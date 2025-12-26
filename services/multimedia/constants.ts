/**
 * 统一多媒体 API 集成 - 常量定义
 */

import { MediaProvider, MediaFunction } from './types';

// ============================================================================
// 提供商配置
// ============================================================================

export const PROVIDER_ENDPOINTS: Record<MediaProvider, string> = {
  openai: 'https://api.openai.com/v1',
  zhipu: 'https://open.bigmodel.cn/api/paas/v4',
  shenma: 'https://api.whatai.cc',
  dayuyu: 'https://api.dyuapi.com',
  custom: '',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/openai/',
};

export const PROVIDER_CAPABILITIES: Record<MediaProvider | 'mock', Record<MediaFunction, boolean>> = {
  openai: {
    textToImage: true,
    imageToImage: true,
    textGeneration: true,
    imageAnalysis: true,
    videoGeneration: false,
    videoAnalysis: false,
  },
  zhipu: {
    textToImage: true,
    imageToImage: false,
    textGeneration: true,
    imageAnalysis: false,
    videoGeneration: true,
    videoAnalysis: false,
  },
  shenma: {
    textToImage: true,
    imageToImage: true,
    textGeneration: true,
    imageAnalysis: true,
    videoGeneration: true,
    videoAnalysis: true,
  },
  dayuyu: {
    textToImage: false,
    imageToImage: false,
    textGeneration: false,
    imageAnalysis: false,
    videoGeneration: true,
    videoAnalysis: false,
  },
  custom: {
    textToImage: true,
    imageToImage: true,
    textGeneration: true,
    imageAnalysis: true,
    videoGeneration: true,
    videoAnalysis: true,
  },
  gemini: {
    textToImage: true,
    imageToImage: true,
    textGeneration: true,
    imageAnalysis: true,
    videoGeneration: true,
    videoAnalysis: true,
  },
  mock: {
    textToImage: true,
    imageToImage: true,
    textGeneration: true,
    imageAnalysis: true,
    videoGeneration: true,
    videoAnalysis: true,
  },
};

// ============================================================================
// 默认配置
// ============================================================================

export const DEFAULT_TIMEOUT = 30000; // 30 秒
export const DEFAULT_RETRY_COUNT = 3;
export const DEFAULT_RETRY_DELAY = 1000; // 1 秒
export const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 分钟

export const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  retryableErrors: [
    'API_TIMEOUT',
    'RATE_LIMIT_EXCEEDED',
    'SERVICE_UNAVAILABLE',
    'NETWORK_ERROR',
  ],
};

// ============================================================================
// 模型配置
// ============================================================================

export const DEFAULT_MODELS: Record<MediaProvider, Record<string, string>> = {
  openai: {
    textGeneration: 'gpt-4',
    imageGeneration: 'dall-e-3',
    imageAnalysis: 'gpt-4-vision',
  },
  zhipu: {
    textGeneration: 'glm-4',
    imageGeneration: 'cogview-3',
  },
  shenma: {
    textGeneration: 'gpt-4',
    imageGeneration: 'dall-e-3',
    videoGeneration: 'sora-2',
  },
  dayuyu: {
    videoGeneration: 'sora-2',
  },
  custom: {},
  gemini: {
    textGeneration: 'gemini-pro',
    imageGeneration: 'gemini-pro-vision',
  },
};

// ============================================================================
// 图片大小配置
// ============================================================================

export const IMAGE_SIZES = {
  openai: ['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792'],
  shenma: ['1K', '2K', '4K'],
  zhipu: ['1024x1024', '2048x2048'],
};

export const ASPECT_RATIOS = [
  '1:1',
  '16:9',
  '9:16',
  '4:3',
  '3:4',
  '2:3',
  '3:2',
  '4:5',
  '5:4',
  '21:9',
];

// ============================================================================
// 错误代码
// ============================================================================

export const ERROR_CODES = {
  // 配置错误
  INVALID_API_KEY: 'INVALID_API_KEY',
  PROVIDER_NOT_CONFIGURED: 'PROVIDER_NOT_CONFIGURED',
  INVALID_CONFIGURATION: 'INVALID_CONFIGURATION',
  MISSING_PROVIDER: 'MISSING_PROVIDER',
  
  // 请求错误
  INVALID_REQUEST: 'INVALID_REQUEST',
  INVALID_PARAMETER: 'INVALID_PARAMETER',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_IMAGE_FORMAT: 'INVALID_IMAGE_FORMAT',
  
  // API 错误
  API_ERROR: 'API_ERROR',
  API_TIMEOUT: 'API_TIMEOUT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  
  // 业务错误
  GENERATION_FAILED: 'GENERATION_FAILED',
  CONTENT_POLICY_VIOLATION: 'CONTENT_POLICY_VIOLATION',
  UNSUPPORTED_FUNCTION: 'UNSUPPORTED_FUNCTION',
  
  // 系统错误
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
};

// ============================================================================
// HTTP 状态码映射
// ============================================================================

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMIT: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// ============================================================================
// 日志级别
// ============================================================================

export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};

// ============================================================================
// 缓存键前缀
// ============================================================================

export const CACHE_KEY_PREFIX = {
  CONFIG: 'multimedia:config:',
  PROVIDER_STATUS: 'multimedia:provider_status:',
  MODEL_LIST: 'multimedia:model_list:',
};
