# LUC-2304 Web Runtime Start Wrapper Fix Evidence

- Date: 2026-06-05
- Owner: Frontend Engineer
- Issue: [LUC-2304](/LUC/issues/LUC-2304)
- Parent evidence: `history/evidence/luc-2297-soar-web-crash-log-retrieval-2026-06-05.md`
- Scope: code-side repair for the production Web image/startup contract.

## Problem

The production `soar-web` container was starting with:

```text
web@0.1.0 start -> node ../../scripts/runWebNextProductionCommand.mjs start
Error: Cannot find module '[APP_ROOT]/scripts/runWebNextProductionCommand.mjs'
```

`apps/web/package.json` still requires the repo-root wrapper for `build` and
`start`, while `apps/web/Dockerfile` copied `scripts` only in the build stage.
The runtime stage copied `/app/apps/web`, `/app/libs/shared`, and root package
files, but not `/app/scripts/runWebNextProductionCommand.mjs`.

## Repair

- `apps/web/Dockerfile` now copies the existing production wrapper from the
  build stage into the runtime image:
  `/app/scripts/runWebNextProductionCommand.mjs`.
- `scripts/repoGuardrails.mjs` now includes
  `validateWebRuntimeImageIncludesStartWrapper`, which fails when the Web
  package still depends on `scripts/runWebNextProductionCommand.mjs` but the
  Web runtime Dockerfile does not copy that wrapper into the runtime stage.
- `scripts/repoGuardrails.test.mjs` covers both the accepted runtime wrapper
  copy and the missing-wrapper regression.

## Verification

| Check | Result |
| --- | --- |
| `node --test scripts\repoGuardrails.test.mjs` | PASS, `11/11` tests |
| `pnpm --filter web run build` | PASS, exit `0`; production bundle generated |
| Local wrapper start proof | PASS; `node scripts/runWebNextProductionCommand.mjs start` served `/` and `/api/build-info` on port `32104` |
| `/` probe during wrapper start | `200` |
| `/api/build-info` probe during wrapper start | `200`, git SHA `6e31d814046b640ad529d1cd57f968ba6f67b05e` |
| Validation process cleanup | PASS; started wrapper process tree was stopped |
| `chrome-headless-shell` cleanup check | PASS; no matching process was present |

`pnpm --filter web run build` emitted a non-fatal Next/ESLint warning about
`eslint-plugin-react-hooks` resolution through `eslint-config-next`, but the
command completed with exit code `0` and generated the production build.

Docker image build could not be executed in this runner because Docker Desktop
was unavailable:

```text
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

The static Dockerfile guardrail plus local production-wrapper start proof cover
the root cause: the wrapper module exists and the production start path can
serve Web routes when present.

## Artifacts

- `history/artifacts/luc-2304-web-wrapper-start-stdout-2026-06-05.log`
- `history/artifacts/luc-2304-web-wrapper-start-stderr-2026-06-05.log`

## Mutation Boundary

No deploy, restart, rollback, production env edit, database action, account
mutation, protected smoke, secret readback, exchange action, or live-trading
action was performed.

## Residual Risk

The fix is verified locally but not deployed in this heartbeat. Ops still needs
a separate release mutation permit after source-control closure/push to recover
production `soar-web` and capture public `/` plus `/api/build-info` proof.
