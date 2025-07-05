# Bluesky API Specifications - Key Behaviors

## Post Deletion - Idempotent Behavior

**Critical Finding**: Bluesky's `deletePost` API (`com.atproto.repo.deleteRecord`) is **idempotent**.

### API Behavior
- **Endpoint**: `com.atproto.repo.deleteRecord`
- **Description**: "Delete a repository record, or ensure it doesn't exist"
- **Idempotency**: Calling delete on the same post URI multiple times has the same effect
- **No Error on Double Delete**: Does not return "not found" errors when deleting already-deleted posts

### AtpAgent Implementation
```typescript
await agent.deletePost(postUri); // First call - deletes post
await agent.deletePost(postUri); // Second call - succeeds (idempotent)
```

### Error Handling Patterns
- `Could not find repo` - Repository/DID doesn't exist
- `Could not find record` - Record doesn't exist  
- Both treated as "not found" scenarios in error handling

### Testing Implications
- **Don't expect failures** on double delete operations
- Design tests to handle both success and "not found" responses
- API designed for "ensure deleted" semantics rather than strict deletion validation

### MCP Integration Notes
- MCP tools should mirror this idempotent behavior in response formatting
- Test suites must account for idempotency when validating delete operations
- Error classification should handle API's "ensure doesn't exist" design

## References
- [Official API Docs](https://docs.bsky.app/docs/api/com-atproto-repo-delete-record)
- [AT Protocol Repository](https://github.com/bluesky-social/atproto)
- Context7 Library: `/bluesky-social/atproto`

## Implementation Date
January 2025 - Validated through E2E testing against live Bluesky instance