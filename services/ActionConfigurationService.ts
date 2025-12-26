/**
 * Action Configuration Service
 * Manages action configurations and templates for motion generation
 */

import { prisma } from '@/lib/prisma';
import type { ActionConfiguration } from '@prisma/client';

export interface CreateActionConfigurationInput {
  userId: number;
  name: string;
  description: string;
  templates?: {
    forward?: string;
    rotate?: string;
    jump?: string;
    fly?: string;
  };
}

export interface UpdateActionConfigurationInput {
  name?: string;
  description?: string;
  forwardTemplate?: string;
  rotateTemplate?: string;
  jumpTemplate?: string;
  flyTemplate?: string;
}

// Default templates
const DEFAULT_TEMPLATES = {
  forward: 'Generate a smooth forward motion of {subject}',
  rotate: 'Generate a 360-degree rotation of {subject}',
  jump: 'Generate a jumping motion of {subject}',
  fly: 'Generate a flying motion of {subject}',
};

export class ActionConfigurationService {
  /**
   * Create a new action configuration
   */
  async createConfig(input: CreateActionConfigurationInput): Promise<ActionConfiguration> {
    // Validate input
    if (!input.name || input.name.trim().length === 0) {
      throw new Error('Configuration name is required');
    }

    if (!input.description || input.description.trim().length === 0) {
      throw new Error('Configuration description is required');
    }

    // Create configuration with default or custom templates
    const config = await prisma.actionConfiguration.create({
      data: {
        userId: input.userId,
        name: input.name.trim(),
        description: input.description.trim(),
        forwardTemplate: input.templates?.forward || DEFAULT_TEMPLATES.forward,
        rotateTemplate: input.templates?.rotate || DEFAULT_TEMPLATES.rotate,
        jumpTemplate: input.templates?.jump || DEFAULT_TEMPLATES.jump,
        flyTemplate: input.templates?.fly || DEFAULT_TEMPLATES.fly,
      },
    });

    return config;
  }

  /**
   * Get action configuration for a user
   */
  async getConfig(userId: number): Promise<ActionConfiguration | null> {
    const config = await prisma.actionConfiguration.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return config;
  }

  /**
   * Get all configurations for a user
   */
  async getAllConfigs(userId: number): Promise<ActionConfiguration[]> {
    const configs = await prisma.actionConfiguration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return configs;
  }

  /**
   * Get configuration by ID
   */
  async getConfigById(configId: string): Promise<ActionConfiguration | null> {
    const config = await prisma.actionConfiguration.findUnique({
      where: { id: configId },
    });

    return config;
  }

  /**
   * Update an action configuration
   */
  async updateConfig(
    configId: string,
    userId: number,
    updates: UpdateActionConfigurationInput
  ): Promise<ActionConfiguration> {
    // Verify ownership
    const config = await prisma.actionConfiguration.findUnique({
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
    const updatedConfig = await prisma.actionConfiguration.update({
      where: { id: configId },
      data: {
        ...(updates.name && { name: updates.name.trim() }),
        ...(updates.description && { description: updates.description.trim() }),
        ...(updates.forwardTemplate && { forwardTemplate: updates.forwardTemplate }),
        ...(updates.rotateTemplate && { rotateTemplate: updates.rotateTemplate }),
        ...(updates.jumpTemplate && { jumpTemplate: updates.jumpTemplate }),
        ...(updates.flyTemplate && { flyTemplate: updates.flyTemplate }),
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
    templateType: 'forward' | 'rotate' | 'jump' | 'fly'
  ): Promise<ActionConfiguration> {
    // Verify ownership
    const config = await prisma.actionConfiguration.findUnique({
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
      forward: 'forwardTemplate',
      rotate: 'rotateTemplate',
      jump: 'jumpTemplate',
      fly: 'flyTemplate',
    };

    const fieldName = fieldMap[templateType] as keyof typeof fieldMap;

    // Reset template
    const updatedConfig = await prisma.actionConfiguration.update({
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
    const config = await prisma.actionConfiguration.findUnique({
      where: { id: configId },
    });

    if (!config) {
      throw new Error('Configuration not found');
    }

    if (config.userId !== userId) {
      throw new Error('Unauthorized: You do not own this configuration');
    }

    // Delete configuration
    await prisma.actionConfiguration.delete({
      where: { id: configId },
    });
  }
}

export const actionConfigurationService = new ActionConfigurationService();
