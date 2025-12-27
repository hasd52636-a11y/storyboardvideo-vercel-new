/**
 * Error Handler
 * Centralized error handling with retry logic and user-friendly messages
 */

export interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  retryable: boolean;
  details?: Record<string, any>;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export type APIResponse<T> = SuccessResponse<T> | ErrorResponse;

export enum ErrorCode {
  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_PARAMETER = 'INVALID_PARAMETER',

  // Reference image errors
  INVALID_IMAGE_FORMAT = 'INVALID_IMAGE_FORMAT',
  IMAGE_TOO_LARGE = 'IMAGE_TOO_LARGE',
  IMAGE_VALIDATION_FAILED = 'IMAGE_VALIDATION_FAILED',

  // API errors
  API_UNAVAILABLE = 'API_UNAVAILABLE',
  API_TIMEOUT = 'API_TIMEOUT',
  API_RATE_LIMIT = 'API_RATE_LIMIT',
  API_ERROR = 'API_ERROR',

  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',

  // Generation errors
  GENERATION_FAILED = 'GENERATION_FAILED',
  TEMPLATE_ERROR = 'TEMPLATE_ERROR',

  // Unknown errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public retryable: boolean = false,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ErrorHandler {
  /**
   * Handle API errors with retry logic
   */
  static async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // Check if error is retryable
        if (error instanceof AppError && !error.retryable) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff
        const delay = delayMs * Math.pow(2, attempt - 1);
        console.log(
          `Retry attempt ${attempt}/${maxRetries} after ${delay}ms. Error: ${lastError.message}`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Convert error to user-friendly response
   */
  static toResponse<T>(error: unknown): ErrorResponse {
    if (error instanceof AppError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
        retryable: error.retryable,
        details: error.details,
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: this.getUserFriendlyMessage(error.message),
        code: ErrorCode.UNKNOWN_ERROR,
        retryable: false,
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred',
      code: ErrorCode.UNKNOWN_ERROR,
      retryable: false,
    };
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(technicalMessage: string): string {
    const messages: Record<string, string> = {
      'unsupported image format': 'The image format is not supported. Please use JPEG, PNG, WebP, or GIF.',
      'image is too large': 'The image file is too large. Maximum size is 5MB.',
      'invalid base64': 'The image data is corrupted or invalid. Please try a different image.',
      'invalid url': 'The image URL is invalid. Please check the URL and try again.',
      'reference image': 'The API does not support reference images. Generating without reference image.',
      'API key not configured': 'Image generation service is not properly configured',
      'Template is required': 'Please provide a valid template',
      'Frame count must be': 'Please provide a valid frame count (2-12)',
      'Symbol not found': 'The requested symbol does not exist',
      'Configuration not found': 'The requested configuration does not exist',
      'Unauthorized': 'You do not have permission to perform this action',
      'Database error': 'A database error occurred. Please try again later',
      'timeout': 'The request took too long. Please try again',
      'ECONNREFUSED': 'Unable to connect to the service. Please try again later',
    };

    // Check for known error patterns
    for (const [pattern, message] of Object.entries(messages)) {
      if (technicalMessage.toLowerCase().includes(pattern.toLowerCase())) {
        return message;
      }
    }

    // Default message
    return 'An error occurred. Please try again later';
  }

  /**
   * Validate required fields
   */
  static validateRequired(
    data: Record<string, any>,
    requiredFields: string[]
  ): AppError | null {
    for (const field of requiredFields) {
      if (!(field in data) || data[field] === undefined || data[field] === null) {
        return new AppError(
          ErrorCode.MISSING_REQUIRED_FIELD,
          `Missing required field: ${field}`,
          false,
          { field }
        );
      }
    }

    return null;
  }

  /**
   * Validate parameter range
   */
  static validateRange(
    value: number,
    min: number,
    max: number,
    fieldName: string
  ): AppError | null {
    if (value < min || value > max) {
      return new AppError(
        ErrorCode.INVALID_PARAMETER,
        `${fieldName} must be between ${min} and ${max}`,
        false,
        { fieldName, value, min, max }
      );
    }

    return null;
  }

  /**
   * Validate string length
   */
  static validateStringLength(
    value: string,
    minLength: number,
    maxLength: number,
    fieldName: string
  ): AppError | null {
    if (value.length < minLength || value.length > maxLength) {
      return new AppError(
        ErrorCode.INVALID_PARAMETER,
        `${fieldName} must be between ${minLength} and ${maxLength} characters`,
        false,
        { fieldName, length: value.length, minLength, maxLength }
      );
    }

    return null;
  }

  /**
   * Log error for debugging
   */
  static logError(error: unknown, context: string = ''): void {
    const timestamp = new Date().toISOString();

    if (error instanceof AppError) {
      console.error(
        `[${timestamp}] AppError in ${context}: [${error.code}] ${error.message}`,
        error.details
      );
    } else if (error instanceof Error) {
      console.error(`[${timestamp}] Error in ${context}: ${error.message}`, error.stack);
    } else {
      console.error(`[${timestamp}] Unknown error in ${context}:`, error);
    }
  }
}

/**
 * Create success response
 */
export function success<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Create error response
 */
export function error(
  code: ErrorCode,
  message: string,
  retryable: boolean = false,
  details?: Record<string, any>
): ErrorResponse {
  return {
    success: false,
    error: message,
    code,
    retryable,
    details,
  };
}
