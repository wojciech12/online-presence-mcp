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
- **Git**: Git and github CLI

## Development Commands

ONLY use bun, NEVER npm

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

## Working with Git

- Git branch name conventions:
  - prefix: 'feature/' 'bugfix/'
  - followed by descriptive name

- Git commit messages:
  - Use imperative mood (e.g., "Add feature" not "Added feature")
  - Keep subject line concise (50 chars or less)
  - Start with capital letter and don't end with period
  - Separate subject from body with a blank line for detailed explanations
  - NEVER ever mention a co-authored-by or similar aspects. In particular, never mention the tool used to create the commit message or PR.

## Pull Requests

- Create a detailed message of what changed. Focus on the high level description of the problem it tries to solve, and how it is solved. Don't go into the specifics of the code unless it adds clarity.

- NEVER ever mention a co-authored-by or similar aspects. In particular, never mention the tool used to create the commit message or PR.

## Project Structure

```
src/
├── index.ts          # MCP server entry point
├── tools/            # MCP tools for Bluesky interactions (actions with side effects)
│   ├── post.ts       # Post management (create, reply, delete, repost)
│   ├── search.ts     # Search functionality (users, posts)
│   └── notifications.ts # Notification management (mark as read)
├── resources/        # MCP resources for Bluesky data (read-only access)
│   ├── timeline.ts   # Timeline and feed data
│   ├── post.ts       # Individual post data
│   └── notifications.ts # Notification data
├── auth/             # Authentication handling
│   └── bluesky.ts    # Bluesky authentication with BskyAgent
├── mocks/            # Mock data for Phase 1 development
│   └── responses.ts  # Mock API responses and data generators
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
