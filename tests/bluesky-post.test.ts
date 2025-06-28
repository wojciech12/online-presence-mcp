/**
 * Tests for bluesky_post tool (Phase 2.1.1)
 * Testing tool interface and mock response generation
 */

import { generateMockPostResponse, formatPostSuccessMessage } from "../src/mocks/responses.js";

describe('bluesky_post tool - Mock Response Generation', () => {
  describe('Mock Response Generation', () => {
    test('should generate valid mock response', () => {
      const response = generateMockPostResponse('Test post');
      
      expect(response.uri).toMatch(/^at:\/\/did:plc:mockuser123\/app\.bsky\.feed\.post\/mock_post_\d+_\d+$/);
      expect(response.cid).toMatch(/^bafyrei/);
      expect(response.text).toBe('Test post');
      expect(response.media).toEqual([]);
      expect(response.createdAt).toBeDefined();
      expect(response.author).toEqual({
        did: 'did:plc:mockuser123',
        handle: 'mockuser.bsky.social',
        displayName: 'Mock User'
      });
      expect(response.replyCount).toBe(0);
      expect(response.repostCount).toBe(0);
      expect(response.likeCount).toBe(0);
    });

    test('should generate response with media', () => {
      const media = ['https://example.com/image.jpg'];
      const response = generateMockPostResponse('Post with media', media);
      
      expect(response.media).toEqual(media);
    });

    test('should format success message correctly', () => {
      const response = generateMockPostResponse('Test message');
      const message = formatPostSuccessMessage(response);
      
      expect(message).toContain('Post created successfully! 🎉');
      expect(message).toContain('Test message');
      expect(message).toContain('@mockuser.bsky.social');
      expect(message).toContain(response.uri);
    });

    test('should include media info in success message', () => {
      const response = generateMockPostResponse('Test', ['https://example.com/img.jpg', 'https://example.com/img2.jpg']);
      const message = formatPostSuccessMessage(response);
      
      expect(message).toContain('Media attachments: 2');
    });

    test('should generate unique URIs for different posts', () => {
      const response1 = generateMockPostResponse('First post');
      const response2 = generateMockPostResponse('Second post');
      
      expect(response1.uri).not.toBe(response2.uri);
      expect(response1.cid).not.toBe(response2.cid);
    });

    test('should preserve input text exactly', () => {
      const testCases = [
        'Simple text',
        'Text with emojis 🚀 🎉',
        'Text with special chars: @user #hashtag https://example.com',
        'Multi-line\ntext\nwith\nbreaks',
        'Text with "quotes" and \'apostrophes\''
      ];

      testCases.forEach(text => {
        const response = generateMockPostResponse(text);
        expect(response.text).toBe(text);
      });
    });

    test('should handle empty media array', () => {
      const response = generateMockPostResponse('Test', []);
      expect(response.media).toEqual([]);
    });

    test('should preserve media URLs exactly', () => {
      const media = [
        'https://example.com/image1.jpg',
        'https://cdn.example.com/photo.png',
        'https://media.example.com/video.mp4'
      ];
      const response = generateMockPostResponse('Test', media);
      expect(response.media).toEqual(media);
    });

    test('should generate valid ISO date strings', () => {
      const response = generateMockPostResponse('Test');
      const date = new Date(response.createdAt);
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe(response.createdAt);
    });

    test('should generate consistent author information', () => {
      const response1 = generateMockPostResponse('First');
      const response2 = generateMockPostResponse('Second');
      
      expect(response1.author).toEqual(response2.author);
      expect(response1.author?.did).toBe('did:plc:mockuser123');
      expect(response1.author?.handle).toBe('mockuser.bsky.social');
      expect(response1.author?.displayName).toBe('Mock User');
    });
  });

  describe('Message Formatting', () => {
    test('should format message without media correctly', () => {
      const response = generateMockPostResponse('Hello world');
      const message = formatPostSuccessMessage(response);
      
      expect(message).toContain('Post created successfully! 🎉');
      expect(message).toContain('Post URI:');
      expect(message).toContain('Author: @mockuser.bsky.social');
      expect(message).toContain('Text: "Hello world"');
      expect(message).toContain('Created:');
      expect(message).not.toContain('Media attachments:');
    });

    test('should format message with single media attachment', () => {
      const response = generateMockPostResponse('Photo post', ['https://example.com/photo.jpg']);
      const message = formatPostSuccessMessage(response);
      
      expect(message).toContain('Media attachments: 1');
    });

    test('should format message with multiple media attachments', () => {
      const media = [
        'https://example.com/photo1.jpg',
        'https://example.com/photo2.jpg',
        'https://example.com/video.mp4'
      ];
      const response = generateMockPostResponse('Multi-media post', media);
      const message = formatPostSuccessMessage(response);
      
      expect(message).toContain('Media attachments: 3');
    });

    test('should include readable timestamp', () => {
      const response = generateMockPostResponse('Time test');
      const message = formatPostSuccessMessage(response);
      
      // Should contain a formatted date
      expect(message).toMatch(/Created: \d{1,2}\/\d{1,2}\/\d{4}/);
    });
  });
});