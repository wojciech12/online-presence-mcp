/**
 * End-to-end tests for bluesky_post tool against live Bluesky instance (Phase 2.1.1B)
 * These tests run against the actual Bluesky API using AtpAgent
 */

import { AtpAgent } from "@atproto/api";

describe('bluesky_post tool - End-to-End Tests', () => {
  let agent: AtpAgent;
  
  beforeAll(async () => {
    // Skip E2E tests if credentials are not provided
    if (!process.env.BLUESKY_IDENTIFIER || !process.env.BLUESKY_PASSWORD) {
      console.log('Skipping E2E tests - BLUESKY_IDENTIFIER and BLUESKY_PASSWORD not set');
      return;
    }

    agent = new AtpAgent({
      service: process.env.BLUESKY_SERVICE || 'https://bsky.social'
    });

    try {
      await agent.login({
        identifier: process.env.BLUESKY_IDENTIFIER,
        password: process.env.BLUESKY_PASSWORD
      });
    } catch (error) {
      console.error('Failed to authenticate with Bluesky:', error);
      throw error;
    }
  });

  // Helper function to skip tests if no credentials
  const skipIfNoCredentials = () => {
    if (!process.env.BLUESKY_IDENTIFIER || !process.env.BLUESKY_PASSWORD) {
      return true;
    }
    return false;
  };

  describe('Real API Post Creation', () => {
    test('should create a simple text post', async () => {
      if (skipIfNoCredentials()) return;
      
      const testText = `Test post from MCP server - ${new Date().toISOString()}`;
      
      const response = await agent.post({
        text: testText,
        createdAt: new Date().toISOString()
      });

      expect(response.uri).toBeDefined();
      expect(response.cid).toBeDefined();
      expect(response.uri).toMatch(/^at:\/\/did:plc:[a-z0-9]+\/app\.bsky\.feed\.post\/[a-z0-9]+$/);
      expect(response.cid).toMatch(/^baf[a-zA-Z0-9]+$/);
    });

    test('should handle authentication errors gracefully', async () => {
      // Create agent with invalid credentials
      const invalidAgent = new AtpAgent({
        service: process.env.BLUESKY_SERVICE || 'https://bsky.social'
      });

      await expect(
        invalidAgent.login({
          identifier: 'invalid@example.com',
          password: 'wrongpassword'
        })
      ).rejects.toThrow();
    });

    test('should validate post text length limits', async () => {
      if (skipIfNoCredentials()) return;
      
      // Bluesky has a 300 character limit for posts
      const longText = 'x'.repeat(301);
      
      await expect(
        agent.post({
          text: longText,
          createdAt: new Date().toISOString()
        })
      ).rejects.toThrow();
    });

    test('should handle network errors gracefully', async () => {
      if (skipIfNoCredentials()) return;
      
      // Create agent with invalid service URL
      const invalidAgent = new AtpAgent({
        service: 'https://invalid-bluesky-instance.example.com'
      });

      await expect(
        invalidAgent.login({
          identifier: process.env.BLUESKY_IDENTIFIER!,
          password: process.env.BLUESKY_PASSWORD!
        })
      ).rejects.toThrow();
    });
  });

  describe('Post Content Validation', () => {
    test('should create post with special characters', async () => {
      if (skipIfNoCredentials()) return;
      
      const testText = `MCP test with emojis 🚀🎉 and unicode: àáâãäå #test @handle.bsky.social`;
      
      const response = await agent.post({
        text: testText,
        createdAt: new Date().toISOString()
      });

      expect(response.uri).toBeDefined();
      expect(response.cid).toBeDefined();
    });

    test('should create post with URLs', async () => {
      if (skipIfNoCredentials()) return;
      
      const testText = `MCP test with URL: https://example.com and link shortening - ${Date.now()}`;
      
      const response = await agent.post({
        text: testText,
        createdAt: new Date().toISOString()
      });

      expect(response.uri).toBeDefined();
      expect(response.cid).toBeDefined();
    });
  });

  describe('Error Scenarios', () => {
    test('should handle missing required fields', async () => {
      if (skipIfNoCredentials()) return;
      
      // @ts-ignore - intentionally testing runtime validation
      await expect(
        agent.post({
          createdAt: new Date().toISOString()
        })
      ).rejects.toThrow();
    });
  });
});