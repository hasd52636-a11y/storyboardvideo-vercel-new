/**
 * 统一多媒体 API 集成 - API 配置管理器
 */

import {
  APIProviderConfig,
  MultiMediaConfig,
  MediaProvider,
  MediaFunction,
  IConfigManager,
  ValidationResult,
  ProviderStatus,
  CacheEntry,
} from './types';
import {
  PROVIDER_CAPABILITIES,
  DEFAULT_TIMEOUT,
  DEFAULT_RETRY_COUNT,
  DEFAULT_CACHE_TTL,
  CACHE_KEY_PREFIX,
} from './constants';
import {
  MultiMediaError,
  ConfigurationError,
  APIKeyError,
  ProviderNotConfiguredError,
  UnsupportedFunctionError,
  ErrorHandler,
} from './errors';

// ============================================================================
// 配置管理器实现
// ============================================================================

export class APIConfigManager implements IConfigManager {
  private config: MultiMediaConfig | null = null;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private cacheTTL: number = DEFAULT_CACHE_TTL;
  private userId?: number;
  private logger: any;

  constructor(userId?: number, logger?: any) {
    this.userId = userId;
    this.logger = logger || console;
  }

  /**
   * 获取配置
   */
  async getConfig(userId?: number): Promise<MultiMediaConfig> {
    const id = userId || this.userId;
    const cacheKey = `${CACHE_KEY_PREFIX.CONFIG}${id || 'default'}`;

    // 检查缓存
    const cached = this.getCachedValue<MultiMediaConfig>(cacheKey);
    if (cached) {
      this.logger.debug(`[APIConfigManager] Config loaded from cache for user ${id}`);
      return cached;
    }

    // 从存储加载配置
    if (!this.config) {
      this.config = await this.loadConfigFromStorage(id);
    }

    // 缓存配置
    this.setCachedValue(cacheKey, this.config, this.cacheTTL);

    return this.config;
  }

  /**
   * 更新配置
   */
  async updateConfig(config: MultiMediaConfig, userId?: number): Promise<void> {
    const id = userId || this.userId;

    // 验证配置
    const validation = await this.validateConfig(config);
    if (!validation.valid) {
      throw new ConfigurationError(
        `Configuration validation failed: ${validation.errors.join(', ')}`,
        { errors: validation.errors, warnings: validation.warnings }
      );
    }

    // 保存配置
    this.config = config;
    await this.saveConfigToStorage(config, id);

    // 清除缓存
    const cacheKey = `${CACHE_KEY_PREFIX.CONFIG}${id || 'default'}`;
    this.cache.delete(cacheKey);

    this.logger.info(`[APIConfigManager] Configuration updated for user ${id}`);
  }

  /**
   * 同步配置（一键同步）
   */
  async syncConfig(provider: MediaProvider, userId?: number): Promise<void> {
    const id = userId || this.userId;
    const config = await this.getConfig(id);

    // 检查提供商是否已配置
    if (!config.configs[provider]) {
      throw new ProviderNotConfiguredError(provider);
    }

    // 获取提供商的能力
    const capabilities = PROVIDER_CAPABILITIES[provider];
    if (!capabilities) {
      throw new ConfigurationError(`Unknown provider: ${provider}`);
    }

    // 更新所有功能的提供商映射
    const functions: MediaFunction[] = [
      'textToImage',
      'imageToImage',
      'textGeneration',
      'imageAnalysis',
      'videoGeneration',
      'videoAnalysis',
    ];

    for (const func of functions) {
      if (capabilities[func]) {
        config.providers[func] = provider;
      }
    }

    // 保存更新后的配置
    await this.updateConfig(config, id);

    this.logger.info(
      `[APIConfigManager] Configuration synced to provider "${provider}" for user ${id}`
    );
  }

  /**
   * 验证配置
   */
  async validateConfig(config: MultiMediaConfig): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查配置对象
    if (!config) {
      errors.push('Configuration object is required');
      return { valid: false, errors, warnings };
    }

    // 检查提供商映射
    if (!config.providers) {
      errors.push('Providers mapping is required');
    }

    // 检查配置对象
    if (!config.configs) {
      errors.push('Configs object is required');
    }

    if (errors.length > 0) {
      return { valid: false, errors, warnings };
    }

    // 验证每个提供商配置
    for (const [provider, providerConfig] of Object.entries(config.configs)) {
      if (!providerConfig) continue;

      const validation = this.validateProviderConfig(
        provider as MediaProvider,
        providerConfig
      );
      errors.push(...validation.errors);
      warnings.push(...validation.warnings);
    }

