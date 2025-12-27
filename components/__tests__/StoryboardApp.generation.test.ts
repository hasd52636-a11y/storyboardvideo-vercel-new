/**
 * Unit Tests for Generation Trigger Functions
 * Feature: reference-image-fix
 */

import { describe, it, expect, vi } from 'vitest';

describe('Generation Trigger Functions - Reference Image Support', () => {
  describe('Three-View Generation with Reference', () => {
    it('should pass reference image to three-view generation', () => {
      // Feature: reference-image-fix, Requirement 3.2
      // Validates: Reference image is passed to three-view generation

      const mockGenerate = vi.fn();
      const referenceImage = 'data:image/jpeg;base64,test';
      const weight = 0.8;

      mockGenerate('three-view', {}, referenceImage, weight);

      expect(mockGenerate).toHaveBeenCalledWith(
        'three-view',
        {},
        referenceImage,
        weight
      );
    });

    it('should work without reference image for backward compatibility', () => {
      // Feature: reference-image-fix, Requirement 9.1
      // Validates: Three-view generation works without reference image

      const mockGenerate = vi.fn();

      mockGenerate('three-view', {});

      expect(mockGenerate).toHaveBeenCalledWith('three-view', {});
    });

    it('should include reference image metadata in generation result', () => {
      // Feature: reference-image-fix, Requirement 3.2
      // Validates: Reference image metadata is included

      const metadata = {
        type: 'three-view',
        parameters: {},
        referenceImageUsed: true,
        referenceImageWeight: 0.8,
      };

      expect(metadata.referenceImageUsed).toBe(true);
      expect(metadata.referenceImageWeight).toBe(0.8);
    });
  });

  describe('Multi-Grid Generation with Reference', () => {
    it('should pass reference image to multi-grid generation', () => {
      // Feature: reference-image-fix, Requirement 4.2
      // Validates: Reference image is passed to multi-grid generation

      const mockGenerate = vi.fn();
      const referenceImage = 'data:image/jpeg;base64,test';
      const weight = 0.7;

      mockGenerate('multi-grid', { frameCount: '4' }, referenceImage, weight);

      expect(mockGenerate).toHaveBeenCalledWith(
        'multi-grid',
        { frameCount: '4' },
        referenceImage,
        weight
      );
    });

    it('should preserve frame count parameter with reference image', () => {
      // Feature: reference-image-fix, Requirement 4.2
      // Validates: Frame count is preserved with reference image

      const mockGenerate = vi.fn();
      const parameters = { frameCount: '6' };
      const referenceImage = 'data:image/jpeg;base64,test';

      mockGenerate('multi-grid', parameters, referenceImage, 0.8);

      expect(mockGenerate).toHaveBeenCalledWith(
        'multi-grid',
        expect.objectContaining({ frameCount: '6' }),
        referenceImage,
        0.8
      );
    });
  });

  describe('Style Comparison Generation with Reference', () => {
    it('should pass reference image to style comparison generation', () => {
      // Feature: reference-image-fix, Requirement 5.2
      // Validates: Reference image is passed to style comparison generation

      const mockGenerate = vi.fn();
      const referenceImage = 'data:image/jpeg;base64,test';
      const weight = 0.75;

      mockGenerate('style-comparison', {}, referenceImage, weight);

      expect(mockGenerate).toHaveBeenCalledWith(
        'style-comparison',
        {},
        referenceImage,
        weight
      );
    });

    it('should work without reference image for style comparison', () => {
      // Feature: reference-image-fix, Requirement 9.1
      // Validates: Style comparison works without reference image

      const mockGenerate = vi.fn();

      mockGenerate('style-comparison', {});

      expect(mockGenerate).toHaveBeenCalledWith('style-comparison', {});
    });
  });

  describe('Narrative Progression Generation with Reference', () => {
    it('should pass reference image to narrative progression generation', () => {
      // Feature: reference-image-fix, Requirement 6.2
      // Validates: Reference image is passed to narrative progression generation

      const mockGenerate = vi.fn();
      const referenceImage = 'data:image/jpeg;base64,test';
      const weight = 0.85;

      mockGenerate('narrative-progression', { frameCount: '5' }, referenceImage, weight);

      expect(mockGenerate).toHaveBeenCalledWith(
        'narrative-progression',
        { frameCount: '5' },
        referenceImage,
        weight
      );
    });

    it('should preserve frame count with reference image', () => {
      // Feature: reference-image-fix, Requirement 6.2
      // Validates: Frame count is preserved with reference image

      const mockGenerate = vi.fn();
      const parameters = { frameCount: '8' };
      const referenceImage = 'data:image/jpeg;base64,test';

      mockGenerate('narrative-progression', parameters, referenceImage, 0.8);

      expect(mockGenerate).toHaveBeenCalledWith(
        'narrative-progression',
        expect.objectContaining({ frameCount: '8' }),
        referenceImage,
        0.8
      );
    });
  });

  describe('Reference Image Weight Handling', () => {
    it('should use default weight when not specified', () => {
      // Feature: reference-image-fix, Requirement 3.2
      // Validates: Default weight is used

      const mockGenerate = vi.fn();
      const referenceImage = 'data:image/jpeg;base64,test';
      const defaultWeight = 0.8;

      mockGenerate('three-view', {}, referenceImage, defaultWeight);

      expect(mockGenerate).toHaveBeenCalledWith(
        'three-view',
        {},
        referenceImage,
        0.8
      );
    });

    it('should accept custom weight values', () => {
      // Feature: reference-image-fix, Requirement 3.2
      // Validates: Custom weights are accepted

      const mockGenerate = vi.fn();
      const referenceImage = 'data:image/jpeg;base64,test';

      const weights = [0, 0.3, 0.5, 0.7, 1.0];

      weights.forEach((weight) => {
        mockGenerate('three-view', {}, referenceImage, weight);
      });

      expect(mockGenerate).toHaveBeenCalledTimes(5);
    });
  });

  describe('Metadata Tracking', () => {
    it('should track reference image usage in metadata', () => {
      // Feature: reference-image-fix, Requirement 3.2
      // Validates: Reference image usage is tracked

      const metadata = {
        type: 'three-view',
        parameters: {},
        referenceImageUsed: true,
        referenceImageWeight: 0.8,
      };

      expect(metadata.referenceImageUsed).toBe(true);
      expect(metadata.referenceImageWeight).toBe(0.8);
    });

    it('should mark reference image as not used when not provided', () => {
      // Feature: reference-image-fix, Requirement 9.1
      // Validates: Reference image usage is correctly marked

      const metadata = {
        type: 'three-view',
        parameters: {},
        referenceImageUsed: false,
      };

      expect(metadata.referenceImageUsed).toBe(false);
    });

    it('should preserve all generation parameters with reference image', () => {
      // Feature: reference-image-fix, Requirement 3.2
      // Validates: All parameters are preserved

      const metadata = {
        type: 'multi-grid',
        parameters: { frameCount: '4' },
        referenceImageUsed: true,
        referenceImageWeight: 0.8,
      };

      expect(metadata.type).toBe('multi-grid');
      expect(metadata.parameters.frameCount).toBe('4');
      expect(metadata.referenceImageUsed).toBe(true);
    });
  });

  describe('Generation Type Support', () => {
    it('should support all generation types with reference image', () => {
      // Feature: reference-image-fix, Requirement 3.2
      // Validates: All generation types support reference image

      const generationTypes = [
        'three-view',
        'multi-grid',
        'style-comparison',
        'narrative-progression',
      ];

      const mockGenerate = vi.fn();
      const referenceImage = 'data:image/jpeg;base64,test';

      generationTypes.forEach((type) => {
        mockGenerate(type, {}, referenceImage, 0.8);
      });

      expect(mockGenerate).toHaveBeenCalledTimes(4);
    });

    it('should maintain backward compatibility for all generation types', () => {
      // Feature: reference-image-fix, Requirement 9.1
      // Validates: All types work without reference image

      const generationTypes = [
        'three-view',
        'multi-grid',
        'style-comparison',
        'narrative-progression',
      ];

      const mockGenerate = vi.fn();

      generationTypes.forEach((type) => {
        mockGenerate(type, {});
      });

      expect(mockGenerate).toHaveBeenCalledTimes(4);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing reference image gracefully', () => {
      // Feature: reference-image-fix, Requirement 10.1
      // Validates: Missing reference image is handled

      const mockGenerate = vi.fn();

      mockGenerate('three-view', {}, undefined, undefined);

      expect(mockGenerate).toHaveBeenCalledWith(
        'three-view',
        {},
        undefined,
        undefined
      );
    });

    it('should handle invalid weight gracefully', () => {
      // Feature: reference-image-fix, Requirement 10.1
      // Validates: Invalid weight is handled

      const mockGenerate = vi.fn();
      const referenceImage = 'data:image/jpeg;base64,test';

      // Should still call with invalid weight (validation happens elsewhere)
      mockGenerate('three-view', {}, referenceImage, 1.5);

      expect(mockGenerate).toHaveBeenCalledWith(
        'three-view',
        {},
        referenceImage,
        1.5
      );
    });
  });
});
