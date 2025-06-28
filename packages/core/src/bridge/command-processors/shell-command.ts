import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Process a shell command
 * 
 * @param command The command to process (without the leading !)
 * @returns The result of processing the command
 */
export async function processShellCommand(command: string): Promise<any> {
  try {
    // Remove the leading ! if present
    const cleanCommand = command.startsWith('!') ? command.substring(1) : command;
    
    // Execute the shell command
    try {
      const { stdout, stderr } = await execPromise(cleanCommand);
      
      return {
        command: cleanCommand,
        stdout: stdout,
        stderr: stderr,
        success: true
      };
    } catch (error: any) {
      return {
        command: cleanCommand,
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        error: error.message,
        success: false
      };
    }
  } catch (error) {
    console.error('Error processing shell command:', error);
    throw error;
  }
}