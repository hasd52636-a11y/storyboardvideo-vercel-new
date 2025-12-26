/**
 * 统一多媒体 API 集成 - 适配器测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ShenmaAPIAdapter,
  OpenAIAdapter,
  ZhipuAdapter,
  DayuyuVideoAdapter,
  CustomAPIAdapter,
} from '../index';
import { APIKeyError, MultiMediaError } from '../../errors';

// ============================================================================
// 测试数据
// ============================================================================

const TEST_API_KEY = 'sk-test-key-12345';
const TEST_BASE_URL = 'https://api.example.com';

// ============================================================================
// Shenma 适配器测试
// ============================================================================

describe('ShenmaAPIAdapter', () => {
  let adapter: ShenmaAPIAdapter;

  beforeEach(() => {
    adapter = new ShenmaAPIAdapter({
      provider: 'shenma',
      apiKey: TEST_API_KEY,
      baseUrl: TEST_BASE_URL,
      features: {
        textToImage: true,
        imageToImage: true,
        textGeneration: true,
        imageAnalysis: true,
        videoGeneration: true,
        videoAnalysis: true,
      },
    });
  });

  it('should throw error if API key is missing', () => {
    expect(() => {
      new ShenmaAPIAdapter({
        provider: 'shenma',
        apiKey: '',
        features: {},
      });
    }).toThrow(APIKeyError);
  });

  it('should have correct name', () => {
    expect(adapter.name).toBe('shenma');
  });

  it('should support all functions', () => {
    expect(adapter.generateImage).toBeDefined();
    expect(adapter.editImage).toBeDefined();
    expect(adapter.generateText).toBeDefined();
    expect(adapter.analyzeImage).toBeDefined();
    expect(adapter.generateVideo).toBeDefined();
    expect(adapter.analyzeVideo).toBeDefined();
  });
});

// ============================================================================
// OpenAI 适配器测试
// ============================================================================

describe('OpenAIAdapter', () => {
  let adapter: OpenAIAdapter;

  beforeEach(() => {
    adapter = new OpenAIAdapter({
      provider: 'openai',
      apiKey: TEST_API_KEY,
      baseUrl: TEST_BASE_URL,
      features: {
        textToImage: true,
        imageToImage: true,
        textGeneration: true,
        imageAnalysis: true,
      },
    });
  });

  it('should throw error if API key is missing', () => {
    expect(() => {
      new OpenAIAdapter({
        provider: 'openai',
        apiKey: '',
        features: {},
      });
    }).toThrow(APIKeyError);
  });

  it('should have correct name', () => {
    expect(adapter.name).toBe('openai');
  });

  it('should support image and text functions', () => {
    expect(adapter.generateImage).toBeDefined();
    expect(adapter.editImage).toBeDefined();
    expect(adapter.generateText).toBeDefined();
    expect(adapter.analyzeImage).toBeDefined();
  });

  it('should not support video functions', () => {
    expect(adapter.generateVideo).toBeUndefined();
    expect(adapter.analyzeVideo).toBeUndefined();
  });
});

// ============================================================================
// Zhipu 适配器测试
// ============================================================================

describe('ZhipuAdapter', () => {
  let adapter: ZhipuAdapter;

  beforeEach(() => {
    adapter = new ZhipuAdapter({
      provider: 'zhipu',
      apiKey: TEST_API_KEY,
      baseUrl: TEST_BASE_URL,
      features: {
        textToImage: true,
        textGeneration: true,
      },
    });
  });

  it('should throw error if API key is missing', () => {
    expect(() => {
      new ZhipuAdapter({
        provider: 'zhipu',
        apiKey: '',
        features: {},
      });
    }).toThrow(APIKeyError);
  });

  it('should have correct name', () => {
    expect(adapter.name).toBe('zhipu');
  });

  it('should support text and image generation', () => {
    expect(adapter.generateImage).toBeDefined();
    expect(adapter.generateText).toBeDefined();
  });

  it('should not support other functions', () => {
    expect(adapter.editImage).toBeUndefined();
    expect(adapter.analyzeImage).toBeUndefined();
    expect(adapter.generateVideo).toBeUndefined();
    expect(adapter.analyzeVideo).toBeUndefined();
  });
});

// ============================================================================
// Dayuyu 视频适配器测试
// ============================================================================

describe('DayuyuVideoAdapter', () => {
  let adapter: DayuyuVideoAdapter;

  beforeEach(() => {
    adapter = new DayuyuVideoAdapter({
      provider: 'dayuyu',
      apiKey: TEST_API_KEY,
      baseUrl: TEST_BASE_URL,
      features: {
        videoGeneration: true,
      },
    });
  });

  it('should throw error if API key is missing', () => {
    expect(() => {
      new DayuyuVideoAdapter({
        provider: 'dayuyu',
        apiKey: '',
        features: {},
      });
    }).toThrow(APIKeyError);
  });

  it('should have correct name', () => {
    expect(adapter.name).toBe('dayuyu');
  });

  it('should support only video generation', () => {
    expect(adapter.generateVideo).toBeDefined();
  });

  it('should not support other functions', () => {
    expect(adapter.generateImage).toBeUndefined();
    expect(adapter.editImage).toBeUndefined();
    expect(adapter.generateText).toBeUndefined();
    expect(adapter.analyzeImage).toBeUndefined();
    expect(adapter.analyzeVideo).toBeUndefined();
  });
});

// ============================================================================
// 自定义 API 适配器测试
// ============================================================================

describe('CustomAPIAdapter', () => {
  let adapter: CustomAPIAdapter;

  beforeEach(() => {
    adapter = new CustomAPIAdapter({
      provider: 'custom',
      apiKey: TEST_API_KEY,
      baseUrl: TEST_BASE_URL,
      features: {
        textToImage: true,
        imageToImage: true,
        textGeneration: true,
        imageAnalysis: true,
        videoGeneration: true,
        videoAnalysis: true,
      },
    });
  });

  it('should throw error if API key is missing', () => {
    expect(() => {
      new CustomAPIAdapter({
        provider: 'custom',
        apiKey: '',
        baseUrl: TEST_BASE_URL,
        features: {},
      });
    }).toThrow(APIKeyError);
  });

  it('should throw error if base URL is missing', () => {
    expect(() => {
      new CustomAPIAdapter({
        provider: 'custom',
        apiKey: TEST_API_KEY,
        features: {},
      });
    }).toThrow(MultiMediaError);
  });

  it('should have correct name', () => {
    expect(adapter.name).toBe('custom');
  });

  it('should support all functions', () => {
    expect(adapter.generateImage).toBeDefined();
    expect(adapter.editImage).toBeDefined();
    expect(adapter.generateText).toBeDefined();
    expect(adapter.analyzeImage).toBeDefined();
    expect(adapter.generateVideo).toBeDefined();
    expect(adapter.analyzeVideo).toBeDefined();
  });

  it('should support custom request/response mappers', () => {
    const customAdapter = new CustomAPIAdapter({
      provider: 'custom',
      apiKey: TEST_API_KEY,
      baseUrl: TEST_BASE_URL,
      features: {
        textToImage: true,
      },
      customConfig: {
        endpoints: {
          generateImage: '/custom/image-gen',
        },
        requestMappers: {
          generateImage: (req: any) => ({
            ...req,
            custom_field: 'custom_value',
          }),
        },
        responseMappers: {
          generateImage: (res: any) => ({
            success: true,
            data: res,
            metadata: {
              provider: 'custom',
            },
          }),
        },
      },
    });

    expect(customAdapter).toBeDefined();
  });
});

// ============================================================================
// 适配器集成测试
// ============================================================================

describe('Adapter Integration', () => {
  it('should create all adapters without errors', () => {
    const shenma = new ShenmaAPIAdapter({
      provider: 'shenma',
      apiKey: TEST_API_KEY,
      features: {},
    });

    const openai = new OpenAIAdapter({
      provider: 'openai',
      apiKey: TEST_API_KEY,
      features: {},
    });

    const zhipu = new ZhipuAdapter({
      provider: 'zhipu',
      apiKey: TEST_API_KEY,
      features: {},
    });

    const dayuyu = new DayuyuVideoAdapter({
      provider: 'dayuyu',
      apiKey: TEST_API_KEY,
      features: {},
    });

    const custom = new CustomAPIAdapter({
      provider: 'custom',
      apiKey: TEST_API_KEY,
      baseUrl: TEST_BASE_URL,
      features: {},
    });

    expect(shenma.name).toBe('shenma');
    expect(openai.name).toBe('openai');
    expect(zhipu.name).toBe('zhipu');
    expect(dayuyu.name).toBe('dayuyu');
    expect(custom.name).toBe('custom');
  });

  it('should have different capabilities per adapter', () => {
    const shenma = new ShenmaAPIAdapter({
      provider: 'shenma',
      apiKey: TEST_API_KEY,
      features: {},
    });

    const dayuyu = new DayuyuVideoAdapter({
      provider: 'dayuyu',
      apiKey: TEST_API_KEY,
      features: {},
    });

    // Shenma 支持所有功能
    expect(shenma.generateImage).toBeDefined();
    expect(shenma.generateVideo).toBeDefined();

    // Dayuyu 只支持视频生成
    expect(dayuyu.generateVideo).toBeDefined();
    expect(dayuyu.generateImage).toBeUndefined();
  });
});
