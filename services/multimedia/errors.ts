/**
 * 统一多媒体 API 集成 - 错误处理
 */

import { ERROR_CODES } from './constants';

// ============================================================================
// 自定义错误类
// ============================================================================

export class MultiMediaError extends Error {
  code: string;
  retryable: boolean;
  details?: any;
  statusCode?: number;

  constructor(
    message: string,
    code: string = ERROR_CODES.INTERNAL_ERROR,
    retryable: boolean = false,
    details?: any,
    statusCode?: number
  ) {
    super(message);
    this.name = 'MultiMediaError';
    this.code = code;
    this.retryable = retryable;
    this.details = details;
    this.statusCode = statusCode;

    // 保持原型链
    Object.setPrototypeOf(this, MultiMediaError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      retryable: this.retryable,
      details: this.details,
      statusCode: this.statusCode,
    };
  }
}

// ============================================================================
// 特定错误类
// ============================================================================

export class ConfigurationError extends MultiMediaError {
  constructor(message: string, details?: any) {
    super(
      message,
      ERROR_CODES.INVALID_CONFIGURATION,
      false,
      details
    );
    this.name = 'ConfigurationError';
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}

export class APIKeyError extends MultiMediaError {
  constructor(message: string, details?: any) {
    super(
      message,
      ERROR_CODES.INVALID_API_KEY,
      false,
      details
    );
    this.name = 'APIKeyError';
    Object.setPrototypeOf(this, APIKeyError.prototype);
  }
}

export class ProviderNotConfiguredError extends MultiMediaError {
  constructor(provider: string) {
    super(
      `Provider "${provider}" is not configured`,
      ERROR_CODES.PROVIDER_NOT_CONFIGURED,
      false,
      { provider }
    );
    this.name = 'ProviderNotConfiguredError';
    Object.setPrototypeOf(this, ProviderNotConfiguredError.prototype);
  }
}

export class UnsupportedFunctionError extends MultiMediaError {
  constructor(provider: string, func: string) {
    super(
      `Provider "${provider}" does not support function "${func}"`,
      ERROR_CODES.UNSUPPORTED_FUNCTION,
      false,
      { provider, function: func }
    );
    this.name = 'UnsupportedFunctionError';
    Object.setPrototypeOf(this, UnsupportedFunctionError.prototype);
  }
}

export class InvalidParameterError extends MultiMediaError {
  constructor(message: string, details?: any) {
    super(
      message,
      ERROR_CODES.INVALID_PARAMETER,
      false,
      details
    );
    this.name = 'InvalidParameterError';
    Object.setPrototypeOf(this, InvalidParameterError.prototype);
  }
}

export class APITimeoutError extends MultiMediaError {
  constructor(message: string, details?: any) {
    super(
      message,
      ERROR_CODES.API_TIMEOUT,
      true,
      details
    );
    this.name = 'APITimeoutError';
    Object.setPrototypeOf(this, APITimeoutError.prototype);
  }
}

export class RateLimitError extends MultiMediaError {
  constructor(message: string, retryAfter?: number) {
    super(
      message,
      ERROR_CODES.RATE_LIMIT_EXCEEDED,
      true,
      { retryAfter }
    );
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class QuotaExceededError extends MultiMediaError {
  constructor(message: string, details?: any) {
    super(
      message,
      ERROR_CODES.QUOTA_EXCEEDED,
      false,
      details
    );
    this.name = 'QuotaExceededError';
    Object.setPrototypeOf(this, QuotaExceededError.prototype);
  }
}

export class ContentPolicyViolationError extends MultiMediaError {
  constructor(message: string, details?: any) {
    super(
      message,
      ERROR_CODES.CONTENT_POLICY_VIOLATION,
      false,
      details
    );
    this.name = 'ContentPolicyViolationError';
    Object.setPrototypeOf(this, ContentPolicyViolationError.prototype);
  }
}

export class NetworkError extends MultiMediaError {
  constructor(message: string, details?: any) {
    super(
      message,
      ERROR_CODES.NETWORK_ERROR,
      true,
      details
    );
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class ServiceUnavailableError extends MultiMediaError {
  constructor(message: string, details?: any) {
    super(
      message,
      ERROR_CODES.SERVICE_UNAVAILABLE,
      true,
      details
    );
    this.name = 'ServiceUnavailableError';
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}

// ============================================================================
// 错误处理工具
// ============================================================================

export class ErrorHandler {
  /**
   * 从 HTTP 响应创建错误
   */
  static fromHTTPResponse(
    status: number,
    statusText: string,
    body: any
  ): MultiMediaError {
    const message = body?.message || body?.error?.message || statusText;
    const details = body?.error || body;

    switch (status) {
      case 400:
        return new InvalidParameterError(message, details);
      case 401:
        return new APIKeyError(message, details);
      case 403:
        return new ConfigurationError(message, details);
      case 404:
        return new MultiMediaError(message, ERROR_CODES.API_ERROR, false, details, status);
      case 429:
        return new RateLimitError(message, details?.retry_after);
      case 500:
        return new MultiMediaError(message, ERROR_CODES.INTERNAL_ERROR, true, details, status);
      case 503:
        return new ServiceUnavailableError(message, details);
      default:
        return new MultiMediaError(message, ERROR_CODES.API_ERROR, false, details, status);
    }
  }

  /**
   * 从异常创建错误
   */
  static fromException(error: any): MultiMediaError {
    if (error instanceof MultiMediaError) {
      return error;
    }

    if (error instanceof TypeError) {
      if (error.message.includes('fetch')) {
        return new NetworkError(error.message, { originalError: error });
      }
    }

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return new APITimeoutError(error.message, { originalError: error });
      }
      if (error.message.includes('network')) {
        return new NetworkError(error.message, { originalError: error });
      }
    }

    // 检查是否是可重试的 HTTP 错误
    const statusCode = error?.statusCode;
    const isRetryable = statusCode === 429 || statusCode === 503 || statusCode === 502 || statusCode === 504;

    return new MultiMediaError(
      error?.message || 'Unknown error',
      ERROR_CODES.INTERNAL_ERROR,
      isRetryable,
      { originalError: error }
    );
  }

  /**
   * 判断错误是否可重试
   */
  static isRetryable(error: any): boolean {
    if (error instanceof MultiMediaError) {
      return error.retryable;
    }
    return false;
  }

  /**
   * 获取重试延迟（毫秒）
   */
  static getRetryDelay(
    retryCount: number,
    initialDelay: number = 1000,
    maxDelay: number = 30000,
    backoffMultiplier: number = 2
  ): number {
    const delay = initialDelay * Math.pow(backoffMultiplier, retryCount);
    return Math.min(delay, maxDelay);
  }

  /**
   * 格式化错误消息
   */
  static formatErrorMessage(error: MultiMediaError): string {
    let message = `[${error.code}] ${error.message}`;
    
    if (error.details) {
      message += ` (Details: ${JSON.stringify(error.details)})`;
    }
    
    if (error.retryable) {
      message += ' [Retryable]';
    }
    
    return message;
  }
}
