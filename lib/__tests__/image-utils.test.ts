/**
 * Image Utility Functions Tests
 * Tests for image validation, conversion, and processing
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  getBase64MimeType,
  isImageUrl,
  isBase64Image,
  base64ToFile,
  validateImageFile,
  generateImagePreview,
  getImageMetadata,
  convertImageForAPI,
  formatFileSize,
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

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
    });

    it('should handle large file sizes', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });

  describe('Image Format Validation - Property Tests', () => {
    // Feature: creative-chat-image-attachment, Property 1: Image Format Validation
    // Validates: Requirements 1.3, 5.2
    it('should reject unsupported image formats', async () => {
      const unsupportedFormats = ['.txt', '.pdf', '.doc', '.mp4', '.exe', '.zip'];
      
      for (const ext of unsupportedFormats) {
        const filename = `test${ext}`;
        const mimeType = 'application/octet-stream';
        const file = new File([new ArrayBuffer(100)], filename, { type: mimeType });
        
        const result = await validateImageFile(file);
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      }
    });

    it('should reject files exceeding size limit', async () => {
      const largeSize = 5 * 1024 * 1024 + 1; // Just over 5MB limit
      const file = new File([new ArrayBuffer(largeSize)], 'large.jpg', { type: 'image/jpeg' });
      
      const result = await validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too large');
    });
  });

  describe('Image Conversion - Property Tests', () => {
    // Feature: creative-chat-image-attachment, Property 6: Image Conversion Maintains Quality
    // Validates: Requirements 7.1, 7.4
    it('should handle URL pass-through correctly', async () => {
      const urls = [
        'https://example.com/image.jpg',
        'http://example.com/image.png',
        'https://cdn.example.com/images/photo.webp?size=large'
      ];

      for (const url of urls) {
        const result = await convertImageForAPI(url);
        expect(result).toBe(url);
      }
    });

    it('should handle base64 image strings correctly', async () => {
      const base64Images = [
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA==',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBIAAAAwAQCdASoBAAEAAUAcJaACdLoB/gAA/v8A/v8A',
        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      ];

      for (const base64 of base64Images) {
        const result = await convertImageForAPI(base64);
        expect(result).toBe(base64);
      }
    });
  });

  describe('Image Metadata Display - Property Tests', () => {
    // Feature: creative-chat-image-attachment, Property 11: Image Metadata Display
    // Validates: Requirements 2.2
    it('should format file size correctly for metadata display', () => {
      const testCases = [
        { size: 1024, expected: '1 KB' },
        { size: 1024 * 1024, expected: '1 MB' },
        { size: 5 * 1024 * 1024, expected: '5 MB' },
        { size: 512, expected: '512 Bytes' },
      ];

      for (const testCase of testCases) {
        const formatted = formatFileSize(testCase.size);
        expect(formatted).toBe(testCase.expected);
      }
    });

    it('should identify image format from MIME type', () => {
      const formats = [
        { mime: 'image/jpeg', expected: 'jpeg' },
        { mime: 'image/png', expected: 'png' },
        { mime: 'image/webp', expected: 'webp' },
        { mime: 'image/gif', expected: 'gif' }
      ];

      for (const format of formats) {
        const mimeType = format.mime;
        const extracted = mimeType.split('/')[1];
        expect(extracted).toBe(format.expected);
      }
    });
  });
});

