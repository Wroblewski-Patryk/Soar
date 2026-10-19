// Dedicated test entrypoint: production src/index.mjs never enables HTTP.
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { createBotStatusReader, createGrantStatusReader } from '../src/status-client.mjs';
import { createServer } from '../src/server.mjs';

const readGrantStatus = createGrantStatusReader({
  origin: process.env.SOAR_MCP_TEST_ORIGIN,
  grantId: process.env.SOAR_MCP_GRANT_ID,
  secret: process.env.SOAR_MCP_GRANT_SECRET,
  testOnlyAllowLoopback: true,
});
const readBotStatus = createBotStatusReader({
  origin: process.env.SOAR_MCP_TEST_ORIGIN,
  botId: process.env.SOAR_MCP_BOT_ID,
  secret: process.env.SOAR_MCP_BOT_READ_SECRET,
  testOnlyAllowLoopback: true,
});
await serveStdio(() => createServer(readGrantStatus, readBotStatus));
