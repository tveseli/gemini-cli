// Export the bridge server
export { BridgeServer } from './bridge-server.js';

// Export the command processors
export { processSlashCommand } from './command-processors/slash-command.js';
export { processAtCommand } from './command-processors/at-command.js';
export { processShellCommand } from './command-processors/shell-command.js';

// Export the prompts utilities
export { buildSystemPrompt } from './prompts.js';

// Export the integration utilities
export {
  initializeBridge,
  startBridge,
  stopBridge
} from './integration.js';

// Export the bridge configuration
export {
  BridgeConfig,
  DEFAULT_BRIDGE_CONFIG,
  getBridgeConfig
} from '../config/bridge-config.js';