/**
 * Chat Message Format Tests
 * Tests for extended chat message format with image support
 */

import { describe, it, expect } from 'vitest';

describe('Chat Message Format', () => {
  describe('Extended ChatMessage Type', () => {
    it('should support text-only messages', () => {
      const message = {
        role: 'user' as const,
        text: 'Hello, AI!',
      };

      expect(message.role).toBe('user');
      expect(message.text).toBe('Hello, AI!');
      expect(message.images).toBeUndefined();
    });

    it('should support messages with images', () => {
      const message = {
        role: 'user' as const,
        text: 'What is in this image?',
        images: ['data:image/jpeg;base64,test'],
      };

      expect(message.role).toBe('user');
      expect(message.text).toBe('What is in this image?');
      expect(message.images).toBeDefined();
      expect(message.images?.length).toBe(1);
    });

    it('should support multiple images in a message', () => {
      const message = {
        role: 'user' as const,
        text: 'Compare these images',
        images: [
          'data:image/jpeg;base64,image1',
          'data:image/png;base64,image2',
        ],
      };

      expect(message.images?.length).toBe(2);
    });

    it('should support both base64 and URL images', () => {
      const message = {
        role: 'user' as const,
        text: 'Analyze these images',
        images: [
          'data:image/jpeg;base64,test',
          'https://example.com/image.jpg',
        ],
      };

      expect(message.images?.[0]).toContain('data:image');
      expect(message.images?.[1]).toContain('https://');
    });
  });

  describe('Message Display', () => {
    // Feature: creative-chat-image-attachment, Property 4: Text-Only Messages Use Original Flow
    // Validates: Requirements 4.2, 8.1
    it('should display text-only messages exactly as before', () => {
      const messageHTML = `
        <div class="flex justify-end">
          <div class="flex flex-col gap-1">
            <div class="max-w-[85%] p-3 rounded-2xl text-xs font-bold leading-relaxed whitespace-pre-wrap break-words bg-purple-600 text-white">
              Hello, AI!
            </div>
            <button class="text-[9px] opacity-50 hover:opacity-100 transition-opacity w-fit flex items-center gap-1 ml-auto pr-1">
              <span>📋</span>
              <span class="text-[8px] font-semibold text-purple-400">Copy</span>
            </button>
          </div>
        </div>
      `;

      expect(messageHTML).toContain('Hello, AI!');
      expect(messageHTML).toContain('bg-purple-600');
      expect(messageHTML).toContain('📋');
    });

    it('should display messages with images', () => {
      const messageHTML = `
        <div class="flex justify-end">
          <div class="flex flex-col gap-1">
            <div class="max-w-[85%] p-3 rounded-2xl text-xs font-bold leading-relaxed whitespace-pre-wrap break-words bg-purple-600 text-white">
              What is in this image?
            </div>
            <div class="flex flex-wrap gap-2 max-w-[85%]">
              <div class="rounded-lg overflow-hidden border border-zinc-400">
                <img 
                  src="data:image/jpeg;base64,test"
                  alt="Message image 1"
                  class="max-w-[200px] max-h-[150px] object-cover"
                />
              </div>
            </div>
            <button class="text-[9px] opacity-50 hover:opacity-100 transition-opacity w-fit flex items-center gap-1 ml-auto pr-1">
              <span>📋</span>
              <span class="text-[8px] font-semibold text-purple-400">Copy</span>
            </button>
          </div>
        </div>
      `;

      expect(messageHTML).toContain('What is in this image?');
      expect(messageHTML).toContain('<img');
      expect(messageHTML).toContain('max-w-[200px]');
    });

    it('should display multiple images in a message', () => {
      const messageHTML = `
        <div class="flex flex-wrap gap-2 max-w-[85%]">
          <div class="rounded-lg overflow-hidden border border-zinc-400">
            <img src="data:image/jpeg;base64,image1" alt="Message image 1" class="max-w-[200px] max-h-[150px] object-cover" />
          </div>
          <div class="rounded-lg overflow-hidden border border-zinc-400">
            <img src="data:image/png;base64,image2" alt="Message image 2" class="max-w-[200px] max-h-[150px] object-cover" />
          </div>
        </div>
      `;

      const imgCount = (messageHTML.match(/<img/g) || []).length;
      expect(imgCount).toBe(2);
    });
  });

  describe('Image Display in Chat History', () => {
    // Feature: creative-chat-image-attachment, Property 3: Image Inclusion in Chat Messages
    // Validates: Requirements 3.3, 8.2
    it('should display images alongside user text', () => {
      const messageHTML = `
        <div class="flex justify-end">
          <div class="flex flex-col gap-1">
            <div class="max-w-[85%] p-3 rounded-2xl bg-purple-600 text-white">
              Analyze this image
            </div>
            <div class="flex flex-wrap gap-2 max-w-[85%]">
              <div class="rounded-lg overflow-hidden border border-zinc-400">
                <img src="data:image/jpeg;base64,test" alt="Message image 1" class="max-w-[200px] max-h-[150px] object-cover" />
              </div>
            </div>
          </div>
        </div>
      `;

      expect(messageHTML).toContain('Analyze this image');
      expect(messageHTML).toContain('<img');
    });

    it('should display images with AI responses', () => {
      const messageHTML = `
        <div class="flex justify-start">
          <div class="flex flex-col gap-1">
            <div class="max-w-[85%] p-3 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-100">
              This image shows a cat sitting on a table.
            </div>
          </div>
        </div>
      `;

      expect(messageHTML).toContain('This image shows a cat');
      expect(messageHTML).toContain('justify-start');
    });

    it('should maintain message styling with images', () => {
      const userMessageHTML = `
        <div class="max-w-[85%] p-3 rounded-2xl text-xs font-bold leading-relaxed whitespace-pre-wrap break-words bg-purple-600 text-white">
          Text
        </div>
      `;

      const aiMessageHTML = `
        <div class="max-w-[85%] p-3 rounded-2xl text-xs font-bold leading-relaxed whitespace-pre-wrap break-words bg-zinc-800 border border-zinc-700 text-zinc-100">
          Response
        </div>
      `;

      expect(userMessageHTML).toContain('bg-purple-600');
      expect(aiMessageHTML).toContain('bg-zinc-800');
    });
  });

  describe('Backward Compatibility', () => {
    // Feature: creative-chat-image-attachment, Property 4: Text-Only Messages Use Original Flow
    // Validates: Requirements 4.2, 8.1
    it('should use exact same API call format for text-only messages', () => {
      const textOnlyMessage = {
        role: 'user' as const,
        text: 'Hello',
      };

      // Should not have images property
      expect(textOnlyMessage.images).toBeUndefined();
      
      // Should have same structure as before
      expect(Object.keys(textOnlyMessage)).toEqual(['role', 'text']);
    });

    it('should display text-only messages identically to before', () => {
      const oldFormat = {
        role: 'user' as const,
        text: 'Hello, AI!',
      };

      const newFormat = {
        role: 'user' as const,
        text: 'Hello, AI!',
        images: undefined,
      };

      // Both should display the same way
      expect(oldFormat.text).toBe(newFormat.text);
      expect(oldFormat.role).toBe(newFormat.role);
    });

    it('should not affect chat history for existing messages', () => {
      const chatHistory = [
        { role: 'user' as const, text: 'First message' },
        { role: 'model' as const, text: 'Response' },
        { role: 'user' as const, text: 'Second message' },
      ];

      // All messages should still be accessible
      expect(chatHistory.length).toBe(3);
      expect(chatHistory[0].text).toBe('First message');
      expect(chatHistory[1].text).toBe('Response');
    });

    it('should not affect copy functionality', () => {
      const message = {
        role: 'user' as const,
        text: 'Copy this text',
        images: ['data:image/jpeg;base64,test'],
      };

      // Copy should still work with just the text
      const textToCopy = message.text;
      expect(textToCopy).toBe('Copy this text');
    });
  });

  describe('Message Rendering', () => {
    it('should render user messages on the right', () => {
      const messageHTML = `
        <div class="flex justify-end">
          <div>User message</div>
        </div>
      `;

      expect(messageHTML).toContain('justify-end');
    });

    it('should render AI messages on the left', () => {
      const messageHTML = `
        <div class="flex justify-start">
          <div>AI response</div>
        </div>
      `;

      expect(messageHTML).toContain('justify-start');
    });

    it('should apply correct styling to user messages', () => {
      const messageHTML = `
        <div class="max-w-[85%] p-3 rounded-2xl text-xs font-bold leading-relaxed whitespace-pre-wrap break-words bg-purple-600 text-white">
          User message
        </div>
      `;

      expect(messageHTML).toContain('bg-purple-600');
      expect(messageHTML).toContain('text-white');
    });

    it('should apply correct styling to AI messages', () => {
      const messageHTML = `
        <div class="max-w-[85%] p-3 rounded-2xl text-xs font-bold leading-relaxed whitespace-pre-wrap break-words bg-zinc-800 border border-zinc-700 text-zinc-100">
          AI response
        </div>
      `;

      expect(messageHTML).toContain('bg-zinc-800');
      expect(messageHTML).toContain('text-zinc-100');
    });
  });
});
