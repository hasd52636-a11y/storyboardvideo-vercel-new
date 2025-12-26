/**
 * Property-Based Tests for Prompt Engine
 * Feature: storyboard-enhancement
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { PromptEngine } from '../PromptEngine';

describe('PromptEngine', () => {
  let engine: PromptEngine;

  beforeEach(() => {
    engine = new PromptEngine();
  });

  describe('Property 6: Template Placeholder Validation', () => {
    it('should reject templates missing required placeholders', async () => {
      // Feature: storyboard-enhancement, Property 6: Template Placeholder Validation
      // Validates: Requirements 9.3

      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.stringOf(fc.alphaNumericChar(), { minLength: 1, maxLength: 20 }), {
            minLength: 1,
            maxLength: 5,
          }),
          async (requiredPlaceholders) => {
            // Create a template with only some of the required placeholders
            const fullTemplate = requiredPlaceholders
              .map((p) => `{${p}}`)
              .join(' ');
            const missingIndex = Math.floor(Math.random() * requiredPlaceholders.length);
            const incompleteTemplate = requiredPlaceholders
              .filter((_, i) => i !== missingIndex)
              .map((p) => `{${p}}`)
              .join(' ');

            // Validation should fail for incomplete template
            const isValid = engine.validateTemplate(
              incompleteTemplate,
              requiredPlaceholders
            );

            expect(isValid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept templates with all required placeholders', async () => {
      // Feature: storyboard-enhancement, Property 6: Template Placeholder Validation
      // Validates: Requirements 9.3

      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.stringOf(fc.alphaNumericChar(), { minLength: 1, maxLength: 20 }), {
            minLength: 1,
            maxLength: 5,
          }),
          async (requiredPlaceholders) => {
            // Create a template with all required placeholders
            const template = requiredPlaceholders
              .map((p) => `{${p}}`)
              .join(' ');

            // Validation should pass
            const isValid = engine.validateTemplate(template, requiredPlaceholders);

            expect(isValid).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 7: Template Substitution Correctness', () => {
    it('should replace all placeholders with their corresponding values', async () => {
      // Feature: storyboard-enhancement, Property 7: Template Substitution Correctness
      // Validates: Requirements 9.2

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            subject: fc.stringOf(fc.alphaNumericChar(), { minLength: 1, maxLength: 50 }),
            style: fc.stringOf(fc.alphaNumericChar(), { minLength: 1, maxLength: 50 }),
            count: fc.integer({ min: 1, max: 100 }).map(String),
          }),
          async (values) => {
            const template = 'Generate {subject} in {style} style with {count} variations';
            const result = engine.renderPrompt(template, values);

            // Verify all placeholders are replaced
            expect(result).not.toContain('{subject}');
            expect(result).not.toContain('{style}');
            expect(result).not.toContain('{count}');

            // Verify values are present
            expect(result).toContain(values.subject);
            expect(result).toContain(values.style);
            expect(result).toContain(values.count);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should throw error when placeholder values are missing', async () => {
      // Feature: storyboard-enhancement, Property 7: Template Substitution Correctness
      // Validates: Requirements 9.2

      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.stringOf(fc.alphaNumericChar(), { minLength: 1, maxLength: 20 }), {
            minLength: 1,
            maxLength: 5,
          }),
          async (placeholders) => {
            const template = placeholders.map((p) => `{${p}}`).join(' ');
            const values: Record<string, string> = {};

            // Provide values for all but one placeholder
            for (let i = 0; i < placeholders.length - 1; i++) {
              values[placeholders[i]] = `value${i}`;
            }

            // Should throw error for missing placeholder
            expect(() => engine.renderPrompt(template, values)).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should parse template and extract placeholders', () => {
      const template = 'Generate {subject} in {style} style';
      const parsed = engine.parseTemplate(template);

      expect(parsed.template).toBe(template);
      expect(parsed.requiredPlaceholders).toContain('subject');
      expect(parsed.requiredPlaceholders).toContain('style');
      expect(parsed.requiredPlaceholders.length).toBe(2);
    });

    it('should extract unique placeholders only once', () => {
      const template = 'Generate {subject} and {subject} again';
      const parsed = engine.parseTemplate(template);

      expect(parsed.requiredPlaceholders).toEqual(['subject']);
    });

    it('should throw error when rendering with empty template', () => {
      expect(() => engine.renderPrompt('', { key: 'value' })).toThrow(
        'Template cannot be empty'
      );
    });

    it('should throw error when rendering with missing placeholder value', () => {
      const template = 'Generate {subject} in {style}';
      const values = { subject: 'cat' };

      expect(() => engine.renderPrompt(template, values)).toThrow(
        'Missing required placeholder value: {style}'
      );
    });

    it('should throw error when placeholder value is null', () => {
      const template = 'Generate {subject}';
      const values = { subject: null as any };

      expect(() => engine.renderPrompt(template, values)).toThrow();
    });

    it('should handle multiple occurrences of same placeholder', () => {
      const template = 'Generate {subject} and another {subject}';
      const values = { subject: 'cat' };

      const result = engine.renderPrompt(template, values);

      expect(result).toBe('Generate cat and another cat');
    });

    it('should validate template syntax', () => {
      expect(engine.hasValidSyntax('Generate {subject}')).toBe(true);
      expect(engine.hasValidSyntax('Generate {subject} and {style}')).toBe(true);
      expect(engine.hasValidSyntax('Generate {subject')).toBe(false);
      expect(engine.hasValidSyntax('Generate subject}')).toBe(false);
      expect(engine.hasValidSyntax('Generate {subject-name}')).toBe(false); // Invalid character
    });

    it('should extract placeholders from template', () => {
      const template = 'Generate {subject} in {style} with {count} items';
      const placeholders = engine.extractPlaceholders(template);

      expect(placeholders).toEqual(['subject', 'style', 'count']);
    });

    it('should handle template with no placeholders', () => {
      const template = 'Generate a simple image';
      const placeholders = engine.extractPlaceholders(template);

      expect(placeholders).toEqual([]);
    });

    it('should trim placeholder names', () => {
      const template = 'Generate { subject } in { style }';
      const parsed = engine.parseTemplate(template);

      expect(parsed.requiredPlaceholders).toContain('subject');
      expect(parsed.requiredPlaceholders).toContain('style');
    });

    it('should render template with numeric values', () => {
      const template = 'Generate {count} images';
      const values = { count: '5' };

      const result = engine.renderPrompt(template, values);

      expect(result).toBe('Generate 5 images');
    });
  });
});
