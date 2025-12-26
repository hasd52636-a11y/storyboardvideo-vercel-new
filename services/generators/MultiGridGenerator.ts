/**
 * Multi-Grid Generator
 * Generates N camera angles of the same subject/scene from different perspectives
 * Uses Camera Angle Library for intelligent angle selection
 */

import { promptEngine } from '../PromptEngine';
import { cameraAngleLibrary, CameraAngle } from './CameraAngleLibrary';

export interface MultiGridRequest {
  frameCount: number;
  template: string;
  subject: string;
  context?: string;
}

export interface MultiGridResult {
  prompt: string;
  parameters: Record<string, string>;
  gridDimensions: string;
  selectedAngles: CameraAngle[];
  angleDescriptions: string[];
}

export class MultiGridGenerator {
  /**
   * Validate frame count (2-12)
   */
  validateFrameCount(frameCount: number): boolean {
    return Number.isInteger(frameCount) && frameCount >= 2 && frameCount <= 12;
  }

  /**
   * Calculate optimal grid dimensions for N frames
   */
  calculateGridDimensions(frameCount: number): string {
    if (!this.validateFrameCount(frameCount)) {
      throw new Error('Frame count must be an integer between 2 and 12');
    }

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

    return dimensions[frameCount];
  }

  /**
   * Generate multi-grid prompt with camera angles
   */
  generatePrompt(request: MultiGridRequest): MultiGridResult {
    // Validate input
    if (!this.validateFrameCount(request.frameCount)) {
      throw new Error('Frame count must be an integer between 2 and 12');
    }

    if (!request.template || request.template.trim().length === 0) {
      throw new Error('Template is required');
    }

    if (!request.subject || request.subject.trim().length === 0) {
      throw new Error('Subject is required');
    }

    // Select camera angles intelligently
    const selectedAngles = cameraAngleLibrary.selectCameraAngles(request.frameCount);
    const angleDescriptions = cameraAngleLibrary.getAngleDescriptions(selectedAngles);

    // Calculate grid dimensions
    const gridDimensions = this.calculateGridDimensions(request.frameCount);

    // Build parameters with camera angle information
    const parameters = {
      frameCount: request.frameCount.toString(),
      gridDimensions,
      subject: request.subject,
      cameraAngles: selectedAngles.join(', '),
      angleDescriptions: angleDescriptions.join('\n'),
      ...(request.context && { context: request.context }),
    };

    // Render prompt
    const prompt = promptEngine.renderPrompt(request.template, parameters);

    return {
      prompt,
      parameters,
      gridDimensions,
      selectedAngles,
      angleDescriptions,
    };
  }

  /**
   * Validate multi-grid request
   */
  validate(request: MultiGridRequest): boolean {
    if (!this.validateFrameCount(request.frameCount)) {
      return false;
    }

    if (!request.template || request.template.trim().length === 0) {
      return false;
    }

    if (!request.subject || request.subject.trim().length === 0) {
      return false;
    }

    return true;
  }
}

export const multiGridGenerator = new MultiGridGenerator();
