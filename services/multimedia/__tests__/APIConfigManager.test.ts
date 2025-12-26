/**
 * APIConfigManager 单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import APIConfigManager from '../APIConfigManager';
import { MultiMediaConfig, APIProviderConfig } from '../types';
import { ConfigurationError, ProviderNotConfiguredError } from '../errors';

describe('APIConfigManager', () => {
  let manager: APIConfigManager;

  beforeEach(() => {
    manager = new APIConfigManager(1);
  });

  describe('getConfig', () => {
    it('should return default config when no config is set', async () => {
      const config = await manager.getConfig();
      expect(config).toBeDefined();
      expect(config.providers).toBeDefined();
      expect(config.configs).toBeDefined();
    });

    it('should cache config', async () => {
      const config1 = await manager.getConfig();
      const config2 = await manager.getConfig();
      expect(config1).toBe(config2);
    });
  });

  describe('validateConfig', () => {
    it('should validate empty config', async () => {
      const result = await manager.validateConfig({
        providers: {},
        configs: {},
      });
      expect(result.valid).toBe(true);
    });

    it('should reject config with missing provider', async () => {
      const config: MultiMediaConfig = {
        providers: {
          textToImage: 'shenma',
        },
        configs: {},
      };
      const result = await manager.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject config with unsupported function', async () => {
      const config: MultiMediaConfig = {
        providers: {
          textToImage: 'dayuyu', // Dayuyu 不支持文生图
        },
        configs: {
          dayuyu: {
            provider: 'dayuyu',
            apiKey: 'test-key',
            features: { videoGeneration: true },
          },
        },
      };
      const result = await manager.validateConfig(config);
      expect(result.valid).toBe(false);
    });
  });

  describe('addProviderConfig', () => {
    it('should add provider config', async () => {
      const config: APIProviderConfig = {
        provider: 'shenma',
        apiKey: 'test-key-123456',
        features: {
          textToImage: true,
          imageToImage: true,
          textGeneration: true,
        },
      };

      await manager.addProviderConfig('shenma', config);

      const multiConfig = await manager.getConfig();
      expect(multiConfig.configs.shenma).toBeDefined();
      expect(multiConfig.configs.shenma?.apiKey).toBe('test-key-123456');
    });

    it('should reject invalid provider config', async () => {
      const config: APIProviderConfig = {
        provider: 'shenma',
        apiKey: '', // 空 API Key
        features: {},
      };

      await expect(
        manager.addProviderConfig('shenma', config)
      ).rejects.toThrow(ConfigurationError);
    });
  });

  describe('syncConfig', () => {
    it('should sync config to provider', async () => {
      // 首先添加提供商配置
      const config: APIProviderConfig = {
        provider: 'shenma',
        apiKey: 'test-key-123456',
        features: {
          textToImage: true,
          imageToImage: true,
          textGeneration: true,
          imageAnalysis: true,
          videoGeneration: true,
          videoAnalysis: true,
        },
      };

      await manager.addProviderConfig('shenma', config);

      // 同步配置
      await manager.syncConfig('shenma');

      // 验证所有支持的功能都映射到 shenma
      const multiConfig = await manager.getConfig();
      expect(multiConfig.providers.textToImage).toBe('shenma');
      expect(multiConfig.providers.imageToImage).toBe('shenma');
      expect(multiConfig.providers.textGeneration).toBe('shenma');
      expect(multiConfig.providers.imageAnalysis).toBe('shenma');
      expect(multiConfig.providers.videoGeneration).toBe('shenma');
      expect(multiConfig.providers.videoAnalysis).toBe('shenma');
    });

    it('should throw error if provider not configured', async () => {
      await expect(
        manager.syncConfig('shenma')
      ).rejects.toThrow(ProviderNotConfiguredError);
    });
  });

  describe('setProviderForFunction', () => {
    it('should set provider for function', async () => {
      // 首先添加提供商配置
      const config: APIProviderConfig = {
        provider: 'shenma',
        apiKey: 'test-key-123456',
        features: { textToImage: true },
      };

      await manager.addProviderConfig('shenma', config);

      // 设置提供商
      await manager.setProviderForFunction('textToImage', 'shenma');

      // 验证
      const multiConfig = await manager.getConfig();
      expect(multiConfig.providers.textToImage).toBe('shenma');
    });

    it('should throw error if provider not configured', async () => {
      await expect(
        manager.setProviderForFunction('textToImage', 'shenma')
      ).rejects.toThrow(ProviderNotConfiguredError);
    });
  });

  describe('removeProviderConfig', () => {
    it('should remove provider config', async () => {
      // 首先添加提供商配置
      const config: APIProviderConfig = {
        provider: 'shenma',
        apiKey: 'test-key-123456',
        features: { textToImage: true },
      };

      await manager.addProviderConfig('shenma', config);

      // 移除配置
      await manager.removeProviderConfig('shenma');

      // 验证
      const multiConfig = await manager.getConfig();
      expect(multiConfig.configs.shenma).toBeUndefined();
    });

    it('should throw error if provider is in use', async () => {
      // 首先添加提供商配置
      const config: APIProviderConfig = {
        provider: 'shenma',
        apiKey: 'test-key-123456',
        features: { textToImage: true },
      };

      await manager.addProviderConfig('shenma', config);

      // 设置提供商
      await manager.setProviderForFunction('textToImage', 'shenma');

      // 尝试移除配置
      await expect(
        manager.removeProviderConfig('shenma')
      ).rejects.toThrow(ConfigurationError);
    });
  });

  describe('getConfiguredProviders', () => {
    it('should return configured providers', async () => {
      const config1: APIProviderConfig = {
        provider: 'shenma',
        apiKey: 'test-key-123456',
        features: { textToImage: true },
      };

      const config2: APIProviderConfig = {
        provider: 'openai',
        apiKey: 'test-key-789012',
        features: { textToImage: true },
      };

      await manager.addProviderConfig('shenma', config1);
      await manager.addProviderConfig('openai', config2);

      const providers = await manager.getConfiguredProviders();
      expect(providers).toContain('shenma');
      expect(providers).toContain('openai');
      expect(providers.length).toBe(2);
    });
  });

  describe('clearCache', () => {
    it('should clear cache', async () => {
      // 加载配置到缓存
      await manager.getConfig();

      // 清除缓存
      manager.clearCache();

      // 再次加载应该从存储加载
      const config = await manager.getConfig();
      expect(config).toBeDefined();
    });
  });
});
