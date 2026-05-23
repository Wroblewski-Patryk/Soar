# V1 Static Issue Scan

Generated at: 2026-05-19T01:41:31.126Z
Evidence date: 2026-05-19
Project index: `history/artifacts/project-index-2026-05-19.json`

## Purpose

This is a static inconsistency scan. It identifies proof gaps, surface gaps,
queue drift, and source markers. It does not prove runtime behavior and does
not replace browser/API/DB/exchange action audits.

## Summary

- Total findings: 0
- By severity: {}
- By category: {}
- Production/source files scanned for markers: 667
- Source marker matches: 29

## P0/P1 Findings

| Severity | Category | Finding | Evidence | Recommendation |
| --- | --- | --- | --- | --- |


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
