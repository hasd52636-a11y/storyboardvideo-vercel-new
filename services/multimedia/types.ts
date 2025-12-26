/**
 * 统一多媒体 API 集成 - 类型定义
 */

// ============================================================================
// 提供商类型
// ============================================================================

export type MediaProvider = 'openai' | 'zhipu' | 'shenma' | 'dayuyu' | 'custom' | 'gemini';

export type MediaFunction = 
  | 'textToImage' 
  | 'imageToImage' 
  | 'textGeneration' 
  | 'imageAnalysis' 
  | 'videoGeneration' 
  | 'videoAnalysis';

// ============================================================================
// 配置类型
// ============================================================================

export interface APIProviderConfig {
  // 提供商标识
  provider?: MediaProvider;
  
  // API 密钥
  apiKey: string;
  
  // 基础 URL（可选，用于自定义端点）
  baseUrl?: string;
  
  // 功能特定的端点（可选，用于覆盖基础 URL）
  endpoints?: {
    textToImage?: string;
    imageToImage?: string;
    textGeneration?: string;
    imageAnalysis?: string;
    videoGeneration?: string;
    videoAnalysis?: string;
  };
  
  // 功能启用状态
  features?: {
    textToImage?: boolean;
    imageToImage?: boolean;
    textGeneration?: boolean;
    imageAnalysis?: boolean;
    videoGeneration?: boolean;
    videoAnalysis?: boolean;
  };
  
  // 默认模型配置
  defaultModels?: {
    textGeneration?: string;
    imageGeneration?: string;
    videoGeneration?: string;
  };
  
  // 其他配置
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

export interface MultiMediaConfig {
  // 各功能的提供商映射
  providers: {
    textToImage?: MediaProvider;
    imageToImage?: MediaProvider;
    textGeneration?: MediaProvider;
    imageAnalysis?: MediaProvider;
    videoGeneration?: MediaProvider;
    videoAnalysis?: MediaProvider;
  };
  
  // 各提供商的配置
  configs: {
    [key in MediaProvider]?: APIProviderConfig;
  };
  
  // 全局配置
  globalTimeout?: number;
  globalRetryCount?: number;
  enableCache?: boolean;
  cacheTTL?: number;
}

// ============================================================================
// 请求/响应类型
// ============================================================================

// 文生图请求
export interface TextToImageRequest {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '2:3' | '3:2' | '4:5' | '5:4' | '21:9';
  size?: string;
  responseFormat?: 'url' | 'b64_json';
  n?: number;
  quality?: 'high' | 'medium' | 'low';
  model?: string;
  style?: string;
}

// 图生图请求
export interface ImageEditRequest {
  prompt: string;
  images: string[];
  mask?: string;
  aspectRatio?: string;
  size?: string;
  responseFormat?: 'url' | 'b64_json';
  n?: number;
  quality?: 'high' | 'medium' | 'low';
  model?: string;
}

// 文本生成请求
export interface TextGenerationRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  responseFormat?: { type: 'json_object' | 'text' };
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

// 图片分析请求
export interface ImageAnalysisRequest {
  images: string[];
  prompt: string;
  model?: string;
  maxTokens?: number;
  detail?: 'low' | 'high' | 'auto';
}

// 视频生成请求
export interface VideoGenerationRequest {
  prompt: string;
  images?: string[];
  duration?: number;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  hd?: boolean;
  watermark?: boolean;
  model?: string;
  style?: string;
}

// 视频分析请求
export interface VideoAnalysisRequest {
  videoUrl: string;
  prompt: string;
  model?: string;
  maxTokens?: number;
}

// 统一响应格式
export interface GenerationResponse {
  success: boolean;
  data?: {
    images?: string[];
    text?: string;
    videoUrl?: string;
    taskId?: string;
    [key: string]: any;
  };
  error?: {
    code: string;
    message: string;
    retryable: boolean;
    details?: any;
  };
  metadata?: {
    provider: MediaProvider;
    model?: string;
    tokensUsed?: number;
    duration?: number;
    timestamp?: number;
  };
}

// ============================================================================
// 适配器接口
// ============================================================================

export interface IMediaAdapter {
  name: MediaProvider;
  
  isAvailable(): Promise<boolean>;
  
  generateImage?(request: TextToImageRequest): Promise<GenerationResponse>;
  editImage?(request: ImageEditRequest): Promise<GenerationResponse>;
  generateText?(request: TextGenerationRequest): Promise<GenerationResponse>;
  analyzeImage?(request: ImageAnalysisRequest): Promise<GenerationResponse>;
  generateVideo?(request: VideoGenerationRequest): Promise<GenerationResponse>;
  analyzeVideo?(request: VideoAnalysisRequest): Promise<GenerationResponse>;
}

// ============================================================================
// 配置管理接口
// ============================================================================

export interface IConfigManager {
  getConfig(userId?: number): Promise<MultiMediaConfig>;
  updateConfig(config: MultiMediaConfig, userId?: number): Promise<void>;
  syncConfig(provider: MediaProvider, userId?: number): Promise<void>;
  validateConfig(config: MultiMediaConfig): Promise<ValidationResult>;
  getProviderStatus(provider: MediaProvider): Promise<ProviderStatus>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ProviderStatus {
  provider: MediaProvider;
  available: boolean;
  features: {
    [key in MediaFunction]?: boolean;
  };
  lastChecked?: number;
  error?: string;
}

// ============================================================================
// 缓存类型
// ============================================================================

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

// ============================================================================
// 日志类型
// ============================================================================

export interface LogEntry {
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error';
  provider: MediaProvider;
  function: MediaFunction;
  message: string;
  details?: any;
}
