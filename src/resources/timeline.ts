/**
 * Timeline Resources
 * 
 * MCP resources for accessing Bluesky timeline data
 * These are read-only data access without side effects
 * Phase 2.1.2: Implementing bluesky_get_timeline resource
 */

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Timeline resource URI schema
const TimelineUriSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(20),
  cursor: z.string().optional()
});

export function registerBlueskyTimelineResource(server: McpServer) {
  // bluesky://timeline - User's authored posts timeline with pagination support
  server.registerResource(
    "bluesky-timeline",
    new ResourceTemplate("bluesky://timeline?limit={limit}&cursor={cursor}", {
      list: undefined
    }),
    {
      title: "Bluesky Timeline", 
      description: "Get user's authored posts (timeline of posts created by the user account)",
      mimeType: "application/json"
    },
    async (uri: any, { limit, cursor }: { limit?: string, cursor?: string }) => {
      try {
        // Parse and validate parameters with defaults
        const parsedParams = TimelineUriSchema.parse({ 
          limit: limit ? parseInt(limit, 10) : 20,
          cursor: cursor || undefined
        });
        
        // TODO: Phase 2.1.2B - Replace with real AtpAgent getAuthorFeed call
        // For now, return mock timeline data
        const mockTimeline = generateMockTimeline(parsedParams.limit, parsedParams.cursor);
        
        return {
          contents: [{
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(mockTimeline, null, 2)
          }]
        };
      } catch (error) {
        return {
          contents: [{
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify({
              error: `Failed to get timeline: ${error instanceof Error ? error.message : 'Unknown error'}`
            }, null, 2)
          }]
        };
      }
    }
  );
}

/**
 * Generate mock timeline data for testing
 */
function generateMockTimeline(limit: number = 20, cursor?: string) {
  const posts = [];
  const startIndex = cursor ? parseInt(cursor, 10) : 0;
  
  for (let i = 0; i < limit; i++) {
    const postIndex = startIndex + i;
    const timestamp = Date.now() - (postIndex * 60000); // Posts 1 minute apart
    const postId = `mock_timeline_post_${timestamp}_${postIndex}`;
    
    posts.push({
      uri: `at://did:plc:mockuser123/app.bsky.feed.post/${postId}`,
      cid: `bafyrei${postId.slice(-20).padStart(20, '0')}`,
      author: {
        did: 'did:plc:mockuser123',
        handle: 'mockuser.bsky.social',
        displayName: 'Mock User'
      },
      record: {
        $type: 'app.bsky.feed.post',
        text: `Mock timeline post #${postIndex + 1} - ${new Date(timestamp).toLocaleString()}`,
        createdAt: new Date(timestamp).toISOString()
      },
      replyCount: Math.floor(Math.random() * 5),
      repostCount: Math.floor(Math.random() * 10),
      likeCount: Math.floor(Math.random() * 20),
      indexedAt: new Date(timestamp).toISOString()
    });
  }
  
  const nextCursor = posts.length === limit && limit > 0 ? String(startIndex + limit) : undefined;
  
  return {
    feed: posts,
    cursor: nextCursor,
    total: posts.length,
    metadata: {
      source: 'mock',
      generated_at: new Date().toISOString(),
      user: 'mockuser.bsky.social',
      query_params: {
        limit,
        cursor: cursor || null
      }
    }
  };
}

// TODO: Implement bluesky://feed/{uri} resource
//   - Parameters: feed URI, optional cursor/limit
//   - Content: mock feed content