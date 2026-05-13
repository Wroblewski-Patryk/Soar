# V1 Static Issue Scan

Generated at: 2026-05-13T17:11:05.812Z
Evidence date: 2026-05-13
Project index: `docs/operations/project-index-2026-05-13.json`

## Purpose

This is a static inconsistency scan. It identifies proof gaps, surface gaps,
queue drift, and source markers. It does not prove runtime behavior and does
not replace browser/API/DB/exchange action audits.

## Summary

- Total findings: 3
- By severity: {"P1":1,"P0":1,"P2":1}
- By category: {"v1-proof-gap":2,"queue-blocked":1}
- Production/source files scanned for markers: 658
- Source marker matches: 29

## P0/P1 Findings

| Severity | Category | Finding | Evidence | Recommendation |
| --- | --- | --- | --- | --- |
| P1 | v1-proof-gap | Bots is locally proven but still lacks production-safe clickthrough | Production-safe non-destructive clickthrough for bot actions; local action proof already exists. | Run or add non-destructive production clickthrough on throwaway fixtures before final V1 claim. |
| P0 | v1-proof-gap | Operations remains BLOCKED_AUTH | Rollback PASS, liveimport readback, authenticated SLO, release gate, and alerts evidence. | Execute the mapped proof path from project index priority 19. |

## P2 Findings

| Severity | Category | Finding | Evidence | Recommendation |
| --- | --- | --- | --- | --- |
| P2 | queue-blocked | 2 protected/auth queue blockers remain open | .codex/context/TASK_BOARD.md:790, docs/planning/mvp-next-commits.md:696 - [ ] `CONTROLLED-LIVE-SESSION-PROOF-2026-05-10 release: capture guarded LIVE runtime session readback` \| .codex/context/TASK_BOARD.md:5312, docs/planning/mvp-next-com | Keep these open until approved protected auth, production-safe fixtures, or required approvals are available. |

## Interpretation

1. `v1-proof-gap` means the V1 matrix row lacks accepted action proof; it is
   not automatically a code bug.
2. `web-surface-gap`, `web-route-gap`, and `documented-placeholder` are
   stronger candidates for implementation/documentation drift.
3. `source-marker` findings require human triage because some placeholders
   are valid fail-closed behavior or deterministic fallback contracts.
4. Approved exchange capability gates are skipped as open source findings when
   they match the canonical fail-closed exchange capability matrix.
5. Start fixes from P0/P1 findings that overlap the V1 Audit Work Map priority:
   Dashboard Home, Bot Runtime, Auth, Profile API Keys, then Bots production
   clickthrough.
