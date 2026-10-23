# CryptoSparrow / Soar Documentation Overview

This documentation set is the project operating manual for humans and coding agents.

Language policy: repository documentation stays in English.

## How to Use This Doc Set
- Start with [Current Version Product Contract](./current-version-contract.md)
  for required scope and its separate acceptance boundary.
- Use `autonomous-agent-vision.md` for the long-range product direction.
- Use `product.md` for earlier product goals and proposals; its dated sections
  do not override the current-version contract.
- Use `docs/architecture/architecture-documentation.md` and the numbered architecture files for the canonical system behavior.
- Use `docs/modules/` when you need implementation ownership, code-path mapping, and test entrypoints.
- Use `docs/operations/` for deployment, smoke checks, rollback, and runtime operations.
- Use `docs/planning/mvp-execution-plan.md` and `docs/planning/mvp-next-commits.md` for active execution sequencing only.

## Definition of Done for Documentation
- feature behavior is recorded in the correct folder,
- architecture invariants live in `docs/architecture/`,
- implementation ownership lives in `docs/modules/`,
- plans do not remain the only place where accepted behavior is described,
- current vs planned scope is explicit,
- risks and safety implications are noted,
- unresolved decisions are tracked in `docs/planning/open-decisions.md`.
