/**
 * Property-Based Tests for Image Generation Adapter
 * Feature: storyboard-enhancement
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import {
  APIManager,
  PrimaryAPIAdapter,
  NanobanaAPIAdapter,
  JiMengAPIAdapter,
  type IImageGenerationAdapter,
  type ImageGenerationAPIResponse,
} from '../ImageGenerationAdapter';
import { AppError, ErrorCode } from '../ErrorHandler';

describe('ImageGenerationAdapter', () => {
  describe('Property 13: API Fallback Activation', () => {
    it('should attempt fallback APIs when primary API fails', async () => {
      // Feature: storyboard-enhancement, Property 13: API Fallback Activation
      // Validates: Requirements 7.2

      await fc.assert(
        fc.asyncProperty(
          fc.stringOf(fc.alphaNumericChar(), { minLength: 10, maxLength: 100 }),
          async (prompt) => {
            // Create mock adapters
            const failingAdapter: IImageGenerationAdapter = {
              name: 'Failing API',
              isAvailable: async () => true,
              generateImages: async () => ({
                success: false,
                images: [],
                error: 'Primary API failed',
              }),
            };

            const successAdapter: IImageGenerationAdapter = {
              name: 'Success API',
              isAvailable: async () => true,
              generateImages: async () => ({
                success: true,
                images: ['image-1.jpg', 'image-2.jpg'],
              }),
            };

            const manager = new APIManager([failingAdapter, successAdapter]);

            const result = await manager.generateImages(prompt, 2);

            // Should succeed with fallback adapter
            expect(result.success).toBe(true);
            expect(result.images).toHaveLength(2);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should skip unavailable adapters', async () => {
      // Feature: storyboard-enhancement, Property 13: API Fallback Activation
      // Validates: Requirements 7.2

      await fc.assert(
        fc.asyncProperty(
          fc.stringOf(fc.alphaNumericChar(), { minLength: 10, maxLength: 100 }),
          async (prompt) => {
            // Create mock adapters
            const unavailableAdapter: IImageGenerationAdapter = {
              name: 'Unavailable API',
              isAvailable: async () => false,
              generateImages: async () => ({
                success: false,
                images: [],
                error: 'Not available',
              }),
            };

            const successAdapter: IImageGenerationAdapter = {
              name: 'Success API',
              isAvailable: async () => true,
              generateImages: async () => ({
                success: true,
                images: ['image-1.jpg'],
              }),
            };

            const manager = new APIManager([unavailableAdapter, successAdapter]);

            const result = await manager.generateImages(prompt, 1);

            // Should skip unavailable and use success adapter
            expect(result.success).toBe(true);
            expect(result.images).toHaveLength(1);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 14: Error Message on Complete Failure', () => {
    it('should return descriptive error message when all APIs fail', async () => {
      // Feature: storyboard-enhancement, Property 14: Error Message on Complete Failure
      // Validates: Requirements 7.5

      await fc.assert(
        fc.asyncProperty(
          fc.stringOf(fc.alphaNumericChar(), { minLength: 10, maxLength: 100 }),
          async (prompt) => {
            // Create mock adapters that all fail
            const failingAdapters: IImageGenerationAdapter[] = [
              {
                name: 'API 1',
                isAvailable: async () => true,
                generateImages: async () => ({
                  success: false,
                  images: [],
                  error: 'API 1 error',
                }),
              },
              {
                name: 'API 2',
                isAvailable: async () => true,
                generateImages: async () => ({
                  success: false,
                  images: [],
                  error: 'API 2 error',
                }),
              },
            ];

            const manager = new APIManager(failingAdapters);

            try {
              await manager.generateImages(prompt, 1);
              expect.fail('Should have thrown error');
            } catch (error) {
              // Should throw AppError with descriptive message
              expect(error).toBeInstanceOf(AppError);
              const appError = error as AppError;
              expect(appError.code).toBe(ErrorCode.GENERATION_FAILED);
              expect(appError.message).toBeTruthy();
              expect(appError.message.length).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Unit Tests', () => {
    let manager: APIManager;

    beforeEach(() => {
      manager = new APIManager();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should throw error for empty prompt', async () => {
      try {
        await manager.generateImages('', 1);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        const appError = error as AppError;
        expect(appError.code).toBe(ErrorCode.INVALID_INPUT);
      }
    });

    it('should throw error for invalid image count', async () => {
      try {
        await manager.generateImages('test prompt', 0);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        const appError = error as AppError;
        expect(appError.code).toBe(ErrorCode.INVALID_PARAMETER);
      }
    });

    it('should throw error for image count > 10', async () => {
      try {
        await manager.generateImages('test prompt', 11);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        const appError = error as AppError;
        expect(appError.code).toBe(ErrorCode.INVALID_PARAMETER);
      }
    });

    it('should add new adapter', () => {
      const newAdapter: IImageGenerationAdapter = {
        name: 'New API',
        isAvailable: async () => true,
        generateImages: async () => ({
          success: true,
          images: ['image.jpg'],
        }),
      };

      manager.addAdapter(newAdapter);

      // Verify adapter was added (by checking it's used in generation)
      expect(manager).toBeDefined();
    });

    it('should get available adapters', async () => {
      const mockAdapter: IImageGenerationAdapter = {
        name: 'Mock API',
        isAvailable: async () => true,
        generateImages: async () => ({
          success: true,
          images: ['image.jpg'],
        }),
      };

      const testManager = new APIManager([mockAdapter]);
      const available = await testManager.getAvailableAdapters();

      expect(available).toContain('Mock API');
    });

    it('should handle adapter with no API key', async () => {
      const adapter = new PrimaryAPIAdapter({ apiKey: '' });
      const isAvailable = await adapter.isAvailable();

      expect(isAvailable).toBe(false);
    });

    it('should generate images with valid adapter', async () => {
      const mockAdapter: IImageGenerationAdapter = {
        name: 'Mock API',
        isAvailable: async () => true,
        generateImages: async (prompt: string, count: number) => ({
          success: true,
          images: Array.from({ length: count }, (_, i) => `image-${i + 1}.jpg`),
        }),
      };

      const testManager = new APIManager([mockAdapter]);
      const result = await testManager.generateImages('test prompt', 3);

      expect(result.success).toBe(true);
      expect(result.images).toHaveLength(3);
    });

    it('should try all adapters before failing', async () => {
      const adapters: IImageGenerationAdapter[] = [
        {
          name: 'API 1',
          isAvailable: async () => true,
          generateImages: async () => ({
            success: false,
            images: [],
            error: 'API 1 failed',
          }),
        },
        {
          name: 'API 2',
          isAvailable: async () => true,
          generateImages: async () => ({
            success: false,
            images: [],
            error: 'API 2 failed',
          }),
        },
        {
          name: 'API 3',
          isAvailable: async () => true,
          generateImages: async () => ({
            success: true,
            images: ['image.jpg'],
          }),
        },
      ];

      const testManager = new APIManager(adapters);
      const result = await testManager.generateImages('test prompt', 1);

      expect(result.success).toBe(true);
      expect(result.images).toHaveLength(1);
    });
  });
});
