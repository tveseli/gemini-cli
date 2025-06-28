import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fetch from 'node-fetch';
import { BridgeServer } from './bridge-server.js';

// Mock the tool registry
const mockToolRegistry = {
  getTool: vi.fn().mockImplementation((name) => {
    if (name === 'ls') {
      return {
        execute: vi.fn().mockResolvedValue({
          files: ['file1.txt', 'file2.txt']
        })
      };
    }
    return null;
  })
};

// Mock environment variables
vi.stubEnv('GIT_BRANCH', 'main');
vi.stubEnv('GIT_STATUS', 'clean');
vi.stubEnv('SANDBOX_ENABLED', 'false');

describe('BridgeServer', () => {
  let server: BridgeServer;
  const port = 3001; // Use a different port for testing
  const baseUrl = `http://localhost:${port}`;

  beforeAll(async () => {
    server = new BridgeServer(mockToolRegistry as any, port);
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
  });

  it('should return health status', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({ status: 'ok' });
  });

  it('should execute a tool', async () => {
    const response = await fetch(`${baseUrl}/api/tools/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'ls',
        args: {
          path: '.'
        }
      })
    });
    
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.result.files).toEqual(['file1.txt', 'file2.txt']);
  });

  it('should build context', async () => {
    const response = await fetch(`${baseUrl}/api/context/build`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.systemPrompt).toContain('You are Gemini');
    expect(data.context.gitInfo.branch).toBe('main');
    expect(data.context.gitInfo.status).toBe('clean');
    expect(data.context.sandbox).toBe(false);
  });

  it('should process a slash command', async () => {
    const response = await fetch(`${baseUrl}/api/commands/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        command: '/help',
        type: 'slash'
      })
    });
    
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.result.command).toBe('help');
  });

  it('should process an at command', async () => {
    const response = await fetch(`${baseUrl}/api/commands/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        command: '@package.json',
        type: 'at'
      })
    });
    
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.result.type).toBe('error'); // Since the file doesn't exist in the test
  });

  it('should process a shell command', async () => {
    const response = await fetch(`${baseUrl}/api/commands/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        command: '!echo hello',
        type: 'shell'
      })
    });
    
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.result.command).toBe('echo hello');
  });
});