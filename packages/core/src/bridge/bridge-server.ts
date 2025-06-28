import express from 'express';
import cors from 'cors';
import { ToolRegistry } from '../tools/tool-registry.js';
import { buildSystemPrompt } from '../core/prompts.js';
import { processSlashCommand } from './command-processors/slash-command.js';
import { processAtCommand } from './command-processors/at-command.js';
import { processShellCommand } from './command-processors/shell-command.js';

/**
 * BridgeServer provides an HTTP API for the Go implementation to communicate with
 * the Node.js implementation during the gradual migration process.
 */
export class BridgeServer {
  private app: express.Application;
  private server: any;
  private port: number;
  private toolRegistry: ToolRegistry;

  constructor(toolRegistry: ToolRegistry, port = 3000) {
    this.app = express();
    this.port = port;
    this.toolRegistry = toolRegistry;

    // Configure middleware
    this.app.use(cors());
    this.app.use(express.json());

    // Set up routes
    this.setupRoutes();
  }

  /**
   * Set up the API routes
   */
  private setupRoutes() {
    // Health check endpoint
    this.app.get('/api/health', (req: express.Request, res: express.Response) => {
      res.json({ status: 'ok' });
    });

    // Tool execution endpoint
    this.app.post('/api/tools/execute', async (req: express.Request, res: express.Response) => {
      try {
        const { name, args } = req.body;
        
        if (!name) {
          return res.status(400).json({
            success: false,
            error: 'Tool name is required'
          });
        }

        const tool = this.toolRegistry.getTool(name);
        if (!tool) {
          return res.status(404).json({
            success: false,
            error: `Tool '${name}' not found`
          });
        }

        const result = await tool.execute(args);
        
        res.json({
          success: true,
          result
        });
      } catch (error) {
        console.error('Error executing tool:', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Context building endpoint
    this.app.get('/api/context/build', async (req: express.Request, res: express.Response) => {
      try {
        const systemPrompt = await buildSystemPrompt({
          includeGitInfo: true,
          includeSandboxStatus: true
        });

        // Get git info and sandbox status
        const gitBranch = process.env.GIT_BRANCH || '';
        const gitStatus = process.env.GIT_STATUS || '';
        const sandbox = process.env.SANDBOX_ENABLED === 'true';

        res.json({
          systemPrompt,
          context: {
            gitInfo: {
              branch: gitBranch,
              status: gitStatus
            },
            sandbox
          }
        });
      } catch (error) {
        console.error('Error building context:', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Command processing endpoint
    this.app.post('/api/commands/process', async (req: express.Request, res: express.Response) => {
      try {
        const { command, type } = req.body;
        
        if (!command) {
          return res.status(400).json({
            success: false,
            error: 'Command is required'
          });
        }

        if (!type) {
          return res.status(400).json({
            success: false,
            error: 'Command type is required'
          });
        }

        let result;
        switch (type) {
          case 'slash':
            result = await processSlashCommand(command);
            break;
          case 'at':
            result = await processAtCommand(command);
            break;
          case 'shell':
            result = await processShellCommand(command);
            break;
          default:
            return res.status(400).json({
              success: false,
              error: `Invalid command type: ${type}`
            });
        }

        res.json({
          success: true,
          result
        });
      } catch (error) {
        console.error('Error processing command:', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  /**
   * Start the server
   */
  public start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`Bridge server listening on port ${this.port}`);
        resolve();
      });
    });
  }

  /**
   * Stop the server
   */
  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        return resolve();
      }

      this.server.close((err: Error) => {
        if (err) {
          return reject(err);
        }
        console.log('Bridge server stopped');
        resolve();
      });
    });
  }
}