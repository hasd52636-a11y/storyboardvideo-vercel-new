/**
 * MultiMediaService 单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import MultiMediaService from '../MultiMediaService';
import APIConfigManager from '../APIConfigManager';
import { IMediaAdapter, GenerationResponse, TextToImageRequest } from '../types';
import { ProviderNotConfiguredError, UnsupportedFunctionError } from '../errors';

// Mock 适配器
class MockAdapter implements IMediaAdapter {
  name = 'mock' as const;

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async generateImage(): Promise<GenerationResponse> {
    return {
      success: true,
      data: {
        images: ['https://example.com/image.png'],
      },
      metadata: {
        provider: 'mock',
        model: 'mock-model',
      },
    };
  }

  async editImage(): Promise<GenerationResponse> {
    return {
      success: true,
      data: {
        images: ['https://example.com/edited.png'],
      },
      metadata: {
        provider: 'mock',
        model: 'mock-model',
      },
    };
  }

  async generateText(): Promise<GenerationResponse> {
    return {
      success: true,
      data: {
        text: 'Mock response',
      },
      metadata: {
        provider: 'mock',
        model: 'mock-model',
      },
    };
  }

  async analyzeImage(): Promise<GenerationResponse> {
    return {
      success: true,
      data: {
        text: 'Image analysis result',
      },
      metadata: {
        provider: 'mock',
        model: 'mock-model',
      },
    };
  }

  async generateVideo(): Promise<GenerationResponse> {
    return {
      success: true,
      data: {
        videoUrl: 'https://example.com/video.mp4',
        taskId: 'task-123',
      },
      metadata: {
        provider: 'mock',
        model: 'mock-model',
      },
    };
  }

  async analyzeVideo(): Promise<GenerationResponse> {
    return {
      success: true,
      data: {
        text: 'Video analysis result',
      },
      metadata: {
        provider: 'mock',
        model: 'mock-model',
      },
    };
  }
}

describe('MultiMediaService', () => {
  let service: MultiMediaService;
  let configManager: APIConfigManager;
  let mockAdapter: MockAdapter;

  beforeEach(async () => {
    configManager = new APIConfigManager(1);
    service = new MultiMediaService(configManager, 1);
    mockAdapter = new MockAdapter();

    // 注册 mock 适配器
    service.registerAdapter('mock', mockAdapter);

    // 添加提供商配置
    await configManager.addProviderConfig('mock', {
      provider: 'mock',
      apiKey: 'test-key-1234567890', // 长度足够
      features: {
        textToImage: true,
        imageToImage: true,
        textGeneration: true,
        imageAnalysis: true,
        videoGeneration: true,
        videoAnalysis: true,
      },
    });

    // 同步配置
    await configManager.syncConfig('mock');
  });

  describe('generateImage', () => {
    it('should generate image', async () => {
      const request: TextToImageRequest = {
        prompt: 'A beautiful sunset',
      };

      const response = await service.generateImage(request);

      expect(response.success).toBe(true);
      expect(response.data?.images).toBeDefined();
      expect(response.data?.images?.length).toBeGreaterThan(0);
    });

    it('should throw error if provider not configured', async () => {
      // 创建新的服务，不配置提供商
      const newService = new MultiMediaService(new APIConfigManager(2), 2);

      const request: TextToImageRequest = {
        prompt: 'A beautiful sunset',
      };

      await expect(newService.generateImage(request)).rejects.toThrow(
        ProviderNotConfiguredError
      );
    });
  });

  describe('editImage', () => {
    it('should edit image', async () => {
      const response = await service.editImage({
        prompt: 'Make it more colorful',
        images: ['https://example.com/image.png'],
      });

      expect(response.success).toBe(true);
      expect(response.data?.images).toBeDefined();
    });
  });

  describe('generateText', () => {
    it('should generate text', async () => {
      const response = await service.generateText({
        messages: [
          {
            role: 'user',
            content: 'Hello, how are you?',
          },
        ],
      });

      expect(response.success).toBe(true);
      expect(response.data?.text).toBeDefined();
    });
  });

  describe('analyzeImage', () => {
    it('should analyze image', async () => {
      const response = await service.analyzeImage({
        images: ['https://example.com/image.png'],
        prompt: 'What is in this image?',
      });

      expect(response.success).toBe(true);
      expect(response.data?.text).toBeDefined();
    });
  });

  describe('generateVideo', () => {
    it('should generate video', async () => {
      const response = await service.generateVideo({
        prompt: 'A cat playing with a ball',
      });

      expect(response.success).toBe(true);
      expect(response.data?.videoUrl || response.data?.taskId).toBeDefined();
    });
  });

  describe('analyzeVideo', () => {
    it('should analyze video', async () => {
      const response = await service.analyzeVideo({
        videoUrl: 'https://example.com/video.mp4',
        prompt: 'What is happening in this video?',
      });

      expect(response.success).toBe(true);
      expect(response.data?.text).toBeDefined();
    });
  });

  describe('getConfig', () => {
    it('should get config', async () => {
      const config = await service.getConfig();

      expect(config).toBeDefined();
      expect(config.providers).toBeDefined();
      expect(config.configs).toBeDefined();
    });
  });

  describe('syncConfig', () => {
    it('should sync config', async () => {
      await service.syncConfig('mock');

      const config = await service.getConfig();
      expect(config.providers.textToImage).toBe('mock');
      expect(config.providers.imageToImage).toBe('mock');
      expect(config.providers.textGeneration).toBe('mock');
    });
  });

  describe('getProviderStatus', () => {
    it('should get provider status', async () => {
      const status = await service.getProviderStatus('mock');

      expect(status).toBeDefined();
      expect(status.provider).toBe('mock');
      // validateAPIKey 检查 API Key 格式，'test-key' 长度足够，所以应该返回 true
      expect(status.available).toBe(true);
    });
  });

  describe('getConfiguredProviders', () => {
    it('should get configured providers', async () => {
      const providers = await service.getConfiguredProviders();

      expect(providers).toContain('mock');
    });
  });

  describe('retry logic', () => {
    it('should retry on transient error', async () => {
      let callCount = 0;
      const failingAdapter: IMediaAdapter = {
        name: 'mock',
        async isAvailable() {
          return true;
        },
        async generateImage() {
          callCount++;
          if (callCount < 2) {
            // 抛出一个可重试的错误（模拟 503 Service Unavailable）
            const error = new Error('Service temporarily unavailable');
            (error as any).statusCode = 503;
            throw error;
          }
          return {
            success: true,
            data: { images: ['https://example.com/image.png'] },
            metadata: { provider: 'mock', model: 'test' },
          };
        },
      };

      // 替换 mock 适配器为会失败的版本
      service.registerAdapter('mock', failingAdapter);

      // 应该在重试后成功
      const response = await service.generateImage({
        prompt: 'Test',
      });

      expect(response.success).toBe(true);
      expect(callCount).toBeGreaterThan(1);
    });
  });
});
