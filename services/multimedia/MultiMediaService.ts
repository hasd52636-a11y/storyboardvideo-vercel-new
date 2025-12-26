/**
 * 统一多媒体 API 集成 - 多媒体服务
 */

import {
  IMediaAdapter,
  MediaProvider,
  MediaFunction,
  MultiMediaConfig,
  TextToImageRequest,
  ImageEditRequest,
  TextGenerationRequest,
  ImageAnalysisRequest,
  VideoGenerationRequest,
  VideoAnalysisRequest,
  GenerationResponse,
  APIProviderConfig,
} from './types';
import {
  PROVIDER_CAPABILITIES,
  DEFAULT_TIMEOUT,
  DEFAULT_RETRY_COUNT,
  RETRY_CONFIG,
} from './constants';
import {
  MultiMediaError,
  ProviderNotConfiguredError,
  UnsupportedFunctionError,
  ErrorHandler,
} from './errors';
import APIConfigManager from './APIConfigManager';
import {
  ShenmaAPIAdapter,
  OpenAIAdapter,
  ZhipuAdapter,
  DayuyuVideoAdapter,
  CustomAPIAdapter,
} from './adapters';

// ============================================================================
// 多媒体服务实现
// ============================================================================

export class MultiMediaService {
  private configManager: APIConfigManager;
  private adapters: Map<MediaProvider, IMediaAdapter> = new Map();
  private config: MultiMediaConfig | null = null;
  private logger: any;
  private userId?: number;

  constructor(configManager?: APIConfigManager, userId?: number, logger?: any) {
    this.configManager = configManager || new APIConfigManager(userId);
    this.userId = userId;
    this.logger = logger || console;
  }

  /**
   * 初始化适配器（必须在使用前调用）
   */
  async initialize(): Promise<void> {
    const config = await this.configManager.getConfig(this.userId);
    this.config = config;
    this.initializeAdaptersSync(config);
  }

  /**
   * 初始化适配器（同步版本，用于测试）
   */
  initializeAdaptersSync(config: MultiMediaConfig): void {
    this.config = config;
    
    // Shenma 适配器
    if (config.configs.shenma) {
      try {
        const adapter = new ShenmaAPIAdapter(config.configs.shenma, this.logger);
        this.registerAdapter('shenma', adapter);
      } catch (error) {
        this.logger.warn('[MultiMediaService] Failed to initialize Shenma adapter:', error);
      }
    }

    // OpenAI 适配器
    if (config.configs.openai) {
      try {
        const adapter = new OpenAIAdapter(config.configs.openai, this.logger);
        this.registerAdapter('openai', adapter);
      } catch (error) {
        this.logger.warn('[MultiMediaService] Failed to initialize OpenAI adapter:', error);
      }
    }

    // Zhipu 适配器
    if (config.configs.zhipu) {
      try {
        const adapter = new ZhipuAdapter(config.configs.zhipu, this.logger);
        this.registerAdapter('zhipu', adapter);
      } catch (error) {
        this.logger.warn('[MultiMediaService] Failed to initialize Zhipu adapter:', error);
      }
    }

    // Dayuyu 视频适配器
    if (config.configs.dayuyu) {
      try {
        const adapter = new DayuyuVideoAdapter(config.configs.dayuyu, this.logger);
        this.registerAdapter('dayuyu', adapter);
      } catch (error) {
        this.logger.warn('[MultiMediaService] Failed to initialize Dayuyu adapter:', error);
      }
    }

    // 自定义 API 适配器
    if (config.configs.custom) {
      try {
        const adapter = new CustomAPIAdapter(config.configs.custom, this.logger);
        this.registerAdapter('custom', adapter);
      } catch (error) {
        this.logger.warn('[MultiMediaService] Failed to initialize Custom API adapter:', error);
      }
    }
  }

  /**
   * 注册适配器
   */
  registerAdapter(provider: MediaProvider, adapter: IMediaAdapter): void {
    this.adapters.set(provider, adapter);
    this.logger.debug(`[MultiMediaService] Adapter registered for provider "${provider}"`);
  }

  /**
   * 获取适配器
   */
  private getAdapter(provider: MediaProvider): IMediaAdapter {
    const adapter = this.adapters.get(provider);
    if (!adapter) {
      throw new ProviderNotConfiguredError(provider);
    }
    return adapter;
  }

  /**
   * 文生图
   */
  async generateImage(request: TextToImageRequest): Promise<GenerationResponse> {
    return this.executeWithRetry(
      'textToImage',
      async (adapter) => {
        if (!adapter.generateImage) {
          throw new UnsupportedFunctionError(
            this.adapters.get(this.adapters.keys().next().value)?.name || 'unknown',
            'textToImage'
          );
        }
        return adapter.generateImage(request);
      }
    );
  }

  /**
   * 图生图
   */
  async editImage(request: ImageEditRequest): Promise<GenerationResponse> {
    return this.executeWithRetry(
      'imageToImage',
      async (adapter) => {
        if (!adapter.editImage) {
          throw new UnsupportedFunctionError(
            this.adapters.get(this.adapters.keys().next().value)?.name || 'unknown',
            'imageToImage'
          );
        }
        return adapter.editImage(request);
      }
    );
  }

  /**
   * 文本生成
   */
  async generateText(request: TextGenerationRequest): Promise<GenerationResponse> {
    return this.executeWithRetry(
      'textGeneration',
      async (adapter) => {
        if (!adapter.generateText) {
          throw new UnsupportedFunctionError(
            this.adapters.get(this.adapters.keys().next().value)?.name || 'unknown',
            'textGeneration'
          );
        }
        return adapter.generateText(request);
      }
    );
  }

