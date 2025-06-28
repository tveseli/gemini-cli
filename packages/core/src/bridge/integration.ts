import { BridgeServer } from './bridge-server.js';
import { ToolRegistry } from '../tools/tool-registry.js';
import { Config } from '../config/config.js';
import { getBridgeConfig } from '../config/bridge-config.js';

/**
 * Bridge server instance
 */
let bridgeServer: BridgeServer | null = null;

/**
 * Initialize the bridge server
 * 
 * @param toolRegistry The tool registry
 * @param config The configuration
 * @returns The bridge server instance, or null if the bridge is disabled
 */
export async function initializeBridge(
  toolRegistry: ToolRegistry,
  config: Config
): Promise<BridgeServer | null> {
  // Get bridge configuration
  const bridgeConfig = getBridgeConfig(config);

  // If the bridge is disabled, return null
  if (!bridgeConfig.enabled) {
    return null;
  }

  // Create the bridge server
  bridgeServer = new BridgeServer(toolRegistry, bridgeConfig.port);

  // Start the bridge server if autoStart is enabled
  if (bridgeConfig.autoStart) {
    await startBridge();
  }

  // Handle process termination
  process.on('SIGINT', async () => {
    await stopBridge();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await stopBridge();
    process.exit(0);
  });

  return bridgeServer;
}

/**
 * Start the bridge server
 * 
 * @returns A promise that resolves when the bridge server has started
 */
export async function startBridge(): Promise<void> {
  if (!bridgeServer) {
    throw new Error('Bridge server not initialized');
  }

  await bridgeServer.start();
  console.log(`Bridge server started on port ${bridgeServer.port}`);
}

/**
 * Stop the bridge server
 * 
 * @returns A promise that resolves when the bridge server has stopped
 */
export async function stopBridge(): Promise<void> {
  if (!bridgeServer) {
    return;
  }

  await bridgeServer.stop();
  console.log('Bridge server stopped');
}