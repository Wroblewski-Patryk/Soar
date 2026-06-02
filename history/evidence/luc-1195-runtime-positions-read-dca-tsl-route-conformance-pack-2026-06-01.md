# LUC-1195 - Runtime Positions Read DCA/TSL Route-Level Conformance Pack

Date: 2026-06-01
Owner lane: Backend API Engineer
Status: `blocked`

## Consolidated Pack Command

```bash
pnpm --filter api run test:conformance:runtime-positions-dca-tsl-routes
```

Command contract source:
- `apps/api/package.json` -> `test:conformance:runtime-positions-dca-tsl-routes`

## Execution Result (this heartbeat)

- Outcome: `FAIL` (non-zero exit)
- Failing segment:
  - `src/modules/bots/bots.e2e.test.ts` targeted route-level test
  - test name: `maps dynamic TTP/TSL lifecycle in runtime positions payload (pre-arm, post-arm, fallback)`
- Blocker signature:
  - `PrismaClientInitializationError`
  - `Can't reach database server at localhost:5432`
  - first failing call chain includes `resetBotsE2eState -> prisma.log.deleteMany()`

## Local Dependency Unblock Attempt

- `docker compose ps` executed at repo root.
- Result: failed before compose inspection because Docker Desktop engine pipe was unavailable:
  - `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.`

## Classification

- Conformance pack path: `implemented`.
- Route-level DCA/TSL proof run: `blocked by error` (local DB runtime dependency unavailable).

## Unblock Owner / Next Action

1. Backend/Ops local runtime owner: bring up reachable local DB/cache dependencies (`localhost:5432`/`localhost:6379`) or equivalent test services.
2. Backend/QA lane: rerun
   - `pnpm --filter api run test:conformance:runtime-positions-dca-tsl-routes`
   and attach passing closure packet.
