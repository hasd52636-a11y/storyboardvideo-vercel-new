/**
 * Image Generation Integration Service
 * Handles integration between image cloning workflow and existing image generation
 */

import { imageGenerationService, GenerationRequest, GenerationResult } from './ImageGenerationService';
import { StoryboardItem } from '../types';

export interface CloneGenerationRequest {
  prompt: string;
  userId: number;
  referenceImage?: string;
  referenceImageWeight?: number;
  aspectRatio?: string;
}

export interface CloneGenerationResult {
  generationId: string;
  images: string[];
  prompt: string;
  storyboardCard: StoryboardItem;
  metadata: Record<string, any>;
}

export class ImageGenerationIntegrationService {
  /**
   * Generate images from analyzed prompt and create storyboard card
   */
  async generateClonedImages(request: CloneGenerationRequest): Promise<CloneGenerationResult> {
    try {
      // Validate request
      if (!request.prompt || request.prompt.trim().length === 0) {
        throw new Error('Prompt is required');
      }

      if (!request.userId || request.userId <= 0) {
        throw new Error('Valid user ID is required');
      }

      // Create generation request for existing service
      const generationRequest: GenerationRequest = {
        type: 'multi-grid',
        userId: request.userId,
        template: request.prompt,
        parameters: {
          frameCount: '1',
        },
        referenceImage: request.referenceImage,
        referenceImageWeight: request.referenceImageWeight || 0.8,
      };

      // Call existing image generation service
      const generationResult = await imageGenerationService.generateImages(generationRequest);

      // Create storyboard card from generation result
      const storyboardCard = this.createStoryboardCard(
        generationResult,
        request.prompt,
        request.aspectRatio
      );

      return {
        generationId: generationResult.id,
        images: generationResult.images,
        prompt: generationResult.prompt,
        storyboardCard,
        metadata: generationResult.metadata,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error during image generation';
      throw new Error(`Failed to generate cloned images: ${message}`);
    }
  }

  /**
   * Create storyboard card from generation result
   */
  private createStoryboardCard(
    generationResult: GenerationResult,
    prompt: string,
    aspectRatio?: string
  ): StoryboardItem {
    // Use first generated image as the card image
    const imageUrl = generationResult.images[0] || '';

    // Generate unique ID for the card
    const cardId = `clone-${generationResult.id}-${Date.now()}`;

    // Create storyboard card
    const card: StoryboardItem = {
      id: cardId,
      imageUrl,
      prompt,
      description: `Cloned from: ${prompt.substring(0, 100)}...`,
      x: 0,
      y: 0,
      width: 300,
      height: 200,
      isMain: false,
      filter: 'normal',
      order: 0,
      symbols: [],
      scale: 1,
      colorMode: 'color',
      aspectRatio: aspectRatio || '16:9',
      isLoading: false,
    };

    return card;
  }

  /**
   * Validate that generated images are compatible with storyboard
   */
  async validateGeneratedImages(images: string[]): Promise<boolean> {
    try {
      if (!images || images.length === 0) {
        throw new Error('No images provided');
      }

      // Check that all images are valid URLs or base64
      for (const image of images) {
        if (!image || image.trim().length === 0) {
          throw new Error('Empty image URL');
        }

        const isBase64 = image.startsWith('data:image/');
        const isUrl = image.startsWith('http://') || image.startsWith('https://');

        if (!isBase64 && !isUrl) {
          throw new Error(`Invalid image format: ${image.substring(0, 50)}`);
        }
      }

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown validation error';
      throw new Error(`Image validation failed: ${message}`);
    }
  }

  /**
   * Get generation history for user
   */
  async getGenerationHistory(userId: number, limit: number = 20): Promise<GenerationResult[]> {
    try {
      return await imageGenerationService.getGenerationHistory(userId, limit);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to retrieve generation history: ${message}`);
    }
  }

  /**
   * Get specific generation by ID
   */
  async getGenerationById(generationId: string): Promise<GenerationResult | null> {
    try {
      return await imageGenerationService.getGenerationById(generationId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to retrieve generation: ${message}`);
    }
  }

  /**
   * Delete generation
   */
  async deleteGeneration(generationId: string, userId: number): Promise<void> {
    try {
      await imageGenerationService.deleteGeneration(generationId, userId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete generation: ${message}`);
    }
  }

  /**
   * Calculate optimal card dimensions based on aspect ratio
   */
  calculateCardDimensions(
    aspectRatio: string,
    maxWidth: number = 300
  ): { width: number; height: number } {
    try {
      const [w, h] = aspectRatio.split(':').map(Number);

      if (!w || !h || isNaN(w) || isNaN(h)) {
        // Default to 16:9
        return {
          width: maxWidth,
          height: Math.round((maxWidth * 9) / 16),
        };
      }

      const ratio = w / h;
      return {
        width: maxWidth,
        height: Math.round(maxWidth / ratio),
      };
    } catch (error) {
      // Default to 16:9 on error
      return {
        width: maxWidth,
        height: Math.round((maxWidth * 9) / 16),
      };
    }
  }
}

export const imageGenerationIntegrationService = new ImageGenerationIntegrationService();
