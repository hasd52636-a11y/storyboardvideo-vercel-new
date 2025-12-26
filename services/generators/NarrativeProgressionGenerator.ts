/**
 * Narrative Progression Generator
 * Generates N sequential frames showing story progression
 */

import { promptEngine } from '../PromptEngine';

export interface NarrativeProgressionRequest {
  frameCount: number;
  template: string;
  currentImage?: string;
  script?: string;
  context?: string;
}

export interface NarrativeProgressionResult {
  prompt: string;
  parameters: Record<string, string>;
  frameSequence: number[];
}

export class NarrativeProgressionGenerator {
  /**
   * Validate frame count (1-12)
   */
  validateFrameCount(frameCount: number): boolean {
    return Number.isInteger(frameCount) && frameCount >= 1 && frameCount <= 12;
  }

  /**
   * Generate narrative progression prompt
   */
  generatePrompt(request: NarrativeProgressionRequest): NarrativeProgressionResult {
    // Validate input
    if (!this.validateFrameCount(request.frameCount)) {
      throw new Error('Frame count must be an integer between 1 and 12');
    }

    if (!request.template || request.template.trim().length === 0) {
      throw new Error('Template is required');
    }

    // Build context from current image and script
    let currentContext = request.context || '';
    if (request.currentImage) {
      currentContext += `Current image: ${request.currentImage}. `;
    }
    if (request.script) {
      currentContext += `Script: ${request.script}`;
    }

    if (!currentContext.trim()) {
      throw new Error('Either context, currentImage, or script is required');
    }

    // Build parameters
    const parameters = {
      frameCount: request.frameCount.toString(),
      currentContext: currentContext.trim(),
    };

    // Render prompt
    const prompt = promptEngine.renderPrompt(request.template, parameters);

    // Generate frame sequence
    const frameSequence = Array.from({ length: request.frameCount }, (_, i) => i + 1);

    return {
      prompt,
      parameters,
      frameSequence,
    };
  }

  /**
   * Validate narrative progression request
   */
  validate(request: NarrativeProgressionRequest): boolean {
    if (!this.validateFrameCount(request.frameCount)) {
      return false;
    }

    if (!request.template || request.template.trim().length === 0) {
      return false;
    }

    // Check if template contains required placeholders
    const placeholders = promptEngine.extractPlaceholders(request.template);
    return placeholders.includes('frameCount') && placeholders.includes('currentContext');
  }

  /**
   * Generate frame sequence for N frames
   */
  generateFrameSequence(frameCount: number): number[] {
    if (!this.validateFrameCount(frameCount)) {
      throw new Error('Frame count must be an integer between 1 and 12');
    }

    return Array.from({ length: frameCount }, (_, i) => i + 1);
  }
}

export const narrativeProgressionGenerator = new NarrativeProgressionGenerator();
