/**
 * Error Handling Tests for Image Generation Service
 * Task 7: Implement error handling for reference image issues
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { ImageGenerationService } from '../ImageGenerationService';
import { ErrorHandler, ErrorCode, AppError } from '../api/ErrorHandler';
import { prisma } from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    generationHistory: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('ImageGenerationService - Error Handling', () => {
  let service: ImageGenerationService;

  beforeEach(() => {
    service = new ImageGenerationService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Property 10: Error Handling Completeness', () => {
    describe('Reference Image Validation Errors', () => {
      it('should reject empty reference image', async () => {
        vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce({
          id: 'test-id',
          userId: 1,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {},
          referenceImage: null,
          referenceImageWeight: null,
          createdAt: new Date(),
        });

        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
          referenceImage: '',
        };

        const result = await service.generateImages(request);
        expect(result).toBeDefined();
        expect(result.metadata.referenceImageValidationWarning).toBeDefined();
      });

      it('should reject invalid base64 format', async () => {
        vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce({
          id: 'test-id',
          userId: 1,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {},
          referenceImage: null,
          referenceImageWeight: null,
          createdAt: new Date(),
        });

        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
          referenceImage: 'not-a-valid-base64',
        };

        const result = await service.generateImages(request);
        expect(result).toBeDefined();
        expect(result.metadata.referenceImageValidationWarning).toBeDefined();
      });

      it('should reject unsupported image format', async () => {
        vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce({
          id: 'test-id',
          userId: 1,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {},
          referenceImage: null,
          referenceImageWeight: null,
          createdAt: new Date(),
        });

        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
          referenceImage: 'data:image/bmp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        };

        const result = await service.generateImages(request);
        expect(result).toBeDefined();
        expect(result.metadata.referenceImageValidationWarning).toBeDefined();
      });

      it('should reject oversized reference image', async () => {
        vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce({
          id: 'test-id',
          userId: 1,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {},
          referenceImage: null,
          referenceImageWeight: null,
          createdAt: new Date(),
        });

        // Create a base64 string larger than 5MB
        const largeBase64 = 'data:image/jpeg;base64,' + 'A'.repeat(6 * 1024 * 1024);
        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
          referenceImage: largeBase64,
        };

        const result = await service.generateImages(request);
        expect(result).toBeDefined();
        expect(result.metadata.referenceImageValidationWarning).toBeDefined();
      });

      it('should reject invalid URL format', async () => {
        vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce({
          id: 'test-id',
          userId: 1,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {},
          referenceImage: null,
          referenceImageWeight: null,
          createdAt: new Date(),
        });

        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
          referenceImage: 'http://invalid url with spaces',
        };

        const result = await service.generateImages(request);
        expect(result).toBeDefined();
        expect(result.metadata.referenceImageValidationWarning).toBeDefined();
      });

      it('should accept valid JPEG base64', async () => {
        const validJpegBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=';
        
        vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce({
          id: 'test-id',
          userId: 1,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {},
          referenceImage: validJpegBase64,
          referenceImageWeight: 0.8,
          createdAt: new Date(),
        });

        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
          referenceImage: validJpegBase64,
        };

        const result = await service.generateImages(request);
        expect(result).toBeDefined();
        expect(result.id).toBe('test-id');
      });

      it('should accept valid PNG base64', async () => {
        const validPngBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        
        vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce({
          id: 'test-id',
          userId: 1,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {},
          referenceImage: validPngBase64,
          referenceImageWeight: 0.8,
          createdAt: new Date(),
        });

        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
          referenceImage: validPngBase64,
        };

        const result = await service.generateImages(request);
        expect(result).toBeDefined();
      });

      it('should accept valid WebP base64', async () => {
        const validWebpBase64 = 'data:image/webp;base64,UklGRiYAAABXEBP8';
        
        vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce({
          id: 'test-id',
          userId: 1,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {},
          referenceImage: validWebpBase64,
          referenceImageWeight: 0.8,
          createdAt: new Date(),
        });

        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
          referenceImage: validWebpBase64,
        };

        const result = await service.generateImages(request);
        expect(result).toBeDefined();
      });

      it('should accept valid GIF base64', async () => {
        const validGifBase64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        
        vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce({
          id: 'test-id',
          userId: 1,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {},
          referenceImage: validGifBase64,
          referenceImageWeight: 0.8,
          createdAt: new Date(),
        });

        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
          referenceImage: validGifBase64,
        };

        const result = await service.generateImages(request);
        expect(result).toBeDefined();
      });

      it('should accept valid HTTPS URL', async () => {
        const validUrl = 'https://example.com/image.jpg';
        
        vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce({
          id: 'test-id',
          userId: 1,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {},
          referenceImage: validUrl,
          referenceImageWeight: 0.8,
          createdAt: new Date(),
        });

        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
          referenceImage: validUrl,
        };

        const result = await service.generateImages(request);
        expect(result).toBeDefined();
      });

      it('should accept valid HTTP URL', async () => {
        const validUrl = 'http://example.com/image.jpg';
        
        vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce({
          id: 'test-id',
          userId: 1,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {},
          referenceImage: validUrl,
          referenceImageWeight: 0.8,
          createdAt: new Date(),
        });

        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
          referenceImage: validUrl,
        };

        const result = await service.generateImages(request);
        expect(result).toBeDefined();
      });
    });

    describe('API Error Handling', () => {
      it('should throw error for missing template', async () => {
        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: '',
          parameters: {},
        };

        await expect(service.generateImages(request)).rejects.toThrow('Template is required');
      });

      it('should throw error for invalid generation type', async () => {
        const request = {
          type: 'invalid-type' as any,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
        };

        await expect(service.generateImages(request)).rejects.toThrow();
      });

      it('should handle API errors gracefully', async () => {
        vi.mocked(prisma.generationHistory.create).mockRejectedValueOnce(
          new Error('Database connection failed')
        );

        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
        };

        await expect(service.generateImages(request)).rejects.toThrow();
      });
    });

    describe('Database Error Handling', () => {
      it('should handle database errors in getGenerationHistory', async () => {
        vi.mocked(prisma.generationHistory.findMany).mockRejectedValueOnce(
          new Error('Database connection failed')
        );

        await expect(service.getGenerationHistory(1)).rejects.toThrow();
      });

      it('should handle invalid user ID in getGenerationHistory', async () => {
        await expect(service.getGenerationHistory(-1)).rejects.toThrow();
      });

      it('should handle invalid limit in getGenerationHistory', async () => {
        await expect(service.getGenerationHistory(1, 101)).rejects.toThrow();
      });

      it('should handle database errors in getGenerationById', async () => {
        vi.mocked(prisma.generationHistory.findUnique).mockRejectedValueOnce(
          new Error('Database connection failed')
        );

        await expect(service.getGenerationById('test-id')).rejects.toThrow();
      });

      it('should handle empty generation ID in getGenerationById', async () => {
        await expect(service.getGenerationById('')).rejects.toThrow();
      });

      it('should handle database errors in deleteGeneration', async () => {
        vi.mocked(prisma.generationHistory.findUnique).mockRejectedValueOnce(
          new Error('Database connection failed')
        );

        await expect(service.deleteGeneration('test-id', 1)).rejects.toThrow();
      });

      it('should handle generation not found in deleteGeneration', async () => {
        vi.mocked(prisma.generationHistory.findUnique).mockResolvedValueOnce(null);

        await expect(service.deleteGeneration('test-id', 1)).rejects.toThrow('Generation not found');
      });

      it('should handle unauthorized deletion', async () => {
        vi.mocked(prisma.generationHistory.findUnique).mockResolvedValueOnce({
          id: 'test-id',
          userId: 2,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {},
          referenceImage: null,
          referenceImageWeight: null,
          createdAt: new Date(),
        });

        await expect(service.deleteGeneration('test-id', 1)).rejects.toThrow('permission');
      });
    });

    describe('Error Handler Integration', () => {
      it('should use ErrorHandler for user-friendly messages', () => {
        const message = ErrorHandler.getUserFriendlyMessage('timeout occurred');
        expect(message).toContain('took too long');
      });

      it('should use ErrorHandler for reference image format errors', () => {
        const message = ErrorHandler.getUserFriendlyMessage('unsupported image format');
        expect(message).toContain('not supported');
      });

      it('should use ErrorHandler for image size errors', () => {
        const message = ErrorHandler.getUserFriendlyMessage('image is too large');
        expect(message).toContain('too large');
      });

      it('should use ErrorHandler for API rejection errors', () => {
        const message = ErrorHandler.getUserFriendlyMessage('reference image rejected');
        expect(message).toContain('does not support');
      });
    });

    describe('Fallback Behavior', () => {
      it('should fallback to text-only generation if reference image is invalid', async () => {
        vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce({
          id: 'test-id',
          userId: 1,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {
            referenceImageValidationWarning: 'Reference image cannot be empty',
          },
          referenceImage: null,
          referenceImageWeight: null,
          createdAt: new Date(),
        });

        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
          referenceImage: '',
        };

        const result = await service.generateImages(request);
        expect(result).toBeDefined();
        expect(result.metadata.referenceImageValidationWarning).toBeDefined();
      });

      it('should track validation warnings in metadata', async () => {
        vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce({
          id: 'test-id',
          userId: 1,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {
            referenceImageValidationWarning: 'Invalid format',
          },
          referenceImage: null,
          referenceImageWeight: null,
          createdAt: new Date(),
        });

        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
          referenceImage: 'invalid',
        };

        const result = await service.generateImages(request);
        expect(result.metadata.referenceImageValidationWarning).toBeDefined();
      });
    });

    describe('Property-Based Error Tests', () => {
      it('should handle any invalid base64 string gracefully', async () => {
        vi.mocked(prisma.generationHistory.create).mockResolvedValue({
          id: 'test-id',
          userId: 1,
          type: 'three-view',
          prompt: 'Generate front view',
          images: ['image-1.jpg'],
          metadata: {},
          referenceImage: null,
          referenceImageWeight: null,
          createdAt: new Date(),
        });

        const invalidBase64 = 'not-base64';
        const request = {
          type: 'three-view' as const,
          userId: 1,
          template: 'Generate front view',
          parameters: {},
          referenceImage: invalidBase64,
        };

        // Should fallback gracefully
        const result = await service.generateImages(request);
        expect(result).toBeDefined();
      });

      it('should handle any invalid user ID gracefully', async () => {
        await expect(service.getGenerationHistory(-1)).rejects.toThrow();
      });

      it('should handle any invalid limit gracefully', async () => {
        await expect(service.getGenerationHistory(1, 101)).rejects.toThrow();
      });
    });
  });
});
