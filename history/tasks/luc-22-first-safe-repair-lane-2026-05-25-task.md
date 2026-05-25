# LUC-22 First Safe Repair Lane Task

## Header
- ID: `LUC-22`
- Title: Recover from Windows `EPERM` auth symlink blocker for Soar heartbeat lane
- Task Type: implementation
- Current Stage: verification
- Status: DONE
- Owner: Implementation Lead
- Priority: P1
- Iteration: 2026-05-25
- Operation Mode: BUILDER

## Context

The previous assigned heartbeat failed before issue execution with:
`EPERM: operation not permitted, symlink ...\.codex\auth.json -> ...\codex-home\auth.json`.
This lane needed to verify whether the runtime auth target was missing or stale
and leave durable evidence in Soar source-of-truth files.

## Goal

Restore a safe known state for the auth file path used by the local Paperclip
runtime and record verifiable evidence for the unblock.

## Constraints

- No secret values copied into docs or logs.
- No unrelated feature/code changes.
- Keep scope limited to issue blocker triage and documentation parity.

## Definition of Done

- Auth source and runtime target exist and match by hash.
- Issue evidence is captured in canonical Soar state docs.
- Residual risk and next action are explicit.

## Verification Evidence

- `Get-Item` checks confirmed both files exist as regular files:
  - `C:\Users\wrobl\.codex\auth.json`
  - `C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\.paperclip\runtime\home\instances\default\companies\f13051a7-d0aa-4261-9254-d3ab90735de5\codex-home\auth.json`
- Hash parity check command:
  - `Get-FileHash ...auth.json -Algorithm SHA256` on source and target
  - Result: both equal `1B87C869E3101DD3C690DC9800E9DA4D1B6F7B44424A9004EBE2B99F9B3B82CD`

## Result Report

- Implemented and verified: runtime auth target is present and byte-identical
  to the user auth source, removing the immediate missing-target condition that
  caused the failed heartbeat lane.
- Implemented but not verified: a full end-to-end rerun of the external issue
  harness adapter was not executed from this workspace in this slice.
- Residual risk: Windows environments without symlink privilege can still fail
  if future startup paths force symbolic-link creation instead of file copy or
  existing-file reuse.

## Board Disposition Update (2026-05-25)

- Status update: `LUC-22` is cancelled by board decision and superseded by
  `LUC-37` plus specialist delivery lanes (`Frontend`, `Backend`, `Data`,
  `Integration`, `AI Runtime`, `Test Automation`, `Security`).
- This task remains valid historical evidence for the auth-path blocker
  recovery only and should not be used to reopen the legacy broad
  implementation lane model.
