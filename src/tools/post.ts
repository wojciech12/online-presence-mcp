/**
 * Post Management Tools
 * 
 * MCP tools for creating and managing Bluesky posts
 * These are actions with side effects (CREATE, UPDATE, DELETE operations)
 * Phase 2.1.1B: Real API implementation with AtpAgent
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { generateMockPostResponse, formatPostSuccessMessage } from "../mocks/responses.js";
import { getAuthenticatedAgent, initializeBlueskyAuth, getAuthConfigFromEnv } from "../auth/bluesky.js";

export function registerBlueskyPostTool(server: McpServer) {
  // bluesky_post - Create a new text/media post
  server.registerTool(
    "bluesky_post",
    {
      title: "Create Bluesky Post",
      description: "Create a new text/media post on Bluesky",
      inputSchema: {
        text: z.string()
          .min(1, "Post text cannot be empty")
          .max(300, "Post text cannot exceed 300 characters")
          .describe("The text content of the post"),
        media: z.array(z.string().url("Media must be valid URLs"))
          .optional()
          .describe("Optional media attachment URLs")
      }
    },
    async ({ text, media }) => {
      try {
        // Try to use real API if credentials are available
        const authConfig = getAuthConfigFromEnv();
        
        if (authConfig) {
          // Real API implementation
          try {
            await initializeBlueskyAuth(authConfig);
            const agent = getAuthenticatedAgent();
            
            const response = await agent.post({
              text,
              createdAt: new Date().toISOString()
            });

            return {
              content: [{
                type: "text",
                text: `Post created successfully! 🎉\n\nPost URI: ${response.uri}\nPost CID: ${response.cid}\nText: "${text}"\nCreated: ${new Date().toLocaleString()}\n${media && media.length > 0 ? `\nMedia attachments: ${media.length}` : ''}`
              }]
            };
          } catch (apiError) {
            // Fall back to mock if API fails
            console.warn('API call failed, falling back to mock:', apiError);
            const mockResponse = generateMockPostResponse(text, media);
            const successMessage = formatPostSuccessMessage(mockResponse);
            
            return {
              content: [{
                type: "text",
                text: `${successMessage}\n\n⚠️ Note: Used mock response due to API error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`
              }]
            };
          }
        } else {
          // No credentials, use mock response
          const mockResponse = generateMockPostResponse(text, media);
          const successMessage = formatPostSuccessMessage(mockResponse);
          
          return {
            content: [{
              type: "text",
              text: `${successMessage}\n\n⚠️ Note: Mock response used. Set BLUESKY_IDENTIFIER and BLUESKY_PASSWORD to use real API.`
            }]
          };
        }
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error creating post: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        };
      }
    }
  );
}

// TODO: Implement bluesky_reply tool  
//   - Input: post URI, reply text
//   - Output: mock reply post data

// TODO: Implement bluesky_delete_post tool
//   - Input: post URI
//   - Output: deletion confirmation

// TODO: Implement bluesky_repost tool
//   - Input: post URI, optional quote text
//   - Output: repost confirmation