# Socials MCP

A Model Context Protocol (MCP) server that enables interaction with Bluesky social network.

## Overview

This MCP server provides tools to interact with Bluesky using the official TypeScript SDK (`@atproto/api`), allowing users to:

- Post text and media to their Bluesky feed
- Read and search posts
- Follow/unfollow users
- Manage user profiles
- Interact with notifications

## Technology Stack

- **Language**: TypeScript
- **Bluesky SDK**: `@atproto/api` (Official Bluesky TypeScript SDK)
- **Runtime**: Node.js
- **MCP**: Model Context Protocol

## Development Commands

```bash
# Install dependencies
bun install

# Build the project
bun run build

# Start development server
bun run dev

# Run tests
bun test

# Lint code
bun run lint

# Type check
bun run typecheck
```

## Project Structure

```
src/
├── index.ts          # MCP server entry point
├── tools/            # MCP tools for Bluesky interactions
│   ├── post.ts       # Create and manage posts
│   ├── feed.ts       # Read feeds and timeline
│   ├── profile.ts    # User profile management
│   ├── follow.ts     # Follow/unfollow operations
│   └── search.ts     # Search functionality
├── auth/             # Authentication handling
│   └── bluesky.ts    # Bluesky authentication with BskyAgent
├── types/            # TypeScript type definitions
│   └── bluesky.ts    # Bluesky-related types
└── utils/            # Utility functions
    └── validation.ts # Input validation helpers
```

## Authentication

Bluesky authentication using BskyAgent:

- Bluesky handle/identifier (e.g., handle.bsky.social)
- Password or App password
- Automatic JWT token management

## MCP Tools

### Post Management

- `bluesky_post` - Create a new post
- `bluesky_reply` - Reply to a post
- `bluesky_delete_post` - Delete a post
- `bluesky_repost` - Repost content

### Feed & Timeline

- `bluesky_get_timeline` - Get user's timeline
- `bluesky_get_feed` - Get specific feed
- `bluesky_get_post` - Get individual post details

### Social Interactions

- `bluesky_follow` - Follow a user
- `bluesky_unfollow` - Unfollow a user
- `bluesky_get_followers` - Get followers list
- `bluesky_get_following` - Get following list

### Profile Management

- `bluesky_get_profile` - Get user profile
- `bluesky_update_profile` - Update profile information

### Search

- `bluesky_search_users` - Search for users
- `bluesky_search_posts` - Search posts

## Environment Variables

```bash
BLUESKY_IDENTIFIER=your.handle.bsky.social
BLUESKY_PASSWORD=your-password-or-app-password
BLUESKY_SERVICE=https://bsky.social
```

## Dependencies

Core dependencies:

- `@atproto/api` - Official Bluesky TypeScript SDK
- `@modelcontextprotocol/sdk` - MCP SDK

Development dependencies:

- `typescript`
- `@types/node`
- `ts-node`
- `nodemon`
- `eslint`
- `prettier`

## Getting Started

1. Install dependencies: `bun add @atproto/api @modelcontextprotocol/sdk`
2. Set up environment variables
3. Build the project: `bun run build`
4. Configure MCP client to use this server

## Basic Usage Example

```typescript
import { BskyAgent } from "@atproto/api";

const agent = new BskyAgent({
  service: process.env.BLUESKY_SERVICE || "https://bsky.social",
});

await agent.login({
  identifier: process.env.BLUESKY_IDENTIFIER,
  password: process.env.BLUESKY_PASSWORD,
});

await agent.post({
  text: "Hello world! Posted via MCP.",
  createdAt: new Date().toISOString(),
});
```

## Error Handling

The MCP server implements comprehensive error handling for:

- Network connectivity issues
- Authentication failures
- Rate limiting
- Invalid input validation
- Bluesky API errors

## Rate Limiting

Respects Bluesky's rate limits and implements proper backoff strategies.

## Security

- Never log or expose authentication credentials
- Validate all user inputs
- Follow Bluesky's API guidelines and terms of service
