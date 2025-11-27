/**
 * Sanitized error logging utility
 * Logs errors without leaking sensitive data (API keys, error details, etc.)
 */

export function logError(context: string, error: unknown) {
  if (error instanceof Error) {
    console.error(`[${context}] ${error.message}`);
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
  } else {
    console.error(`[${context}] Unknown error`);
  }
}
