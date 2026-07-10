# LUC-172 Protected Authenticated Browser Proof Packet

## Status

- Result: `READY_FOR_PROTECTED_RUN / LOCAL_HELPER_PROOF_PASS / PRODUCTION_RUN_GATED`
- Issue: [LUC-172](/LUC/issues/LUC-172)
- Date: 2026-07-10
- Role: QA and Verification Engineer

## Scope

Prepare the smallest executable authenticated browser proof packet for Soar
runtime/trading top flows without exposing secrets or mutating LIVE trading
state.

This heartbeat did not run production protected smoke because the wake comment
explicitly forbids protected smoke/live account mutation until protected gate
evidence exists. Existing production auth proof evidence from
[LUC-212](/LUC/issues/LUC-212) and [LUC-229](/LUC/issues/LUC-229) is treated as
prior evidence, not as a fresh LUC-172 protected run.

## Affected Capability Chain

| Capability | Route / action | Proof mode | Required evidence | Stop condition |
| --- | --- | --- | --- | --- |
| Auth/session boundary | `/dashboard`, `/auth/login`, `/auth/me`, `/auth/logout` | Browser + API session proof | Redirect paths, HTTP status summaries, body text length only | Missing approved session; token/cookie value would need capture; logout does not fail closed |
| Dashboard runtime | `/dashboard` | Authenticated browser render | Desktop and mobile route render, no auth flash, no console/network critical errors | Route redirects unexpectedly, API 401/5xx after auth, visible runtime crash |
| Bots runtime monitoring | `/dashboard/bots`, bot detail/runtime graph routes | Read-only browser/API readback | Loaded route, runtime graph/status summaries, no activation controls used | Requires enabling a bot, LIVE opt-in, assistant mutation, or exchange action |
| Manual orders | `/dashboard/orders/manual-context`, order readback routes | Read-only context proof only by default | Manual context response status and UI state; optional PAPER fixture proof only with explicit fixture approval | Requires LIVE order, cancel, close, subscription/API-key mutation, or trading setting mutation |
| Positions/orders readback | `/dashboard/orders`, `/dashboard/positions` or equivalent dashboard panels | Read-only browser/API proof | Route reachability and masked row-count/status summaries | Requires exchange-side mutation or raw external account detail capture |
| Backtests/reports | `/dashboard/backtests`, backtest report/trades/timeline routes | Read-only browser/API proof; disposable fixture proof only with explicit fixture approval | Route reachability, report lifecycle/status summaries, cleanup proof if fixtures are created | Fixture cleanup fails; production worker/report route returns unrecoverable 5xx |

## Desktop / Mobile Coverage

- Desktop: Chromium/Edge headless CDP viewport should cover the dashboard shell
  and primary content panes for the authenticated routes above.
- Mobile: a second CDP/browser pass should use a mobile-size viewport before
  closure if visual/responsive evidence is required by the parent release gate.
- Evidence must store route paths, HTTP status codes, text lengths, and
  redacted summaries only. Do not store screenshots that show credentials,
  cookies, tokens, API keys, payment data, exchange credentials, or account
  secrets.

## Preconditions

- Approved protected session source:
  `SOAR_PROD_TEST_EMAIL` and `SOAR_PROD_TEST_PASSWORD`, or an approved
  transient token through the existing `PROD_AUTH_TOKEN` / `PROD_FIXTURE_AUTH_*`
  mechanism.
- Public build-info must return `200`; if `--expected-sha` is supplied, it must
  match the deployed build.
- Any fixture-mutating proof requires explicit production fixture approval and
  must remain PAPER/disposable. LIVE orders, LIVE cancels, LIVE closes, API-key
  secret disclosure, subscriptions, exchange settings, and trading settings are
  forbidden.

## Existing Executable Helpers

- `scripts/runProdAuthSessionBrowserProof.mjs`
  - Non-mutating production auth/browser proof.
  - Supports `SOAR_PROD_TEST_EMAIL` and `SOAR_PROD_TEST_PASSWORD` fallback refs.
  - Redacts tokens, passwords, cookies, private headers, and response bodies.
- `scripts/runProdFixtureActionProof.mjs`
  - Disposable production fixture proof for broader runtime/trading surface.
  - Supports `SOAR_PROD_TEST_EMAIL` and `SOAR_PROD_TEST_PASSWORD` fallback refs.
  - Requires `--i-understand-production-fixture-risk`.
  - Must not be used for LIVE exchange-side actions.

## Validation

- `git diff --check`
  - Result: PASS, no whitespace errors.
- `node --test scripts/runProdAuthSessionBrowserProof.test.mjs scripts/runProdFixtureActionProof.test.mjs`
  - Result: PASS, `12/12` tests.
- Broad command attempted:
  `corepack pnpm exec vitest run scripts/runProdAuthSessionBrowserProof.test.mjs scripts/runProdFixtureActionProof.test.mjs --pool=forks --maxWorkers=1 --minWorkers=1 --test-timeout 30000`
  - Result: FAIL, because Vitest discovered stale copied tests under
    `.paperclip/worktrees/*/scripts/*.test.mjs`; current-checkout focused
    Node proof passed.

## Source Control Disposition

- Before this LUC-172 evidence update, the worktree was clean and `main` was
  `3` commits ahead of `origin/main`:
  - `da82334c test: support Soar protected smoke account refs`
  - `50b9ebe4 docs: record protected auth smoke evidence`
  - `a08ce18e chore: close Soar source-control sidecar`
- Push/deploy are forbidden by this issue wake.
- This evidence packet is docs/history/context only and should be locally
  committed before closure if the final dirty set remains limited to this
  LUC-172 packet and source-of-truth updates.

## Regression Risk

- Low runtime risk: no product runtime code was changed in this heartbeat.
- Medium validation risk: Vitest path discovery can accidentally include stale
  `.paperclip/worktrees` copies. Use Node's file-level runner for these helper
  tests unless the workspace excludes worktrees.
- Protected proof remains gated until a protected-session owner provides
  approved refs in the runner or accepts a protected smoke interaction.

## Follow-Up Gap

Run `scripts/runProdAuthSessionBrowserProof.mjs` with approved protected refs
and, if explicitly approved, run the fixture proof in PAPER/disposable mode.
Record the redacted artifact and cleanup evidence. Do not run LIVE trading
mutations under LUC-172.
