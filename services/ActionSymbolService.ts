/**
 * Action Symbol Service
 * Handles predefined motion actions (forward, rotate, jump, fly)
 */

import { prisma } from '@/lib/prisma';
import type { ActionSymbol } from '@prisma/client';

export interface CreateActionSymbolInput {
  userId: number;
  name: 'forward' | 'rotate' | 'jump' | 'fly';
  icon: string;
  description: string;
  prompt: string;
}

export interface UpdateActionSymbolInput {
  icon?: string;
  description?: string;
  prompt?: string;
}

// Default action symbols
const DEFAULT_ACTIONS = {
  forward: {
    icon: '➡️',
    description: 'Smooth forward motion',
    prompt: 'Generate a smooth forward motion of {subject}, moving steadily from left to right',
  },
  rotate: {
    icon: '🔄',
    description: '360-degree rotation',
    prompt: 'Generate a 360-degree rotation of {subject}, rotating smoothly around its center',
  },
  jump: {
    icon: '⬆️',
    description: 'Jumping motion',
    prompt: 'Generate a jumping motion of {subject}, bouncing up and down with energy',
  },
  fly: {
    icon: '✈️',
    description: 'Flying motion',
    prompt: 'Generate a flying motion of {subject}, soaring through the air gracefully',
  },
};

export class ActionSymbolService {
  /**
   * Initialize default action symbols for a user
   */
  async initializeDefaultActions(userId: number): Promise<ActionSymbol[]> {
    const actions: ActionSymbol[] = [];

    for (const [name, data] of Object.entries(DEFAULT_ACTIONS)) {
      // Check if action already exists
      const existing = await prisma.actionSymbol.findFirst({
        where: { userId, name },
      });

      if (!existing) {
        const action = await prisma.actionSymbol.create({
          data: {
            userId,
            name: name as any,
            icon: data.icon,
            description: data.description,
            prompt: data.prompt,
          },
        });
        actions.push(action);
      } else {
        actions.push(existing);
      }
    }

    return actions;
  }

  /**
   * Get all action symbols for a user
   */
  async getActionSymbols(userId: number): Promise<ActionSymbol[]> {
    const actions = await prisma.actionSymbol.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    // If no actions exist, initialize defaults
    if (actions.length === 0) {
      return this.initializeDefaultActions(userId);
    }

    return actions;
  }

  /**
   * Get a single action symbol by ID
   */
  async getActionSymbolById(actionId: string): Promise<ActionSymbol | null> {
    const action = await prisma.actionSymbol.findUnique({
      where: { id: actionId },
    });

    return action;
  }

  /**
   * Get action symbol by name
   */
  async getActionSymbolByName(
    userId: number,
    name: 'forward' | 'rotate' | 'jump' | 'fly'
  ): Promise<ActionSymbol | null> {
    const action = await prisma.actionSymbol.findFirst({
      where: { userId, name },
    });

    return action;
  }

  /**
   * Update an action symbol
   */
  async updateActionSymbol(
    actionId: string,
    userId: number,
    updates: UpdateActionSymbolInput
  ): Promise<ActionSymbol> {
    // Verify ownership
    const action = await prisma.actionSymbol.findUnique({
      where: { id: actionId },
    });

    if (!action) {
      throw new Error('Action symbol not found');
    }

    if (action.userId !== userId) {
      throw new Error('Unauthorized: You do not own this action');
    }

    // Validate updates
    if (updates.description !== undefined && updates.description.trim().length === 0) {
      throw new Error('Action description cannot be empty');
    }

    if (updates.prompt !== undefined && updates.prompt.trim().length === 0) {
      throw new Error('Action prompt cannot be empty');
    }

    // Update action
    const updatedAction = await prisma.actionSymbol.update({
      where: { id: actionId },
      data: {
        ...(updates.icon && { icon: updates.icon }),
        ...(updates.description && { description: updates.description.trim() }),
        ...(updates.prompt && { prompt: updates.prompt.trim() }),
      },
    });

    return updatedAction;
  }

  /**
   * Reset action symbol to default
   */
  async resetActionSymbol(
    actionId: string,
    userId: number
  ): Promise<ActionSymbol> {
    // Verify ownership
    const action = await prisma.actionSymbol.findUnique({
      where: { id: actionId },
    });

    if (!action) {
      throw new Error('Action symbol not found');
    }

    if (action.userId !== userId) {
      throw new Error('Unauthorized: You do not own this action');
    }

    // Get default values
    const defaultData = DEFAULT_ACTIONS[action.name as keyof typeof DEFAULT_ACTIONS];
    if (!defaultData) {
      throw new Error('Invalid action name');
    }

    // Reset to default
    const resetAction = await prisma.actionSymbol.update({
      where: { id: actionId },
      data: {
        icon: defaultData.icon,
        description: defaultData.description,
        prompt: defaultData.prompt,
      },
    });

    return resetAction;
  }

  /**
   * Get default action symbols
   */
  getDefaultActions(): typeof DEFAULT_ACTIONS {
    return DEFAULT_ACTIONS;
  }
}

export const actionSymbolService = new ActionSymbolService();
