import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

export function createServer(readGrantStatus) {
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
  return server;
}
