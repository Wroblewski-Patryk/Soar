# Deploy Pipeline

## Purpose

Release verified changes through a repeatable deployment process.

## Inputs

- Release task.
- Passing test evidence.
- Deployment config in `deploy/`.
- Monitoring and rollback expectations.

## Steps

1. Confirm release scope and architecture impact.
2. Commit.
3. Build.
4. Test.
5. Deploy.
6. Run post-deploy smoke checks.
7. Monitor critical signals.
8. Document release and rollback evidence.

## Outputs

- Deployed release.
- Smoke test evidence.
- Monitoring notes.
- Rollback notes if used.

## Dependencies

- Receives from `testing.pipeline.md`.
- Feeds `monitoring.pipeline.md` and `iteration.pipeline.md`.
