import { Config } from './config.js';

/**
 * Bridge configuration options
 */
export interface BridgeConfig {
  /**
   * Whether the bridge is enabled
   */
  enabled: boolean;

  /**
   * The port to listen on
   */
  port: number;

  /**
   * Whether to automatically start the bridge server on startup
   */
  autoStart: boolean;
}

/**
 * Default bridge configuration
 */
export const DEFAULT_BRIDGE_CONFIG: BridgeConfig = {
  enabled: false,
  port: 3000,
  autoStart: false,
};

/**
 * Get the bridge configuration from the global configuration
 * 
 * @param config The global configuration
 * @returns The bridge configuration
 */
export function getBridgeConfig(config: Config): BridgeConfig {
  const bridgeConfig = { ...DEFAULT_BRIDGE_CONFIG };

  // Override with values from the configuration
  if (config.bridge) {
    if (typeof config.bridge.enabled === 'boolean') {
      bridgeConfig.enabled = config.bridge.enabled;
    }

    if (typeof config.bridge.port === 'number') {
      bridgeConfig.port = config.bridge.port;
    }

    if (typeof config.bridge.autoStart === 'boolean') {
      bridgeConfig.autoStart = config.bridge.autoStart;
    }
  }

  return bridgeConfig;
}

/**
 * Extend the Config interface to include bridge configuration
 */
declare module './config.js' {
  interface Config {
    /**
     * Bridge configuration
     */
    bridge?: {
      /**
       * Whether the bridge is enabled
       */
      enabled?: boolean;

      /**
       * The port to listen on
       */
      port?: number;

      /**
       * Whether to automatically start the bridge server on startup
       */
      autoStart?: boolean;
    };
  }
}