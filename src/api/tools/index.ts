/**
 * AI Zen Tools Index
 * Collection of tools available to the agent
 */

export * from './web-search-tool';
export * from './calculator-tool';
export * from './code-interpreter-tool';

/**
 * Tool definitions for the agent
 */
export const CUSTOM_TOOLS = [
  {
    name: 'web_search',
    description: 'Search the web for information. Use this when you need to find current information, facts, or research.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query',
        },
        max_results: {
          type: 'number',
          description: 'Maximum number of results (default: 5)',
          default: 5,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'calculator',
    description: 'Evaluate mathematical expressions. Use this for calculations, conversions, and numerical operations.',
    parameters: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'Mathematical expression to evaluate (e.g., "2 + 2", "sqrt(16)", "100 * 0.15")',
        },
      },
      required: ['expression'],
    },
  },
  {
    name: 'code_interpreter',
    description: 'Execute JavaScript code in a sandboxed environment. Use this for running code snippets, algorithms, or data processing.',
    parameters: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'JavaScript code to execute',
        },
        language: {
          type: 'string',
          enum: ['javascript', 'python', 'bash'],
          default: 'javascript',
          description: 'Programming language',
        },
      },
      required: ['code'],
    },
  },
];