    // 验证提供商映射
    for (const [func, provider] of Object.entries(config.providers)) {
      if (!provider) continue;

      if (!config.configs[provider]) {
        errors.push(
          `Provider "${provider}" for function "${func}" is not configured`
        );
      }

      const capabilities = PROVIDER_CAPABILITIES[provider];
      if (capabilities && !capabilities[func as MediaFunction]) {
        errors.push(
          `Provider "${provider}" does not support function "${func}"`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 获取提供商状态
   */
  async getProviderStatus(provider: MediaProvider): Promise<ProviderStatus> {
    const cacheKey = `${CACHE_KEY_PREFIX.PROVIDER_STATUS}${provider}`;

    // 检查缓存
    const cached = this.getCachedValue<ProviderStatus>(cacheKey);
    if (cached) {
      return cached;
    }

    const config = this.config;
    const providerConfig = config?.configs[provider];

    if (!providerConfig) {
      const status: ProviderStatus = {
        provider,
        available: false,
        features: {},
        error: `Provider "${provider}" is not configured`,
      };
      return status;
    }

    // 验证 API Key
    let available = false;
    let error: string | undefined;

    try {
      available = await this.validateAPIKey(provider, providerConfig.apiKey);
    } catch (err) {
      error = (err as Error).message;
    }

    const capabilities = PROVIDER_CAPABILITIES[provider];
    const status: ProviderStatus = {
      provider,
      available,
      features: capabilities || {},
      lastChecked: Date.now(),
      error,
    };

    // 缓存状态
    this.setCachedValue(cacheKey, status, 60000); // 1 分钟

    return status;
  }

  /**
   * 获取特定功能的提供商
   */
  async getProviderForFunction(
    func: MediaFunction,
    userId?: number
  ): Promise<MediaProvider> {
    const config = await this.getConfig(userId);
    const provider = config.providers[func];

    if (!provider) {
      throw new ProviderNotConfiguredError(`No provider configured for function "${func}"`);
    }

    return provider;
  }

  /**
   * 设置特定功能的提供商
   */
  async setProviderForFunction(
    func: MediaFunction,
    provider: MediaProvider,
    userId?: number
  ): Promise<void> {
    const config = await this.getConfig(userId);

    // 检查提供商是否已配置
    if (!config.configs[provider]) {
      throw new ProviderNotConfiguredError(provider);
    }

    // 检查提供商是否支持该功能
    const capabilities = PROVIDER_CAPABILITIES[provider];
    if (!capabilities[func]) {
      throw new UnsupportedFunctionError(provider, func);
    }

    // 更新提供商映射
    config.providers[func] = provider;

    // 保存配置
    await this.updateConfig(config, userId);
  }

  /**
   * 添加提供商配置
   */
  async addProviderConfig(
    provider: MediaProvider,
    config: APIProviderConfig,
    userId?: number
  ): Promise<void> {
    const multiConfig = await this.getConfig(userId);

    // 验证提供商配置
    const validation = this.validateProviderConfig(provider, config);
    if (validation.errors.length > 0) {
      throw new ConfigurationError(
        `Provider configuration validation failed: ${validation.errors.join(', ')}`,
        { errors: validation.errors }
      );
    }

    // 添加配置
    multiConfig.configs[provider] = config;

    // 保存配置
    await this.updateConfig(multiConfig, userId);
  }

  /**
   * 移除提供商配置
   */
  async removeProviderConfig(provider: MediaProvider, userId?: number): Promise<void> {
    const config = await this.getConfig(userId);

    // 检查是否有功能使用该提供商
    const usedFunctions: MediaFunction[] = [];
    for (const [func, p] of Object.entries(config.providers)) {
      if (p === provider) {
        usedFunctions.push(func as MediaFunction);
      }
    }

    if (usedFunctions.length > 0) {
      throw new ConfigurationError(
        `Cannot remove provider "${provider}" because it is used by functions: ${usedFunctions.join(', ')}`,
        { usedFunctions }
      );
    }

    // 移除配置
    delete config.configs[provider];

    // 保存配置
    await this.updateConfig(config, userId);
  }

  /**
   * 获取所有已配置的提供商
   */
  async getConfiguredProviders(userId?: number): Promise<MediaProvider[]> {
    const config = await this.getConfig(userId);
    return Object.keys(config.configs) as MediaProvider[];
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.debug('[APIConfigManager] Cache cleared');
  }

  // ============================================================================
  // 私有方法
  // ============================================================================

  /**
   * 验证提供商配置
   */
  private validateProviderConfig(
    provider: MediaProvider,
    config: APIProviderConfig
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查 API Key
    if (!config.apiKey || config.apiKey.trim() === '') {
      errors.push(`API Key is required for provider "${provider}"`);
    }

    // 检查功能配置
    if (!config.features || Object.keys(config.features).length === 0) {
      warnings.push(`No features enabled for provider "${provider}"`);
    }

    // 检查超时配置
    if (config.timeout && config.timeout < 1000) {
      warnings.push(`Timeout ${config.timeout}ms is too short, minimum is 1000ms`);
    }

    // 检查重试配置
    if (config.retryCount && config.retryCount < 0) {
      errors.push(`Retry count cannot be negative`);
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * 验证 API Key
   */
  private async validateAPIKey(provider: MediaProvider, apiKey: string): Promise<boolean> {
    // 这是一个占位符实现
    // 实际实现应该调用提供商的 API 来验证 Key
    // 例如：调用 /v1/models 端点来检查 API Key 是否有效

    if (!apiKey || apiKey.trim() === '') {
      throw new APIKeyError('API Key is empty');
    }

    // 基本验证：检查 API Key 格式
    if (apiKey.length < 10) {
      throw new APIKeyError('API Key is too short');
    }

    // TODO: 实现实际的 API Key 验证
    // 这需要在具体的适配器中实现

    return true;
  }

  /**
   * 从存储加载配置
   */
  private async loadConfigFromStorage(userId?: number): Promise<MultiMediaConfig> {
    try {
      // 尝试从 localStorage 加载配置（客户端）
      if (typeof window !== 'undefined' && window.localStorage) {
        const storageKey = `multimedia_config_${userId || 'default'}`;
        const stored = window.localStorage.getItem(storageKey);
        
        if (stored) {
          const config = JSON.parse(stored) as MultiMediaConfig;
          this.logger.debug(`[APIConfigManager] Configuration loaded from localStorage for user ${userId || 'default'}`);
          return config;
        }
      }
    } catch (error) {
      this.logger.warn(`[APIConfigManager] Failed to load config from localStorage:`, error);
    }

    // 尝试从数据库加载配置（服务器端）
    if (userId) {
      try {
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        
        try {
          const dbConfig = await prisma.multimediaAPIConfig.findUnique({
            where: { userId },
          });
          
          if (dbConfig) {
            this.logger.debug(`[APIConfigManager] Configuration loaded from database for user ${userId}`);
            return dbConfig.config as MultiMediaConfig;
          }
        } finally {
          await prisma.$disconnect();
        }
      } catch (error) {
        this.logger.warn(`[APIConfigManager] Failed to load config from database:`, error);
      }
    }

    // 返回默认配置
    return {
      providers: {},
      configs: {},
      globalTimeout: DEFAULT_TIMEOUT,
      globalRetryCount: DEFAULT_RETRY_COUNT,
      enableCache: true,
      cacheTTL: DEFAULT_CACHE_TTL,
    };
  }

  /**
   * 保存配置到存储
   */
  private async saveConfigToStorage(
    config: MultiMediaConfig,
    userId?: number
  ): Promise<void> {
    try {
      // 保存到 localStorage（客户端）
      if (typeof window !== 'undefined' && window.localStorage) {
        const storageKey = `multimedia_config_${userId || 'default'}`;
        window.localStorage.setItem(storageKey, JSON.stringify(config));
        this.logger.debug(
          `[APIConfigManager] Configuration saved to localStorage for user ${userId || 'default'}`
        );
      }
    } catch (error) {
      this.logger.warn(`[APIConfigManager] Failed to save config to localStorage:`, error);
    }

    // 保存到数据库（服务器端）
    if (userId) {
      try {
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        
        await prisma.multimediaAPIConfig.upsert({
          where: { userId },
          update: { config },
          create: { userId, config },
        });
        
        this.logger.debug(
          `[APIConfigManager] Configuration saved to database for user ${userId}`
        );
      } catch (error) {
        this.logger.warn(`[APIConfigManager] Failed to save config to database:`, error);
      }
    }
  }

  /**
   * 获取缓存值
   */
  private getCachedValue<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * 设置缓存值
   */
  private setCachedValue<T>(key: string, value: T, ttl: number): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });
  }
}

// ============================================================================
// 导出
// ============================================================================

export default APIConfigManager;
