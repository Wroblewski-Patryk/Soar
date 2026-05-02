# Pipeline: Deployment readiness

Updated: 2026-05-03

## Trigger
Operator prepares or verifies deployment, production smoke, rollback proof, or
runtime readiness.

## User/System Action
- Build and deploy API, web, and workers.
- Check health/readiness, Redis/Postgres dependencies, runtime freshness, smoke
  flows, backup/restore evidence, and rollback proof.

## Involved Frontend Files
- Build output from `apps/web`.
- No direct UI route owns this pipeline.

## Involved Backend Files
- `apps/api/src/router/index.ts`
- `apps/api/src/router/*readiness*.test.ts`
- `apps/api/src/workers/*`
- `scripts/*deploy*`, `scripts/*release*`, `scripts/*smoke*`,
  `scripts/*restore*`, `scripts/*rollback*`.

## Involved Services
- API health/readiness.
- Worker readiness/freshness checks.
- Redis and PostgreSQL dependencies.
- Coolify/VPS deployment target.

## Data Read/Write
- Reads runtime dependency state and build/deploy metadata.
- Writes operation evidence artifacts under `docs/operations/_artifacts-*`
  when scripts are run.

## Failure Points
- API/web image mismatch.
- Redis crash-loop or unavailable dependency.
- Migration failure or local migration history drift.
- Stage/prod env var access missing.
- Smoke passing only public health while authenticated/runtime paths fail.

## Tests / Commands
- `pnpm run quality:guardrails`
- `pnpm run typecheck`
- `pnpm run build`
- `pnpm run test:go-live:smoke`
- `pnpm run ops:deploy:smoke`
- `pnpm run ops:release:v1:gate`
- health/readiness and worker readiness tests.

## Related Docs
- `docs/operations/coolify-linux-vps-setup-guide.md`
- `docs/operations/post-deploy-smoke-checklist.md`
- `docs/operations/deployment-rollback-playbook.md`
- `docs/operations/service-reliability-and-observability.md`
- `.codex/context/LEARNING_JOURNAL.md`

## Known Gaps
- Stage environment is intentionally deferred to V2 by operator decision in
  current project state.
