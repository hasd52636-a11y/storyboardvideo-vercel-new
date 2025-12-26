/**
 * Property-Based Tests for Symbol Service
 * Feature: storyboard-enhancement
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { SymbolService } from '../SymbolService';
import { prisma } from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    symbol: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

describe('SymbolService', () => {
  let symbolService: SymbolService;

  beforeEach(() => {
    symbolService = new SymbolService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Property 1: Symbol Persistence Round-Trip', () => {
    it('should persist and retrieve symbols with all fields intact', async () => {
      // Feature: storyboard-enhancement, Property 1: Symbol Persistence Round-Trip
      // Validates: Requirements 1.4, 8.1

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            userId: fc.integer({ min: 1, max: 1000 }),
            icon: fc.base64String({ minLength: 10, maxLength: 1000 }),
            name: fc.stringOf(fc.alphaNumericChar(), { minLength: 1, maxLength: 50 }),
            description: fc.stringOf(fc.alphaNumericChar(), { minLength: 1, maxLength: 200 }),
          }),
          async (input) => {
            const mockSymbol = {
              id: 'test-id',
              userId: input.userId,
              icon: input.icon,
              name: input.name,
              description: input.description,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            vi.mocked(prisma.symbol.create).mockResolvedValueOnce(mockSymbol);

            const result = await symbolService.uploadSymbol(input);

            expect(result.userId).toBe(input.userId);
            expect(result.icon).toBe(input.icon);
            expect(result.name).toBe(input.name);
            expect(result.description).toBe(input.description);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2: Symbol Validation', () => {
    it('should reject symbols with empty or missing name', async () => {
      // Feature: storyboard-enhancement, Property 2: Symbol Validation
      // Validates: Requirements 1.3

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            userId: fc.integer({ min: 1, max: 1000 }),
            icon: fc.base64String({ minLength: 10 }),
            description: fc.stringOf(fc.alphaNumericChar(), { minLength: 1 }),
          }),
          async (input) => {
            const invalidInputs = [
              { ...input, name: '' },
              { ...input, name: '   ' },
              { ...input, name: undefined },
            ];

            for (const invalidInput of invalidInputs) {
              await expect(
                symbolService.uploadSymbol(invalidInput as any)
              ).rejects.toThrow();
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should reject symbols with empty or missing description', async () => {
      // Feature: storyboard-enhancement, Property 2: Symbol Validation
      // Validates: Requirements 1.3

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            userId: fc.integer({ min: 1, max: 1000 }),
            icon: fc.base64String({ minLength: 10 }),
            name: fc.stringOf(fc.alphaNumericChar(), { minLength: 1 }),
          }),
          async (input) => {
            const invalidInputs = [
              { ...input, description: '' },
              { ...input, description: '   ' },
              { ...input, description: undefined },
            ];

            for (const invalidInput of invalidInputs) {
              await expect(
                symbolService.uploadSymbol(invalidInput as any)
              ).rejects.toThrow();
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 3: Symbol Deletion Completeness', () => {
    it('should remove symbol from database after deletion', async () => {
      // Feature: storyboard-enhancement, Property 3: Symbol Deletion Completeness
      // Validates: Requirements 1.7

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            symbolId: fc.uuid(),
            userId: fc.integer({ min: 1, max: 1000 }),
          }),
          async (input) => {
            const mockSymbol = {
              id: input.symbolId,
              userId: input.userId,
              icon: 'test-icon',
              name: 'test-name',
              description: 'test-description',
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            vi.mocked(prisma.symbol.findUnique).mockResolvedValueOnce(mockSymbol);
            vi.mocked(prisma.symbol.delete).mockResolvedValueOnce(mockSymbol);

            await symbolService.deleteSymbol(input.symbolId, input.userId);

            // After deletion, querying should return null
            vi.mocked(prisma.symbol.findUnique).mockResolvedValueOnce(null);
            const result = await prisma.symbol.findUnique({
              where: { id: input.symbolId },
            });

            expect(result).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should trim whitespace from name and description', async () => {
      const input = {
        userId: 1,
        icon: 'test-icon',
        name: '  test name  ',
        description: '  test description  ',
      };

      const mockSymbol = {
        id: 'test-id',
        userId: 1,
        icon: 'test-icon',
        name: 'test name',
        description: 'test description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.symbol.create).mockResolvedValueOnce(mockSymbol);

      const result = await symbolService.uploadSymbol(input);

      expect(result.name).toBe('test name');
      expect(result.description).toBe('test description');
    });

    it('should throw error when updating non-existent symbol', async () => {
      vi.mocked(prisma.symbol.findUnique).mockResolvedValueOnce(null);

      await expect(
        symbolService.updateSymbol('non-existent-id', 1, { name: 'new name' })
      ).rejects.toThrow('Symbol not found');
    });

    it('should throw error when user tries to update symbol they do not own', async () => {
      const mockSymbol = {
        id: 'test-id',
        userId: 1,
        icon: 'test-icon',
        name: 'test name',
        description: 'test description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.symbol.findUnique).mockResolvedValueOnce(mockSymbol);

      await expect(
        symbolService.updateSymbol('test-id', 2, { name: 'new name' })
      ).rejects.toThrow('Unauthorized');
    });

    it('should retrieve all symbols for a user', async () => {
      const mockSymbols = [
        {
          id: 'id-1',
          userId: 1,
          icon: 'icon-1',
          name: 'symbol-1',
          description: 'desc-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'id-2',
          userId: 1,
          icon: 'icon-2',
          name: 'symbol-2',
          description: 'desc-2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(prisma.symbol.findMany).mockResolvedValueOnce(mockSymbols);

      const result = await symbolService.getSymbols(1);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('symbol-1');
      expect(result[1].name).toBe('symbol-2');
    });
  });
});
