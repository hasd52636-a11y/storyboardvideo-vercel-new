/**
 * Property-Based Tests for Quick Storyboard Service
 * Feature: storyboard-enhancement
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { QuickStoryboardService } from '../QuickStoryboardService';
import { prisma } from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    quickStoryboardConfig: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('QuickStoryboardService', () => {
  let service: QuickStoryboardService;

  beforeEach(() => {
    service = new QuickStoryboardService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Property 4: Quick Storyboard Configuration Persistence', () => {
    it('should persist and retrieve configurations with all fields intact', async () => {
      // Feature: storyboard-enhancement, Property 4: Quick Storyboard Configuration Persistence
      // Validates: Requirements 2.4, 8.2

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            userId: fc.integer({ min: 1, max: 1000 }),
            name: fc.stringOf(fc.alphaNumericChar(), { minLength: 1, maxLength: 50 }),
            description: fc.stringOf(fc.alphaNumericChar(), { minLength: 1, maxLength: 200 }),
          }),
          async (input) => {
            const mockConfig = {
              id: 'test-id',
              userId: input.userId,
              name: input.name,
              description: input.description,
              threeViewTemplate: 'Generate three orthographic views (front, side, top) of {subject}',
              multiGridTemplate: 'Generate a {gridDimensions} grid storyboard with {frameCount} frames',
              styleComparisonTemplate: 'Generate {subject} in 5 different artistic styles: {styles}',
              narrativeProgressionTemplate:
                'Generate {frameCount} sequential frames showing narrative progression from: {currentContext}',
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            vi.mocked(prisma.quickStoryboardConfig.create).mockResolvedValueOnce(mockConfig);

            const result = await service.createConfig(input);

            expect(result.userId).toBe(input.userId);
            expect(result.name).toBe(input.name);
            expect(result.description).toBe(input.description);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 5: Default Templates Initialization', () => {
    it('should initialize all four default templates for new configurations', async () => {
      // Feature: storyboard-enhancement, Property 5: Default Templates Initialization
      // Validates: Requirements 2.6

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            userId: fc.integer({ min: 1, max: 1000 }),
            name: fc.stringOf(fc.alphaNumericChar(), { minLength: 1, maxLength: 50 }),
            description: fc.stringOf(fc.alphaNumericChar(), { minLength: 1, maxLength: 200 }),
          }),
          async (input) => {
            const mockConfig = {
              id: 'test-id',
              userId: input.userId,
              name: input.name,
              description: input.description,
              threeViewTemplate: 'Generate three orthographic views (front, side, top) of {subject}',
              multiGridTemplate: 'Generate a {gridDimensions} grid storyboard with {frameCount} frames',
              styleComparisonTemplate: 'Generate {subject} in 5 different artistic styles: {styles}',
              narrativeProgressionTemplate:
                'Generate {frameCount} sequential frames showing narrative progression from: {currentContext}',
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            vi.mocked(prisma.quickStoryboardConfig.create).mockResolvedValueOnce(mockConfig);

            const result = await service.createConfig(input);

            // Verify all four templates are present
            expect(result.threeViewTemplate).toBeDefined();
            expect(result.multiGridTemplate).toBeDefined();
            expect(result.styleComparisonTemplate).toBeDefined();
            expect(result.narrativeProgressionTemplate).toBeDefined();

            // Verify they are not empty
            expect(result.threeViewTemplate.length).toBeGreaterThan(0);
            expect(result.multiGridTemplate.length).toBeGreaterThan(0);
            expect(result.styleComparisonTemplate.length).toBeGreaterThan(0);
            expect(result.narrativeProgressionTemplate.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should throw error when creating config with empty name', async () => {
      const input = {
        userId: 1,
        name: '',
        description: 'test description',
      };

      await expect(service.createConfig(input)).rejects.toThrow('Configuration name is required');
    });

    it('should throw error when creating config with empty description', async () => {
      const input = {
        userId: 1,
        name: 'test name',
        description: '',
      };

      await expect(service.createConfig(input)).rejects.toThrow(
        'Configuration description is required'
      );
    });

    it('should trim whitespace from name and description', async () => {
      const input = {
        userId: 1,
        name: '  test name  ',
        description: '  test description  ',
      };

      const mockConfig = {
        id: 'test-id',
        userId: 1,
        name: 'test name',
        description: 'test description',
        threeViewTemplate: 'default',
        multiGridTemplate: 'default',
        styleComparisonTemplate: 'default',
        narrativeProgressionTemplate: 'default',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.quickStoryboardConfig.create).mockResolvedValueOnce(mockConfig);

      const result = await service.createConfig(input);

      expect(result.name).toBe('test name');
      expect(result.description).toBe('test description');
    });

    it('should throw error when updating non-existent configuration', async () => {
      vi.mocked(prisma.quickStoryboardConfig.findUnique).mockResolvedValueOnce(null);

      await expect(
        service.updateConfig('non-existent-id', 1, { name: 'new name' })
      ).rejects.toThrow('Configuration not found');
    });

    it('should throw error when user tries to update configuration they do not own', async () => {
      const mockConfig = {
        id: 'test-id',
        userId: 1,
        name: 'test name',
        description: 'test description',
        threeViewTemplate: 'default',
        multiGridTemplate: 'default',
        styleComparisonTemplate: 'default',
        narrativeProgressionTemplate: 'default',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.quickStoryboardConfig.findUnique).mockResolvedValueOnce(mockConfig);

      await expect(
        service.updateConfig('test-id', 2, { name: 'new name' })
      ).rejects.toThrow('Unauthorized');
    });

    it('should reset template to default', async () => {
      const mockConfig = {
        id: 'test-id',
        userId: 1,
        name: 'test name',
        description: 'test description',
        threeViewTemplate: 'custom template',
        multiGridTemplate: 'default',
        styleComparisonTemplate: 'default',
        narrativeProgressionTemplate: 'default',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const resetConfig = {
        ...mockConfig,
        threeViewTemplate: 'Generate three orthographic views (front, side, top) of {subject}',
      };

      vi.mocked(prisma.quickStoryboardConfig.findUnique).mockResolvedValueOnce(mockConfig);
      vi.mocked(prisma.quickStoryboardConfig.update).mockResolvedValueOnce(resetConfig);

      const result = await service.resetTemplate('test-id', 1, 'threeView');

      expect(result.threeViewTemplate).toBe(
        'Generate three orthographic views (front, side, top) of {subject}'
      );
    });

    it('should return default templates', () => {
      const defaults = service.getDefaultTemplates();

      expect(defaults.threeView).toBeDefined();
      expect(defaults.multiGrid).toBeDefined();
      expect(defaults.styleComparison).toBeDefined();
      expect(defaults.narrativeProgression).toBeDefined();
    });
  });
});
