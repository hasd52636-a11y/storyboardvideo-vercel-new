/**
 * Property-Based Tests for Generation History Service
 * Feature: storyboard-enhancement
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { GenerationHistoryService } from '../GenerationHistoryService';
import { prisma } from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    generationHistory: {
      count: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

describe('GenerationHistoryService', () => {
  let service: GenerationHistoryService;

  beforeEach(() => {
    service = new GenerationHistoryService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Property 12: Generation History Persistence', () => {
    it('should persist and retrieve generations with all fields intact', async () => {
      // Feature: storyboard-enhancement, Property 12: Generation History Persistence
      // Validates: Requirements 8.3, 8.5

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            userId: fc.integer({ min: 1, max: 1000 }),
            type: fc.constantFrom('three-view', 'multi-grid', 'style-comparison', 'narrative-progression'),
            prompt: fc.stringOf(fc.alphaNumericChar(), { minLength: 10, maxLength: 200 }),
            imageCount: fc.integer({ min: 1, max: 5 }),
          }),
          async (input) => {
            const images = Array.from({ length: input.imageCount }, (_, i) => `image-${i + 1}.jpg`);
            const mockGeneration = {
              id: 'test-id',
              userId: input.userId,
              type: input.type,
              prompt: input.prompt,
              images,
              metadata: { test: true },
              createdAt: new Date(),
            };

            vi.mocked(prisma.generationHistory.count).mockResolvedValueOnce(1);
            vi.mocked(prisma.generationHistory.findMany).mockResolvedValueOnce([mockGeneration]);

            const result = await service.getHistory(input.userId);

            expect(result.items).toHaveLength(1);
            expect(result.items[0].userId).toBe(input.userId);
            expect(result.items[0].type).toBe(input.type);
            expect(result.items[0].prompt).toBe(input.prompt);
            expect(result.items[0].images).toEqual(images);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should throw error for invalid page number', async () => {
      await expect(
        service.getHistory(1, { page: 0, limit: 20 })
      ).rejects.toThrow('Page must be >= 1');
    });

    it('should throw error for invalid limit', async () => {
      await expect(
        service.getHistory(1, { page: 1, limit: 0 })
      ).rejects.toThrow('Limit must be between 1 and 100');
    });

    it('should throw error for limit > 100', async () => {
      await expect(
        service.getHistory(1, { page: 1, limit: 101 })
      ).rejects.toThrow('Limit must be between 1 and 100');
    });

    it('should retrieve paginated history', async () => {
      const mockGenerations = [
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

      vi.mocked(prisma.generationHistory.count).mockResolvedValueOnce(2);
      vi.mocked(prisma.generationHistory.findMany).mockResolvedValueOnce(mockGenerations);

      const result = await service.getHistory(1, { page: 1, limit: 20 });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(1);
    });

    it('should throw error when accessing generation not owned by user', async () => {
      const mockGeneration = {
        id: 'test-id',
        userId: 1,
        type: 'three-view',
        prompt: 'test',
        images: ['img.jpg'],
        metadata: {},
        createdAt: new Date(),
      };

      vi.mocked(prisma.generationHistory.findUnique).mockResolvedValueOnce(mockGeneration);

      await expect(
        service.getGenerationById('test-id', 2)
      ).rejects.toThrow('Unauthorized');
    });

    it('should throw error when deleting non-existent generation', async () => {
      vi.mocked(prisma.generationHistory.findUnique).mockResolvedValueOnce(null);

      await expect(
        service.deleteGeneration('non-existent-id', 1)
      ).rejects.toThrow('Generation not found');
    });

    it('should throw error when deleting generation not owned by user', async () => {
      const mockGeneration = {
        id: 'test-id',
        userId: 1,
        type: 'three-view',
        prompt: 'test',
        images: ['img.jpg'],
        metadata: {},
        createdAt: new Date(),
      };

      vi.mocked(prisma.generationHistory.findUnique).mockResolvedValueOnce(mockGeneration);

      await expect(
        service.deleteGeneration('test-id', 2)
      ).rejects.toThrow('Unauthorized');
    });

    it('should get generations by type', async () => {
      const mockGenerations = [
        {
          id: 'id-1',
          userId: 1,
          type: 'three-view',
          prompt: 'prompt-1',
          images: ['img-1.jpg'],
          metadata: {},
          createdAt: new Date(),
        },
      ];

      vi.mocked(prisma.generationHistory.count).mockResolvedValueOnce(1);
      vi.mocked(prisma.generationHistory.findMany).mockResolvedValueOnce(mockGenerations);

      const result = await service.getGenerationsByType(1, 'three-view');

      expect(result.items).toHaveLength(1);
      expect(result.items[0].type).toBe('three-view');
    });

    it('should get statistics', async () => {
      const mockGenerations = [
        { type: 'three-view' },
        { type: 'three-view' },
        { type: 'multi-grid' },
        { type: 'style-comparison' },
      ];

      vi.mocked(prisma.generationHistory.findMany).mockResolvedValueOnce(mockGenerations as any);

      const stats = await service.getStatistics(1);

      expect(stats.total).toBe(4);
      expect(stats['three-view']).toBe(2);
      expect(stats['multi-grid']).toBe(1);
      expect(stats['style-comparison']).toBe(1);
      expect(stats['narrative-progression']).toBe(0);
    });

    it('should get most recent generation', async () => {
      const mockGeneration = {
        id: 'test-id',
        userId: 1,
        type: 'three-view',
        prompt: 'test',
        images: ['img.jpg'],
        metadata: {},
        createdAt: new Date(),
      };

      vi.mocked(prisma.generationHistory.findFirst).mockResolvedValueOnce(mockGeneration);

      const result = await service.getMostRecent(1);

      expect(result).toEqual(mockGeneration);
    });

    it('should export history as JSON', async () => {
      const mockGenerations = [
        {
          id: 'id-1',
          userId: 1,
          type: 'three-view',
          prompt: 'prompt-1',
          images: ['img-1.jpg'],
          metadata: {},
          createdAt: new Date(),
        },
      ];

      vi.mocked(prisma.generationHistory.findMany).mockResolvedValueOnce(mockGenerations);

      const json = await service.exportAsJSON(1);

      expect(json).toBeTruthy();
      const parsed = JSON.parse(json);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
    });

    it('should calculate storage used', async () => {
      const mockGenerations = [
        {
          images: ['image-1.jpg', 'image-2.jpg'],
        },
        {
          images: ['image-3.jpg'],
        },
      ];

      vi.mocked(prisma.generationHistory.findMany).mockResolvedValueOnce(mockGenerations as any);

      const storage = await service.getTotalStorageUsed(1);

      // 3 images * 100KB each = 300KB
      expect(storage).toBeGreaterThan(0);
    });
  });
});
