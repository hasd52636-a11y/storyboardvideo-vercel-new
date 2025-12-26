/**
 * Image Generation Service
 * Handles image generation requests and API integration
 */

import { prisma } from '@/lib/prisma';
import { promptEngine } from './PromptEngine';
import { quickStoryboardService } from './QuickStoryboardService';
import type { GenerationHistory } from '@prisma/client';

export type GenerationType = 'three-view' | 'multi-grid' | 'style-comparison' | 'narrative-progression';

export interface GenerationRequest {
  type: GenerationType;
  userId: number;
  template: string;
  parameters: Record<string, string>;
  subject?: string;
  currentImage?: string;
  script?: string;
}

export interface GenerationResult {
  id: string;
  userId: number;
  type: string;
  prompt: string;
  images: string[];
  metadata: Record<string, any>;
  createdAt: Date;
}

// Style library for style comparison
const STYLE_LIBRARY = [
  'oil painting',
  'watercolor',
  'digital art',
  'anime',
  'photorealistic',
  'cartoon',
  'sketch',
  'abstract',
  'impressionist',
  'surrealism',
  'cyberpunk',
  'steampunk',
  'minimalist',
  'maximalist',
  'noir',
];

export class ImageGenerationService {
  /**
   * Generate images based on request
   */
  async generateImages(request: GenerationRequest): Promise<GenerationResult> {
    // Validate request
    if (!request.template || request.template.trim().length === 0) {
      throw new Error('Template is required');
    }

    // Construct prompt
    const prompt = this.constructPrompt(request);

    // Call API (placeholder - will be implemented with actual API)
    const images = await this.callImageGenerationAPI(prompt, request.type);

    // Persist generation history
    const metadata = this.buildMetadata(request);
    const result = await prisma.generationHistory.create({
      data: {
        userId: request.userId,
        type: request.type,
        prompt,
        images,
        metadata,
      },
    });

    return {
      id: result.id,
      userId: result.userId,
      type: result.type,
      prompt: result.prompt,
      images: result.images,
      metadata: result.metadata as Record<string, any>,
      createdAt: result.createdAt,
    };
  }

  /**
   * Construct prompt from template and parameters
   */
  private constructPrompt(request: GenerationRequest): string {
    try {
      return promptEngine.renderPrompt(request.template, request.parameters);
    } catch (error) {
      throw new Error(`Failed to construct prompt: ${(error as Error).message}`);
    }
  }

  /**
   * Call image generation API
   * Placeholder implementation - will be replaced with actual API calls
   */
  private async callImageGenerationAPI(prompt: string, type: GenerationType): Promise<string[]> {
    // TODO: Implement actual API calls to Sora/Gemini
    // For now, return placeholder images
    console.log(`Calling API for ${type} with prompt: ${prompt}`);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Return placeholder images based on type
    switch (type) {
      case 'three-view':
        return ['image-front.jpg', 'image-side.jpg', 'image-top.jpg'];
      case 'multi-grid':
        return ['grid-layout.jpg'];
      case 'style-comparison':
        return [
          'style-1.jpg',
          'style-2.jpg',
          'style-3.jpg',
          'style-4.jpg',
          'style-5.jpg',
        ];
      case 'narrative-progression':
        return ['frame-1.jpg', 'frame-2.jpg', 'frame-3.jpg'];
      default:
        throw new Error(`Unknown generation type: ${type}`);
    }
  }

  /**
   * Build metadata for generation
   */
  private buildMetadata(request: GenerationRequest): Record<string, any> {
    const metadata: Record<string, any> = {
      type: request.type,
      timestamp: new Date().toISOString(),
    };

    // Add type-specific metadata
    switch (request.type) {
      case 'three-view':
        metadata.views = ['front', 'side', 'top'];
        if (request.subject) {
          metadata.subject = request.subject;
        }
        break;

      case 'multi-grid':
        const frameCount = request.parameters.frameCount
          ? parseInt(request.parameters.frameCount)
          : 0;
        metadata.frameCount = frameCount;
        metadata.gridDimensions = this.calculateGridDimensions(frameCount);
        break;

      case 'style-comparison':
        metadata.stylesUsed = request.parameters.styles
          ? request.parameters.styles.split(',')
          : [];
        metadata.styleCount = 5;
        break;

      case 'narrative-progression':
        const progressionCount = request.parameters.frameCount
          ? parseInt(request.parameters.frameCount)
          : 0;
        metadata.frameCount = progressionCount;
        if (request.script) {
          metadata.scriptLength = request.script.length;
        }
        break;
    }

    return metadata;
  }

  /**
   * Calculate optimal grid dimensions for N frames
   */
  private calculateGridDimensions(frameCount: number): string {
    if (frameCount < 2 || frameCount > 12) {
      throw new Error('Frame count must be between 2 and 12');
    }

    // Calculate optimal grid dimensions
    const dimensions: Record<number, string> = {
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

    return dimensions[frameCount] || '2x1';
  }

  /**
   * Select N distinct styles from style library
   */
  selectDistinctStyles(count: number): string[] {
    if (count < 1 || count > STYLE_LIBRARY.length) {
      throw new Error(`Style count must be between 1 and ${STYLE_LIBRARY.length}`);
    }

    // Shuffle and select
    const shuffled = [...STYLE_LIBRARY].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Get generation history for a user
   */
  async getGenerationHistory(userId: number, limit: number = 20): Promise<GenerationResult[]> {
    const history = await prisma.generationHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return history.map((h) => ({
      id: h.id,
      userId: h.userId,
      type: h.type,
      prompt: h.prompt,
      images: h.images,
      metadata: h.metadata as Record<string, any>,
      createdAt: h.createdAt,
    }));
  }

  /**
   * Get generation by ID
   */
  async getGenerationById(generationId: string): Promise<GenerationResult | null> {
    const generation = await prisma.generationHistory.findUnique({
      where: { id: generationId },
    });

    if (!generation) {
      return null;
    }

    return {
      id: generation.id,
      userId: generation.userId,
      type: generation.type,
      prompt: generation.prompt,
      images: generation.images,
      metadata: generation.metadata as Record<string, any>,
      createdAt: generation.createdAt,
    };
  }

  /**
   * Delete generation history
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
}

export const imageGenerationService = new ImageGenerationService();
