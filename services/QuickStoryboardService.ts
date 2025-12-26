/**
 * Quick Storyboard Service
 * Handles quick storyboard configuration management
 */

import { prisma } from '@/lib/prisma';
import type { QuickStoryboardConfig } from '@prisma/client';

export interface CreateQuickStoryboardInput {
  userId: number;
  name: string;
  description: string;
  templates?: {
    threeView?: string;
    multiGrid?: string;
    styleComparison?: string;
    narrativeProgression?: string;
  };
}

export interface UpdateQuickStoryboardInput {
  name?: string;
  description?: string;
  threeViewTemplate?: string;
  multiGridTemplate?: string;
  styleComparisonTemplate?: string;
  narrativeProgressionTemplate?: string;
}

// Default templates
const DEFAULT_TEMPLATES = {
  threeView: 'Generate three orthographic views (front, side, top) of {subject}',
  multiGrid: 'Generate a {gridDimensions} grid storyboard with {frameCount} frames',
  styleComparison: 'Generate {subject} in 5 different artistic styles: {styles}',
  narrativeProgression:
    'Generate {frameCount} sequential frames showing narrative progression from: {currentContext}',
};

export class QuickStoryboardService {
  /**
   * Create a new Quick Storyboard configuration
   * Initializes with default templates if not provided
   */
  async createConfig(input: CreateQuickStoryboardInput): Promise<QuickStoryboardConfig> {
    // Validate input
    if (!input.name || input.name.trim().length === 0) {
      throw new Error('Configuration name is required');
    }

    if (!input.description || input.description.trim().length === 0) {
      throw new Error('Configuration description is required');
    }

    // Create configuration with default or custom templates
    const config = await prisma.quickStoryboardConfig.create({
      data: {
        userId: input.userId,
        name: input.name.trim(),
        description: input.description.trim(),
        threeViewTemplate: input.templates?.threeView || DEFAULT_TEMPLATES.threeView,
        multiGridTemplate: input.templates?.multiGrid || DEFAULT_TEMPLATES.multiGrid,
        styleComparisonTemplate:
          input.templates?.styleComparison || DEFAULT_TEMPLATES.styleComparison,
        narrativeProgressionTemplate:
          input.templates?.narrativeProgression || DEFAULT_TEMPLATES.narrativeProgression,
      },
    });

    return config;
  }

  /**
   * Get Quick Storyboard configuration for a user
   * Returns the first (most recent) configuration
   */
  async getConfig(userId: number): Promise<QuickStoryboardConfig | null> {
    const config = await prisma.quickStoryboardConfig.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return config;
  }

  /**
   * Get all configurations for a user
   */
  async getAllConfigs(userId: number): Promise<QuickStoryboardConfig[]> {
    const configs = await prisma.quickStoryboardConfig.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return configs;
  }

  /**
   * Get configuration by ID
   */
  async getConfigById(configId: string): Promise<QuickStoryboardConfig | null> {
    const config = await prisma.quickStoryboardConfig.findUnique({
      where: { id: configId },
    });

    return config;
  }

  /**
   * Update a Quick Storyboard configuration
   */
  async updateConfig(
    configId: string,
    userId: number,
    updates: UpdateQuickStoryboardInput
  ): Promise<QuickStoryboardConfig> {
    // Verify ownership
    const config = await prisma.quickStoryboardConfig.findUnique({
      where: { id: configId },
    });

    if (!config) {
      throw new Error('Configuration not found');
    }

    if (config.userId !== userId) {
      throw new Error('Unauthorized: You do not own this configuration');
    }

    // Validate updates
    if (updates.name !== undefined && updates.name.trim().length === 0) {
      throw new Error('Configuration name cannot be empty');
    }

    if (updates.description !== undefined && updates.description.trim().length === 0) {
      throw new Error('Configuration description cannot be empty');
    }

    // Update configuration
    const updatedConfig = await prisma.quickStoryboardConfig.update({
      where: { id: configId },
      data: {
        ...(updates.name && { name: updates.name.trim() }),
        ...(updates.description && { description: updates.description.trim() }),
        ...(updates.threeViewTemplate && { threeViewTemplate: updates.threeViewTemplate }),
        ...(updates.multiGridTemplate && { multiGridTemplate: updates.multiGridTemplate }),
        ...(updates.styleComparisonTemplate && {
          styleComparisonTemplate: updates.styleComparisonTemplate,
        }),
        ...(updates.narrativeProgressionTemplate && {
          narrativeProgressionTemplate: updates.narrativeProgressionTemplate,
        }),
      },
    });

    return updatedConfig;
  }

  /**
   * Reset a specific template to default
   */
  async resetTemplate(
    configId: string,
    userId: number,
    templateType: keyof typeof DEFAULT_TEMPLATES
  ): Promise<QuickStoryboardConfig> {
    // Verify ownership
    const config = await prisma.quickStoryboardConfig.findUnique({
      where: { id: configId },
    });

    if (!config) {
      throw new Error('Configuration not found');
    }

    if (config.userId !== userId) {
      throw new Error('Unauthorized: You do not own this configuration');
    }

    // Map template type to field name
    const fieldMap = {
      threeView: 'threeViewTemplate',
      multiGrid: 'multiGridTemplate',
      styleComparison: 'styleComparisonTemplate',
      narrativeProgression: 'narrativeProgressionTemplate',
    };

    const fieldName = fieldMap[templateType] as keyof typeof fieldMap;

    // Reset template
    const updatedConfig = await prisma.quickStoryboardConfig.update({
      where: { id: configId },
      data: {
        [fieldName]: DEFAULT_TEMPLATES[templateType],
      },
    });

    return updatedConfig;
  }

  /**
   * Get default templates
   */
  getDefaultTemplates(): typeof DEFAULT_TEMPLATES {
    return DEFAULT_TEMPLATES;
  }

  /**
   * Delete a configuration
   */
  async deleteConfig(configId: string, userId: number): Promise<void> {
    // Verify ownership
    const config = await prisma.quickStoryboardConfig.findUnique({
      where: { id: configId },
    });

    if (!config) {
      throw new Error('Configuration not found');
    }

    if (config.userId !== userId) {
      throw new Error('Unauthorized: You do not own this configuration');
    }

    // Delete configuration
    await prisma.quickStoryboardConfig.delete({
      where: { id: configId },
    });
  }
}

export const quickStoryboardService = new QuickStoryboardService();
