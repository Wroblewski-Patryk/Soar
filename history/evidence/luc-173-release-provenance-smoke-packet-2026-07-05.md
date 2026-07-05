# LUC-173 Release Provenance And Smoke Packet - 2026-07-05

## Scope

- Issue: [LUC-173](/LUC/issues/LUC-173)
- Owner role: DRE (Deployment and Reliability Engineer)
- Stage: verification
- Operation mode: no-mutation release provenance reconciliation
- Forbidden boundary preserved: no push, deploy, restart, rollback, env edit,
  secret/account readback, DB/Redis mutation, production account action,
  exchange/payment/order/position/subscription action, or live-trading action.

## Source Provenance

- Application: Soar
- Repo path: `C:\Personal\Projekty\Aplikacje\Soar`
- Branch: `main`
- Remote: `origin` -> `https://github.com/Wroblewski-Patryk/Soar.git`
- Local HEAD: `33ff4ab33ec0dde91b45254cbded75dc85eaad77`
- Local HEAD short: `33ff4ab3`
- Local HEAD subject: `chore: record Soar RC evidence packet`
- Upstream `origin/main`: `cf9011b43060c52941dae9232e9a1ca4392ca3f2`
- Upstream subject: `fix: preserve live dca aggregate fallback positions`
- Divergence at check time: `0` behind / `3` ahead.
- Worktree status: dirty before this packet; multiple docs/state/graph/evidence
  paths were already modified by other owner lanes. This packet added only this
  evidence file and Paperclip issue records.

## Public Production Readback

- Target environment: Soar production
- Web base URL: `https://soar.luckysparrow.ch`
- API base URL: `https://api.soar.luckysparrow.ch`
- Public build-info readback at `2026-07-05T01:42:52Z`:
  - HTTP status: `200`
  - `buildId`: `aiz87yp_HNLVycecEbvSx`
  - `gitSha`: `cf9011b43060c52941dae9232e9a1ca4392ca3f2`
  - `gitRef`: `main`
  - `metadataGeneratedAt`: `2026-07-04T20:27:38.719Z`
  - `metadataSource`: `env-runtime`
  - `checkedAt`: `2026-07-05T01:42:52.961Z`
- API `/health` readback:
  - HTTP status: `200`
  - payload status: `ok`
- API `/ready` readback:
  - HTTP status: `200`
  - payload status: `ready`

## Smoke Result

Command:

```powershell
pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`
- Overall: `all checks passed`

Workers were intentionally skipped because this issue requested public
source/build provenance and smoke packet reconciliation without protected
auth/session use or production mutation.

## Local Build Gate

Command:

```powershell
pnpm run build
```

Result: failed with exit `1`; wrapper output did not include the useful package
failure, so package builds were narrowed.

API command:

```powershell
pnpm --filter api run build
```

Result: failed with TypeScript errors in
`apps/api/src/middleware/requireAuth.test.ts`.

Blocking errors:

- `src/middleware/requireAuth.test.ts(127,32): error TS2345: Argument of type 'string' is not assignable to parameter of type 'string[]'.`
- `src/middleware/requireAuth.test.ts(134,32): error TS2345: Argument of type 'string' is not assignable to parameter of type 'string[]'.`
- `src/middleware/requireAuth.test.ts(161,32): error TS2345: Argument of type 'string' is not assignable to parameter of type 'string[]'.`
- `src/middleware/requireAuth.test.ts(180,32): error TS2345: Argument of type 'string' is not assignable to parameter of type 'string[]'.`
- `src/middleware/requireAuth.test.ts(194,63): error TS2345: Argument of type '{ id: string; email: string; role: "USER"; sessionVersion: number; }' is not assignable to parameter of type full Prisma user shape.`
- `src/middleware/requireAuth.test.ts(204,32): error TS2345: Argument of type 'string' is not assignable to parameter of type 'string[]'.`

Web command:

```powershell
pnpm --filter web run build
```

Result: passed production Next.js build for local HEAD
`33ff4ab33ec0dde91b45254cbded75dc85eaad77`; the build wrote local Web
metadata `.build-meta\BUILD_META.json` with `source=git`. The output also
reported a non-fatal ESLint plugin load warning for `eslint-plugin-react-hooks`
from the Next config chain after the successful build.

## Classification

- Production public availability: implemented and verified for API `/health`,
  API `/ready`, Web `/`, and Web `/api/build-info`.
- Deployed source provenance: stale relative to local `main` HEAD. Production
  reports `cf9011b43060c52941dae9232e9a1ca4392ca3f2`, while local candidate is
  `33ff4ab33ec0dde91b45254cbded75dc85eaad77`.
- Build metadata source: present but not release-grade enough by itself because
  production reports `metadataSource=env-runtime`; it is useful readback but not
  a full immutable build artifact proof.
- Local release build gate: blocked by API TypeScript build failure in
  `requireAuth.test.ts`. Web build is implemented and verified locally.
- Push/deploy/restart/rollback approval: required before any production mutation.
  Not requested in this heartbeat because the packet is not release-ready while
  API build fails and the worktree is dirty/divergent.

## Release Packet Fields

- Source commit candidate: `33ff4ab33ec0dde91b45254cbded75dc85eaad77`
- Deployed build-info SHA: `cf9011b43060c52941dae9232e9a1ca4392ca3f2`
- Metadata source: `env-runtime`
- Target environment: Coolify/VPS production, public endpoints
  `https://soar.luckysparrow.ch` and `https://api.soar.luckysparrow.ch`
- Expected Coolify resource set from existing owner paths: `soar-api`,
  `soar-web`, `workers-backtest`, `workers-execution`, `workers-market-data`,
  `workers-market-stream`, `postgresql`, and `redis`
- Rollback path: do not roll back from this packet. If a future approved deploy
  of local HEAD regresses public or protected smoke, use the established Soar
  deployment rollback playbook to redeploy the last known good production SHA,
  currently `cf9011b43060c52941dae9232e9a1ca4392ca3f2`, after Ops approval and
  rollback guard evidence.
- Smoke plan before promotion:
  1. Restore clean/coherent source-control state and resolve API build failure.
  2. Run `pnpm --filter api run build`, `pnpm --filter web run build`, and the
     relevant focused API/Web regression tests.
  3. Obtain explicit approval for push/deploy because Coolify auto-redeploy can
     mutate production.
  4. After deploy convergence, verify Web `/api/build-info` equals promoted SHA.
  5. Run public deploy smoke, protected worker readiness/runtime freshness,
     rollback guard, and authenticated acceptance using approved non-secret
     evidence handling.

## Existing Owner Paths

This packet does not create a second release lane. It links and preserves these
existing owner paths:

- [LUC-6461](/LUC/issues/LUC-6461): source/build provenance owner path.
- [LUC-6002](/LUC/issues/LUC-6002): protected input / credential owner path.
- [LUC-4103](/LUC/issues/LUC-4103): owner-login / local-board review path.
- [LUC-241](/LUC/issues/LUC-241): worker-smoke authentication path.
- [LUC-6820](/LUC/issues/LUC-6820): regression evidence path.

## Result

[LUC-173](/LUC/issues/LUC-173) can close as
`DONE / PUBLIC_SMOKE_PASS / PRODUCTION_SHA_STALE_TO_LOCAL_HEAD /
API_BUILD_BLOCKED / NO_RELEASE_MUTATION`.

Next owner/action: Core Backend Engineer fixes the API build blocker in
`apps/api/src/middleware/requireAuth.test.ts`; DRE/Ops can then rerun this
packet and, only if all build and smoke gates pass, request explicit
push/deploy approval.
