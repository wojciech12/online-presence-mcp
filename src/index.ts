/**
 * Bluesky Social MCP Server
 * 
 * A Model Context Protocol (MCP) server that enables interaction with Bluesky social network.
 * Phase 2.1.1: Implementing bluesky_post tool
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerBlueskyPostTool, registerBlueskyDeletePostTool } from "./tools/post.js";
import { registerBlueskyTimelineResource } from "./resources/timeline.js";

// Initialize MCP server
const server = new McpServer({
  name: "bluesky-social",
  version: "1.0.0"
});

console.log('Bluesky Social MCP Server starting...');

// Register bluesky_post tool (Phase 2.1.1)
registerBlueskyPostTool(server);

// Register bluesky_delete_post tool (Phase 2.1.3)
registerBlueskyDeletePostTool(server);

// Register bluesky_get_timeline resource (Phase 2.1.2)
registerBlueskyTimelineResource(server);

console.log('Registered bluesky_post, bluesky_delete_post tools and bluesky_get_timeline resource');

// Connect to transport and start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Bluesky Social MCP Server connected and ready");
}

// Start the server
main().catch(console.error);