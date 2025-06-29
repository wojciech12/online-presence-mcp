/**
 * Bluesky Authentication Handling
 * 
 * Manages authentication with Bluesky using AtpAgent
 * Handles login, session management, and authentication errors
 */

import { AtpAgent } from "@atproto/api";

let globalAgent: AtpAgent | null = null;

export interface BlueskyAuthConfig {
  identifier: string;
  password: string;
  service?: string;
}

export interface AuthError extends Error {
  code?: string;
  status?: number;
}

/**
 * Initialize and authenticate with Bluesky
 */
export async function initializeBlueskyAuth(config: BlueskyAuthConfig): Promise<AtpAgent> {
  if (globalAgent) {
    return globalAgent;
  }

  const agent = new AtpAgent({
    service: config.service || 'https://bsky.social'
  });

  try {
    await agent.login({
      identifier: config.identifier,
      password: config.password
    });

    globalAgent = agent;
    return agent;
  } catch (error) {
    const authError = error as AuthError;
    
    // Enhance error with more context
    if (authError.message?.includes('Invalid identifier or password')) {
      throw new Error('Invalid Bluesky credentials. Please check your identifier and password.');
    } else if (authError.message?.includes('Network Error')) {
      throw new Error('Network error connecting to Bluesky. Please check your internet connection.');
    } else if (authError.message?.includes('Rate limit')) {
      throw new Error('Rate limited by Bluesky. Please try again later.');
    } else {
      throw new Error(`Authentication failed: ${authError.message || 'Unknown error'}`);
    }
  }
}

/**
 * Get authenticated agent or throw error
 */
export function getAuthenticatedAgent(): AtpAgent {
  if (!globalAgent) {
    throw new Error('Not authenticated with Bluesky. Please initialize authentication first.');
  }
  return globalAgent;
}

/**
 * Check if currently authenticated
 */
export function isAuthenticated(): boolean {
  return globalAgent !== null && globalAgent.session !== undefined;
}

/**
 * Clear authentication and reset agent
 */
export function clearAuthentication(): void {
  globalAgent = null;
}

/**
 * Get authentication configuration from environment variables
 */
export function getAuthConfigFromEnv(): BlueskyAuthConfig | null {
  const identifier = process.env.BLUESKY_IDENTIFIER;
  const password = process.env.BLUESKY_PASSWORD;
  
  if (!identifier || !password) {
    return null;
  }

  return {
    identifier,
    password,
    service: process.env.BLUESKY_SERVICE
  };
}