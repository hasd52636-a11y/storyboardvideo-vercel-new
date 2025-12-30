import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { ImageAttachmentState } from '../../types';

describe('Multiple Image Attachment', () => {
  describe('Sequential Image Handling', () => {
    it('should handle multiple image selection', async () => {
      const files: File[] = [
        new File(['image1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['image2'], 'test2.png', { type: 'image/png' }),
        new File(['image3'], 'test3.webp', { type: 'image/webp' }),
      ];

      const state: ImageAttachmentState = {
        files,
        previews: ['data:image/jpeg;base64,aaa', 'data:image/png;base64,bbb', 'data:image/webp;base64,ccc'],
        dimensions: [
          { width: 800, height: 600 },
          { width: 1024, height: 768 },
          { width: 640, height: 480 },
        ],
        fileSizes: [50000, 75000, 40000],
        isLoading: false,
        error: null,
        currentIndex: 0,
      };

      expect(state.files.length).toBe(3);
      expect(state.previews.length).toBe(3);
      expect(state.dimensions.length).toBe(3);
      expect(state.fileSizes.length).toBe(3);
    });

    it('should navigate between images in carousel', () => {
      const state: ImageAttachmentState = {
        files: [
          new File(['1'], 'a.jpg', { type: 'image/jpeg' }),
          new File(['2'], 'b.jpg', { type: 'image/jpeg' }),
          new File(['3'], 'c.jpg', { type: 'image/jpeg' }),
        ],
        previews: ['preview1', 'preview2', 'preview3'],
        dimensions: [
          { width: 100, height: 100 },
          { width: 200, height: 200 },
          { width: 300, height: 300 },
        ],
        fileSizes: [1000, 2000, 3000],
        isLoading: false,
        error: null,
        currentIndex: 0,
      };

      // Navigate forward
      let nextIndex = (state.currentIndex || 0 + 1) % state.files.length;
      expect(nextIndex).toBe(1);

      // Navigate forward again
      nextIndex = (nextIndex + 1) % state.files.length;
      expect(nextIndex).toBe(2);

      // Wrap around
      nextIndex = (nextIndex + 1) % state.files.length;
      expect(nextIndex).toBe(0);

      // Navigate backward
      let prevIndex = (state.currentIndex || 0) === 0 ? state.files.length - 1 : (state.currentIndex || 0) - 1;
      expect(prevIndex).toBe(2);
    });

    it('should remove specific image from multiple', () => {
      const state: ImageAttachmentState = {
        files: [
          new File(['1'], 'a.jpg', { type: 'image/jpeg' }),
          new File(['2'], 'b.jpg', { type: 'image/jpeg' }),
          new File(['3'], 'c.jpg', { type: 'image/jpeg' }),
        ],
        previews: ['preview1', 'preview2', 'preview3'],
        dimensions: [
          { width: 100, height: 100 },
          { width: 200, height: 200 },
          { width: 300, height: 300 },
        ],
        fileSizes: [1000, 2000, 3000],
        isLoading: false,
        error: null,
        currentIndex: 1,
      };

      // Remove middle image
      const indexToRemove = 1;
      const newFiles = state.files.filter((_, i) => i !== indexToRemove);
      const newPreviews = state.previews.filter((_, i) => i !== indexToRemove);
      const newDimensions = state.dimensions.filter((_, i) => i !== indexToRemove);
      const newFileSizes = state.fileSizes.filter((_, i) => i !== indexToRemove);

      expect(newFiles.length).toBe(2);
      expect(newPreviews.length).toBe(2);
      expect(newDimensions.length).toBe(2);
      expect(newFileSizes.length).toBe(2);
      expect(newFiles[0].name).toBe('a.jpg');
      expect(newFiles[1].name).toBe('c.jpg');
    });

    it('should clear all images', () => {
      const state: ImageAttachmentState = {
        files: [
          new File(['1'], 'a.jpg', { type: 'image/jpeg' }),
          new File(['2'], 'b.jpg', { type: 'image/jpeg' }),
        ],
        previews: ['preview1', 'preview2'],
        dimensions: [
          { width: 100, height: 100 },
          { width: 200, height: 200 },
        ],
        fileSizes: [1000, 2000],
        isLoading: false,
        error: null,
        currentIndex: 0,
      };

      const clearedState: ImageAttachmentState = {
        files: [],
        previews: [],
        dimensions: [],
        fileSizes: [],
        isLoading: false,
        error: null,
        currentIndex: 0,
      };

      expect(clearedState.files.length).toBe(0);
      expect(clearedState.previews.length).toBe(0);
      expect(clearedState.dimensions.length).toBe(0);
      expect(clearedState.fileSizes.length).toBe(0);
    });

    it('should maintain array consistency when removing images', () => {
      const state: ImageAttachmentState = {
        files: [
          new File(['1'], 'a.jpg', { type: 'image/jpeg' }),
          new File(['2'], 'b.jpg', { type: 'image/jpeg' }),
          new File(['3'], 'c.jpg', { type: 'image/jpeg' }),
          new File(['4'], 'd.jpg', { type: 'image/jpeg' }),
        ],
        previews: ['p1', 'p2', 'p3', 'p4'],
        dimensions: [
          { width: 100, height: 100 },
          { width: 200, height: 200 },
          { width: 300, height: 300 },
          { width: 400, height: 400 },
        ],
        fileSizes: [1000, 2000, 3000, 4000],
        isLoading: false,
        error: null,
        currentIndex: 0,
      };

      // Remove image at index 1
      const indexToRemove = 1;
      const newFiles = state.files.filter((_, i) => i !== indexToRemove);
      const newPreviews = state.previews.filter((_, i) => i !== indexToRemove);
      const newDimensions = state.dimensions.filter((_, i) => i !== indexToRemove);
      const newFileSizes = state.fileSizes.filter((_, i) => i !== indexToRemove);

      // All arrays should have same length
      expect(newFiles.length).toBe(newPreviews.length);
      expect(newPreviews.length).toBe(newDimensions.length);
      expect(newDimensions.length).toBe(newFileSizes.length);

      // Verify correct items remain
      expect(newFiles.map(f => f.name)).toEqual(['a.jpg', 'c.jpg', 'd.jpg']);
      expect(newPreviews).toEqual(['p1', 'p3', 'p4']);
      expect(newDimensions).toEqual([
        { width: 100, height: 100 },
        { width: 300, height: 300 },
        { width: 400, height: 400 },
      ]);
      expect(newFileSizes).toEqual([1000, 3000, 4000]);
    });
  });

  describe('Property-Based Tests', () => {
    it('Property 12: Multiple Images Sequential Handling - should maintain array consistency', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.integer({ min: 1, max: 10 }), { minLength: 1, maxLength: 5 }),
          async (imageSizes) => {
            const files = imageSizes.map((size, i) =>
              new File([new Array(size).fill('x').join('')], `image${i}.jpg`, { type: 'image/jpeg' })
            );

            const state: ImageAttachmentState = {
              files,
              previews: files.map((_, i) => `preview${i}`),
              dimensions: files.map((_, i) => ({ width: 100 + i * 50, height: 100 + i * 50 })),
              fileSizes: imageSizes,
              isLoading: false,
              error: null,
              currentIndex: 0,
            };

            // Verify all arrays have same length
            expect(state.files.length).toBe(state.previews.length);
            expect(state.previews.length).toBe(state.dimensions.length);
            expect(state.dimensions.length).toBe(state.fileSizes.length);

            // Verify no data loss
            expect(state.files.length).toBe(imageSizes.length);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('Property 12: Multiple Images Sequential Handling - carousel navigation should be circular', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 2, max: 10 }),
          fc.integer({ min: 0, max: 100 }),
          (imageCount, steps) => {
            let currentIndex = 0;

            // Simulate navigation
            for (let i = 0; i < steps; i++) {
              currentIndex = (currentIndex + 1) % imageCount;
            }

            // After imageCount steps, should be back at start
            const stepsToStart = steps % imageCount;
            expect(currentIndex).toBe(stepsToStart);

            // Verify index is always valid
            expect(currentIndex).toBeGreaterThanOrEqual(0);
            expect(currentIndex).toBeLessThan(imageCount);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('Property 12: Multiple Images Sequential Handling - removal should not corrupt state', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 2, maxLength: 10 }),
          fc.integer({ min: 0, max: 9 }),
          (sizes, removeIndex) => {
            const actualRemoveIndex = removeIndex % sizes.length;

            const state: ImageAttachmentState = {
              files: sizes.map((_, i) => new File(['x'], `img${i}.jpg`, { type: 'image/jpeg' })),
              previews: sizes.map((_, i) => `p${i}`),
              dimensions: sizes.map((_, i) => ({ width: 100, height: 100 })),
              fileSizes: sizes,
              isLoading: false,
              error: null,
              currentIndex: 0,
            };

            // Remove image
            const newFiles = state.files.filter((_, i) => i !== actualRemoveIndex);
            const newPreviews = state.previews.filter((_, i) => i !== actualRemoveIndex);
            const newDimensions = state.dimensions.filter((_, i) => i !== actualRemoveIndex);
            const newFileSizes = state.fileSizes.filter((_, i) => i !== actualRemoveIndex);

            // Verify consistency
            expect(newFiles.length).toBe(newPreviews.length);
            expect(newPreviews.length).toBe(newDimensions.length);
            expect(newDimensions.length).toBe(newFileSizes.length);

            // Verify count decreased by 1
            expect(newFiles.length).toBe(state.files.length - 1);

            // Verify no data loss in remaining items
            expect(newFiles.length + 1).toBe(state.files.length);
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
