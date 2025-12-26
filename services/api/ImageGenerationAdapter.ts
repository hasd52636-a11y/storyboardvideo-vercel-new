/**
 * Image Generation API Adapter
 * Implements adapter pattern for multiple image generation APIs with fallback support
 */

import { ErrorHandler, ErrorCode, AppError } from './ErrorHandler';

export interface ImageGenerationAPIResponse {
  images: string[];
  success: boolean;
  error?: string;
}

export interface ImageGenerationAPIConfig {
  apiKey?: string;
  endpoint?: string;
  timeout?: number;
}

/**
 * Base adapter interface
 */
export interface IImageGenerationAdapter {
  name: string;
  isAvailable(): Promise<boolean>;
  generateImages(prompt: string, count?: number): Promise<ImageGenerationAPIResponse>;
}

/**
 * Primary API Adapter (Sora/Gemini)
 */
export class PrimaryAPIAdapter implements IImageGenerationAdapter {
  name = 'Primary API (Sora/Gemini)';
  private apiKey: string;
  private endpoint: string;
  private timeout: number;

  constructor(config: ImageGenerationAPIConfig = {}) {
    this.apiKey = config.apiKey || process.env.GEMINI_API_KEY || '';
    this.endpoint = config.endpoint || 'https://api.gemini.example.com/generate';
    this.timeout = config.timeout || 30000;
  }

  async isAvailable(): Promise<boolean> {
    // Check if API key is configured
    return !!this.apiKey;
  }

  async generateImages(prompt: string, count: number = 1): Promise<ImageGenerationAPIResponse> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          images: [],
          error: 'API key not configured',
        };
      }

      // TODO: Implement actual API call to Sora/Gemini
      console.log(`[Primary API] Generating ${count} images with prompt: ${prompt}`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Return placeholder images
      const images = Array.from({ length: count }, (_, i) => `image-${i + 1}.jpg`);

      return {
        success: true,
        images,
      };
    } catch (error) {
      return {
        success: false,
        images: [],
        error: `Primary API error: ${(error as Error).message}`,
      };
    }
  }
}

/**
 * Fallback API Adapter 1 (Nanobanana)
 */
export class NanobanaAPIAdapter implements IImageGenerationAdapter {
  name = 'Nanobanana API';
  private apiKey: string;
  private endpoint: string;
  private timeout: number;

  constructor(config: ImageGenerationAPIConfig = {}) {
    this.apiKey = config.apiKey || process.env.NANOBANANA_API_KEY || '';
    this.endpoint = config.endpoint || 'https://api.nanobanana.example.com/generate';
    this.timeout = config.timeout || 30000;
  }

  async isAvailable(): Promise<boolean> {
    // Check if API key is configured
    return !!this.apiKey;
  }

  async generateImages(prompt: string, count: number = 1): Promise<ImageGenerationAPIResponse> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          images: [],
          error: 'Nanobanana API key not configured',
        };
      }

      // TODO: Implement actual API call to Nanobanana
      console.log(`[Nanobanana API] Generating ${count} images with prompt: ${prompt}`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Return placeholder images
      const images = Array.from({ length: count }, (_, i) => `nanobanana-image-${i + 1}.jpg`);

      return {
        success: true,
        images,
      };
    } catch (error) {
      return {
        success: false,
        images: [],
        error: `Nanobanana API error: ${(error as Error).message}`,
      };
    }
  }
}

/**
 * Fallback API Adapter 2 (即梦)
 */
export class JiMengAPIAdapter implements IImageGenerationAdapter {
  name = '即梦 API';
  private apiKey: string;
  private endpoint: string;
  private timeout: number;

  constructor(config: ImageGenerationAPIConfig = {}) {
    this.apiKey = config.apiKey || process.env.JIMENG_API_KEY || '';
    this.endpoint = config.endpoint || 'https://api.jimeng.example.com/generate';
    this.timeout = config.timeout || 30000;
  }

  async isAvailable(): Promise<boolean> {
    // Check if API key is configured
    return !!this.apiKey;
  }

  async generateImages(prompt: string, count: number = 1): Promise<ImageGenerationAPIResponse> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          images: [],
          error: '即梦 API key not configured',
        };
      }

      // TODO: Implement actual API call to 即梦
      console.log(`[即梦 API] Generating ${count} images with prompt: ${prompt}`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Return placeholder images
      const images = Array.from({ length: count }, (_, i) => `jimeng-image-${i + 1}.jpg`);

      return {
        success: true,
        images,
      };
    } catch (error) {
      return {
        success: false,
        images: [],
        error: `即梦 API error: ${(error as Error).message}`,
      };
    }
  }
}

/**
 * API Manager with fallback support
 */
export class APIManager {
  private adapters: IImageGenerationAdapter[];
  private maxRetries: number;

  constructor(adapters?: IImageGenerationAdapter[], maxRetries: number = 3) {
    this.adapters = adapters || [
      new PrimaryAPIAdapter(),
      new NanobanaAPIAdapter(),
      new JiMengAPIAdapter(),
    ];
    this.maxRetries = maxRetries;
  }

  /**
   * Generate images with automatic fallback
   */
  async generateImages(prompt: string, count: number = 1): Promise<ImageGenerationAPIResponse> {
    const errors: string[] = [];

    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      throw new AppError(
        ErrorCode.INVALID_INPUT,
        'Prompt cannot be empty',
        false
      );
    }

    if (count < 1 || count > 10) {
      throw new AppError(
        ErrorCode.INVALID_PARAMETER,
        'Image count must be between 1 and 10',
        false,
        { count }
      );
    }

    // Try each adapter in order
    for (const adapter of this.adapters) {
      try {
        const isAvailable = await adapter.isAvailable();
        if (!isAvailable) {
          errors.push(`${adapter.name}: Not available`);
          continue;
        }

        console.log(`Attempting to generate images with ${adapter.name}`);
        const response = await ErrorHandler.withRetry(
          () => adapter.generateImages(prompt, count),
          this.maxRetries,
          1000
        );

        if (response.success) {
          console.log(`Successfully generated images with ${adapter.name}`);
          return response;
        } else {
          errors.push(`${adapter.name}: ${response.error}`);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        errors.push(`${adapter.name}: ${errorMsg}`);
        ErrorHandler.logError(error, `ImageGeneration with ${adapter.name}`);
      }
    }

    // All adapters failed
    const errorMessage = `All image generation APIs failed. Errors: ${errors.join('; ')}`;
    throw new AppError(
      ErrorCode.GENERATION_FAILED,
      ErrorHandler.getUserFriendlyMessage(errorMessage),
      true,
      { errors }
    );
  }

  /**
   * Add a new adapter
   */
  addAdapter(adapter: IImageGenerationAdapter): void {
    this.adapters.push(adapter);
  }

  /**
   * Get list of available adapters
   */
  async getAvailableAdapters(): Promise<string[]> {
    const available: string[] = [];

    for (const adapter of this.adapters) {
      if (await adapter.isAvailable()) {
        available.push(adapter.name);
      }
    }

    return available;
  }
}

// Export singleton instance
export const apiManager = new APIManager();
