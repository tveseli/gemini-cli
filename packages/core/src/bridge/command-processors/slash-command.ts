/**
 * Process a slash command
 * 
 * @param command The command to process (without the leading slash)
 * @returns The result of processing the command
 */
export async function processSlashCommand(command: string): Promise<any> {
  try {
    // Remove the leading slash if present
    const cleanCommand = command.startsWith('/') ? command.substring(1) : command;
    
    // Split the command into parts
    const parts = cleanCommand.split(' ');
    const commandName = parts[0];
    const args = parts.slice(1);
    
    // Process the command (simplified implementation for demonstration)
    let result: any;
    
    switch (commandName) {
      case 'help':
        result = {
          message: 'Available commands: /help, /clear, /memory, /chat, /restore, /compress, /stats'
        };
        break;
      case 'clear':
        result = {
          message: 'Conversation cleared'
        };
        break;
      case 'memory':
        result = {
          message: 'Memory command processed',
          subCommand: args[0] || 'show'
        };
        break;
      case 'chat':
        result = {
          message: 'Chat command processed',
          subCommand: args[0] || 'list'
        };
        break;
      default:
        result = {
          message: `Unknown command: ${commandName}`
        };
    }
    
    return {
      command: commandName,
      args: args,
      result: result
    };
  } catch (error) {
    console.error('Error processing slash command:', error);
    throw error;
  }
}