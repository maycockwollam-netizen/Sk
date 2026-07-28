/**
 * Calculator Tool for Agent
 * Evaluates mathematical expressions safely
 */

export interface CalculatorResult {
  expression: string;
  result: string;
  error?: string;
}

/**
 * Safe mathematical expression evaluator
 */
export function evaluateMath(expression: string): CalculatorResult {
  try {
    // Only allow safe mathematical operations
    const sanitized = expression
      .replace(/[^0-9+\-*/.()%^√pi,e]/gi, '')
      .replace(/\^/g, '**')
      .replace(/√/g, 'Math.sqrt');
    
    // Use Function constructor for evaluation (safer than eval)
    const result = new Function(`return ${sanitized}`)();
    
    return {
      expression,
      result: String(result),
    };
  } catch (error) {
    return {
      expression,
      result: '0',
      error: error instanceof Error ? error.message : 'Calculation error',
    };
  }
}

/**
 * Format calculator result for display
 */
export function formatCalculatorResult(result: CalculatorResult): string {
  if (result.error) {
    return `❌ Error: ${result.error}`;
  }
  return `✅ ${result.expression} = ${result.result}`;
}

/**
 * Available math functions
 */
export const MATH_FUNCTIONS = {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
  multiply: (a: number, b: number) => a * b,
  divide: (a: number, b: number) => b !== 0 ? a / b : 'Error: Division by zero',
  power: (base: number, exp: number) => Math.pow(base, exp),
  sqrt: (n: number) => Math.sqrt(n),
  abs: (n: number) => Math.abs(n),
  floor: (n: number) => Math.floor(n),
  ceil: (n: number) => Math.ceil(n),
  round: (n: number) => Math.round(n),
  max: (...nums: number[]) => Math.max(...nums),
  min: (...nums: number[]) => Math.min(...nums),
  random: () => Math.random(),
  sin: (n: number) => Math.sin(n),
  cos: (n: number) => Math.cos(n),
  tan: (n: number) => Math.tan(n),
  log: (n: number) => Math.log(n),
  log10: (n: number) => Math.log10(n),
  exp: (n: number) => Math.exp(n),
};
