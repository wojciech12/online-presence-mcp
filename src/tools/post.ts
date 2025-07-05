/**
 * Post Management Tools
 * 
 * MCP tools for creating and managing Bluesky posts
 * These are actions with side effects (CREATE, UPDATE, DELETE operations)
 * Phase 2.1.1B: Real API implementation with AtpAgent
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
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
            // API call failed, return error
            return {
              content: [{
                type: "text",
                text: `Error creating post: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`
              }],
              isError: true
            };
          }
        } else {
          // No credentials, return error
          return {
            content: [{
              type: "text",
              text: "Error creating post: Missing Bluesky credentials. Please set BLUESKY_IDENTIFIER and BLUESKY_PASSWORD environment variables."
            }],
            isError: true
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

export function registerBlueskyDeletePostTool(server: McpServer) {
  // bluesky_delete_post - Delete a user's own post
  server.registerTool(
    "bluesky_delete_post",
    {
      title: "Delete Bluesky Post",
      description: "Delete a user's own Bluesky post using the post URI",
      inputSchema: {
        postUri: z.string()
          .min(1, "Post URI cannot be empty")
          .refine((uri) => {
            // Validate AT-URI format: at://did:plc:xxx/app.bsky.feed.post/xxx
            const atUriRegex = /^at:\/\/did:[a-z0-9:]+\/app\.bsky\.feed\.post\/[a-zA-Z0-9]+$/;
            return atUriRegex.test(uri);
          }, "Post URI must be a valid AT-URI format (at://did:plc:xxx/app.bsky.feed.post/xxx)")
          .describe("The AT-URI of the post to delete")
      }
    },
    async ({ postUri }) => {
      try {
        // Try to use real API if credentials are available
        const authConfig = getAuthConfigFromEnv();
        
        if (authConfig) {
          // Real API implementation
          try {
            await initializeBlueskyAuth(authConfig);
            const agent = getAuthenticatedAgent();
            
            // Use AtpAgent.deletePost to delete the post
            await agent.deletePost(postUri);

            return {
              content: [{
                type: "text",
                text: `Post deleted successfully! 🗑️\n\nDeleted post URI: ${postUri}\nDeleted at: ${new Date().toLocaleString()}`
              }]
            };
          } catch (apiError) {
            // API call failed, return error
            const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
            
            // Check for specific error types based on actual API responses
            if (errorMessage.includes('not found') || errorMessage.includes('404') || errorMessage.includes('Could not find repo') || errorMessage.includes('Could not find record')) {
              return {
                content: [{
                  type: "text",
                  text: `Error deleting post: Post not found. The post may have already been deleted or the URI is invalid.\n\nURI: ${postUri}`
                }],
                isError: true
              };
            } else if (errorMessage.includes('unauthorized') || errorMessage.includes('forbidden')) {
              return {
                content: [{
                  type: "text",
                  text: `Error deleting post: You are not authorized to delete this post. You can only delete your own posts.\n\nURI: ${postUri}`
                }],
                isError: true
              };
            } else {
              return {
                content: [{
                  type: "text",
                  text: `Error deleting post: ${errorMessage}\n\nURI: ${postUri}`
                }],
                isError: true
              };
            }
          }
        } else {
          // No credentials, return error
          return {
            content: [{
              type: "text",
              text: "Error deleting post: Missing Bluesky credentials. Please set BLUESKY_IDENTIFIER and BLUESKY_PASSWORD environment variables."
            }],
            isError: true
          };
        }
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error deleting post: ${error instanceof Error ? error.message : 'Unknown error'}\n\nURI: ${postUri}`
          }],
          isError: true
        };
      }
    }
  );
}

// TODO: Implement bluesky_repost tool
//   - Input: post URI, optional quote text
//   - Output: repost confirmation