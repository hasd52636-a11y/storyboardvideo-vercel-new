/**
 * Symbol Service
 * Handles all symbol-related operations: upload, retrieve, update, delete
 */

import { prisma } from '@/lib/prisma';
import type { Symbol } from '@prisma/client';

export interface CreateSymbolInput {
  userId: number;
  icon: string; // Base64 or URL
  name: string;
  description: string;
}

export interface UpdateSymbolInput {
  icon?: string;
  name?: string;
  description?: string;
}

export class SymbolService {
  /**
   * Upload a new symbol
   * Validates that name and description are not empty
   */
  async uploadSymbol(input: CreateSymbolInput): Promise<Symbol> {
    // Validate input
    if (!input.name || input.name.trim().length === 0) {
      throw new Error('Symbol name is required and cannot be empty');
    }

    if (!input.description || input.description.trim().length === 0) {
      throw new Error('Symbol description is required and cannot be empty');
    }

    if (!input.icon || input.icon.trim().length === 0) {
      throw new Error('Symbol icon is required');
    }

    // Create symbol in database
    const symbol = await prisma.symbol.create({
      data: {
        userId: input.userId,
        icon: input.icon,
        name: input.name.trim(),
        description: input.description.trim(),
      },
    });

    return symbol;
  }

  /**
   * Get all symbols for a user
   */
  async getSymbols(userId: number): Promise<Symbol[]> {
    const symbols = await prisma.symbol.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return symbols;
  }

  /**
   * Get a single symbol by ID
   */
  async getSymbolById(symbolId: string): Promise<Symbol | null> {
    const symbol = await prisma.symbol.findUnique({
      where: { id: symbolId },
    });

    return symbol;
  }

  /**
   * Update a symbol
   * Only updates provided fields
   */
  async updateSymbol(
    symbolId: string,
    userId: number,
    updates: UpdateSymbolInput
  ): Promise<Symbol> {
    // Verify ownership
    const symbol = await prisma.symbol.findUnique({
      where: { id: symbolId },
    });

    if (!symbol) {
      throw new Error('Symbol not found');
    }

    if (symbol.userId !== userId) {
      throw new Error('Unauthorized: You do not own this symbol');
    }

    // Validate updates
    if (updates.name !== undefined && updates.name.trim().length === 0) {
      throw new Error('Symbol name cannot be empty');
    }

    if (
      updates.description !== undefined &&
      updates.description.trim().length === 0
    ) {
      throw new Error('Symbol description cannot be empty');
    }

    // Update symbol
    const updatedSymbol = await prisma.symbol.update({
      where: { id: symbolId },
      data: {
        ...(updates.icon && { icon: updates.icon }),
        ...(updates.name && { name: updates.name.trim() }),
        ...(updates.description && { description: updates.description.trim() }),
      },
    });

    return updatedSymbol;
  }

  /**
   * Delete a symbol
   */
  async deleteSymbol(symbolId: string, userId: number): Promise<void> {
    // Verify ownership
    const symbol = await prisma.symbol.findUnique({
      where: { id: symbolId },
    });

    if (!symbol) {
      throw new Error('Symbol not found');
    }

    if (symbol.userId !== userId) {
      throw new Error('Unauthorized: You do not own this symbol');
    }

    // Delete symbol
    await prisma.symbol.delete({
      where: { id: symbolId },
    });
  }

  /**
   * Delete all symbols for a user (cleanup)
   */
  async deleteUserSymbols(userId: number): Promise<number> {
    const result = await prisma.symbol.deleteMany({
      where: { userId },
    });

    return result.count;
  }
}

export const symbolService = new SymbolService();
