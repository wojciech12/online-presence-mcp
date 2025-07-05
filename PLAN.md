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
│   └── bluesky.ts    # Bluesky authentication with AtpAgent
├── types/            # TypeScript type definitions
│   └── bluesky.ts    # Bluesky-related types
├── utils/            # Utility functions
│   └── validation.ts # Input validation helpers
└── mocks/            # Mock data and responses (Phase 1 only)
    └── responses.ts  # Mock API responses
```

### 2. MCP Tools and Resources

#### 2.1 Tools (Actions with Side Effects) & Resources 1/2

Implementation will be broken down into individual tool substeps for incremental development and testing:

##### 2.1.1 Tool: bluesky_post
- Create a new text/media post on Bluesky
- **Implementation Steps:**
  1. Install MCP SDK dependencies
  2. Create tool registration with input schema validation
  3. Implement mock response generator
  4. Write tests against the tool interface
  5. Run tests and validate functionality
- **Input:** text content, optional media attachments
- **Output:** mock post ID and confirmation

##### 2.1.1B Tool: bluesky_post real API ✅ COMPLETED
- Integrate with actual Bluesky API for post creation
- **Implementation Steps:**
  1. ✅ Add end-to-end test that runs against Bluesky instance
  2. ✅ Replace mock response with real AtpAgent API call
  3. ✅ Add authentication handling and error management
  4. ✅ Test against live Bluesky instance with test account
  5. ✅ Validate real post creation and response handling

  You *MUST* official bluesky SDK `@atproto/api`. Must not use deprecated `BskyAgent`. You must one `AtpAgent`. Use context7 mcp to verify how to use the SDK. Do not add more files if it is not absolutely important. 
 
##### 2.1.2 Resource: bluesky_get_timeline ✅ COMPLETED
- Get user's authored posts (timeline of posts created by the user account)
- **Implementation Steps:**
  1. ✅ Create Resource registration with pagination parameters
  2. ✅ Implement mock timeline response generator
  3. ✅ Add cursor-based pagination handling
  4. ✅ Write tests for timeline functionality
  5. ✅ Run tests and validate timeline structure
- **Input:** optional limit, cursor for pagination
- **Output:** mock timeline with user's posts

##### 2.1.2B Resource: bluesky_get_timeline real API ✅ COMPLETED
- Integrate with actual Bluesky API for user timeline retrieval
- **Implementation Steps:**
  1. ✅ Add end-to-end test that runs against Bluesky instance
  2. ✅ Replace mock response with real AtpAgent API call
  3. ✅ Add pagination and cursor handling
  4. ✅ Test against live Bluesky instance with real timeline data
  5. ✅ Validate timeline retrieval and post data accuracy

End-to-End tests (against real bluesky instnce):

- ✅ *MUST* run against a real bluesky instance
- ✅ *MUST* test the blue_get_timeline MCP implementation.
- ✅ You *MUST NOT* test the Bsky SDK or MCP SDK.
- ✅ Check whether you can list 2 added posts - Successfully verified 10 posts with 2 distinct posts validated. 

##### 2.1.3 Tool: bluesky_delete_post
No mocks.
- Delete user's own Bluesky post (works with posts from timeline)
- **Implementation Steps:**
  1. Create tool registration with URI validation
  2. Use AtpAgent
  3. Implement deletion confirmation against a real running Bleusky instance
  4. Add error handling for invalid/unauthorized deletions
  5. Write end2end tests for deletion scenarios - adding and deleting posts, YOU MUST ONLY DELETE the posts you created in the test
  6. Run end2end tests and validate error handling
- **Input:** post URI (can be obtained from bluesky_post or bluesky_timeline)
- **Output:** deletion confirmation

#### TODO: use bluesky_delete_post to clean the bluesky instance after the post and timeline tests.





##### 2.1.4 Tool: bluesky_reply
- Reply to an existing Bluesky post
- **Implementation Steps:**
  1. Create tool registration with reply-specific schema
  2. Implement reply threading logic in mock response
  3. Add validation for post URI format
  4. Write tests for reply functionality
  5. Run tests and validate reply structure
- **Input:** post URI, reply text
- **Output:** mock reply post data

##### 2.1.4B Tool: bluesky_reply real API
- Integrate with actual Bluesky API for reply functionality
- **Implementation Steps:**
  1. Add end-to-end test that runs against Bluesky instance
  2. Replace mock response with real AtpAgent reply API call
  3. Add post URI resolution and threading validation
  4. Test against live Bluesky instance with real post replies
  5. Validate reply threading and parent-child relationships

##### 2.1.5 Tool: bluesky_repost
- Repost or quote-post Bluesky content
- **Implementation Steps:**
  1. Create tool registration supporting both repost types
  2. Implement logic to distinguish repost vs quote-post
  3. Generate appropriate mock responses for each type
  4. Write tests for both repost variations
  5. Run tests and validate repost behavior
- **Input:** post URI, optional quote text
- **Output:** repost confirmation

##### 2.1.5B Tool: bluesky_repost real API
- Integrate with actual Bluesky API for repost functionality
- **Implementation Steps:**
  1. Add end-to-end test that runs against Bluesky instance
  2. Replace mock response with real AtpAgent repost/quote API calls
  3. Add validation for repost vs quote-post logic
  4. Test against live Bluesky instance with both repost types
  5. Validate repost creation and quote-post embedding

##### 2.1.6 Tool: bluesky_search_users
- Search for users on Bluesky platform
- **Implementation Steps:**
  1. Create tool registration with search query validation
  2. Implement realistic user search result generator
  3. Add pagination and limit handling
  4. Write tests for various search scenarios
  5. Run tests and validate search results format
- **Input:** search query, optional limit
- **Output:** mock user search results

##### 2.1.6B Tool: bluesky_search_users real API
- Integrate with actual Bluesky API for user search
- **Implementation Steps:**
  1. Add end-to-end test that runs against Bluesky instance
  2. Replace mock response with real AtpAgent search API call
  3. Add pagination and search parameter handling
  4. Test against live Bluesky instance with various search queries
  5. Validate user search results and profile data accuracy

##### 2.1.7 Tool: bluesky_search_posts
- Search for posts on Bluesky platform
- **Implementation Steps:**
  1. Create tool registration with search filters
  2. Implement post search result generator with metadata
  3. Add time-based filtering and pagination
  4. Write tests for filtered and unfiltered searches
  5. Run tests and validate post search results
- **Input:** search query, optional filters
- **Output:** mock post search results

##### 2.1.7B Tool: bluesky_search_posts real API
- Integrate with actual Bluesky API for post search
- **Implementation Steps:**
  1. Add end-to-end test that runs against Bluesky instance
  2. Replace mock response with real AtpAgent post search API call
  3. Add search filtering and time-based query parameters
  4. Test against live Bluesky instance with various post searches
  5. Validate post search results and content metadata accuracy

##### 2.1.8 Tool: bluesky_mark_notifications_read
- Mark Bluesky notifications as read
- **Implementation Steps:**
  1. Create tool registration with flexible input options
  2. Implement batch and individual notification handling
  3. Add validation for notification ID formats
  4. Write tests for various marking scenarios
  5. Run tests and validate notification state changes
- **Input:** notification IDs or mark all flag
- **Output:** confirmation with count

##### 2.1.8B Tool: bluesky_mark_notifications_read real API
- Integrate with actual Bluesky API for notification management
- **Implementation Steps:**
  1. Add end-to-end test that runs against Bluesky instance
  2. Replace mock response with real AtpAgent notification API calls
  3. Add batch processing and notification ID validation
  4. Test against live Bluesky instance with real notifications
  5. Validate notification read state changes and count accuracy

#### 2.2 Tools and Resources (Read-Only Data Access) 2/2

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
- Integration with `@atproto/api` and `AtpAgent`
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