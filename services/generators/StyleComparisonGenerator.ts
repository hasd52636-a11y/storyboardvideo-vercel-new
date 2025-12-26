/**
 * Style Comparison Generator
 * Generates 5 variations of the same subject in different artistic styles
 */

import { promptEngine } from '../PromptEngine';

// Style library
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
  'renaissance',
  'baroque',
  'art deco',
  'pop art',
  'graffiti',
];

export interface StyleComparisonRequest {
  subject: string;
  template: string;
  styleCount?: number;
}

export interface StyleComparisonResult {
  prompts: string[];
  parameters: Record<string, string>;
  selectedStyles: string[];
}

export class StyleComparisonGenerator {
  /**
   * Select N distinct styles from style library
   */
  selectDistinctStyles(count: number = 5): string[] {
    if (count < 1 || count > STYLE_LIBRARY.length) {
      throw new Error(`Style count must be between 1 and ${STYLE_LIBRARY.length}`);
    }

    // Shuffle array and select
    const shuffled = [...STYLE_LIBRARY].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Generate style comparison prompts
   */
  generatePrompts(request: StyleComparisonRequest): StyleComparisonResult {
    // Validate input
    if (!request.subject || request.subject.trim().length === 0) {
      throw new Error('Subject is required');
    }

    if (!request.template || request.template.trim().length === 0) {
      throw new Error('Template is required');
    }

    // Select 5 distinct styles
    const styleCount = request.styleCount || 5;
    const selectedStyles = this.selectDistinctStyles(styleCount);

    // Generate prompts for each style
    const prompts: string[] = [];
    for (const style of selectedStyles) {
      const parameters = {
        subject: request.subject,
        style,
        styles: selectedStyles.join(', '),
      };

      try {
        const prompt = promptEngine.renderPrompt(request.template, parameters);
        prompts.push(prompt);
      } catch (error) {
        throw new Error(`Failed to generate prompt for style ${style}: ${(error as Error).message}`);
      }
    }

    return {
      prompts,
      parameters: {
        subject: request.subject,
        styles: selectedStyles.join(', '),
        styleCount: styleCount.toString(),
      },
      selectedStyles,
    };
  }

  /**
   * Validate style comparison request
   */
  validate(request: StyleComparisonRequest): boolean {
    if (!request.subject || request.subject.trim().length === 0) {
      return false;
    }

    if (!request.template || request.template.trim().length === 0) {
      return false;
    }

    // Check if template contains required placeholders
    const placeholders = promptEngine.extractPlaceholders(request.template);
    return placeholders.includes('subject');
  }

  /**
   * Get available styles
   */
  getAvailableStyles(): string[] {
    return [...STYLE_LIBRARY];
  }
}

export const styleComparisonGenerator = new StyleComparisonGenerator();
