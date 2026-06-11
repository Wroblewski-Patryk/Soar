# Architecture Graph Auth Session Deep Backfill - 2026-05-24

## Architecture Links

- Primary feature/module: Auth session deep graph coverage.
- Architecture nodes: SOAR-FEATURE-AUTH-SESSION; SOAR-PAGE-LOGIN; SOAR-API-AUTH-LOGIN; SOAR-API-AUTH-ME; SOAR-DB-USER; SOAR-TEST-AUTH-SESSION.
- Function chains: docs/architecture/chains/CHAIN-AUTH-SESSION-DEEP.md; docs/architecture/chains/CHAIN-AUTH-SESSION.md.
- Affected files: docs/architecture/registry/nodes.csv; docs/architecture/relations/dependencies.csv; docs/architecture/chains/chains.csv; generated graph/status exports.
- Tests/proof: `pnpm run architecture:graph:generate` recorded in this task's Result Report.
- Docs updated: architecture graph registries, auth chain output, generated graph exports, and source-of-truth state files.

## Context

The architecture drift audit still showed unmapped auth/public Web pages,
auth form components, hooks, Web auth service, AuthContext tests, and API auth
tests after the Web runtime surface checkpoint.

## Goal

Backfill the Auth Session chain so agents can inspect authentication as a
systemic path from public entrypoints through Web forms/hooks/services,
AuthContext, API routes/controller/service/session helpers, User model, tests,
and docs.

## Scope

- Public landing, login, and register entrypoints.
- Login/Register form components and password visibility control.
- Login/Register hooks, hydration helper, Web auth service, AuthContext, and
  Web auth form types.
- API register/logout route records, auth controller, auth service, cookie/JWT
  helpers, auth errors, session token helper, and auth types.
- Web and API auth test records.
- `CHAIN-AUTH-SESSION-DEEP` CSV and Markdown chain evidence.

## Constraints

- Do not change auth runtime behavior.
- Do not store raw credentials, tokens, cookies, or protected session data.
- Preserve existing graph schema and generated output locations.
- Do not claim fresh production auth browser proof from this graph-only slice.

## Definition Of Done

- Auth public/Web/API nodes exist in graph CSV records.
- Relations connect public pages, components, hooks, services, API routes,
  controller/service/session helpers, tests, and docs.
- `CHAIN-AUTH-SESSION-DEEP` exists in CSV and Markdown form.
- Graph generation passes.
- Drift audit reports improved coverage.

## Result Report

Status: `verified_local`

Implemented:

- Added Auth Session deep nodes, tests, workflow, chain record, and chain note.
- Added auth relations from public page to forms, hooks, Web auth service,
  AuthContext, API auth routes, backend controller/service/session helpers,
  tests, and docs.

Validation:

- `pnpm run architecture:graph:generate` passed with `573` nodes, `659`
  relations, and `24` chains.
- `pnpm run architecture:graph:drift` passed with `534/796` covered and `262`
  missing representative files.

Residual Risk:

- This is graph/documentation proof only. Fresh authenticated browser proof and
  production session readback remain separate validation gates.
