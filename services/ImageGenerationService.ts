/**
 * Image Generation Service
 * Handles image generation requests and API integration
 */

import { prisma } from '@/lib/prisma';
import { promptEngine } from './PromptEngine';
import { ErrorHandler, ErrorCode, AppError } from './api/ErrorHandler';

export type GenerationType = 'three-view' | 'multi-grid' | 'style-comparison' | 'narrative-progression';

export interface GenerationRequest {
  type: GenerationType;
  userId: number;
  template: string;
  parameters: Record<string, string>;
  subject?: string;
  currentImage?: string;
  script?: string;
  referenceImage?: string;  // NEW: base64 or URL
  referenceImageWeight?: number;  // NEW: 0.0-1.0, default 0.8
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
   * Generate images based on request with comprehensive error handling
   */
  async generateImages(request: GenerationRequest): Promise<GenerationResult> {
    try {
      // Validate request
      if (!request.template || request.template.trim().length === 0) {
        throw new AppError(
          ErrorCode.INVALID_INPUT,
          'Template is required',
          false
        );
      }

      // Validate reference image if provided
      let referenceImageError: string | undefined;
      if (request.referenceImage) {
        const validationResult = await this.validateReferenceImage(request.referenceImage);
        if (!validationResult.valid) {
          referenceImageError = validationResult.error;
          console.warn(`Reference image validation warning: ${referenceImageError}`);
          // Don't throw - allow fallback to text-only generation
          request.referenceImage = undefined;
          request.referenceImageWeight = undefined;
        }
      }

      // Construct prompt
      const prompt = this.constructPrompt(request);

      // Call API with reference image and error handling
      let images: string[] = [];
      let apiError: string | undefined;

      try {
        images = await this.callImageGenerationAPI(
          prompt,
          request.type,
          request.referenceImage,
          request.referenceImageWeight
        );
      } catch (error) {
        apiError = error instanceof Error ? error.message : String(error);
        console.error(`API error during generation: ${apiError}`);

        // Check if error is due to reference image
        if (request.referenceImage && apiError.toLowerCase().includes('reference')) {
          console.log('API rejected reference image. Retrying with text-only generation...');
          try {
            images = await this.callImageGenerationAPI(
              prompt,
              request.type,
              undefined,
              undefined
            );
            // Clear reference image from request since API doesn't support it
            request.referenceImage = undefined;
            request.referenceImageWeight = undefined;
          } catch (retryError) {
            const retryErrorMsg = retryError instanceof Error ? retryError.message : String(retryError);
            throw new AppError(
              ErrorCode.GENERATION_FAILED,
              `Image generation failed: ${retryErrorMsg}`,
              true
            );
          }
        } else {
          throw error;
        }
      }

      // Persist generation history
      const metadata = this.buildMetadata(request);
      if (referenceImageError) {
        metadata.referenceImageValidationWarning = referenceImageError;
      }
      if (apiError) {
        metadata.apiError = apiError;
      }

      const result = await prisma.generationHistory.create({
        data: {
          userId: request.userId,
          type: request.type,
          prompt,
          images,
          metadata,
          referenceImage: request.referenceImage,
          referenceImageWeight: request.referenceImageWeight,
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
    } catch (error) {
      ErrorHandler.logError(error, 'ImageGenerationService.generateImages');

      if (error instanceof AppError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : 'Unknown error during image generation';
      throw new AppError(
        ErrorCode.GENERATION_FAILED,
        ErrorHandler.getUserFriendlyMessage(message),
        true
      );
    }
  }

  /**
   * Construct prompt from template and parameters with error handling
   */
  private constructPrompt(request: GenerationRequest): string {
    try {
      return promptEngine.renderPrompt(request.template, request.parameters);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError(
        ErrorCode.TEMPLATE_ERROR,
        `Failed to construct prompt: ${message}`,
        false
      );
    }
  }

  /**
   * Call image generation API with retry logic for transient failures
   */
  private async callImageGenerationAPI(
    prompt: string,
    type: GenerationType,
    referenceImage?: string,
    referenceImageWeight?: number
  ): Promise<string[]> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // TODO: Implement actual API calls to Sora/Gemini
        // For now, return placeholder images
        console.log(`Calling API for ${type} with prompt: ${prompt}`);
        if (referenceImage) {
          console.log(`Reference image provided (weight: ${referenceImageWeight || 0.8})`);
        }

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
            throw new AppError(
              ErrorCode.INVALID_PARAMETER,
              `Unknown generation type: ${type}`,
              false
            );
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Check if error is retryable
        const isRetryable = this.isRetryableError(lastError);
        if (!isRetryable || attempt === maxRetries) {
          throw lastError;
        }

        // Exponential backoff
        const delay = 1000 * Math.pow(2, attempt - 1);
        console.log(
          `Retry attempt ${attempt}/${maxRetries} after ${delay}ms. Error: ${lastError.message}`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('API call failed');
  }

  /**
   * Determine if an error is retryable
   */
  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    const retryablePatterns = [
      'timeout',
      'econnrefused',
      'econnreset',
      'etimedout',
      'temporarily unavailable',
      'rate limit',
      'too many requests',
      '429',
      '503',
      '504',
    ];

    return retryablePatterns.some((pattern) => message.includes(pattern));
  }

  /**
   * Build metadata for generation
   */
  private buildMetadata(request: GenerationRequest): Record<string, any> {
    const metadata: Record<string, any> = {
      type: request.type,
      timestamp: new Date().toISOString(),
      referenceImageUsed: !!request.referenceImage,
    };

    if (request.referenceImage) {
      metadata.referenceImageWeight = request.referenceImageWeight || 0.8;
    }

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
   * Validate reference image with comprehensive error handling
   */
  private async validateReferenceImage(
    referenceImage: string
  ): Promise<{ valid: boolean; error?: string; code?: ErrorCode }> {
    try {
      if (!referenceImage || referenceImage.trim().length === 0) {
        return {
          valid: false,
          error: 'Reference image cannot be empty',
          code: ErrorCode.INVALID_INPUT,
        };
      }

      // Check if it's a valid base64 or URL
      const isBase64 = referenceImage.startsWith('data:image/');
      const isUrl = referenceImage.startsWith('http://') || referenceImage.startsWith('https://');

      if (!isBase64 && !isUrl) {
        return {
          valid: false,
          error: 'Reference image must be a valid base64 string or URL',
          code: ErrorCode.INVALID_INPUT,
        };
      }

      // Validate base64 format
      if (isBase64) {
        const formatMatch = referenceImage.match(/^data:image\/([a-z]+);base64,/);
        if (!formatMatch) {
          return {
            valid: false,
            error: 'Invalid base64 image format. Expected: data:image/[format];base64,[data]',
            code: ErrorCode.INVALID_INPUT,
          };
        }

        const format = formatMatch[1].toLowerCase();
        const supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif'];
        if (!supportedFormats.includes(format)) {
          return {
            valid: false,
            error: `Unsupported image format: ${format}. Supported formats: JPEG, PNG, WebP, GIF`,
            code: ErrorCode.INVALID_INPUT,
          };
        }

        // Check size for base64
        const sizeBytes = Math.ceil((referenceImage.length * 3) / 4);
        const maxSizeBytes = 5 * 1024 * 1024; // 5MB
        if (sizeBytes > maxSizeBytes) {
          return {
            valid: false,
            error: `Reference image is too large (${this.formatBytes(sizeBytes)}). Maximum size: ${this.formatBytes(maxSizeBytes)}`,
            code: ErrorCode.INVALID_INPUT,
          };
        }
      }

      // Validate URL format
      if (isUrl) {
        try {
          new URL(referenceImage);
        } catch {
          return {
            valid: false,
            error: 'Invalid URL format for reference image',
            code: ErrorCode.INVALID_INPUT,
          };
        }
      }

      return { valid: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown validation error';
      return {
        valid: false,
        error: `Reference image validation failed: ${message}`,
        code: ErrorCode.INVALID_INPUT,
      };
    }
  }

  /**
   * Format bytes to human readable format
   */
  private formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
      Math.round((bytes / Math.pow(k, i)) * Math.pow(10, dm)) / Math.pow(10, dm) +
      ' ' +
      sizes[i]
    );
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
   * Get generation history for a user with error handling
   */
  async getGenerationHistory(userId: number, limit: number = 20): Promise<GenerationResult[]> {
    try {
      if (userId <= 0) {
        throw new AppError(
          ErrorCode.INVALID_PARAMETER,
          'Invalid user ID',
          false
        );
      }

      if (limit < 1 || limit > 100) {
        throw new AppError(
          ErrorCode.INVALID_PARAMETER,
          'Limit must be between 1 and 100',
          false
        );
      }

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
    } catch (error) {
      ErrorHandler.logError(error, 'ImageGenerationService.getGenerationHistory');

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to retrieve generation history',
        true
      );
    }
  }

  /**
   * Get generation by ID with error handling
   */
  async getGenerationById(generationId: string): Promise<GenerationResult | null> {
    try {
      if (!generationId || generationId.trim().length === 0) {
        throw new AppError(
          ErrorCode.INVALID_INPUT,
          'Generation ID is required',
          false
        );
      }

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
    } catch (error) {
      ErrorHandler.logError(error, 'ImageGenerationService.getGenerationById');

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to retrieve generation',
        true
      );
    }
  }

  /**
   * Delete generation history with error handling
   */
  async deleteGeneration(generationId: string, userId: number): Promise<void> {
    try {
      if (!generationId || generationId.trim().length === 0) {
        throw new AppError(
          ErrorCode.INVALID_INPUT,
          'Generation ID is required',
          false
        );
      }

      if (userId <= 0) {
        throw new AppError(
          ErrorCode.INVALID_PARAMETER,
          'Invalid user ID',
          false
        );
      }

      const generation = await prisma.generationHistory.findUnique({
        where: { id: generationId },
      });

      if (!generation) {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          'Generation not found',
          false
        );
      }

      if (generation.userId !== userId) {
        throw new AppError(
          ErrorCode.UNAUTHORIZED,
          'You do not have permission to delete this generation',
          false
        );
      }

      await prisma.generationHistory.delete({
        where: { id: generationId },
      });
    } catch (error) {
      ErrorHandler.logError(error, 'ImageGenerationService.deleteGeneration');

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        'Failed to delete generation',
        true
      );
    }
  }
}

export const imageGenerationService = new ImageGenerationService();
