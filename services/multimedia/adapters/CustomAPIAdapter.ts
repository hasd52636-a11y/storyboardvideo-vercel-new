/**
 * 统一多媒体 API 集成 - 自定义 API 适配器
 * 
 * 用于集成第三方或自定义的多媒体 API
 * 支持灵活的请求/响应映射
 */

import {
  IMediaAdapter,
  APIProviderConfig,
  TextToImageRequest,
  ImageEditRequest,
  TextGenerationRequest,
  ImageAnalysisRequest,
  VideoGenerationRequest,
  VideoAnalysisRequest,
  GenerationResponse,
} from '../types';
import {
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
// 自定义 API 适配器实现
// ============================================================================

export class CustomAPIAdapter implements IMediaAdapter {
  name = 'custom' as const;
  private apiKey: string;
  private baseUrl: string;
  private endpoints: Record<string, string> = {};
  private timeout: number;
  private logger: any;
  private customConfig: any;

  constructor(config: APIProviderConfig, logger?: any) {
    if (!config.apiKey) {
      throw new APIKeyError('API Key is required for Custom API provider');
    }

    if (!config.baseUrl) {
      throw new MultiMediaError(
        'Base URL is required for Custom API provider',
        'INVALID_CONFIG',
        false
      );
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.endpoints = config.endpoints || {};
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.logger = logger || console;
    this.customConfig = (config as any).customConfig || {};
  }

  /**
   * 检查适配器是否可用
   */
  async isAvailable(): Promise<boolean> {
    try {
      const healthPath = this.customConfig.healthPath || '/health';
      const response = await this.request('GET', healthPath, {});
      return response.ok;
    } catch (error) {
      this.logger.warn('[CustomAPIAdapter] Provider is not available:', error);
      return false;
    }
  }

  /**
   * 文生图
   */
  async generateImage(request: TextToImageRequest): Promise<GenerationResponse> {
    try {
      const endpoint = this.endpoints.textToImage || this.customConfig.endpoints?.generateImage || '/images/generations';
      const body = this.mapRequestBody('generateImage', request);

      const response = await this.request('POST', endpoint, body);
      const data = await response.json();

      if (!response.ok) {
        throw this.handleError(response.status, data);
      }

      return this.mapResponse('generateImage', data);
    } catch (error) {
      throw ErrorHandler.fromException(error);
    }
  }

  /**
   * 图生图
   */
  async editImage(request: ImageEditRequest): Promise<GenerationResponse> {
    try {
      const endpoint = this.endpoints.imageToImage || this.customConfig.endpoints?.editImage || '/images/edits';
      const formData = new FormData();

      // 处理图片
      if (request.images && request.images.length > 0) {
        const imageBlob = await this.dataUrlToBlob(request.images[0]);
        formData.append('image', imageBlob, 'image.png');
      }

      // 处理遮罩
      if (request.mask) {
        const maskBlob = await this.dataUrlToBlob(request.mask);
        formData.append('mask', maskBlob, 'mask.png');
      }

      formData.append('prompt', request.prompt);

      const response = await this.request('POST', endpoint, formData, true);
      const data = await response.json();

      if (!response.ok) {
        throw this.handleError(response.status, data);
      }

      return this.mapResponse('editImage', data);
    } catch (error) {
      throw ErrorHandler.fromException(error);
    }
  }

  /**
   * 文本生成
   */
  async generateText(request: TextGenerationRequest): Promise<GenerationResponse> {
    try {
      const endpoint = this.endpoints.textGeneration || this.customConfig.endpoints?.generateText || '/chat/completions';
      const body = this.mapRequestBody('generateText', request);

      const response = await this.request('POST', endpoint, body);
      const data = await response.json();

      if (!response.ok) {
        throw this.handleError(response.status, data);
      }

      return this.mapResponse('generateText', data);
    } catch (error) {
      throw ErrorHandler.fromException(error);
    }
  }

  /**
   * 图片分析
   */
  async analyzeImage(request: ImageAnalysisRequest): Promise<GenerationResponse> {
    try {
      const endpoint = this.endpoints.imageAnalysis || this.customConfig.endpoints?.analyzeImage || '/images/analysis';
      const body = this.mapRequestBody('analyzeImage', request);

      const response = await this.request('POST', endpoint, body);
      const data = await response.json();

      if (!response.ok) {
        throw this.handleError(response.status, data);
      }

      return this.mapResponse('analyzeImage', data);
    } catch (error) {
      throw ErrorHandler.fromException(error);
    }
  }

  /**
   * 视频生成
   */
  async generateVideo(request: VideoGenerationRequest): Promise<GenerationResponse> {
    try {
      const endpoint = this.endpoints.videoGeneration || this.customConfig.endpoints?.generateVideo || '/videos/generations';
      const body = this.mapRequestBody('generateVideo', request);

      const response = await this.request('POST', endpoint, body);
      const data = await response.json();

      if (!response.ok) {
        throw this.handleError(response.status, data);
      }

      return this.mapResponse('generateVideo', data);
    } catch (error) {
      throw ErrorHandler.fromException(error);
    }
  }

  /**
   * 视频分析
   */
  async analyzeVideo(request: VideoAnalysisRequest): Promise<GenerationResponse> {
    try {
      const endpoint = this.endpoints.videoAnalysis || this.customConfig.endpoints?.analyzeVideo || '/videos/analysis';
      const body = this.mapRequestBody('analyzeVideo', request);

      const response = await this.request('POST', endpoint, body);
      const data = await response.json();

      if (!response.ok) {
        throw this.handleError(response.status, data);
      }

      return this.mapResponse('analyzeVideo', data);
    } catch (error) {
      throw ErrorHandler.fromException(error);
    }
  }

  // ============================================================================
  // 私有方法
  // ============================================================================

  /**
   * 映射请求体
   */
  private mapRequestBody(functionType: string, request: any): any {
    const mapper = this.customConfig.requestMappers?.[functionType];

    if (mapper && typeof mapper === 'function') {
      return mapper(request);
    }

    // 默认映射
    return request;
  }

  /**
   * 映射响应
   */
  private mapResponse(functionType: string, data: any): GenerationResponse {
    const mapper = this.customConfig.responseMappers?.[functionType];

    if (mapper && typeof mapper === 'function') {
      return mapper(data);
    }

    // 默认响应格式
    return {
      success: true,
      data,
      metadata: {
        provider: 'custom',
      },
    };
  }

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
    const headers: HeadersInit = {};

    // 添加认证头
    if (this.customConfig.authHeader) {
      headers[this.customConfig.authHeader] = `Bearer ${this.apiKey}`;
    } else {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

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

  /**
   * 将 Data URL 转换为 Blob
   */
  private async dataUrlToBlob(dataUrl: string): Promise<Blob> {
    if (dataUrl.startsWith('http')) {
      const response = await fetch(dataUrl);
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

export default CustomAPIAdapter;
