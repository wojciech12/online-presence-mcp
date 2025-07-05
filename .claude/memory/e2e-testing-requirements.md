# End-to-End Testing Requirements

## CRITICAL REQUIREMENTS FOR ALL INTEGRATIONS

These requirements apply to **ALL** future integrations and implementations, not only Bluesky, and for **ALL** types of operations (timeline retrieval, creating posts, deleting posts, etc.).

### Mandatory E2E Test Requirements

- **MUST** run against a real live instance (never mock data in E2E tests)
- **MUST** test the MCP implementation directly (tools/resources)
- **MUST NOT** test the underlying SDK or MCP SDK directly
- **MUST** verify actual data operations and functionality

### Implementation Scope

This applies to:
- ✅ Timeline/feed retrieval operations
- ✅ Post creation operations  
- ✅ Post deletion operations
- ✅ User profile operations
- ✅ Search operations
- ✅ Any future social media integrations (Twitter, LinkedIn, etc.)
- ✅ Any future API integrations beyond social media

### Test Validation Requirements

- Verify real data is returned (not mock responses)
- Validate actual operations succeed against live APIs
- Test with real credentials and authentication
- Ensure proper error handling without mock fallbacks
- Validate data structure and content accuracy

### Why This Matters

- Ensures our MCP layer works correctly with real APIs
- Validates authentication and authorization flows
- Tests actual network conditions and API responses
- Proves end-to-end functionality for users
- Catches integration issues that unit tests miss

## Example Success Criteria

From bluesky_get_timeline implementation:
- ✅ Successfully verified 10 posts with 2 distinct posts validated
- ✅ Real API integration confirmed with `metadata.source === 'real_api'`
- ✅ No mock fallback occurred during testing
- ✅ Actual Bluesky data retrieved and validated

This standard must be maintained for all future work.