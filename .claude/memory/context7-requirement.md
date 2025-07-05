# Context7 Documentation Requirement

## CRITICAL INSTRUCTION

**You MUST always use Context7 MCP to fetch the newest documentation for libraries and SDKs before implementing any functionality.**

## When to Use Context7

- **Before implementing any new features** - Always check latest SDK documentation
- **When encountering API errors** - Verify current method signatures and parameters
- **For library updates** - Ensure using current best practices and non-deprecated methods
- **When unsure about implementation details** - Get authoritative documentation

## Required Workflow

1. **Identify the library/SDK** you need to work with
2. **Use `mcp__context7__resolve-library-id`** to find the correct Context7-compatible library ID
3. **Use `mcp__context7__get-library-docs`** to fetch current documentation
4. **Implement based on latest docs** - Never rely on outdated examples or assumptions

## Examples of Libraries to Always Check

- `@atproto/api` (AtpAgent, authentication, API methods)
- `@modelcontextprotocol/sdk` (MCP server/client implementations)
- Any external APIs or SDKs used in the project

## Why This Is Critical

- **SDKs change rapidly** - Deprecations and new methods happen frequently
- **Avoid deprecated patterns** - Using old examples can introduce technical debt
- **Ensure compatibility** - Latest docs show current best practices
- **Prevent build failures** - Use correct method signatures and imports

## Never Implement Without Context7

❌ **DON'T**: Guess API signatures or use outdated examples
❌ **DON'T**: Rely on web search results that may be outdated
❌ **DON'T**: Assume previous implementations are still correct

✅ **DO**: Always fetch latest docs via Context7 first
✅ **DO**: Verify method signatures and parameters
✅ **DO**: Use current best practices from official documentation

## This Is Non-Negotiable

Context7 verification is **REQUIRED** for all library/SDK work. No exceptions.