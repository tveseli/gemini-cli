import * as fs from 'fs';
import * as path from 'path';

/**
 * Process an at command
 * 
 * @param command The command to process (without the leading @)
 * @returns The result of processing the command
 */
export async function processAtCommand(command: string): Promise<any> {
  try {
    // Remove the leading @ if present
    const cleanCommand = command.startsWith('@') ? command.substring(1) : command;
    
    // The command is a file or directory path
    const targetPath = cleanCommand.trim();
    
    // Simplified implementation for demonstration
    // In a real implementation, this would use the read-many-files tool
    
    try {
      const stats = fs.statSync(targetPath);
      
      if (stats.isDirectory()) {
        // List directory contents
        const files = fs.readdirSync(targetPath);
        
        return {
          type: 'directory',
          path: targetPath,
          files: files.map(file => ({
            name: file,
            isDirectory: fs.statSync(path.join(targetPath, file)).isDirectory()
          }))
        };
      } else if (stats.isFile()) {
        // Read file contents
        const content = fs.readFileSync(targetPath, 'utf-8');
        const extension = path.extname(targetPath).toLowerCase();
        
        return {
          type: 'file',
          path: targetPath,
          extension: extension,
          content: content,
          size: stats.size
        };
      }
    } catch (error) {
      return {
        type: 'error',
        path: targetPath,
        error: `File or directory not found: ${targetPath}`
      };
    }
  } catch (error) {
    console.error('Error processing at command:', error);
    throw error;
  }
}