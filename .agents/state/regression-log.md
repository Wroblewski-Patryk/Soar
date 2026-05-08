# Regression Log

Last updated: 2026-05-08

## Open Regressions

No open code regression is identified in the current backend runtime parity
slice. The earlier local DB-backed runtime e2e blocker was environmental:
`desktop-linux` Docker context was unhealthy, while the `default` context and
local Postgres/Redis ports were reachable. Sequential reruns passed.

## Fixed Or Prevented In This Slice

- 2026-05-08: Fixed a backend PAPER/LIVE runtime parity boundary leak in
  `executionOrchestrator`: close-settlement entry-fee aggregation now goes
  through the existing runtime trade gateway instead of a direct Prisma call in
  the shared orchestration path. Validation: focused engine parity/crash pack
  (`4/4` files, `26/26` tests), DB-backed runtime/order/exchange/import and
  readback packs, full local API suite with test-only API-key encryption env,
  API typecheck, and repository guardrails.
- 2026-05-08: Prevented market-stream worker source-selection drift for the
  Gate.io rollout. Worker env parsing now lives in a pure config resolver with
  tests proving Binance remains the default, Gate.io is explicit opt-in, and
  invalid env values fall back to safe defaults. Validation: focused
  worker/market-stream Vitest pack (`4` files, `8/8`) and API typecheck.
- 2026-05-08: Prevented Web capability-gating drift for Gate.io. Focused Web
  coverage now proves Gate.io is public-catalog only and remains blocked for
  paper pricing, live execution, and API-key probe until shared capability
  truth changes. Validation: focused Web Vitest pack (`3` files, `22/22`) and
  Web typecheck.
- 2026-05-08: Prevented product-form drift for Gate.io setup. Wallet create
  and bot create/edit form tests now prove Gate.io remains blocked for PAPER
  wallet save and bot activation while `PAPER_PRICING_FEED` is unsupported.
  Validation: focused Web Vitest pack (`3` files, `19/19`) and Web typecheck.
- 2026-05-08: Prevented direct API wallet drift for Gate.io setup. A
  DB-backed wallet e2e test now proves direct Gate.io PAPER wallet creation
  returns unsupported capability details and persists no user wallet while
  `PAPER_PRICING_FEED` is unsupported. Validation: focused wallet e2e
  (`21/21`), API typecheck, repository guardrails, docs parity, and diff check.
- 2026-05-08: Prevented wallet update bypass drift for Gate.io setup. A wallet
  CRUD e2e test now proves an existing Binance PAPER wallet cannot be updated
  to `GATEIO` while `PAPER_PRICING_FEED` is unsupported, and persisted wallet
  state remains unchanged after rejection. Validation: focused wallet CRUD e2e
  (`12/12`), API typecheck, repository guardrails, docs parity, and diff check.
- 2026-05-07: Ran production V1 release-gate classifier in dry-run mode and
  preserved stale evidence blockers as release state. This prevents treating
  old 2026-05-02 RC/backup/rollback artifacts as fresh V1 evidence.
- 2026-05-07: Refreshed activation audit and activation plan as current
  `NO-GO` artifacts, then reran the V1 gate dry-run to confirm those families
  are fresh while protected evidence remains blocked.
- 2026-05-07: Refreshed RC status, sign-off, and checklist as blocked/open
  evidence to prevent stale RC artifacts from being mistaken for current
  approval.
- 2026-05-07: Refreshed restore/rollback proof blockers as current failed
  artifacts to prevent old 2026-05-02 PASS artifacts from masking missing
  production DB/Coolify access and protected OPS auth.
- 2026-05-07: Monitored production web build-info freshness after the collector
  hardening push. Latest pushed `main` is `21bb52f1...`, while production
  still reported `6bf5de83...` after the first canonical wait. A later
  canonical wait passed for `21bb52f1...`, so the deploy-lag monitor is closed
  for the code/tooling commit.
- 2026-05-07: Prevented a false-positive `LIVEIMPORT-03` release evidence
  path in `ops:liveimport:readback`; the collector now fails closed when no
  RUNNING runtime session produced a positions payload. Validation: local
  no-running-session harness exits non-zero with the expected error.
- Added durable anti-regression instructions in
  `.agents/core/anti-regression.md`.
- Added quality gate mapping in `.agents/core/quality-gates.md`.
- Added continuation state files so future short-nudge runs do not depend on
  hidden chat memory.

## Monitoring Rules

Future agents must append an entry here when:

- a regression is found but not fixed in the same iteration
- a regression is fixed and needs traceability
- a quality gate is skipped or blocked
- a test gap is intentionally deferred

## Entry Template

```markdown
### YYYY-MM-DD - Short title
- Status: open | fixed | monitoring
- Severity: P0 | P1 | P2
- Surface:
- Symptom:
- Root cause:
- Fix or mitigation:
- Validation:
- Follow-up:
```
