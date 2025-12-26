/**
 * 统一多媒体 API 集成 - OpenAI 适配器
 */

import {
  IMediaAdapter,
  APIProviderConfig,
  TextToImageRequest,
  ImageEditRequest,
  TextGenerationRequest,
  ImageAnalysisRequest,
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
// OpenAI 适配器实现
// ============================================================================

export class OpenAIAdapter implements IMediaAdapter {
  name = 'openai' as const;
  private apiKey: string;
  private baseUrl: string;
  private endpoints: Record<string, string> = {};
  private timeout: number;
  private logger: any;

  constructor(config: APIProviderConfig, logger?: any) {
    if (!config.apiKey) {
      throw new APIKeyError('API Key is required for OpenAI provider');
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || PROVIDER_ENDPOINTS.openai;
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
      this.logger.warn('[OpenAIAdapter] Provider is not available:', error);
      return false;
    }
  }

  /**
   * 文生图
   */
  async generateImage(request: TextToImageRequest): Promise<GenerationResponse> {
    try {
      const body = {
        model: request.model || 'dall-e-3',
        prompt: request.prompt,
        n: request.n || 1,
        size: this.mapSize(request.size),
        response_format: request.responseFormat || 'url',
        quality: request.quality || 'standard',
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
          provider: 'openai',
          model: request.model || 'dall-e-3',
        },
      };
    } catch (error) {
      throw ErrorHandler.fromException(error);
    }
  }

  /**
   * 图生图
   */
  async editImage(request: ImageEditRequest): Promise<GenerationResponse> {
    try {
      const formData = new FormData();
      formData.append('prompt', request.prompt);
      formData.append('n', String(request.n || 1));
      formData.append('size', this.mapSize(request.size));
      formData.append('response_format', request.responseFormat || 'url');

      // 处理图片（OpenAI 只支持单个图片）
      if (request.images && request.images.length > 0) {
        const imageBlob = await this.dataUrlToBlob(request.images[0]);
        formData.append('image', imageBlob, 'image.png');
      }

      // 处理遮罩
      if (request.mask) {
        const maskBlob = await this.dataUrlToBlob(request.mask);
        formData.append('mask', maskBlob, 'mask.png');
      }

      const endpoint = this.endpoints.imageToImage || '/images/edits';
      const response = await this.request('POST', endpoint, formData, true);
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
          provider: 'openai',
          model: 'dall-e-3',
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
        model: request.model || 'gpt-4',
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2000,
        stream: request.stream || false,
        response_format: request.responseFormat,
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
          provider: 'openai',
          model: request.model || 'gpt-4',
          tokensUsed: data.usage?.total_tokens,
        },
      };
    } catch (error) {
      throw ErrorHandler.fromException(error);
    }
  }

  /**
   * 图片分析
   */
  async analyzeImage(request: ImageAnalysisRequest): Promise<GenerationResponse> {
    try {
      const content: any[] = [
        {
          type: 'text',
          text: request.prompt,
        },
      ];

      // 处理图片
      if (request.images && request.images.length > 0) {
        for (const image of request.images) {
          content.push({
            type: 'image_url',
            image_url: {
              url: image,
              detail: request.detail || 'auto',
            },
          });
        }
      }

      const body = {
        model: request.model || 'gpt-4-vision',
        messages: [
          {
            role: 'user',
            content,
          },
        ],
        max_tokens: request.maxTokens || 2000,
      };

      const endpoint = this.endpoints.imageAnalysis || '/chat/completions';
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
          provider: 'openai',
          model: request.model || 'gpt-4-vision',
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
    body?: any,
    isFormData: boolean = false
  ): Promise<Response> {
    const url = `${this.baseUrl}${path}`;
    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.apiKey}`,
    };

    let requestBody: any = undefined;

    if (body) {
      if (isFormData) {
        requestBody = body;
      } else {
        headers['Content-Type'] = 'application/json';
        requestBody = JSON.stringify(body);
      }
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

    // OpenAI 支持的大小
    const validSizes = ['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792'];

    if (validSizes.includes(size)) {
      return size;
    }

    // 处理宽高比格式
    const ratioMap: Record<string, string> = {
      '1:1': '1024x1024',
      '16:9': '1792x1024',
      '9:16': '1024x1792',
      '4:3': '1024x768',
      '3:4': '768x1024',
    };

    return ratioMap[size] || '1024x1024';
  }

  /**
   * 将 Data URL 转换为 Blob
   */
  private async dataUrlToBlob(dataUrl: string): Promise<Blob> {
    if (dataUrl.startsWith('http')) {
      // 使用全局 fetch（在 Node.js 18+ 和浏览器中都可用）
      const fetchFn = typeof global !== 'undefined' && global.fetch ? global.fetch : fetch;
      const response = await fetchFn(dataUrl) as Response;
      return response.blob();
    }

    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new Blob([u8arr], { type: mime });
  }
}

export default OpenAIAdapter;
