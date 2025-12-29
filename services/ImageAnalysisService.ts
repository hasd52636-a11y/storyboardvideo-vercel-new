/**
 * Image Analysis Service
 * Analyzes images using the configured vision model and generates prompts
 */

export interface AnalysisResult {
  rawAnalysis: string;
  subject: string;
  composition: string;
  colorPalette: string;
  lighting: string;
  style: string;
  perspective: string;
  details: string;
  generatedPrompt: string;
}

export interface ImageAnalysisServiceConfig {
  timeout?: number;
  maxRetries?: number;
  apiKey?: string;
  provider?: string;
}

export class ImageAnalysisService {
  private config: ImageAnalysisServiceConfig;
  private retryCount: number = 0;

  constructor(config: ImageAnalysisServiceConfig = {}) {
    this.config = {
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      ...config,
    };
  }

  /**
   * Analyze image using vision model
   */
  async analyzeImage(imageData: Blob): Promise<string> {
    console.log('[ImageAnalysisService] Starting image analysis...');

    try {
      // Convert blob to base64
      const base64Image = await this.blobToBase64(imageData);

      // Send to vision model
      const analysis = await this.sendToVisionModel(base64Image);

      console.log('[ImageAnalysisService] Image analysis completed');
      return analysis;
    } catch (error) {
      console.error('[ImageAnalysisService] Image analysis failed:', error);
      throw error;
    }
  }

  /**
   * Generate prompt from analysis
   */
  async generatePrompt(analysis: string): Promise<string> {
    console.log('[ImageAnalysisService] Generating prompt from analysis...');

    try {
      // Parse analysis to extract key elements
      const result = this.parseAnalysis(analysis);

      // Generate structured prompt
      const prompt = this.buildPrompt(result);

      console.log('[ImageAnalysisService] Prompt generated successfully');
      return prompt;
    } catch (error) {
      console.error('[ImageAnalysisService] Prompt generation failed:', error);
      throw error;
    }
  }

  /**
   * Validate prompt quality
   */
  async validatePrompt(prompt: string): Promise<boolean> {
    console.log('[ImageAnalysisService] Validating prompt...');

    try {
      // Check if prompt is not empty
      if (!prompt || prompt.trim().length === 0) {
        console.warn('[ImageAnalysisService] Prompt is empty');
        return false;
      }

      // Check minimum length
      if (prompt.length < 10) {
        console.warn('[ImageAnalysisService] Prompt is too short');
        return false;
      }

      // Check maximum length
      if (prompt.length > 2000) {
        console.warn('[ImageAnalysisService] Prompt is too long');
        return false;
      }

      console.log('[ImageAnalysisService] Prompt validation passed');
      return true;
    } catch (error) {
      console.error('[ImageAnalysisService] Prompt validation failed:', error);
      return false;
    }
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Convert blob to base64 string (returns full data URI)
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Return full data URI (data:image/png;base64,xxxxx)
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Send image to vision model for analysis
   */
  private async sendToVisionModel(base64Image: string): Promise<string> {
    try {
      // Import the gemini service
      const { chatWithGemini } = await import('../geminiService');

      console.log('[ImageAnalysisService] Image data format:', base64Image.substring(0, 50) + '...');
      console.log('[ImageAnalysisService] Image data length:', base64Image.length);

      // Create analysis prompt
      const analysisPrompt = `Please analyze this image in detail and provide a comprehensive description that could be used to generate a similar image. Include:
1. Main subject and composition
2. Color palette and dominant colors
3. Lighting conditions and mood
4. Artistic style and technique
5. Perspective and framing
6. Any text or specific details
7. Overall atmosphere and feeling

Provide the analysis in a structured format that can be used as a basis for image generation.`;

      // Send to vision model
      // Note: base64Image is already a full data URI (data:image/png;base64,...)
      const messages = [
        {
          role: 'user',
          content: analysisPrompt,
          images: [base64Image],
        },
      ];

      console.log('[ImageAnalysisService] Sending image to vision model...');
      const response = await chatWithGemini(messages);

      console.log('[ImageAnalysisService] Vision model response received:', response?.substring(0, 100) + '...');

      if (!response) {
        throw new Error('No response from vision model');
      }

      return response;
    } catch (error) {
      console.error('[ImageAnalysisService] Vision model call failed:', error);
      throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse analysis text to extract key elements
   */
  private parseAnalysis(analysis: string): AnalysisResult {
    // Simple parsing - in production, this could be more sophisticated
    const result: AnalysisResult = {
      rawAnalysis: analysis,
      subject: this.extractSection(analysis, 'subject|main subject|主体'),
      composition: this.extractSection(analysis, 'composition|构图'),
      colorPalette: this.extractSection(analysis, 'color|palette|颜色|调色板'),
      lighting: this.extractSection(analysis, 'lighting|light|光线|照明'),
      style: this.extractSection(analysis, 'style|artistic|风格|艺术'),
      perspective: this.extractSection(analysis, 'perspective|framing|视角|框架'),
      details: this.extractSection(analysis, 'details|text|细节|文字'),
      generatedPrompt: '', // Will be filled by buildPrompt
    };

    return result;
  }

  /**
   * Extract section from analysis text
   */
  private extractSection(text: string, keywords: string): string {
    const keywordArray = keywords.split('|');
    const lines = text.split('\n');

    for (const line of lines) {
      for (const keyword of keywordArray) {
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
          // Return the line and next few lines as context
          const index = lines.indexOf(line);
          return lines.slice(index, Math.min(index + 3, lines.length)).join(' ').trim();
        }
      }
    }

    return '';
  }

  /**
   * Build structured prompt from analysis result
   */
  private buildPrompt(result: AnalysisResult): string {
    const parts: string[] = [];

    // Add subject
    if (result.subject) {
      parts.push(result.subject);
    }

    // Add composition
    if (result.composition) {
      parts.push(`Composition: ${result.composition}`);
    }

    // Add color palette
    if (result.colorPalette) {
      parts.push(`Color palette: ${result.colorPalette}`);
    }

    // Add lighting
    if (result.lighting) {
      parts.push(`Lighting: ${result.lighting}`);
    }

    // Add style
    if (result.style) {
      parts.push(`Style: ${result.style}`);
    }

    // Add perspective
    if (result.perspective) {
      parts.push(`Perspective: ${result.perspective}`);
    }

    // Add details
    if (result.details) {
      parts.push(`Details: ${result.details}`);
    }

    // If we have very little information, use the raw analysis
    if (parts.length === 0) {
      return result.rawAnalysis;
    }

    // Combine all parts into a coherent prompt
    const prompt = parts.join('. ').trim();

    // Ensure prompt ends with a period
    return prompt.endsWith('.') ? prompt : `${prompt}.`;
  }
}

export default ImageAnalysisService;
