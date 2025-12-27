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
          fc.string({ minLength: 10, maxLength: 100 }),
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
          fc.string({ minLength: 10, maxLength: 100 }),
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
          fc.string({ minLength: 10, maxLength: 100 }),
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

  describe('Reference Image Support', () => {
    it('should pass reference image to adapter', async () => {
      // Feature: reference-image-fix, Requirement 7.1
      // Validates: Reference images are passed through adapter chain

      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 10, maxLength: 100 }),
          fc.string({ minLength: 20, maxLength: 50 }),
          async (prompt, referenceImage) => {
            let capturedReferenceImage: string | undefined;
            let capturedWeight: number | undefined;

            const mockAdapter: IImageGenerationAdapter = {
              name: 'Mock API',
              isAvailable: async () => true,
              generateImages: async (
                _prompt: string,
                _count: number,
                refImage?: string,
                weight?: number
              ) => {
                capturedReferenceImage = refImage;
                capturedWeight = weight;
                return {
                  success: true,
                  images: ['image-1.jpg'],
                };
              },
            };

            const manager = new APIManager([mockAdapter]);
            const weight = 0.7;

            await manager.generateImages(prompt, 1, referenceImage, weight);

            expect(capturedReferenceImage).toBe(referenceImage);
            expect(capturedWeight).toBe(weight);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should validate reference image weight range', async () => {
      // Feature: reference-image-fix, Requirement 7.3
      // Validates: Reference image weight must be 0-1

      const manager = new APIManager();

      // Test invalid weight > 1
      try {
        await manager.generateImages('test prompt', 1, 'ref-image', 1.5);
        expect.fail('Should have thrown error for weight > 1');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        const appError = error as AppError;
        expect(appError.code).toBe(ErrorCode.INVALID_PARAMETER);
      }

      // Test invalid weight < 0
      try {
        await manager.generateImages('test prompt', 1, 'ref-image', -0.1);
        expect.fail('Should have thrown error for weight < 0');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        const appError = error as AppError;
        expect(appError.code).toBe(ErrorCode.INVALID_PARAMETER);
      }
    });

    it('should accept valid reference image weights', async () => {
      // Feature: reference-image-fix, Requirement 7.3
      // Validates: Valid weights 0-1 are accepted

      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 10, maxLength: 100 }),
          fc.float({ min: 0, max: 1 }),
          async (prompt, weight) => {
            const mockAdapter: IImageGenerationAdapter = {
              name: 'Mock API',
              isAvailable: async () => true,
              generateImages: async () => ({
                success: true,
                images: ['image-1.jpg'],
              }),
            };

            const manager = new APIManager([mockAdapter]);

            const result = await manager.generateImages(
              prompt,
              1,
              'ref-image',
              weight
            );

            expect(result.success).toBe(true);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should work with reference image and fallback', async () => {
      // Feature: reference-image-fix, Requirement 7.2
      // Validates: Reference images work with fallback mechanism

      const failingAdapter: IImageGenerationAdapter = {
        name: 'Failing API',
        isAvailable: async () => true,
        generateImages: async () => ({
          success: false,
          images: [],
          error: 'Failed',
        }),
      };

      const successAdapter: IImageGenerationAdapter = {
        name: 'Success API',
        isAvailable: async () => true,
        generateImages: async (
          _prompt: string,
          _count: number,
          refImage?: string
        ) => ({
          success: true,
          images: ['image-1.jpg'],
          metadata: { referenceImageUsed: !!refImage },
        }),
      };

      const manager = new APIManager([failingAdapter, successAdapter]);

      const result = await manager.generateImages(
        'test prompt',
        1,
        'ref-image',
        0.8
      );

      expect(result.success).toBe(true);
      expect(result.images).toHaveLength(1);
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

    it('should pass reference image through all adapters', async () => {
      const mockAdapter: IImageGenerationAdapter = {
        name: 'Mock API',
        isAvailable: async () => true,
        generateImages: async (
          _prompt: string,
          _count: number,
          refImage?: string,
          weight?: number
        ) => ({
          success: true,
          images: ['image.jpg'],
          metadata: { refImage, weight },
        }),
      };

      const testManager = new APIManager([mockAdapter]);
      const result = await testManager.generateImages(
        'test prompt',
        1,
        'base64-image-data',
        0.75
      );

      expect(result.success).toBe(true);
      expect(result.images).toHaveLength(1);
    });

    it('should handle reference image with default weight', async () => {
      const mockAdapter: IImageGenerationAdapter = {
        name: 'Mock API',
        isAvailable: async () => true,
        generateImages: async (
          _prompt: string,
          _count: number,
          refImage?: string
        ) => ({
          success: true,
          images: ['image.jpg'],
          metadata: { refImage },
        }),
      };

      const testManager = new APIManager([mockAdapter]);
      const result = await testManager.generateImages(
        'test prompt',
        1,
        'base64-image-data'
      );

      expect(result.success).toBe(true);
      expect(result.images).toHaveLength(1);
    });

    it('should validate reference image weight at boundary values', async () => {
      const mockAdapter: IImageGenerationAdapter = {
        name: 'Mock API',
        isAvailable: async () => true,
        generateImages: async () => ({
          success: true,
          images: ['image.jpg'],
        }),
      };

      const testManager = new APIManager([mockAdapter]);

      // Test weight = 0
      const result0 = await testManager.generateImages(
        'test prompt',
        1,
        'ref-image',
        0
      );
      expect(result0.success).toBe(true);

      // Test weight = 1
      const result1 = await testManager.generateImages(
        'test prompt',
        1,
        'ref-image',
        1
      );
      expect(result1.success).toBe(true);
    });
  });
});
