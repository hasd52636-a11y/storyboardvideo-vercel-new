/**
 * Three-View Generator
 * Generates prompts for three-view (orthographic) generation
 */

import type { Symbol } from '@prisma/client';
import { promptEngine } from '../PromptEngine';

export interface ThreeViewRequest {
  symbol: Symbol;
  template: string;
}

export interface ThreeViewResult {
  prompt: string;
  parameters: Record<string, string>;
}

export class ThreeViewGenerator {
  /**
   * Generate three-view prompt from symbol
   */
  generatePrompt(request: ThreeViewRequest): ThreeViewResult {
    const { symbol, template } = request;

    // Build parameters for template substitution
    const parameters: Record<string, string> = {
      subject: symbol.name,
      description: symbol.description,
      views: 'front, side, top',
    };

    // Render prompt with parameters
    const prompt = promptEngine.renderPrompt(template, parameters);

    return {
      prompt,
      parameters,
    };
  }

  /**
   * Validate three-view request
   */
  validate(request: ThreeViewRequest): boolean {
    if (!request.symbol || !request.symbol.name) {
      throw new Error('Symbol name is required');
    }

    if (!request.template || request.template.trim().length === 0) {
      throw new Error('Template is required');
    }

    // Check if template has required placeholders
    const requiredPlaceholders = ['subject'];
    for (const placeholder of requiredPlaceholders) {
      if (!promptEngine.validateTemplate(request.template, [placeholder])) {
        throw new Error(`Template must contain {${placeholder}} placeholder`);
      }
    }

    return true;
  }

  /**
   * Get default template
   */
  getDefaultTemplate(): string {
    return 'Generate three orthographic views (front, side, top) of {subject}';
  }
}

export const threeViewGenerator = new ThreeViewGenerator();

</content>
