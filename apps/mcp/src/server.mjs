import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

export function createServer(readGrantStatus, readBotStatus) {
  const server = new McpServer({ name: 'soar-grant-status', version: '0.1.0' });
  server.registerTool('get_own_grant_status', {
    description: 'Read the current status and limits of the configured Soar grant.',
    inputSchema: z.object({}).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  }, async () => {
    try {
      const grant = await readGrantStatus();
      return { content: [{ type: 'text', text: JSON.stringify({ grant }) }] };
    } catch {
      return { isError: true, content: [{ type: 'text', text: 'Grant status unavailable' }] };
    }
  });
  server.registerTool('get_own_bot_status', {
    description: 'Read the persisted status of the one configured Soar bot.',
    inputSchema: z.object({}).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  }, async () => {
    try {
      const bot = await readBotStatus();
      return { content: [{ type: 'text', text: JSON.stringify({ bot }) }] };
    } catch {
      return { isError: true, content: [{ type: 'text', text: 'Bot status unavailable' }] };
    }
  });
  return server;
}
