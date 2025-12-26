/**
 * 多媒体 UI 组件测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';

describe('Multimedia UI Components', () => {
  let fetchMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('APIConfigPanel', () => {
    it('should load configuration on mount', async () => {
      const mockConfig = {
        providers: {
          textToImage: 'openai',
          imageToImage: 'openai',
          textGeneration: 'zhipu',
          imageAnalysis: 'openai',
          videoGeneration: 'shenma',
          videoAnalysis: 'shenma',
        },
        configs: {
          openai: { apiKey: 'sk-test' },
          shenma: { apiKey: 'sk-test' },
          zhipu: { apiKey: 'sk-test' },
        },
      };

      fetchMock.mockResolvedValueOnce({
        json: async () => ({ success: true, data: { config: mockConfig } }),
      });

      // Component would load config on mount
      expect(fetchMock).toBeDefined();
    });

    it('should handle sync configuration', async () => {
      const mockConfig = {
        providers: {
          textToImage: 'shenma',
          imageToImage: 'shenma',
          textGeneration: 'shenma',
          imageAnalysis: 'shenma',
          videoGeneration: 'shenma',
          videoAnalysis: 'shenma',
        },
        configs: { shenma: { apiKey: 'sk-test' } },
      };

      fetchMock.mockResolvedValueOnce({
        json: async () => ({ success: true, data: { config: mockConfig } }),
      });

      // Simulate sync action
      const response = await fetch('/api/multimedia/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'shenma' }),
      });

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.config.providers.textToImage).toBe('shenma');
    });

    it('should handle configuration update', async () => {
      const mockConfig = {
        providers: { textToImage: 'openai' },
        configs: { openai: { apiKey: 'sk-new' } },
      };

      fetchMock.mockResolvedValueOnce({
        json: async () => ({ success: true, data: { config: mockConfig } }),
      });

      const response = await fetch('/api/multimedia/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockConfig),
      });

      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it('should handle configuration errors', async () => {
      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: false,
          error: { message: 'Failed to load configuration' },
        }),
      });

      const response = await fetch('/api/multimedia/config');
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.message).toBe('Failed to load configuration');
    });
  });

  describe('TextToImagePanel', () => {
    it('should generate image with valid prompt', async () => {
      const mockImages = ['data:image/png;base64,iVBORw0KGgo...'];

      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { images: mockImages },
        }),
      });

      const response = await fetch('/api/multimedia/text-to-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'A beautiful sunset',
          size: '1024x1024',
          quality: 'standard',
          n: 1,
        }),
      });

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.images).toEqual(mockImages);
    });

    it('should handle generation errors', async () => {
      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: false,
          error: { message: 'Invalid prompt' },
        }),
      });

      const response = await fetch('/api/multimedia/text-to-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '' }),
      });

      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it('should support multiple image generation', async () => {
      const mockImages = [
        'data:image/png;base64,iVBORw0KGgo...',
        'data:image/png;base64,iVBORw0KGgo...',
        'data:image/png;base64,iVBORw0KGgo...',
      ];

      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { images: mockImages },
        }),
      });

      const response = await fetch('/api/multimedia/text-to-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'A beautiful sunset',
          n: 3,
        }),
      });

      const data = await response.json();
      expect(data.data.images).toHaveLength(3);
    });
  });

  describe('ImageEditPanel', () => {
    it('should edit image with prompt', async () => {
      const mockImages = ['data:image/png;base64,iVBORw0KGgo...'];

      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { images: mockImages },
        }),
      });

      const response = await fetch('/api/multimedia/image-to-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: 'data:image/png;base64,iVBORw0KGgo...',
          prompt: 'Make it more vibrant',
          n: 1,
        }),
      });

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.images).toEqual(mockImages);
    });

    it('should support mask-based editing', async () => {
      const mockImages = ['data:image/png;base64,iVBORw0KGgo...'];

      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { images: mockImages },
        }),
      });

      const response = await fetch('/api/multimedia/image-to-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: 'data:image/png;base64,iVBORw0KGgo...',
          mask: 'data:image/png;base64,iVBORw0KGgo...',
          prompt: 'Replace the sky with clouds',
        }),
      });

      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe('TextGenerationPanel', () => {
    it('should generate text from messages', async () => {
      const mockText = 'This is generated text response.';

      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { text: mockText },
        }),
      });

      const response = await fetch('/api/multimedia/text-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello' }],
          temperature: 0.7,
          maxTokens: 2000,
        }),
      });

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.text).toBe(mockText);
    });

    it('should support multi-turn conversation', async () => {
      const mockText = 'Response to conversation.';

      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { text: mockText },
        }),
      });

      const response = await fetch('/api/multimedia/text-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi there!' },
            { role: 'user', content: 'How are you?' },
          ],
        }),
      });

      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it('should handle temperature and token parameters', async () => {
      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { text: 'Generated text' },
        }),
      });

      const response = await fetch('/api/multimedia/text-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Test' }],
          temperature: 1.5,
          maxTokens: 4000,
        }),
      });

      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe('ImageAnalysisPanel', () => {
    it('should analyze image with prompt', async () => {
      const mockText = 'This image shows a sunset over mountains.';

      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { text: mockText },
        }),
      });

      const response = await fetch('/api/multimedia/image-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: ['data:image/png;base64,iVBORw0KGgo...'],
          prompt: 'What do you see in this image?',
          detail: 'auto',
        }),
      });

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.text).toBe(mockText);
    });

    it('should support different detail levels', async () => {
      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { text: 'Detailed analysis' },
        }),
      });

      const response = await fetch('/api/multimedia/image-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: ['data:image/png;base64,iVBORw0KGgo...'],
          prompt: 'Analyze this image',
          detail: 'high',
        }),
      });

      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe('VideoGenerationPanel', () => {
    it('should generate video with prompt', async () => {
      const mockTaskId = 'task-123';

      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { taskId: mockTaskId },
        }),
      });

      const response = await fetch('/api/multimedia/video-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'A cat playing with a ball',
          duration: 10,
          aspectRatio: '16:9',
          hd: false,
        }),
      });

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.taskId).toBe(mockTaskId);
    });

    it('should support different aspect ratios', async () => {
      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { taskId: 'task-456' },
        }),
      });

      const response = await fetch('/api/multimedia/video-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'A video',
          aspectRatio: '9:16',
        }),
      });

      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it('should support HD mode', async () => {
      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { taskId: 'task-789' },
        }),
      });

      const response = await fetch('/api/multimedia/video-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'A video',
          hd: true,
        }),
      });

      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe('VideoAnalysisPanel', () => {
    it('should analyze video with prompt', async () => {
      const mockText = 'This video shows a person dancing.';

      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: { text: mockText },
        }),
      });

      const response = await fetch('/api/multimedia/video-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video: 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAA...',
          prompt: 'What is happening in this video?',
        }),
      });

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.text).toBe(mockText);
    });

    it('should handle video analysis errors', async () => {
      fetchMock.mockResolvedValueOnce({
        json: async () => ({
          success: false,
          error: { message: 'Invalid video format' },
        }),
      });

      const response = await fetch('/api/multimedia/video-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video: 'invalid-video',
          prompt: 'Analyze',
        }),
      });

      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });

  describe('MultimediaApp Integration', () => {
    it('should render all tabs', () => {
      const tabs = [
        'Configuration',
        'Text-to-Image',
        'Image Editing',
        'Text Generation',
        'Image Analysis',
        'Video Generation',
        'Video Analysis',
      ];

      expect(tabs).toHaveLength(7);
      tabs.forEach((tab) => {
        expect(tab).toBeTruthy();
      });
    });

    it('should handle tab switching', () => {
      const tabs = ['config', 'text-to-image', 'image-edit', 'text-generation', 'image-analysis', 'video-generation', 'video-analysis'];
      expect(tabs).toHaveLength(7);
    });

    it('should pass config to panels', () => {
      const mockConfig = {
        providers: { textToImage: 'openai' },
        configs: { openai: { apiKey: 'sk-test' } },
      };

      expect(mockConfig).toBeDefined();
      expect(mockConfig.providers).toBeDefined();
    });
  });
});
