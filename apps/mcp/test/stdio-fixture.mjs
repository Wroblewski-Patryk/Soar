// Dedicated test entrypoint: production src/index.mjs never enables HTTP.
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { createGrantStatusReader } from '../src/status-client.mjs';
import { createServer } from '../src/server.mjs';

const readGrantStatus = createGrantStatusReader({
  origin: process.env.SOAR_MCP_TEST_ORIGIN,
  grantId: process.env.SOAR_MCP_GRANT_ID,
  secret: process.env.SOAR_MCP_GRANT_SECRET,
  testOnlyAllowLoopback: true,
});
await serveStdio(() => createServer(readGrantStatus));
