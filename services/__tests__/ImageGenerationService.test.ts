/**
 * Property-Based Tests for Image Generation Service
 * Feature: storyboard-enhancement
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { ImageGenerationService } from '../ImageGenerationService';
import { multiGridGenerator } from '../generators/MultiGridGenerator';
import { styleComparisonGenerator } from '../generators/StyleComparisonGenerator';
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

describe('ImageGenerationService', () => {
  let service: ImageGenerationService;

  beforeEach(() => {
    service = new ImageGenerationService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Property 9: Multi-Grid Dimension Calculation', () => {
    it('should calculate correct grid dimensions for all valid N values (2-12)', async () => {
      // Feature: storyboard-enhancement, Property 9: Multi-Grid Dimension Calculation
      // Validates: Requirements 4.2

      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 2, max: 12 }),
          async (frameCount) => {
            const gridDimensions = multiGridGenerator.calculateGridDimensions(frameCount);

            // Verify grid dimensions are valid
            expect(gridDimensions).toMatch(/^\d+x\d+$/);

            // Verify grid dimensions result in exactly frameCount frames
            const [rows, cols] = gridDimensions.split('x').map(Number);
            expect(rows * cols).toBe(frameCount);
          }
        ),
        { numRuns: 11 } // 11 values from 2 to 12
      );
    });
  });

  describe('Property 10: Style Diversity in Comparison', () => {
    it('should select 5 distinct styles with no duplicates', async () => {
      // Feature: storyboard-enhancement, Property 10: Style Diversity in Comparison
      // Validates: Requirements 5.1, 5.6

      await fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
          const styles = service.selectDistinctStyles(5);

          // Verify exactly 5 styles selected
          expect(styles).toHaveLength(5);

          // Verify all styles are unique
          const uniqueStyles = new Set(styles);
          expect(uniqueStyles.size).toBe(5);

          // Verify all styles are strings
          for (const style of styles) {
            expect(typeof style).toBe('string');
            expect(style.length).toBeGreaterThan(0);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 11: Narrative Progression Sequence Order', () => {
    it('should return images in sequential order', async () => {
      // Feature: storyboard-enhancement, Property 11: Narrative Progression Sequence Order
      // Validates: Requirements 6.6

      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 12 }),
          async (frameCount) => {
            const mockGeneration = {
              id: 'test-id',
              userId: 1,
              type: 'narrative-progression',
              prompt: 'test prompt',
              images: Array.from({ length: frameCount }, (_, i) => `frame-${i + 1}.jpg`),
              metadata: { frameCount },
              createdAt: new Date(),
            };

            vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce(mockGeneration);

            const result = await service.generateImages({
              type: 'narrative-progression',
              userId: 1,
              template: 'Generate {frameCount} frames',
              parameters: { frameCount: frameCount.toString() },
            });

            // Verify images are in order
            for (let i = 0; i < result.images.length; i++) {
              expect(result.images[i]).toBe(`frame-${i + 1}.jpg`);
            }
          }
        ),
        { numRuns: 12 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should throw error for invalid frame count in multi-grid', () => {
      expect(() => multiGridGenerator.calculateGridDimensions(1)).toThrow();
      expect(() => multiGridGenerator.calculateGridDimensions(13)).toThrow();
      expect(() => multiGridGenerator.calculateGridDimensions(0)).toThrow();
      expect(() => multiGridGenerator.calculateGridDimensions(-1)).toThrow();
    });

    it('should throw error for invalid style count', () => {
      expect(() => service.selectDistinctStyles(0)).toThrow();
      expect(() => service.selectDistinctStyles(100)).toThrow();
    });

    it('should calculate correct grid dimensions for each frame count', () => {
      const expected: Record<number, string> = {
        2: '2x1',
        3: '3x1',
        4: '2x2',
        5: '5x1',
        6: '3x2',
        7: '7x1',
        8: '4x2',
        9: '3x3',
        10: '5x2',
        11: '11x1',
        12: '4x3',
      };

      for (const [frameCount, expectedDimensions] of Object.entries(expected)) {
        const dimensions = multiGridGenerator.calculateGridDimensions(parseInt(frameCount));
        expect(dimensions).toBe(expectedDimensions);
      }
    });

    it('should select exactly 5 styles by default', () => {
      const styles = service.selectDistinctStyles(5);
      expect(styles).toHaveLength(5);
    });

    it('should select distinct styles without duplicates', () => {
      for (let i = 0; i < 10; i++) {
        const styles = service.selectDistinctStyles(5);
        const uniqueStyles = new Set(styles);
        expect(uniqueStyles.size).toBe(5);
      }
    });

    it('should throw error when generating with empty template', async () => {
      await expect(
        service.generateImages({
          type: 'three-view',
          userId: 1,
          template: '',
          parameters: { subject: 'test' },
        })
      ).rejects.toThrow('Template is required');
    });

    it('should persist generation to database', async () => {
      const mockGeneration = {
        id: 'test-id',
        userId: 1,
        type: 'three-view',
        prompt: 'Generate three views of cat',
        images: ['front.jpg', 'side.jpg', 'top.jpg'],
        metadata: { subject: 'cat' },
        createdAt: new Date(),
      };

      vi.mocked(prisma.generationHistory.create).mockResolvedValueOnce(mockGeneration);

      const result = await service.generateImages({
        type: 'three-view',
        userId: 1,
        template: 'Generate three views of {subject}',
        parameters: { subject: 'cat' },
      });

      expect(result.id).toBe('test-id');
      expect(result.userId).toBe(1);
      expect(result.type).toBe('three-view');
      expect(result.images).toHaveLength(3);
    });

    it('should retrieve generation history', async () => {
      const mockHistory = [
        {
          id: 'id-1',
          userId: 1,
          type: 'three-view',
          prompt: 'prompt-1',
          images: ['img-1.jpg'],
          metadata: {},
          createdAt: new Date(),
        },
        {
          id: 'id-2',
          userId: 1,
          type: 'multi-grid',
          prompt: 'prompt-2',
          images: ['img-2.jpg'],
          metadata: {},
          createdAt: new Date(),
        },
      ];

      vi.mocked(prisma.generationHistory.findMany).mockResolvedValueOnce(mockHistory);

      const result = await service.getGenerationHistory(1);

      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('three-view');
      expect(result[1].type).toBe('multi-grid');
    });
  });
});
