# Bot V2 Create/Update Contract (Historical Compatibility Note)

Status: superseded as the canonical source of truth.

This file documents an older migration-stage write contract. It is no longer the canonical architecture description because bot write semantics are now wallet-first.

Use these files instead:
- [03 Domain Model](../03_domain-model.md)
- [04 Runtime Contexts](../04_runtime-contexts.md)

Canonical current rule:
- wallet owns execution mode and capital context
- bot write contracts are derived from wallet context
- legacy bot fields such as `mode`, `paperStartBalance`, and `apiKeyId` are compatibility-era concerns, not architecture-first truth
