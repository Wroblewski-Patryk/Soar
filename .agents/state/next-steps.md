# Next Steps

Last updated: 2026-05-07

## Next Tiny Task

After this slice, the next autonomous continuation should return to the active
V1 runtime/UI queue and execute exactly one READY or IN_PROGRESS task from
`docs/planning/mvp-next-commits.md` and `.codex/context/TASK_BOARD.md`.

## Candidate Backlog

1. Verify and sync any drift between `.agents/state/*`,
   `.codex/context/TASK_BOARD.md`, and `docs/planning/mvp-next-commits.md`.
2. Continue the first executable V1UI/LIVE/PAPER runtime follow-up from the
   active queue.
3. If the active queue is empty, run a planning-status sweep before saying
   nothing is planned.

## Continuation Command Handling

On "rob dalej", "rób dalej", "kontynuuj", "continue", or "next":

1. Read `.agents/core/operating-system.md`.
2. Read this file.
3. Cross-check canonical planning.
4. Pick one task.
5. Execute through `.agents/core/execution-loop.md`.
