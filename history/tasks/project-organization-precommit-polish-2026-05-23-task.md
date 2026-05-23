# Task

## Header
- ID: PROJECT-ORGANIZATION-PRECOMMIT-POLISH-2026-05-23
- Title: Pre-commit project organization polish
- Task Type: refactor
- Current Stage: verification
- Status: DONE
- Owner: Active chat as Coordinator
- Depends on: DOC-USABILITY-ROUTING-IMPROVEMENT-2026-05-23
- Priority: P2
- Module Confidence Rows: not applicable
- Requirement Rows: not applicable
- Quality Scenario Rows: maintainability/documentation usability
- Risk Rows: documentation drift and pre-commit organization risk
- Iteration: 2026-05-23 documentation iteration
- Operation Mode: BUILDER
- Mission ID: PROJECT-ORGANIZATION-PRECOMMIT-POLISH-2026-05-23
- Mission Status: VERIFIED

## Context
After the docs/history restructuring and usefulness pass, the operator asked
whether anything else could be improved before creating a commit.

## Goal
Perform one final low-risk organization polish around repository entrypoints,
ignore rules, and structure policy without touching app/runtime behavior.

## Constraints
- Keep changes documentation and repository-organization only.
- Do not modify app logic, production configuration, secrets, or runtime flows.
- Reuse the accepted `docs/` versus `history/` structure.

## Definition of Done
- [x] Root README points to the current docs/history navigation model.
- [x] Repository structure policy lists current documentation categories.
- [x] Ignore rules no longer point generated artifacts at old docs paths.
- [x] Link, graph, guardrail, docs parity, and diff checks pass.

## Forbidden
- App/runtime code changes.
- New documentation framework.
- Historical record deletion.
- Secret or production access.

## Result Report
- Updated `README.md` to mention `apps/mobile` as scaffold-only, point humans
  and agents at `docs/soar-documentation-map.md`, and explain the current
  `docs/` versus `history/` split.
- Updated `docs/governance/repository-structure-policy.md` so its category
  list matches the real docs folders, including `analysis`, `contracts`,
  `flows`, `maps`, `pipelines`, and `testing`.
- Updated `.gitignore` so the rotating RC evidence artifact ignore rule points
  to `history/artifacts/` instead of the old `docs/operations/` path.
- Validation passed:
  - markdown link check: `1816` files, `482` relative/file links, `0` missing targets
  - docs graph scan: `258` docs markdown files, `0` no-incoming files excluding root semantic hubs, `0` isolated docs files
  - stale active path scan: no old docs artifact/index paths found
  - `pnpm run quality:guardrails` PASS
  - `pnpm run docs:parity:check` PASS
  - `git diff --check` found no whitespace errors, only Windows LF/CRLF warnings
- Runtime impact: none.
