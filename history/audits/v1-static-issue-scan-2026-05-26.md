# V1 Static Issue Scan

Generated at: 2026-05-26T17:29:18.689Z
Evidence date: 2026-05-26
Project index: `history/audits/project-index-2026-05-26.json`

## Purpose

This is a static inconsistency scan. It identifies proof gaps, surface gaps,
queue drift, and source markers. It does not prove runtime behavior and does
not replace browser/API/DB/exchange action audits.

## Summary

- Total findings: 1
- By severity: {"P1":1}
- By category: {"queue-open-work":1}
- Production/source files scanned for markers: 692
- Source marker matches: 29

## P0/P1 Findings

| Severity | Category | Finding | Evidence | Recommendation |
| --- | --- | --- | --- | --- |
| P1 | queue-open-work | 17 unchecked queue markers remain | .codex/context/TASK_BOARD.md:931 - [ ] `LUC-45 [Soar] V1 audit-to-completion controller` \| .codex/context/TASK_BOARD.md:995 - [ ] `LUC-48 [Soar][Docs] Autonomous map inventory and UI polish readiness gate` \| .codex/context/TASK_BOARD.md:1 | Classify each as executable, blocked by auth/approval, or historical carryover. |

## P2 Findings

| Severity | Category | Finding | Evidence | Recommendation |
| --- | --- | --- | --- | --- |


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
