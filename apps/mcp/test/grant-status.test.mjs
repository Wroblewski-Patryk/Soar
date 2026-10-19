import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer as createHttpServer } from 'node:http';
import { once } from 'node:events';
import { createInterface } from 'node:readline';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createGrantStatusReader } from '../src/status-client.mjs';

const secret = `soar_ext_${'A'.repeat(43)}`;
const grantId = 'grant_001';
const fixturePath = fileURLToPath(new URL('./stdio-fixture.mjs', import.meta.url));
const grant = {
  id: grantId,
  status: 'ACTIVE',
  scope: { botId: 'bot_001', exchange: 'gateio', marketType: 'FUTURES',
    symbol: 'BTC/USDT:USDT', action: 'PLACE_LIVE_ORDER' },
  limits: { maxActionQuoteAmount: '50', maxTotalQuoteAmount: '100', maxActions: 2 },
  usage: { usedQuoteAmount: '0', usedActions: 0 },
  expiresAt: '2030-01-01T00:00:00.000Z',
};

async function withHttpServer(handler, run) {
  const server = createHttpServer(handler);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const address = server.address();
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

function startMcp(origin, options = {}) {
  const grantSecret = Object.hasOwn(options, 'grantSecret') ? options.grantSecret : secret;
  const env = { ...process.env, SOAR_MCP_TEST_ORIGIN: origin,
    SOAR_MCP_GRANT_ID: grantId };
  if (grantSecret === undefined) delete env.SOAR_MCP_GRANT_SECRET;
  else env.SOAR_MCP_GRANT_SECRET = grantSecret;
  const child = spawn(process.execPath, [fixturePath], { env, stdio: ['pipe', 'pipe', 'pipe'] });
  const pending = new Map();
  let stdout = '';
  let stderr = '';
  child.stderr.setEncoding('utf8').on('data', (chunk) => { stderr += chunk; });
  child.stdout.setEncoding('utf8');
  const lines = createInterface({ input: child.stdout });
  lines.on('line', (line) => {
    stdout += `${line}\n`;
    let message;
    try { message = JSON.parse(line); } catch { return; }
    const waiter = pending.get(message.id);
    if (waiter) { pending.delete(message.id); waiter.resolve(message); }
  });
  child.on('exit', () => {
    for (const waiter of pending.values()) waiter.reject(new Error('MCP process exited'));
    pending.clear();
  });
  function request(id, method, params) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`MCP ${method} timed out`));
      }, 4000);
      pending.set(id, {
        resolve: (value) => { clearTimeout(timeout); resolve(value); },
        reject: (error) => { clearTimeout(timeout); reject(error); },
      });
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
    });
  }
  return { child, request, get output() { return stdout + stderr; } };
}

async function withMcp(origin, options, run) {
  const mcp = startMcp(origin, options);
  try {
    const initialized = await mcp.request(1, 'initialize', {
      protocolVersion: '2025-11-25',
      capabilities: {}, clientInfo: { name: 'soar-local-test', version: '1.0.0' },
    });
    assert.equal(initialized.result.protocolVersion, '2025-11-25');
    mcp.child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0',
      method: 'notifications/initialized' })}\n`);
    await run(mcp);
  } finally {
    mcp.child.stdin.end();
    mcp.child.kill();
    assert.equal(mcp.output.includes(secret), false);
  }
}

test('stdio exposes only one no-argument read tool and returns synthetic own status', async () => {
  let calls = 0;
  await withHttpServer((req, res) => {
    calls++;
    assert.equal(req.method, 'GET');
    assert.equal(req.url, `/external-client/grants/${grantId}/status`);
    assert.equal(req.headers.authorization, `Bearer ${secret}`);
    assert.equal(req.headers.cookie, undefined);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ grant }));
  }, async (origin) => withMcp(origin, {}, async (mcp) => {
    const listed = await mcp.request(2, 'tools/list', {});
    assert.deepEqual(listed.result.tools.map(({ name }) => name), ['get_own_grant_status']);
    const deniedArgs = await mcp.request(3, 'tools/call', {
      name: 'get_own_grant_status', arguments: { url: 'https://elsewhere.example', secret },
    });
    assert.ok(deniedArgs.error || deniedArgs.result?.isError);
    assert.equal(JSON.stringify(deniedArgs).includes(secret), false);
    assert.equal(calls, 0);
    const called = await mcp.request(4, 'tools/call', {
      name: 'get_own_grant_status', arguments: {},
    });
    assert.equal(called.result.isError, undefined);
    assert.deepEqual(JSON.parse(called.result.content[0].text), { grant });
    assert.equal(calls, 1);
  }));
});

test('missing secret, revoked grant, and expired status fail closed over stdio', async () => {
  let calls = 0;
  let mode = 'revoked';
  await withHttpServer((_req, res) => {
    calls++;
    if (mode === 'revoked') { res.writeHead(401); res.end('revoked'); return; }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ grant: { ...grant, expiresAt: '2020-01-01T00:00:00.000Z' } }));
  }, async (origin) => {
    await withMcp(origin, { grantSecret: undefined }, async (mcp) => {
      const result = await mcp.request(2, 'tools/call', {
        name: 'get_own_grant_status', arguments: {},
      });
      assert.equal(result.result.isError, true);
      assert.equal(result.result.content[0].text, 'Grant status unavailable');
      assert.equal(calls, 0);
    });
    await withMcp(origin, {}, async (mcp) => {
      const result = await mcp.request(2, 'tools/call', {
        name: 'get_own_grant_status', arguments: {},
      });
      assert.equal(result.result.isError, true);
      assert.equal(result.result.content[0].text, 'Grant status unavailable');
    });
    mode = 'expired';
    await withMcp(origin, {}, async (mcp) => {
      const result = await mcp.request(2, 'tools/call', {
        name: 'get_own_grant_status', arguments: {},
      });
      assert.equal(result.result.isError, true);
      assert.equal(result.result.content[0].text, 'Grant status unavailable');
    });
    assert.equal(calls, 2);
  });
});

test('unsafe target and redirect never receive the grant secret', async () => {
  let unsafeFetches = 0;
  for (const origin of ['http://attacker.example', 'https://attacker.example',
    'https://api.soar.luckysparrow.ch/extra']) {
    const unsafe = createGrantStatusReader({ origin, grantId, secret,
      fetchImpl: () => { unsafeFetches++; } });
    await assert.rejects(unsafe(), /Grant status unavailable/);
  }
  assert.equal(unsafeFetches, 0);

  let redirectedCalls = 0;
  await withHttpServer((_req, res) => {
    redirectedCalls++;
    res.writeHead(200); res.end('unexpected');
  }, async (destination) => {
    await withHttpServer((_req, res) => {
      res.writeHead(302, { Location: destination }); res.end();
    }, async (origin) => {
      const reader = createGrantStatusReader({ origin, grantId, secret,
        testOnlyAllowLoopback: true });
      await assert.rejects(reader(), /Grant status unavailable/);
    });
  });
  assert.equal(redirectedCalls, 0);
});
