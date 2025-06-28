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
├── tools/            # MCP tools (actions with side effects)
│   ├── post.ts       # Post management: create, reply, delete, repost
│   ├── search.ts     # Search functionality: users and posts
│   └── notifications.ts # Notification actions: mark as read
├── resources/        # MCP resources (read-only data access)
│   ├── timeline.ts   # Timeline and feed resources
│   ├── post.ts       # Individual post detail resources
│   └── notifications.ts # Notification data resources
├── auth/             # Authentication handling
│   └── bluesky.ts    # Bluesky authentication with BskyAgent
├── types/            # TypeScript type definitions
│   └── bluesky.ts    # Bluesky-related types
├── utils/            # Utility functions
│   └── validation.ts # Input validation helpers
└── mocks/            # Mock data and responses (Phase 1 only)
    └── responses.ts  # Mock API responses
```

### 2. MCP Tools and Resources

#### 2.1 Tools (Actions with Side Effects)

##### Post Management Tools
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

##### Search Tools
- `bluesky_search_users` - Search for users
  - Input: search query, optional limit
  - Output: mock user search results
- `bluesky_search_posts` - Search posts
  - Input: search query, optional filters
  - Output: mock post search results

##### Notification Tools
- `bluesky_mark_notifications_read` - Mark notifications as read
  - Input: notification IDs or mark all
  - Output: confirmation

#### 2.2 Resources (Read-Only Data Access)

##### Feed & Timeline Resources
- `bluesky://timeline` - User's home timeline
  - Parameters: optional cursor, limit
  - Content: mock feed with sample posts
- `bluesky://feed/{uri}` - Specific feed content
  - Parameters: feed URI, optional cursor/limit
  - Content: mock feed content
- `bluesky://post/{uri}` - Individual post details
  - Parameters: post URI
  - Content: mock post with replies/interactions

##### Notification Resources
- `bluesky://notifications` - User notifications
  - Parameters: optional cursor, limit
  - Content: mock notifications list

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
- Core Bluesky tools and resources are defined and registered (7 tools, 4 resources)
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

**Phase 2 Additional Tools:**
- `bluesky_follow` - Follow a user (action with side effect)
- `bluesky_unfollow` - Unfollow a user (action with side effect)
- `bluesky_update_profile` - Update profile information (action with side effect)

**Phase 2 Additional Resources:**
- `bluesky://profile/{identifier}` - User profile information (read-only)
- `bluesky://followers/{identifier}` - User's followers list (read-only)
- `bluesky://following/{identifier}` - User's following list (read-only)

This phased approach ensures we have a solid foundation and clear interface definitions before introducing the complexity of real API integration.