  /**
   * 图片分析
   */
  async analyzeImage(request: ImageAnalysisRequest): Promise<GenerationResponse> {
    return this.executeWithRetry(
      'imageAnalysis',
      async (adapter) => {
        if (!adapter.analyzeImage) {
          throw new UnsupportedFunctionError(
            this.adapters.get(this.adapters.keys().next().value)?.name || 'unknown',
            'imageAnalysis'
          );
        }
        return adapter.analyzeImage(request);
      }
    );
  }

  /**
   * 视频生成
   */
  async generateVideo(request: VideoGenerationRequest): Promise<GenerationResponse> {
    return this.executeWithRetry(
      'videoGeneration',
      async (adapter) => {
        if (!adapter.generateVideo) {
          throw new UnsupportedFunctionError(
            this.adapters.get(this.adapters.keys().next().value)?.name || 'unknown',
            'videoGeneration'
          );
        }
        return adapter.generateVideo(request);
      }
    );
  }

  /**
   * 视频分析
   */
  async analyzeVideo(request: VideoAnalysisRequest): Promise<GenerationResponse> {
    return this.executeWithRetry(
      'videoAnalysis',
      async (adapter) => {
        if (!adapter.analyzeVideo) {
          throw new UnsupportedFunctionError(
            this.adapters.get(this.adapters.keys().next().value)?.name || 'unknown',
            'videoAnalysis'
          );
        }
        return adapter.analyzeVideo(request);
      }
    );
  }

  /**
   * 获取配置
   */
  async getConfig(): Promise<MultiMediaConfig> {
    return this.configManager.getConfig(this.userId);
  }

  /**
   * 更新配置
   */
  async updateConfig(config: MultiMediaConfig): Promise<void> {
    return this.configManager.updateConfig(config, this.userId);
  }

  /**
   * 同步配置
   */
  async syncConfig(provider: MediaProvider): Promise<void> {
    return this.configManager.syncConfig(provider, this.userId);
  }

  /**
   * 获取提供商状态
   */
  async getProviderStatus(provider: MediaProvider) {
    return this.configManager.getProviderStatus(provider);
  }

  /**
   * 获取所有已配置的提供商
   */
  async getConfiguredProviders() {
    return this.configManager.getConfiguredProviders(this.userId);
  }

  // ============================================================================
  // 私有方法
  // ============================================================================

  /**
   * 执行请求并支持重试
   */
  private async executeWithRetry(
    func: MediaFunction,
    execute: (adapter: IMediaAdapter) => Promise<GenerationResponse>,
    retryCount: number = 0
  ): Promise<GenerationResponse> {
    try {
      // 获取配置（使用已初始化的配置或从 configManager 加载）
      let config = this.config;
      if (!config) {
        config = await this.configManager.getConfig(this.userId);
      }

      this.logger.debug(`[MultiMediaService] Config providers:`, Object.keys(config.providers || {}));
      this.logger.debug(`[MultiMediaService] Looking for provider for function: ${func}`);

      // 获取提供商
      const provider = config.providers[func];
      if (!provider) {
        // 如果没有配置该功能的提供商，尝试使用任何可用的提供商
        const availableProviders = Object.keys(config.configs || {});
        if (availableProviders.length === 0) {
          throw new ProviderNotConfiguredError(`No provider configured for function "${func}"`);
        }
        
        this.logger.warn(`[MultiMediaService] No provider configured for function "${func}", using first available: ${availableProviders[0]}`);
        config.providers[func] = availableProviders[0] as MediaProvider;
      }

      // 检查提供商是否支持该功能
      const capabilities = PROVIDER_CAPABILITIES[provider];
      if (!capabilities || !capabilities[func]) {
        throw new UnsupportedFunctionError(provider, func);
      }

      // 获取适配器
      const adapter = this.getAdapter(provider);

      // 检查适配器是否可用
      const available = await adapter.isAvailable();
      if (!available) {
        throw new MultiMediaError(
          `Provider "${provider}" is not available`,
          'SERVICE_UNAVAILABLE',
          true
        );
      }

      // 执行请求
      this.logger.debug(
        `[MultiMediaService] Executing ${func} with provider "${provider}"`
      );

      const response = await execute(adapter);

      this.logger.info(
        `[MultiMediaService] ${func} completed successfully with provider "${provider}"`
      );

      return response;
    } catch (error) {
      const err = ErrorHandler.fromException(error);

      // 检查是否可重试
      if (
        ErrorHandler.isRetryable(err) &&
        retryCount < RETRY_CONFIG.maxRetries
      ) {
        const delay = ErrorHandler.getRetryDelay(
          retryCount,
          RETRY_CONFIG.initialDelayMs,
          RETRY_CONFIG.maxDelayMs,
          RETRY_CONFIG.backoffMultiplier
        );

        this.logger.warn(
          `[MultiMediaService] Request failed, retrying in ${delay}ms (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`
        );

        await this.sleep(delay);
        return this.executeWithRetry(func, execute, retryCount + 1);
      }

      this.logger.error(
        `[MultiMediaService] ${func} failed: ${ErrorHandler.formatErrorMessage(err)}`
      );

      throw err;
    }
  }

  /**
   * 延迟
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// 导出
// ============================================================================

export default MultiMediaService;
