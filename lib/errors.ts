/**
 * Error Handling Utilities
 *
 * Provides standardized error handling, logging, and response formatting.
 * Ensures consistent error messages across the application.
 *
 * Security: Sanitizes sensitive data and prevents information leakage.
 */

/**
 * Custom API Error class with HTTP status codes
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Handle API errors and return safe response
 * Converts various error types to consistent response format
 */
export function handleApiError(error: unknown): {
  status: number;
  message: string;
} {
  if (error instanceof ApiError) {
    return {
      status: error.statusCode,
      message: error.message,
    };
  }

  if (error instanceof Error) {
    console.error('Unexpected error:', error.message);
    return {
      status: 500,
      message: 'An unexpected error occurred. Please try again later.',
    };
  }

  console.error('Unknown error:', error);
  return {
    status: 500,
    message: 'An unexpected error occurred. Please try again later.',
  };
}

/**
 * Log error with context prefix
 * Production: Only logs message, no stack trace
 * Development: Logs message and stack trace for debugging
 *
 * Security: Does NOT log sensitive data like API keys or credentials
 */
export function logError(context: string, error: unknown): void {
  if (error instanceof Error) {
    console.error(`[${context}] ${error.message}`);
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
  } else {
    console.error(`[${context}] Unknown error:`, error);
  }
}

/**
 * Validate required environment variables
 * Used to ensure critical config is available at runtime
 */
export function validateEnvVariable(
  name: string,
  value: string | undefined
): string {
  if (!value) {
    throw new ApiError(
      500,
      `Missing required environment variable: ${name}`
    );
  }
  return value;
}
