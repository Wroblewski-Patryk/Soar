import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { createBotStatusReader, createGrantStatusReader, DEFAULT_API_ORIGIN } from './status-client.mjs';
import { createServer } from './server.mjs';

const readGrantStatus = createGrantStatusReader({
  origin: process.env.SOAR_MCP_API_ORIGIN || DEFAULT_API_ORIGIN,
  grantId: process.env.SOAR_MCP_GRANT_ID,
  secret: process.env.SOAR_MCP_GRANT_SECRET,
});
const readBotStatus = createBotStatusReader({
  origin: process.env.SOAR_MCP_API_ORIGIN || DEFAULT_API_ORIGIN,
  botId: process.env.SOAR_MCP_BOT_ID,
  secret: process.env.SOAR_MCP_BOT_READ_SECRET,
});

try {
  await serveStdio(() => createServer(readGrantStatus, readBotStatus));
} catch {
  // stdout is reserved for MCP, and runtime errors must not echo config.
  process.stderr.write('Soar MCP server unavailable\n');
  process.exitCode = 1;
}
