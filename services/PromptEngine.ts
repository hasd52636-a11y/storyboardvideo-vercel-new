/**
 * Prompt Template Engine
 * Handles template parsing, validation, and rendering with placeholder substitution
 */

export interface PromptTemplate {
  template: string;
  requiredPlaceholders: string[];
  defaultPlaceholders: Record<string, string>;
}

export class PromptEngine {
  /**
   * Parse a template and extract placeholders
   * Placeholders are in format {placeholder_name}
   */
  parseTemplate(template: string): PromptTemplate {
    if (!template || template.trim().length === 0) {
      throw new Error('Template cannot be empty');
    }

    // Extract all placeholders using regex
    const placeholderRegex = /\{([^}]+)\}/g;
    const placeholders: string[] = [];
    let match;

    while ((match = placeholderRegex.exec(template)) !== null) {
      const placeholder = match[1].trim();
      if (!placeholders.includes(placeholder)) {
        placeholders.push(placeholder);
      }
    }

    return {
      template,
      requiredPlaceholders: placeholders,
      defaultPlaceholders: {},
    };
  }

  /**
   * Validate that a template contains all required placeholders
   */
  validateTemplate(template: string, requiredPlaceholders: string[]): boolean {
    if (!template || template.trim().length === 0) {
      return false;
    }

    // Check if all required placeholders are present in template
    for (const placeholder of requiredPlaceholders) {
      const placeholderPattern = new RegExp(`\\{${placeholder}\\}`);
      if (!placeholderPattern.test(template)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Render a template by substituting placeholders with values
   * Throws error if required placeholders are missing from values
   */
  renderPrompt(template: string, values: Record<string, string>): string {
    if (!template || template.trim().length === 0) {
      throw new Error('Template cannot be empty');
    }

    // Extract all placeholders from template
    const placeholderRegex = /\{([^}]+)\}/g;
    const requiredPlaceholders: string[] = [];
    let match;

    while ((match = placeholderRegex.exec(template)) !== null) {
      const placeholder = match[1].trim();
      if (!requiredPlaceholders.includes(placeholder)) {
        requiredPlaceholders.push(placeholder);
      }
    }

    // Check if all required placeholders have values
    for (const placeholder of requiredPlaceholders) {
      if (!(placeholder in values)) {
        throw new Error(`Missing required placeholder value: {${placeholder}}`);
      }

      if (values[placeholder] === undefined || values[placeholder] === null) {
        throw new Error(`Placeholder value cannot be null or undefined: {${placeholder}}`);
      }
    }

    // Substitute placeholders with values
    let result = template;
    for (const [key, value] of Object.entries(values)) {
      const placeholderPattern = new RegExp(`\\{${key}\\}`, 'g');
      result = result.replace(placeholderPattern, String(value));
    }

    return result;
  }

  /**
   * Extract placeholders from a template
   */
  extractPlaceholders(template: string): string[] {
    if (!template || template.trim().length === 0) {
      return [];
    }

    const placeholderRegex = /\{([^}]+)\}/g;
    const placeholders: string[] = [];
    let match;

    while ((match = placeholderRegex.exec(template)) !== null) {
      const placeholder = match[1].trim();
      if (!placeholders.includes(placeholder)) {
        placeholders.push(placeholder);
      }
    }

    return placeholders;
  }

  /**
   * Check if a template has valid placeholder syntax
   */
  hasValidSyntax(template: string): boolean {
    if (!template || template.trim().length === 0) {
      return false;
    }

    // Check for balanced braces
    let braceCount = 0;
    for (const char of template) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (braceCount < 0) return false;
    }

    if (braceCount !== 0) return false;

    // Check for valid placeholder format
    const placeholderRegex = /\{([^}]+)\}/g;
    let match;

    while ((match = placeholderRegex.exec(template)) !== null) {
      const placeholder = match[1].trim();
      // Placeholder should contain only alphanumeric characters and underscores
      if (!/^[a-zA-Z0-9_]+$/.test(placeholder)) {
        return false;
      }
    }

    return true;
  }
}

export const promptEngine = new PromptEngine();
