import VideoService from '../videoService';
import { VideoStatus, CreateVideoOptions } from '../../types';

// Mock fetch
global.fetch = jest.fn();

describe('VideoService - Sora2 Implementation', () => {
  let videoService: VideoService;
  const mockApiKey = 'test-api-key';
  const mockBaseUrl = 'https://api.whatai.cc';

  beforeEach(() => {
    jest.clearAllMocks();
    videoService = new VideoService({
      baseUrl: mockBaseUrl,
      apiKey: mockApiKey,
      provider: 'sora2'
    });
  });

  describe('Provider Management', () => {
    test('should set and get provider correctly', () => {
      videoService.setProvider('sora2');
      expect(videoService.getProvider()).toBe('sora2');

      videoService.setProvider('openai');
      expect(videoService.getProvider()).toBe('openai');

      videoService.setProvider('dyu');
      expect(videoService.getProvider()).toBe('dyu');
    });

    test('should initialize with default provider', () => {
      const service = new VideoService({
        baseUrl: mockBaseUrl,
        apiKey: mockApiKey
      });
      expect(service.getProvider()).toBe('openai');
    });

    test('should initialize with specified provider', () => {
      const service = new VideoService({
        baseUrl: mockBaseUrl,
        apiKey: mockApiKey,
        provider: 'sora2'
      });
      expect(service.getProvider()).toBe('sora2');
    });
  });

  describe('Sora2 Video Creation', () => {
    test('should create Sora2 video with portrait model', async () => {
      const mockResponse = {
        id: 'task-123',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Video generation started'
            },
            finish_reason: 'stop'
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      const result = await videoService.createVideo('竖屏 动起来', {
        model: 'sora_video2-portrait',
        images: ['https://example.com/image.png']
      });

      expect(result.task_id).toBeDefined();
      expect(result.status).toBe('SUBMITTED');
      expect(result.progress).toBe('0%');
    });

    test('should create Sora2 video with landscape model', async () => {
      const mockResponse = {
        id: 'task-456',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Video generation started'
            },
            finish_reason: 'stop'
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      const result = await videoService.createVideo('横屏 动起来', {
        model: 'sora_video2-landscape'
      });

      expect(result.task_id).toBe('task-456');
      expect(result.status).toBe('SUBMITTED');
    });

    test('should create Sora2 video with HD model', async () => {
      const mockResponse = {
        id: 'task-789',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Video generation started'
            },
            finish_reason: 'stop'
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      const result = await videoService.createVideo('高清 动起来', {
        model: 'sora_video2-portrait-hd'
      });

      expect(result.task_id).toBe('task-789');
      expect(result.status).toBe('SUBMITTED');
    });

    test('should create Sora2 video with 15s model', async () => {
      const mockResponse = {
        id: 'task-15s',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Video generation started'
            },
            finish_reason: 'stop'
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      const result = await videoService.createVideo('15秒 动起来', {
        model: 'sora_video2-portrait-15s'
      });

      expect(result.task_id).toBe('task-15s');
      expect(result.status).toBe('SUBMITTED');
    });

    test('should support multiple reference images', async () => {
      const mockResponse = {
        id: 'task-multi-img',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Video generation started'
            },
            finish_reason: 'stop'
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      const result = await videoService.createVideo('多图参考', {
        model: 'sora_video2-portrait',
        images: [
          'https://example.com/image1.png',
          'https://example.com/image2.png',
          'https://example.com/image3.png'
        ]
      });

      expect(result.task_id).toBe('task-multi-img');
      expect(result.status).toBe('SUBMITTED');
    });

    test('should handle API errors correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized'
      });

      await expect(
        videoService.createVideo('测试', {
          model: 'sora_video2-portrait'
        })
      ).rejects.toThrow('Authentication failed');
    });

    test('should handle rate limit errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => 'Too many requests'
      });

      await expect(
        videoService.createVideo('测试', {
          model: 'sora_video2-portrait'
        })
      ).rejects.toThrow('Rate limit exceeded');
    });

    test('should handle invalid request errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Invalid model'
      });

      await expect(
        videoService.createVideo('测试', {
          model: 'sora_video2-portrait'
        })
      ).rejects.toThrow('Invalid request');
    });
  });

  describe('Sora2 Status Query', () => {
    test('should query video status successfully', async () => {
      const mockResponse = {
        id: 'task-123',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'https://example.com/video.mp4'
            },
            finish_reason: 'stop'
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      const status = await videoService.getVideoStatus('task-123');

      expect(status.task_id).toBe('task-123');
      expect(status.status).toBe('SUCCESS');
      expect(status.progress).toBe('100%');
      expect(status.video_url).toBe('https://example.com/video.mp4');
    });

    test('should handle in-progress status', async () => {
      const mockResponse = {
        id: 'task-456',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Processing...'
            },
            finish_reason: null
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      const status = await videoService.getVideoStatus('task-456');

      expect(status.task_id).toBe('task-456');
      expect(status.status).toBe('IN_PROGRESS');
      expect(status.progress).toBe('50%');
    });

    test('should handle failure status', async () => {
      const mockResponse = {
        id: 'task-789',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Image contains real people'
            },
            finish_reason: 'content_filter'
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      const status = await videoService.getVideoStatus('task-789');

      expect(status.task_id).toBe('task-789');
      expect(status.status).toBe('FAILURE');
      expect(status.fail_reason).toContain('Image contains real people');
    });

    test('should handle task not found (404)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not found'
      });

      const status = await videoService.getVideoStatus('task-notfound');

      expect(status.task_id).toBe('task-notfound');
      expect(status.status).toBe('FAILURE');
      expect(status.fail_reason).toContain('Task not found');
    });

    test('should handle query errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const status = await videoService.getVideoStatus('task-error');

      expect(status.task_id).toBe('task-error');
      expect(status.status).toBe('IN_PROGRESS');
      expect(status.progress).toBe('50%');
    });
  });

  describe('Endpoint Routing', () => {
    test('should route Sora2 to correct endpoint', async () => {
      videoService.setProvider('sora2');

      const mockResponse = {
        id: 'task-123',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Video generation started'
            },
            finish_reason: 'stop'
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      await videoService.createVideo('测试', {
        model: 'sora_video2-portrait'
      });

      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('/v1/chat/completions');
    });

    test('should route Seedance to correct endpoint', async () => {
      videoService.setProvider('openai');

      const mockResponse = {
        task_id: 'task-123',
        status: 'SUBMITTED',
        progress: '0%'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      await videoService.createVideo('测试', {
        model: 'sora-2'
      });

      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('/seedance/v3/contents/generations/tasks');
    });

    test('should route DYU to correct endpoint', async () => {
      videoService.setProvider('dyu');

      const mockResponse = {
        id: 'task-123',
        status: 'queued',
        progress: 0
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      await videoService.createVideo('测试', {
        model: 'sora-2'
      });

      const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain('/v1/videos');
    });
  });

  describe('Backward Compatibility', () => {
    test('should maintain Seedance API compatibility', async () => {
      const seedanceService = new VideoService({
        baseUrl: mockBaseUrl,
        apiKey: mockApiKey,
        provider: 'openai'
      });

      const mockResponse = {
        task_id: 'task-seedance',
        status: 'SUBMITTED',
        progress: '0%'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      const result = await seedanceService.createVideo('测试', {
        model: 'sora-2'
      });

      expect(result.task_id).toBe('task-seedance');
      expect(result.status).toBe('SUBMITTED');
    });

    test('should maintain DYU API compatibility', async () => {
      const dyuService = new VideoService({
        baseUrl: mockBaseUrl,
        apiKey: mockApiKey,
        provider: 'dyu'
      });

      const mockResponse = {
        id: 'task-dyu',
        status: 'queued',
        progress: 0
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      const result = await dyuService.createVideo('测试', {
        model: 'sora-2'
      });

      expect(result.task_id).toBe('task-dyu');
      expect(result.status).toBe('queued');
    });
  });

  describe('Parameter Validation', () => {
    test('should validate duration parameter', () => {
      expect(() => {
        videoService.createVideo('测试', {
          model: 'sora_video2-portrait',
          duration: 20 as any // Invalid duration
        });
      }).rejects.toThrow('Invalid duration');
    });

    test('should validate aspect ratio parameter', () => {
      expect(() => {
        videoService.createVideo('测试', {
          model: 'sora_video2-portrait',
          aspect_ratio: '1:1' as any // Invalid aspect ratio
        });
      }).rejects.toThrow('Invalid aspect_ratio');
    });

    test('should accept valid duration values', async () => {
      const mockResponse = {
        id: 'task-123',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Video generation started'
            },
            finish_reason: 'stop'
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      for (const duration of [10, 15, 25]) {
        const result = await videoService.createVideo('测试', {
          model: 'sora_video2-portrait',
          duration: duration as any
        });
        expect(result.task_id).toBeDefined();
      }
    });

    test('should accept valid aspect ratios', async () => {
      const mockResponse = {
        id: 'task-123',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Video generation started'
            },
            finish_reason: 'stop'
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      for (const ratio of ['16:9', '9:16']) {
        const result = await videoService.createVideo('测试', {
          model: 'sora_video2-portrait',
          aspect_ratio: ratio as any
        });
        expect(result.task_id).toBeDefined();
      }
    });
  });

  describe('Request Headers', () => {
    test('should include correct authorization header', async () => {
      const mockResponse = {
        id: 'task-123',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Video generation started'
            },
            finish_reason: 'stop'
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      await videoService.createVideo('测试', {
        model: 'sora_video2-portrait'
      });

      const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers;
      expect(headers.Authorization).toBe(`Bearer ${mockApiKey}`);
      expect(headers['Content-Type']).toBe('application/json');
    });
  });

  describe('Response Parsing', () => {
    test('should parse Sora2 Chat format response correctly', async () => {
      const mockResponse = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1234567890,
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'https://example.com/video.mp4'
            },
            finish_reason: 'stop'
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      const result = await videoService.createVideo('测试', {
        model: 'sora_video2-portrait'
      });

      expect(result.task_id).toBe('chatcmpl-123');
      expect(result.status).toBe('SUBMITTED');
    });

    test('should handle missing task_id in response', async () => {
      const mockResponse = {
        object: 'chat.completion',
        created: 1234567890,
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Video generation started'
            },
            finish_reason: 'stop'
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockResponse)
      });

      const result = await videoService.createVideo('测试', {
        model: 'sora_video2-portrait'
      });

      expect(result.task_id).toBeDefined();
    });
  });
});
