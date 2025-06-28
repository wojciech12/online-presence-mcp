# Bluesky Social MCP Server - Implementation Plan

## Phase 1: MCP Server Skeleton & Mock Implementation

### Overview
Create a minimal MCP server implementation with all Bluesky tools defined but using mock responses instead of real API calls. This allows us to establish the MCP interface structure and test tool definitions before integrating with the actual Bluesky SDK.

### 1. Project Setup

#### 1.1 Initialize TypeScript Project
- Create `package.json` with dependencies:
  - `@atproto/api` - Official Bluesky TypeScript SDK
  - `@modelcontextprotocol/sdk` - Core MCP SDK
  - `typescript`, `@types/node` - TypeScript support
  - `eslint`, `prettier` - Code quality tools
- Configure TypeScript (`tsconfig.json`)
- Set up bun build scripts and development workflow

#### 1.2 Project Structure
```
src/
├── index.ts          # MCP server entry point
├── tools/            # MCP tools for Bluesky interactions
│   ├── post.ts       # Create and manage posts
│   ├── feed.ts       # Read feeds and timeline
│   ├── profile.ts    # User profile management
│   ├── follow.ts     # Follow/unfollow operations
│   ├── search.ts     # Search functionality
│   └── notifications.ts # Notification interactions
├── auth/             # Authentication handling
│   └── bluesky.ts    # Bluesky authentication with BskyAgent
├── types/            # TypeScript type definitions
│   └── bluesky.ts    # Bluesky-related types
├── utils/            # Utility functions
│   └── validation.ts # Input validation helpers
└── mocks/            # Mock data and responses (Phase 1 only)
    └── responses.ts  # Mock API responses
```

### 2. MCP Tool Definitions

#### 2.1 Post Management Tools
- `bluesky_post` - Create a new text/media post
  - Input: text content, optional media attachments
  - Output: mock post ID and confirmation
- `bluesky_reply` - Reply to an existing post
  - Input: post URI, reply text
  - Output: mock reply post data
- `bluesky_delete_post` - Delete user's post
  - Input: post URI
  - Output: deletion confirmation
- `bluesky_repost` - Repost/quote content
  - Input: post URI, optional quote text
  - Output: repost confirmation

#### 2.2 Feed & Timeline Tools
- `bluesky_get_timeline` - Get user's home timeline
  - Input: optional cursor, limit
  - Output: mock feed with sample posts
- `bluesky_get_feed` - Get specific feed
  - Input: feed URI, optional cursor/limit
  - Output: mock feed content
- `bluesky_get_post` - Get individual post details
  - Input: post URI
  - Output: mock post with replies/interactions

#### 2.3 Search Tools
- `bluesky_search_users` - Search for users
  - Input: search query, optional limit
  - Output: mock user search results
- `bluesky_search_posts` - Search posts
  - Input: search query, optional filters
  - Output: mock post search results

#### 2.4 Notification Tools
- `bluesky_get_notifications` - Get user notifications
  - Input: optional cursor, limit
  - Output: mock notifications list
- `bluesky_mark_notifications_read` - Mark notifications as read
  - Input: notification IDs or mark all
  - Output: confirmation

### 3. Mock Implementation Strategy

#### 3.1 Mock Data Structure
Create realistic mock responses that mirror Bluesky's actual API structure:
- User profiles with handles, display names, follower counts
- Posts with text, timestamps, interaction counts
- Feed structures with cursors for pagination
- Error responses for validation/authentication scenarios

#### 3.2 Mock Response Generator
- Implement functions to generate consistent mock data
- Include realistic timestamps, IDs, and content
- Support pagination with mock cursors
- Handle edge cases (empty results, rate limits)

#### 3.3 Validation Without API Calls
- Validate input parameters (required fields, format checks)
- Return appropriate error messages for invalid inputs
- Simulate authentication states (logged in/out)
- Mock rate limiting scenarios

### 4. MCP Server Implementation

#### 4.1 Server Setup
- Initialize MCP server with tool registry
- Configure server metadata and capabilities
- Set up proper error handling and logging
- Implement graceful shutdown

#### 4.2 Tool Registration
- Register all Bluesky tools with proper schemas
- Define input/output parameter validation
- Implement consistent error handling across tools
- Add tool descriptions and examples

#### 4.3 Request Handling
- Parse and validate incoming tool requests
- Route requests to appropriate mock handlers
- Format responses according to MCP protocol
- Handle concurrent requests properly

### 5. Development & Testing

#### 5.1 Development Workflow
- Use `bun run dev` for automatic reloading during development
- Implement comprehensive logging for debugging
- Create sample tool invocations for testing
- Set up proper TypeScript compilation with bun

#### 5.2 Manual Testing
- Test each tool with various input combinations
- Verify error handling for invalid inputs
- Test pagination and cursor handling
- Validate response formats match expected schemas

#### 5.3 Integration Preparation
- Document all tool interfaces and expected behaviors
- Create mapping between mock responses and real API structure
- Identify authentication requirements for next phase
- Plan transition strategy to real Bluesky SDK integration

### 6. Documentation & Examples

#### 6.1 Tool Documentation
- Document each tool's purpose and usage
- Provide input/output examples
- Document error conditions and responses
- Create usage guides for common workflows

#### 6.2 Sample Workflows
- Create example scripts showing typical usage patterns
- Document authentication setup (for future implementation)
- Provide debugging and troubleshooting guides
- Create integration examples with MCP clients

### 7. Success Criteria

**Phase 1 Complete When:**
- Core Bluesky tools are defined and registered (posts, feeds, search, notifications)
- Mock responses are realistic and consistent
- MCP server starts and responds to tool requests
- Input validation works correctly
- Error handling is comprehensive
- All tools can be invoked without errors
- Code is well-documented and follows TypeScript best practices
- All development commands use bun (no npm dependencies)

### 8. Next Phase Preview

**Phase 2 will include:**
- Integration with `@atproto/api` and `BskyAgent`
- Real authentication with Bluesky credentials
- Actual API calls replacing mock responses
- Error handling for network and API issues
- Rate limiting and retry logic
- Comprehensive testing with real accounts
- Social interaction tools (follow/unfollow, get followers/following)
- Profile management tools (get profile, update profile)

This phased approach ensures we have a solid foundation and clear interface definitions before introducing the complexity of real API integration.