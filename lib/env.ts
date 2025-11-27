/**
 * Environment variable assertion utility
 * Ensures required env vars are present at startup, fails loudly if missing
 */

export function assertEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Environment variable ${key} is not set. ` +
      `Check .env.local and restart the server.`
    );
  }
  return value;
}
