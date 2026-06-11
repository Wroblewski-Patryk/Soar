# LUC-2824 Backup Verification Profile Env Helper Missing-Test Link

## Header
- ID: LUC-2824-BACKUP-VERIFICATION-PROFILE-ENV-HELPER-MISSING-TEST-LINK-2026-06-07
- Title: Cover backup verification profile env helper missing-test link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: [LUC-2821](/LUC/issues/LUC-2821)
- Priority: P2
- Operation Mode: TESTER
- Mission ID: LUC-2824-BACKUP-VERIFICATION-PROFILE-ENV-HELPER-MISSING-TEST-LINK-2026-06-07
- Mission Status: VERIFIED

## Context
[LUC-2821](/LUC/issues/LUC-2821) selected
`scripts/runBackupVerificationProfile.mjs#firstNonEmptyEnv` as the next
non-duplicate architecture-awareness missing-test link after excluding blocked
generator-index and go-live smoke lanes.

## Goal
Cover the backup verification profile env helper and related injected CLI seams
without running a real backup/restore, Docker Compose, Prisma, DB, production,
or secret-bearing command.

## Scope
- `scripts/runBackupVerificationProfile.mjs`
- `scripts/runBackupVerificationProfile.test.mjs`
- `docs/architecture/relations/priority-test-links.csv`
- Generated architecture-awareness exports under `docs/graphs/` and
  `docs/status/`
- Project state/task evidence files

## Implementation Plan
1. Make the wrapper import-safe while preserving direct CLI execution.
2. Export narrow seams for env lookup, option resolution, CLI parsing, usage,
   command execution, and `main`.
3. Add focused `node:test` proof using fake env and injected runner/spawn
   doubles only.
4. Add scanner-readable relation rows for the exact covered anchors.
5. Refresh architecture graph and architecture-awareness exports.

## Acceptance Criteria
- `firstNonEmptyEnv` is directly covered with fake env data.
- Non-local profile option resolution fails closed when no container is
  supplied.
- `main` can be tested through an injected runner without invoking the backup
  restore verifier.
- Architecture-awareness no longer lists `runBackupVerificationProfile` or
  `firstNonEmptyEnv` in Top Actionable Missing Test Links.

## Definition of Done
- [x] Focused local tests pass.
- [x] Scanner-readable relation rows exist and read back.
- [x] Architecture graph and architecture-awareness exports refreshed.
- [x] Repository guardrails pass.
- [x] No production, secret, DB, backup/restore, deploy, push, restart, or
      live-trading mutation occurred.

## Validation Evidence
- `node --check scripts/runBackupVerificationProfile.mjs` PASS.
- `node --check scripts/runBackupVerificationProfile.test.mjs` PASS.
- `node scripts/runBackupVerificationProfile.mjs --help` PASS and exited
  before any backup/restore command.
- `node --test scripts/runBackupVerificationProfile.test.mjs` PASS (`6/6`).
- Direct relation readback PASS (`6` rows).
- `pnpm run architecture:graph:generate` PASS (`653` nodes / `842` relations /
  `27` chains).
- Softwarehouse architecture-awareness refresh PASS (`14965` entities /
  `24227` relations / `9698` files); refreshed report generated
  `2026-06-07T14:06:33.692Z` reports `305` actionable missing-test links and
  no longer lists `runBackupVerificationProfile` or `firstNonEmptyEnv` in Top
  Actionable Missing Test Links.
- `pnpm run quality:guardrails` PASS.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`,
  `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: generated architecture-awareness exports
  refreshed.

## Security / Privacy Evidence
- Data classification: local test/tooling only; fake env values in tests.
- Secret handling: no secret values read, written, logged, or required.
- Fail-closed behavior: non-local backup profiles still require explicit
  container configuration.
- Residual risk: this is local helper proof only; it does not claim a real
  backup/restore drill or production gate.

## Result Report
- Task summary: made `scripts/runBackupVerificationProfile.mjs` import-safe,
  added focused injected helper/entrypoint tests, and linked covered anchors to
  the Architecture Evidence Graph.
- Files changed:
  - `scripts/runBackupVerificationProfile.mjs`
  - `scripts/runBackupVerificationProfile.test.mjs`
  - `docs/architecture/relations/priority-test-links.csv`
  - generated architecture-awareness exports
  - state/evidence files for [LUC-2824](/LUC/issues/LUC-2824)
- What is incomplete: no production backup/restore execution was attempted or
  claimed.
- Next steps: parent queue can select the next non-duplicate missing-test link.
