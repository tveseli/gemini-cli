import { Config } from '@gemini-cli/core/src/config/config.js';
import { ToolRegistry } from '@gemini-cli/core/src/tools/tool-registry.js';
import {
  initializeBridge,
  BridgeServer,
  BridgeConfig,
  getBridgeConfig
} from '@gemini-cli/core/src/bridge/index.js';

/**
 * Bridge server instance
 */
let bridgeServer: BridgeServer | null = null;

/**
 * Initialize the bridge server for the CLI
 * 
 * This function should be called during CLI startup to initialize the bridge server
 * if it's enabled in the configuration.
 * 
 * @param config The CLI configuration
 * @param toolRegistry The tool registry
 */
export async function initializeBridgeForCLI(
  config: Config,
  toolRegistry: ToolRegistry
): Promise<void> {
  // Get bridge configuration
  const bridgeConfig = getBridgeConfig(config);

  // Log bridge status
  if (bridgeConfig.enabled) {
    console.log(`Bridge server enabled on port ${bridgeConfig.port}`);
    
    // Initialize the bridge server
    bridgeServer = await initializeBridge(toolRegistry, config);
    
    if (bridgeServer) {
      console.log('Bridge server initialized successfully');
    } else {
      console.warn('Failed to initialize bridge server');
    }
  } else {
    console.log('Bridge server disabled');
  }
}

/**
 * Get the current bridge configuration
 * 
 * @param config The CLI configuration
 * @returns The bridge configuration
 */
export function getCurrentBridgeConfig(config: Config): BridgeConfig {
  return getBridgeConfig(config);
}

/**
 * Check if the bridge server is running
 * 
 * @returns True if the bridge server is running, false otherwise
 */
export function isBridgeServerRunning(): boolean {
  return bridgeServer !== null;
}

/**
 * Get the bridge server instance
 * 
 * @returns The bridge server instance, or null if not initialized
 */
export function getBridgeServer(): BridgeServer | null {
  return bridgeServer;
}

/**
 * Shutdown the bridge server
 * 
 * This function should be called during CLI shutdown to stop the bridge server
 * if it's running.
 */
export async function shutdownBridgeServer(): Promise<void> {
  if (bridgeServer) {
    await bridgeServer.stop();
    bridgeServer = null;
    console.log('Bridge server stopped');
  }
}