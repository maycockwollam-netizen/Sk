/**
 * Code Interpreter Tool for Agent
 * Executes code in various programming languages
 */

export interface CodeExecutionParams {
  code: string;
  language: 'javascript' | 'python' | 'bash';
  timeout?: number;
}

export interface CodeExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
}

/**
 * Execute code safely
 * Note: This is a client-side implementation
 * For production, use a sandboxed backend service
 */
export async function executeCode(
  code: string,
  language: 'javascript' | 'python' | 'bash' = 'javascript',
  _timeout: number = 5000
): Promise<CodeExecutionResult> {
  const startTime = Date.now();

  try {
    switch (language) {
      case 'javascript':
        return executeJavaScript(code, startTime);
      case 'python':
        return executePython(code, startTime);
      case 'bash':
        return executeBash(code, startTime);
      default:
        return {
          output: '',
          error: `Unsupported language: ${language}`,
          executionTime: Date.now() - startTime,
        };
    }
  } catch (error) {
    return {
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
    };
  }
}

/**
 * Execute JavaScript code in a sandboxed way
 */
function executeJavaScript(code: string, startTime: number): CodeExecutionResult {
  try {
    // Create a sandboxed function
    const sandboxedCode = `
      "use strict";
      const console = {
        log: (...args) => args.map(a => String(a)).join(' '),
        error: (...args) => args.map(a => String(a)).join(' '),
        warn: (...args) => args.map(a => String(a)).join(' '),
      };
      const Math = globalThis.Math;
      const Date = globalThis.Date;
      const JSON = globalThis.JSON;
      const Array = globalThis.Array;
      const Object = globalThis.Object;
      const String = globalThis.String;
      const Number = globalThis.Number;
      const Boolean = globalThis.Boolean;
      const RegExp = globalThis.RegExp;
      const Map = globalThis.Map;
      const Set = globalThis.Set;
      const Promise = globalThis.Promise;
      ${code}
    `;
    
    // Execute in a function context
    const fn = new Function(sandboxedCode);
    const result = fn();
    
    return {
      output: result !== undefined ? String(result) : 'Code executed successfully (no output)',
      executionTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      output: '',
      error: error instanceof Error ? error.message : 'Execution error',
      executionTime: Date.now() - startTime,
    };
  }
}

/**
 * Python execution - would need a backend service
 * For now, returns instructions
 */
function executePython(code: string, startTime: number): CodeExecutionResult {
  return {
    output: '',
    error: 'Python execution requires a backend service. Please use the terminal tool to run Python code.',
    executionTime: Date.now() - startTime,
  };
}

/**
 * Bash execution - would need a backend service
 * For now, returns instructions
 */
function executeBash(code: string, startTime: number): CodeExecutionResult {
  return {
    output: '',
    error: 'Bash execution requires a backend service. Please use the terminal tool instead.',
    executionTime: Date.now() - startTime,
  };
}

/**
 * Format code execution result for display
 */
export function formatCodeResult(result: CodeExecutionResult): string {
  if (result.error) {
    return `❌ Error:\n\`\`\`\n${result.error}\n\`\`\`\n⏱️ Time: ${result.executionTime}ms`;
  }
  
  return `✅ Output:\n\`\`\`\n${result.output}\n\`\`\`\n⏱️ Time: ${result.executionTime}ms`;
}
