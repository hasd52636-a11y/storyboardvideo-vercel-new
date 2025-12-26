/**
 * 统一多媒体 API 集成 - Dayuyu 视频适配器
 * 
 * Dayuyu 是一个成本优化的视频生成提供商（待测试）
 * 主要用于视频生成功能
 */

import {
  IMediaAdapter,
  APIProviderConfig,
  VideoGenerationRequest,
  GenerationResponse,
} from '../types';
import {
  PROVIDER_ENDPOINTS,
  DEFAULT_TIMEOUT,
} from '../constants';
import {
  MultiMediaError,
  APIKeyError,
  APITimeoutError,
  RateLimitError,
  ErrorHandler,
} from '../errors';

// ============================================================================
// Dayuyu 视频适配器实现
// ============================================================================

export class DayuyuVideoAdapter implements IMediaAdapter {
  name = 'dayuyu' as const;
  private apiKey: string;
  private baseUrl: string;
  private endpoints: Record<string, string> = {};
  private timeout: number;
  private logger: any;

  constructor(config: APIProviderConfig, logger?: any) {
    if (!config.apiKey) {
      throw new APIKeyError('API Key is required for Dayuyu provider');
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || PROVIDER_ENDPOINTS.dayuyu;
    this.endpoints = config.endpoints || {};
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.logger = logger || console;
  }

  /**
   * 检查适配器是否可用
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await this.request('GET', '/health', {});
      return response.ok;
    } catch (error) {
      this.logger.warn('[DayuyuVideoAdapter] Provider is not available:', error);
      return false;
    }
  }

  /**
   * 视频生成
   */
  async generateVideo(request: VideoGenerationRequest): Promise<GenerationResponse> {
    try {
      const body = {
        model: request.model || 'dayuyu-video-1',
        prompt: request.prompt,
        duration: request.duration || 10,
        aspect_ratio: request.aspectRatio || '16:9',
        hd: request.hd || false,
      };

      // 处理参考图片
      if (request.images && request.images.length > 0) {
        (body as any).image_url = request.images[0];
      }

      const endpoint = this.endpoints.videoGeneration || '/videos/generations';
      const response = await this.request('POST', endpoint, body);
      const data = await response.json();

      if (!response.ok) {
        throw this.handleError(response.status, data);
      }

      return {
        success: true,
        data: {
          taskId: data.id || data.task_id,
          videoUrl: data.video_url,
        },
        metadata: {
          provider: 'dayuyu',
          model: request.model || 'dayuyu-video-1',
        },
      };
    } catch (error) {
      throw ErrorHandler.fromException(error);
    }
  }

  // ============================================================================
  // 私有方法
  // ============================================================================

  /**
   * 发送 HTTP 请求
   */
  private async request(
    method: string,
    path: string,
    body?: any
  ): Promise<Response> {
    const url = `${this.baseUrl}${path}`;
    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    let requestBody: any = undefined;

    if (body) {
      requestBody = JSON.stringify(body);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: requestBody,
        signal: controller.signal,
      });

      return response;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new APITimeoutError(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * 处理错误
   */
  private handleError(status: number, data: any): MultiMediaError {
    const message = data?.error?.message || data?.message || 'Unknown error';

    switch (status) {
      case 401:
        return new APIKeyError(message);
      case 429:
        return new RateLimitError(message, data?.error?.retry_after);
      case 400:
        return new MultiMediaError(message, 'INVALID_REQUEST', false, data);
      case 500:
        return new MultiMediaError(message, 'INTERNAL_ERROR', true, data);
      case 503:
        return new MultiMediaError(message, 'SERVICE_UNAVAILABLE', true, data);
      default:
        return ErrorHandler.fromHTTPResponse(status, '', data);
    }
  }
}

export default DayuyuVideoAdapter;
