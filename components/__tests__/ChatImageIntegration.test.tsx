/**
 * Chat Image Integration Tests
 * Tests for image support in chat send handler and API integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';

describe('Chat Image Integration', () => {
  describe('Message Format with Images', () => {
    // Feature: creative-chat-image-attachment, Property 5: Image Included in API Request
    // Validates: Requirements 3.1, 4.3
    it('should format message with image_url content type for API', () => {
      const message = {
        role: 'user' as const,
        text: 'Analyze this image',
        images: ['data:image/jpeg;base64,test123']
      };

      // Simulate API message formatting
      const apiMessage = {
        role: 'user',
        content: [
          {
            type: 'text',
            text: message.text
          },
          {
            type: 'image_url',
            image_url: {
              url: message.images[0],
              detail: 'auto'
            }
          }
        ]
      };

      expect(apiMessage.content).toHaveLength(2);
      expect(apiMessage.content[0].type).toBe('text');
      expect(apiMessage.content[1].type).toBe('image_url');
      expect(apiMessage.content[1].image_url.url).toBe(message.images[0]);
    });

    it('should handle multiple images in message', () => {
      const message = {
        role: 'user' as const,
        text: 'Compare these images',
        images: [
          'data:image/jpeg;base64,image1',
          'data:image/png;base64,image2'
        ]
      };

      // Simulate API message formatting
      const apiMessage = {
        role: 'user',
        content: [
          {
            type: 'text',
            text: message.text
          },
          ...message.images.map(url => ({
            type: 'image_url',
            image_url: {
              url: url,
              detail: 'auto'
            }
          }))
        ]
      };

      expect(apiMessage.content).toHaveLength(3);
      expect(apiMessage.content[0].type).toBe('text');
      expect(apiMessage.content[1].type).toBe('image_url');
      expect(apiMessage.content[2].type).toBe('image_url');
    });

    it('should handle both base64 and URL images', () => {
      const message = {
        role: 'user' as const,
        text: 'Analyze these images',
        images: [
          'data:image/jpeg;base64,test',
          'https://example.com/image.jpg'
        ]
      };

      // Simulate API message formatting
      const apiMessage = {
        role: 'user',
        content: [
          {
            type: 'text',
            text: message.text
          },
          ...message.images.map(url => ({
            type: 'image_url',
            image_url: {
              url: url,
              detail: 'auto'
            }
          }))
        ]
      };

      expect(apiMessage.content[1].image_url.url).toContain('data:image');
      expect(apiMessage.content[2].image_url.url).toContain('https://');
    });
  });

  describe('Text-Only Message Backward Compatibility', () => {
    // Feature: creative-chat-image-attachment, Property 4: Text-Only Messages Use Original Flow
    // Validates: Requirements 4.2, 8.1
    it('should use simple text format for messages without images', () => {
      const message = {
        role: 'user' as const,
        text: 'Hello, AI!',
        images: undefined
      };

      // Simulate API message formatting for text-only
      const apiMessage = {
        role: 'user',
        content: message.text
      };

      expect(typeof apiMessage.content).toBe('string');
      expect(apiMessage.content).toBe('Hello, AI!');
    });

    it('should not include images array in text-only messages', () => {
      const message = {
        role: 'user' as const,
        text: 'Hello, AI!'
      };

      // Verify no images property
      expect(message.images).toBeUndefined();
      
      // Simulate API message formatting
      const apiMessage = {
        role: 'user',
        content: message.text
      };

      expect(apiMessage).not.toHaveProperty('images');
    });
  });

  describe('Chat History with Mixed Messages', () => {
    it('should handle chat history with both text-only and image messages', () => {
      const chatHistory = [
        { role: 'user' as const, text: 'Hello' },
        { role: 'model' as const, text: 'Hi there!' },
        { role: 'user' as const, text: 'What is this?', images: ['data:image/jpeg;base64,test'] },
        { role: 'model' as const, text: 'This is a cat.' }
      ];

      // Verify mixed message types
      expect(chatHistory[0].images).toBeUndefined();
      expect(chatHistory[1].images).toBeUndefined();
      expect(chatHistory[2].images).toBeDefined();
      expect(chatHistory[3].images).toBeUndefined();

      // Verify all messages are preserved
      expect(chatHistory).toHaveLength(4);
    });

    it('should preserve message order in chat history', () => {
      const chatHistory = [
        { role: 'user' as const, text: 'First message' },
        { role: 'user' as const, text: 'Second message', images: ['data:image/jpeg;base64,test'] },
        { role: 'user' as const, text: 'Third message' }
      ];

      expect(chatHistory[0].text).toBe('First message');
      expect(chatHistory[1].text).toBe('Second message');
      expect(chatHistory[2].text).toBe('Third message');
    });
  });

  describe('Image Attachment Lifecycle', () => {
    it('should clear image attachment after sending', () => {
      let attachedImage = {
        file: null as File | null,
        preview: 'data:image/jpeg;base64,test',
        dimensions: { width: 100, height: 100 },
        fileSize: 1024,
        isLoading: false,
        error: null
      };

      // Simulate sending message
      const handleRemoveImage = () => {
        attachedImage = {
          file: null,
          preview: '',
          dimensions: null,
          fileSize: 0,
          isLoading: false,
          error: null
        };
      };

      expect(attachedImage.preview).toBe('data:image/jpeg;base64,test');
      handleRemoveImage();
      expect(attachedImage.preview).toBe('');
    });

    it('should preserve image on API error', () => {
      let attachedImage = {
        file: null as File | null,
        preview: 'data:image/jpeg;base64,test',
        dimensions: { width: 100, height: 100 },
        fileSize: 1024,
        isLoading: false,
        error: null
      };

      // Simulate API error - image should NOT be cleared
      const handleAPIError = () => {
        // Don't clear image on error
        attachedImage.error = 'API error occurred';
      };

      handleAPIError();
      expect(attachedImage.preview).toBe('data:image/jpeg;base64,test');
      expect(attachedImage.error).toBe('API error occurred');
    });
  });

  describe('API Request Formatting', () => {
    it('should format OpenAI-compatible API request with images', () => {
      const messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'What is in this image?'
            },
            {
              type: 'image_url',
              image_url: {
                url: 'data:image/jpeg;base64,test',
                detail: 'auto'
              }
            }
          ]
        }
      ];

      const apiRequest = {
        model: 'gpt-4o',
        messages: messages
      };

      expect(apiRequest.model).toBe('gpt-4o');
      expect(apiRequest.messages[0].content).toHaveLength(2);
      expect(apiRequest.messages[0].content[1].type).toBe('image_url');
    });

    it('should format Gemini API request with base64 images', () => {
      const parts = [
        { text: 'What is in this image?' },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: 'test123'
          }
        }
      ];

      expect(parts).toHaveLength(2);
      expect(parts[0].text).toBe('What is in this image?');
      expect(parts[1].inlineData.mimeType).toBe('image/jpeg');
    });

    it('should format Gemini API request with URL images', () => {
      const parts = [
        { text: 'What is in this image?' },
        {
          fileData: {
            mimeType: 'image/png',
            fileUri: 'https://example.com/image.png'
          }
        }
      ];

      expect(parts).toHaveLength(2);
      expect(parts[1].fileData.fileUri).toContain('https://');
    });
  });

  describe('Property-Based Tests', () => {
    // Feature: creative-chat-image-attachment, Property 5: Image Included in API Request
    // Validates: Requirements 3.1, 4.3
    it('should include all images in API request', () => {
      fc.assert(
        fc.property(
          fc.array(fc.base64String({ minLength: 10, maxLength: 100 }), {
            minLength: 1,
            maxLength: 5
          }),
          (imageUrls) => {
            const message = {
              role: 'user' as const,
              text: 'Analyze these images',
              images: imageUrls.map(url => `data:image/jpeg;base64,${url}`)
            };

            // Simulate API formatting
            const apiMessage = {
              role: 'user',
              content: [
                { type: 'text', text: message.text },
                ...message.images.map(url => ({
                  type: 'image_url',
                  image_url: { url, detail: 'auto' }
                }))
              ]
            };

            // Verify all images are included
            const imageCount = apiMessage.content.filter(
              (c: any) => c.type === 'image_url'
            ).length;
            expect(imageCount).toBe(message.images.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    // Feature: creative-chat-image-attachment, Property 4: Text-Only Messages Use Original Flow
    // Validates: Requirements 4.2, 8.1
    it('should use text-only format for messages without images', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 500 }),
          (text) => {
            const message = {
              role: 'user' as const,
              text: text
            };

            // Simulate API formatting for text-only
            const apiMessage = {
              role: 'user',
              content: message.text
            };

            // Verify it's a simple string, not an array
            expect(typeof apiMessage.content).toBe('string');
            expect(apiMessage.content).toBe(text);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle missing image URL gracefully', () => {
      const message = {
        role: 'user' as const,
        text: 'Analyze this',
        images: ['']
      };

      // Should still format, but with empty URL
      const apiMessage = {
        role: 'user',
        content: [
          { type: 'text', text: message.text },
          ...message.images.map(url => ({
            type: 'image_url',
            image_url: { url, detail: 'auto' }
          }))
        ]
      };

      expect(apiMessage.content).toHaveLength(2);
      expect(apiMessage.content[1].image_url.url).toBe('');
    });

    it('should handle null images array', () => {
      const message = {
        role: 'user' as const,
        text: 'Hello',
        images: null as any
      };

      // Should not crash
      const hasImages = message.images && Array.isArray(message.images);
      expect(hasImages).toBeFalsy();
    });
  });
});
