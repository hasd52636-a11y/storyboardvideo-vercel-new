/**
 * 统一多媒体 API 集成 - Zhipu 适配器
 */

import {
  IMediaAdapter,
  APIProviderConfig,
  TextToImageRequest,
  TextGenerationRequest,
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
  ContentPolicyViolationError,
  ErrorHandler,
} from '../errors';

// ============================================================================
// Zhipu 适配器实现
// ============================================================================

export class ZhipuAdapter implements IMediaAdapter {
  name = 'zhipu' as const;
  private apiKey: string;
  private baseUrl: string;
  private endpoints: Record<string, string> = {};
  private timeout: number;
  private logger: any;

  constructor(config: APIProviderConfig, logger?: any) {
    if (!config.apiKey) {
      throw new APIKeyError('API Key is required for Zhipu provider');
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || PROVIDER_ENDPOINTS.zhipu;
    this.endpoints = config.endpoints || {};
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.logger = logger || console;
  }

  /**
   * 检查适配器是否可用
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await this.request('GET', '/models', {});
      return response.ok;
    } catch (error) {
      this.logger.warn('[ZhipuAdapter] Provider is not available:', error);
      return false;
    }
  }

  /**
   * 文生图
   */
  async generateImage(request: TextToImageRequest): Promise<GenerationResponse> {
    try {
      const body = {
        model: request.model || 'cogview-3',
        prompt: request.prompt,
        size: this.mapSize(request.size),
        num_inference_steps: 50,
        guidance_scale: 7.5,
      };

      const endpoint = this.endpoints.textToImage || '/images/generations';
      const response = await this.request('POST', endpoint, body);
      const data = await response.json();

      if (!response.ok) {
        throw this.handleError(response.status, data);
      }

      return {
        success: true,
        data: {
          images: data.data?.map((item: any) => item.url || item.b64_json) || [],
        },
        metadata: {
          provider: 'zhipu',
          model: request.model || 'cogview-3',
        },
      };
    } catch (error) {
      throw ErrorHandler.fromException(error);
    }
  }

  /**
   * 文本生成
   */
  async generateText(request: TextGenerationRequest): Promise<GenerationResponse> {
    try {
      const body = {
        model: request.model || 'glm-4',
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2000,
        stream: request.stream || false,
        top_p: request.topP || 0.9,
      };

      const endpoint = this.endpoints.textGeneration || '/chat/completions';
      const response = await this.request('POST', endpoint, body);
      const data = await response.json();

      if (!response.ok) {
        throw this.handleError(response.status, data);
      }

      return {
        success: true,
        data: {
          text: data.choices?.[0]?.message?.content || '',
        },
        metadata: {
          provider: 'zhipu',
          model: request.model || 'glm-4',
          tokensUsed: data.usage?.total_tokens,
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
      // 使用全局 fetch（在 Node.js 18+ 和浏览器中都可用）
      const fetchFn = typeof global !== 'undefined' && global.fetch ? global.fetch : fetch;
      
      const response = await fetchFn(url, {
        method,
        headers,
        body: requestBody,
        signal: controller.signal,
      } as any);

      return response as Response;
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
        if (message.includes('content policy')) {
          return new ContentPolicyViolationError(message);
        }
        return new MultiMediaError(message, 'INVALID_REQUEST', false, data);
      case 500:
        return new MultiMediaError(message, 'INTERNAL_ERROR', true, data);
      case 503:
        return new MultiMediaError(message, 'SERVICE_UNAVAILABLE', true, data);
      default:
        return ErrorHandler.fromHTTPResponse(status, '', data);
    }
  }

  /**
   * 映射图片大小
   */
  private mapSize(size?: string): string {
    if (!size) return '1024x1024';

    // Zhipu 支持的大小
    const validSizes = ['256x256', '512x512', '1024x1024', '1024x768', '768x1024'];

    if (validSizes.includes(size)) {
      return size;
    }

    // 处理宽高比格式
    const ratioMap: Record<string, string> = {
      '1:1': '1024x1024',
      '16:9': '1024x576',
      '9:16': '576x1024',
      '4:3': '1024x768',
      '3:4': '768x1024',
    };

    return ratioMap[size] || '1024x1024';
  }
}

export default ZhipuAdapter;
