/**
 * Mock API Responses
 * 
 * Mock data and response generators for Phase 2.1.1 implementation
 * Phase 2.1.1: bluesky_post mock responses
 */

export interface MockPostResponse {
  uri: string;
  cid: string;
  text: string;
  media?: string[];
  createdAt: string;
  author?: {
    did: string;
    handle: string;
    displayName: string;
  };
  replyCount?: number;
  repostCount?: number;
  likeCount?: number;
}

let postCounter = 0;

export function generateMockPostResponse(text: string, media?: string[]): MockPostResponse {
  const timestamp = Date.now();
  const counter = ++postCounter;
  const postId = `mock_post_${timestamp}_${counter}`;
  
  return {
    uri: `at://did:plc:mockuser123/app.bsky.feed.post/${postId}`,
    cid: `bafyrei${postId.slice(-20).padStart(20, '0')}`,
    text,
    media: media || [],
    createdAt: new Date().toISOString(),
    author: {
      did: "did:plc:mockuser123",
      handle: "mockuser.bsky.social",
      displayName: "Mock User"
    },
    replyCount: 0,
    repostCount: 0,
    likeCount: 0
  };
}

export function formatPostSuccessMessage(response: MockPostResponse): string {
  const mediaInfo = response.media && response.media.length > 0 
    ? `\nMedia attachments: ${response.media.length}`
    : "";
  
  return `Post created successfully! 🎉
Post URI: ${response.uri}
Author: @${response.author?.handle}
Text: "${response.text}"${mediaInfo}
Created: ${new Date(response.createdAt).toLocaleString()}`;
}