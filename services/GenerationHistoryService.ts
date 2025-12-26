/**
 * Generation History Service
 * Manages generation history and retrieval
 */

import { prisma } from '@/lib/prisma';
import type { GenerationHistory } from '@prisma/client';

export interface GenerationHistoryFilter {
  type?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GenerationHistoryService {
  /**
   * Get generation history for a user with pagination
   */
  async getHistory(
    userId: number,
    options: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResult<GenerationHistory>> {
    // Validate pagination options
    if (options.page < 1) {
      throw new Error('Page must be >= 1');
    }

    if (options.limit < 1 || options.limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    const skip = (options.page - 1) * options.limit;

    // Get total count
    const total = await prisma.generationHistory.count({
      where: { userId },
    });

    // Get paginated results
    const items = await prisma.generationHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: options.limit,
    });

    const totalPages = Math.ceil(total / options.limit);

    return {
      items,
      total,
      page: options.page,
      limit: options.limit,
      totalPages,
    };
  }

  /**
   * Get generation history with filters
   */
  async getHistoryFiltered(
    userId: number,
    filter: GenerationHistoryFilter,
    options: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResult<GenerationHistory>> {
    // Build where clause
    const where: any = { userId };

    if (filter.type) {
      where.type = filter.type;
    }

    if (filter.startDate || filter.endDate) {
      where.createdAt = {};
      if (filter.startDate) {
        where.createdAt.gte = filter.startDate;
      }
      if (filter.endDate) {
        where.createdAt.lte = filter.endDate;
      }
    }

    // Validate pagination options
    if (options.page < 1) {
      throw new Error('Page must be >= 1');
    }

    if (options.limit < 1 || options.limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    const skip = (options.page - 1) * options.limit;

    // Get total count
    const total = await prisma.generationHistory.count({ where });

    // Get paginated results
    const items = await prisma.generationHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: options.limit,
    });

    const totalPages = Math.ceil(total / options.limit);

    return {
      items,
      total,
      page: options.page,
      limit: options.limit,
      totalPages,
    };
  }

  /**
   * Get a single generation by ID
   */
  async getGenerationById(generationId: string, userId: number): Promise<GenerationHistory | null> {
    const generation = await prisma.generationHistory.findUnique({
      where: { id: generationId },
    });

    if (!generation) {
      return null;
    }

    // Verify ownership
    if (generation.userId !== userId) {
      throw new Error('Unauthorized: You do not own this generation');
    }

    return generation;
  }

  /**
   * Get generations by type
   */
  async getGenerationsByType(
    userId: number,
    type: string,
    options: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResult<GenerationHistory>> {
    return this.getHistoryFiltered(userId, { type }, options);
  }

  /**
   * Delete a generation
   */
  async deleteGeneration(generationId: string, userId: number): Promise<void> {
    const generation = await prisma.generationHistory.findUnique({
      where: { id: generationId },
    });

    if (!generation) {
      throw new Error('Generation not found');
    }

    if (generation.userId !== userId) {
      throw new Error('Unauthorized: You do not own this generation');
    }

    await prisma.generationHistory.delete({
      where: { id: generationId },
    });
  }

  /**
   * Delete all generations for a user
   */
  async deleteAllGenerations(userId: number): Promise<number> {
    const result = await prisma.generationHistory.deleteMany({
      where: { userId },
    });

    return result.count;
  }

  /**
   * Get generation statistics for a user
   */
  async getStatistics(userId: number): Promise<Record<string, number>> {
    const generations = await prisma.generationHistory.findMany({
      where: { userId },
      select: { type: true },
    });

    const stats: Record<string, number> = {
      total: generations.length,
      'three-view': 0,
      'multi-grid': 0,
      'style-comparison': 0,
      'narrative-progression': 0,
    };

    for (const gen of generations) {
      if (gen.type in stats) {
        stats[gen.type]++;
      }
    }

    return stats;
  }

  /**
   * Get most recent generation
   */
  async getMostRecent(userId: number): Promise<GenerationHistory | null> {
    const generation = await prisma.generationHistory.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return generation;
  }

  /**
   * Get generations created in the last N days
   */
  async getRecentGenerations(userId: number, days: number = 7): Promise<GenerationHistory[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const generations = await prisma.generationHistory.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return generations;
  }

  /**
   * Export generation history as JSON
   */
  async exportAsJSON(userId: number): Promise<string> {
    const generations = await prisma.generationHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return JSON.stringify(generations, null, 2);
  }

  /**
   * Get total storage used by generations (in bytes)
   */
  async getTotalStorageUsed(userId: number): Promise<number> {
    const generations = await prisma.generationHistory.findMany({
      where: { userId },
      select: { images: true },
    });

    let totalSize = 0;

    for (const gen of generations) {
      for (const image of gen.images) {
        // Estimate size: if it's a base64 string, calculate size; if URL, estimate 100KB
        if (image.startsWith('data:')) {
          // Base64 encoded image
          const base64Data = image.split(',')[1];
          totalSize += (base64Data.length * 3) / 4; // Convert base64 length to bytes
        } else {
          // URL - estimate 100KB
          totalSize += 100 * 1024;
        }
      }
    }

    return totalSize;
  }
}

export const generationHistoryService = new GenerationHistoryService();
