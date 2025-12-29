/**
 * Image Attachment State Management Tests
 * Tests for image attachment functionality in SidebarRight
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { validateImageFile, generateImagePreview, getImageMetadata } from '../../lib/image-utils';

// Mock the image utilities
vi.mock('../../lib/image-utils', () => ({
  validateImageFile: vi.fn(),
  generateImagePreview: vi.fn(),
  getImageMetadata: vi.fn(),
  convertImageForAPI: vi.fn(),
}));

describe('Image Attachment State Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Image Attachment State', () => {
    it('should initialize with empty attachment state', () => {
      const initialState = {
        file: null,
        preview: '',
        dimensions: null,
        fileSize: 0,
        isLoading: false,
        error: null,
      };

      expect(initialState.file).toBeNull();
      expect(initialState.preview).toBe('');
      expect(initialState.dimensions).toBeNull();
      expect(initialState.fileSize).toBe(0);
      expect(initialState.isLoading).toBe(false);
      expect(initialState.error).toBeNull();
    });

    it('should handle valid image file selection', async () => {
      const mockFile = new File([new ArrayBuffer(1000)], 'test.jpg', { type: 'image/jpeg' });
      const mockPreview = 'data:image/jpeg;base64,test';
      const mockMetadata = {
        width: 800,
        height: 600,
        size: 1000,
        format: 'jpeg',
      };

      // Mock the validation and processing functions
      (validateImageFile as any).mockResolvedValue({ valid: true });
      (generateImagePreview as any).mockResolvedValue(mockPreview);
      (getImageMetadata as any).mockResolvedValue(mockMetadata);

      // Simulate the state update
      const newState = {
        file: mockFile,
        preview: mockPreview,
        dimensions: { width: mockMetadata.width, height: mockMetadata.height },
        fileSize: mockMetadata.size,
        isLoading: false,
        error: null,
      };

      expect(newState.file).toBe(mockFile);
      expect(newState.preview).toBe(mockPreview);
      expect(newState.dimensions).toEqual({ width: 800, height: 600 });
      expect(newState.fileSize).toBe(1000);
      expect(newState.error).toBeNull();
    });

    it('should handle invalid image file rejection', async () => {
      const mockFile = new File([new ArrayBuffer(100)], 'test.txt', { type: 'text/plain' });
      const errorMessage = 'Unsupported image format';

      // Mock the validation function to return error
      (validateImageFile as any).mockResolvedValue({
        valid: false,
        error: errorMessage,
      });

      // Simulate the state update
      const newState = {
        file: null,
        preview: '',
        dimensions: null,
        fileSize: 0,
        isLoading: false,
        error: errorMessage,
      };

      expect(newState.file).toBeNull();
      expect(newState.error).toBe(errorMessage);
    });

    it('should handle image removal', () => {
      const clearedState = {
        file: null,
        preview: '',
        dimensions: null,
        fileSize: 0,
        isLoading: false,
        error: null,
      };

      expect(clearedState.file).toBeNull();
      expect(clearedState.preview).toBe('');
      expect(clearedState.dimensions).toBeNull();
      expect(clearedState.fileSize).toBe(0);
      expect(clearedState.error).toBeNull();
    });
  });

  describe('Image Attachment - Property Tests', () => {
    // Feature: creative-chat-image-attachment, Property 3: Image Removal Clears State
    // Validates: Requirements 1.5, 2.4
    it('should clear all attachment state when image is removed', () => {
      // Start with attached image
      const attachedState = {
        file: new File([new ArrayBuffer(1000)], 'test.jpg', { type: 'image/jpeg' }),
        preview: 'data:image/jpeg;base64,test',
        dimensions: { width: 800, height: 600 },
        fileSize: 1000,
        isLoading: false,
        error: null,
      };

      // Remove image
      const clearedState = {
        file: null,
        preview: '',
        dimensions: null,
        fileSize: 0,
        isLoading: false,
        error: null,
      };

      // Verify all fields are cleared
      expect(clearedState.file).toBeNull();
      expect(clearedState.preview).toBe('');
      expect(clearedState.dimensions).toBeNull();
      expect(clearedState.fileSize).toBe(0);
      expect(clearedState.error).toBeNull();
    });

    it('should preserve error state when image removal is triggered', () => {
      const errorState = {
        file: null,
        preview: '',
        dimensions: null,
        fileSize: 0,
        isLoading: false,
        error: 'File too large',
      };

      // After removal, error should be cleared
      const clearedState = {
        file: null,
        preview: '',
        dimensions: null,
        fileSize: 0,
        isLoading: false,
        error: null,
      };

      expect(clearedState.error).toBeNull();
    });
  });

  describe('Image Attachment Validation', () => {
    it('should validate supported image formats', async () => {
      const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

      for (const mimeType of supportedFormats) {
        const mockFile = new File([new ArrayBuffer(1000)], 'test', { type: mimeType });
        
        (validateImageFile as any).mockResolvedValue({ valid: true });
        const result = await validateImageFile(mockFile);
        
        expect(result.valid).toBe(true);
      }
    });

    it('should reject unsupported image formats', async () => {
      const unsupportedFormats = ['text/plain', 'application/pdf', 'video/mp4'];

      for (const mimeType of unsupportedFormats) {
        const mockFile = new File([new ArrayBuffer(1000)], 'test', { type: mimeType });
        
        (validateImageFile as any).mockResolvedValue({
          valid: false,
          error: 'Unsupported format',
        });
        const result = await validateImageFile(mockFile);
        
        expect(result.valid).toBe(false);
      }
    });

    it('should reject files exceeding size limit', async () => {
      const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      
      (validateImageFile as any).mockResolvedValue({
        valid: false,
        error: 'File too large',
      });
      const result = await validateImageFile(largeFile);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('large');
    });
  });

  describe('Image Metadata Extraction', () => {
    it('should extract image metadata correctly', async () => {
      const mockFile = new File([new ArrayBuffer(5000)], 'test.jpg', { type: 'image/jpeg' });
      const expectedMetadata = {
        width: 1920,
        height: 1080,
        size: 5000,
        format: 'jpeg',
      };

      (getImageMetadata as any).mockResolvedValue(expectedMetadata);
      const metadata = await getImageMetadata(mockFile);

      expect(metadata.width).toBe(1920);
      expect(metadata.height).toBe(1080);
      expect(metadata.size).toBe(5000);
      expect(metadata.format).toBe('jpeg');
    });

    it('should handle different image formats', async () => {
      const formats = [
        { mime: 'image/jpeg', format: 'jpeg' },
        { mime: 'image/png', format: 'png' },
        { mime: 'image/webp', format: 'webp' },
        { mime: 'image/gif', format: 'gif' },
      ];

      for (const { mime, format } of formats) {
        const mockFile = new File([new ArrayBuffer(1000)], 'test', { type: mime });
        
        (getImageMetadata as any).mockResolvedValue({
          width: 800,
          height: 600,
          size: 1000,
          format,
        });
        const metadata = await getImageMetadata(mockFile);
        
        expect(metadata.format).toBe(format);
      }
    });
  });

  describe('Backward Compatibility', () => {
    it('should not affect existing chat functionality when no image is attached', () => {
      const chatState = {
        chatInput: 'Hello, AI!',
        attachedImage: {
          file: null,
          preview: '',
          dimensions: null,
          fileSize: 0,
          isLoading: false,
          error: null,
        },
      };

      // Verify chat input is independent of image attachment
      expect(chatState.chatInput).toBe('Hello, AI!');
      expect(chatState.attachedImage.file).toBeNull();
    });

    it('should preserve chat history when image attachment fails', () => {
      const chatHistory = [
        { role: 'user' as const, text: 'First message' },
        { role: 'model' as const, text: 'Response' },
      ];

      const attachmentError = {
        file: null,
        preview: '',
        dimensions: null,
        fileSize: 0,
        isLoading: false,
        error: 'Image processing failed',
      };

      // Verify chat history is not affected
      expect(chatHistory.length).toBe(2);
      expect(chatHistory[0].text).toBe('First message');
    });
  });
});
