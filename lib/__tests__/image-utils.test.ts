/**
 * Image Utility Functions Tests
 * Tests for image validation, conversion, and processing
 */

import { describe, it, expect } from 'vitest';
import {
  getBase64MimeType,
  isImageUrl,
  isBase64Image,
  base64ToFile,
} from '../image-utils';

describe('Image Utilities', () => {
  describe('getBase64MimeType', () => {
    it('should extract MIME type from base64 string', () => {
      const base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA==';
      const mimeType = getBase64MimeType(base64);
      expect(mimeType).toBe('image/jpeg');
    });

    it('should handle PNG MIME type', () => {
      const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const mimeType = getBase64MimeType(base64);
      expect(mimeType).toBe('image/png');
    });

    it('should handle WebP MIME type', () => {
      const base64 = 'data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAUAcJaACdLoB/gAA/v8A/v8A';
      const mimeType = getBase64MimeType(base64);
      expect(mimeType).toBe('image/webp');
    });

    it('should return null for invalid base64', () => {
      const mimeType = getBase64MimeType('not-a-base64-string');
      expect(mimeType).toBeNull();
    });

    it('should return null for base64 without MIME type', () => {
      const mimeType = getBase64MimeType('base64,dGVzdA==');
      expect(mimeType).toBeNull();
    });
  });

  describe('isImageUrl', () => {
    it('should identify valid HTTPS URLs', () => {
      expect(isImageUrl('https://example.com/image.jpg')).toBe(true);
    });

    it('should identify valid HTTP URLs', () => {
      expect(isImageUrl('http://example.com/image.png')).toBe(true);
    });

    it('should identify URLs with query parameters', () => {
      expect(isImageUrl('https://example.com/image.jpg?size=large')).toBe(true);
    });

    it('should reject non-URLs', () => {
      expect(isImageUrl('not-a-url')).toBe(false);
    });

    it('should reject base64 strings', () => {
      expect(isImageUrl('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA==')).toBe(false);
    });

    it('should reject relative paths', () => {
      expect(isImageUrl('/images/test.jpg')).toBe(false);
    });
  });

  describe('isBase64Image', () => {
    it('should identify base64 JPEG image strings', () => {
      const base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA==';
      expect(isBase64Image(base64)).toBe(true);
    });

    it('should identify base64 PNG image strings', () => {
      const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      expect(isBase64Image(base64)).toBe(true);
    });

    it('should identify base64 WebP image strings', () => {
      const base64 = 'data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAUAcJaACdLoB/gAA/v8A/v8A';
      expect(isBase64Image(base64)).toBe(true);
    });

    it('should identify base64 GIF image strings', () => {
      const base64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      expect(isBase64Image(base64)).toBe(true);
    });

    it('should reject URLs', () => {
      expect(isBase64Image('https://example.com/image.jpg')).toBe(false);
    });

    it('should reject non-base64 strings', () => {
      expect(isBase64Image('not-a-base64-string')).toBe(false);
    });

    it('should reject base64 non-image strings', () => {
      expect(isBase64Image('data:text/plain;base64,dGVzdA==')).toBe(false);
    });

    it('should reject base64 without data URI prefix', () => {
      expect(isBase64Image('image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA==')).toBe(false);
    });
  });

  describe('base64ToFile', () => {
    it('should convert base64 JPEG string to File', () => {
      const base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA==';
      const file = base64ToFile(base64, 'test.jpg');
      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe('test.jpg');
      expect(file.type).toBe('image/jpeg');
      expect(file.size).toBeGreaterThan(0);
    });

    it('should convert base64 PNG string to File', () => {
      const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const file = base64ToFile(base64, 'test.png');
      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe('test.png');
      expect(file.type).toBe('image/png');
    });

    it('should convert base64 WebP string to File', () => {
      const base64 = 'data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAUAcJaACdLoB/gAA/v8A/v8A';
      const file = base64ToFile(base64, 'test.webp');
      expect(file).toBeInstanceOf(File);
      expect(file.type).toBe('image/webp');
    });

    it('should convert base64 GIF string to File', () => {
      const base64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      const file = base64ToFile(base64, 'test.gif');
      expect(file).toBeInstanceOf(File);
      expect(file.type).toBe('image/gif');
    });

    it('should handle base64 without MIME type prefix', () => {
      const base64 = 'base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA==';
      const file = base64ToFile(base64, 'test.jpg');
      expect(file).toBeInstanceOf(File);
      expect(file.type).toBe('image/jpeg'); // defaults to JPEG
    });

    it('should preserve filename', () => {
      const base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA==';
      const file = base64ToFile(base64, 'my-image.jpg');
      expect(file.name).toBe('my-image.jpg');
    });
  });

  describe('Format Support - Property Tests', () => {
    it('should support all required image formats', () => {
      const formats = [
        { base64: 'data:image/jpeg;base64,test', ext: '.jpg', mime: 'image/jpeg' },
        { base64: 'data:image/png;base64,test', ext: '.png', mime: 'image/png' },
        { base64: 'data:image/webp;base64,test', ext: '.webp', mime: 'image/webp' },
        { base64: 'data:image/gif;base64,test', ext: '.gif', mime: 'image/gif' },
      ];

      formats.forEach(({ base64, mime }) => {
        expect(isBase64Image(base64)).toBe(true);
        expect(getBase64MimeType(base64)).toBe(mime);
      });
    });

    it('should correctly identify image vs non-image base64', () => {
      const imageBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA==';
      const textBase64 = 'data:text/plain;base64,dGVzdA==';
      const jsonBase64 = 'data:application/json;base64,e30=';

      expect(isBase64Image(imageBase64)).toBe(true);
      expect(isBase64Image(textBase64)).toBe(false);
      expect(isBase64Image(jsonBase64)).toBe(false);
    });

    it('should correctly distinguish URLs from base64', () => {
      const url = 'https://example.com/image.jpg';
      const base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA==';

      expect(isImageUrl(url)).toBe(true);
      expect(isBase64Image(url)).toBe(false);

      expect(isImageUrl(base64)).toBe(false);
      expect(isBase64Image(base64)).toBe(true);
    });
  });

  describe('Backward Compatibility', () => {
    it('should handle legacy base64 format without data URI prefix', () => {
      const legacyBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA==';
      // Should not crash, but may not identify as image
      expect(() => getBase64MimeType(legacyBase64)).not.toThrow();
    });

    it('should handle URLs with various protocols', () => {
      expect(isImageUrl('https://example.com/image.jpg')).toBe(true);
      expect(isImageUrl('http://example.com/image.jpg')).toBe(true);
    });
  });
});

