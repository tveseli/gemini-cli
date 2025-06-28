/**
 * Build a system prompt for the Gemini API
 * 
 * @param options Options for building the system prompt
 * @returns The system prompt
 */
export async function buildSystemPrompt(options: {
  includeGitInfo?: boolean;
  includeSandboxStatus?: boolean;
}): Promise<string> {
  const { includeGitInfo = true, includeSandboxStatus = true } = options;
  
  // This is a simplified implementation for demonstration
  let prompt = "You are Gemini, a helpful AI assistant.";
  
  // Add git info if requested
  if (includeGitInfo) {
    const gitBranch = process.env.GIT_BRANCH || 'unknown';
    prompt += `\n\nCurrent git branch: ${gitBranch}`;
    
    if (process.env.GIT_STATUS) {
      prompt += `\nGit status: ${process.env.GIT_STATUS}`;
    }
  }
  
  // Add sandbox status if requested
  if (includeSandboxStatus) {
    const sandboxEnabled = process.env.SANDBOX_ENABLED === 'true';
    prompt += `\n\nSandbox mode: ${sandboxEnabled ? 'enabled' : 'disabled'}`;
  }
  
  return prompt;
}