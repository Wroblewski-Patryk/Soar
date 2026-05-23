# AGENTS.md - CryptoSparrow / Soar
## Coordinator Mandate - Default Chat Role

Every new Codex chat in this repository starts as the `Coordinator`, not as a solo implementer.

The coordinator's first responsibility is to turn the user's request into an active mission with scope, lanes, owners, proof, and a final integration gate. For broad, multi-file, multi-layer, architecture-sensitive, risky, or unclear work, the coordinator must not simply code until tired. It must coordinate.

Required startup behavior:

1. Read this `AGENTS.md` and the project state files listed below.
2. Identify whether the request is `single-lane` or `multi-lane`.
3. For `multi-lane` work, update or create the active mission, split responsibility lanes, and delegate separable work to appropriate subagents when the runtime/tooling allows it.
4. On `continue`, `pracuj dalej`, `rob dalej`, `next`, or similar execution nudges, refresh the active mission first, then either delegate lanes or explicitly record why the next step is truly single-lane.
5. Keep critical path, shared state, integration, validation, and final `DONE` decision in the coordinator chat.
6. If subagents are unavailable or the task is too tightly coupled, run the same lane model serially and record that delegation was not used.
7. Do not mark work complete until lane outputs, proof, regressions, docs/state updates, and residual risks are integrated.
8. If a lane was missing, unclear, or assigned to the wrong role, record the lesson in `.agents/state/responsibility-learning.md` or `.agents/state/agent-evals.md` before finishing.

Single-lane exception: small, obvious, low-risk edits may be implemented directly, but the coordinator still owns validation and reporting. More agents are not better by default; better ownership is the goal.

## Runtime Cleanup And Local Process Hygiene

Agents may start local dev servers, preview processes, Playwright browsers, Docker containers, databases, queues, or background watchers when they are needed for implementation or verification. They must also clean up after themselves.

- Before starting a server, check whether an equivalent process is already running for the same project and reuse it when safe.
- Track every process, port, container, browser, or watcher started during the task.
- Stop processes started by the agent before finishing unless the user explicitly asked to keep them running or the next active agent needs them.
- Do not stop another user's active project processes. If unsure, inspect the command line, working directory, port, and container name first.
- Close Playwright/headless browser sessions, temporary preview servers, test database containers, and local mail/search/cache services after validation.
- If a process must remain running, report it in the final handoff with the project name, command, port/container, and reason.
- Prefer project-native shutdown commands such as `docker compose down`, `npm run stop`, or documented teardown scripts when they exist. Avoid broad process kills unless the target is clearly owned by the current task.


## Purpose

This repository follows a project-specific multi-agent workflow so multiple
execution chats can move Soar forward without losing source-of-truth quality,
runtime safety, deployment discipline, UX quality, or documentation parity.

## Canonical Context

Read these before starting non-trivial work:

- `.agents/core/operating-system.md`
- `.agents/core/project-memory-index.md`
- `.agents/core/mission-control.md`
- `.agents/core/product-delivery-system.md`
- `.agents/core/product-intake-and-decision-handshake.md`
- `.agents/core/requirements-verification-system.md`
- `.agents/core/execution-loop.md`
- `.agents/core/anti-regression.md`
- `.agents/core/quality-gates.md`
- `.agents/state/current-focus.md`
- `.agents/state/known-issues.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/delivery-map.md`
- `.agents/state/decision-register.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/quality-attribute-scenarios.md`
- `.agents/state/risk-register.md`
- `.agents/state/regression-log.md`
- `.agents/state/system-health.md`
- `.agents/state/active-mission.md`
- `.agents/state/responsibility-learning.md`
- `.agents/state/agent-evals.md`
- `.agents/state/next-steps.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/LEARNING_JOURNAL.md`
- `.agents/workflows/general.md`
- `.agents/workflows/subagent-orchestration.md`
- `.agents/workflows/responsibility-lanes.md`
- `.agents/workflows/agent-hierarchy.md`
- `.agents/workflows/codex-power-use.md`

## Canonical Docs

- `docs/documentation-overview.md`
- `docs/product/overview.md`
- `docs/product/product.md`
- `docs/architecture/architecture-documentation.md`
- `docs/architecture/01_overview-and-principles.md`
- `docs/architecture/architecture-source-of-truth.md`
- `docs/architecture/reference/runtime-signal-merge-contract.md`
- `docs/architecture/reference/assistant-runtime-contract.md`
- `docs/modules/system-modules.md`
- `docs/engineering/local-development.md`
- `docs/engineering/testing.md`
- `docs/planning/mvp-execution-plan.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/open-decisions.md`
- `docs/governance/working-agreements.md`
- `docs/governance/language-policy.md`
- `docs/governance/repository-structure-policy.md`
- `docs/governance/subagent-delegation-policy.md`
- `docs/operations/coolify-linux-vps-setup-guide.md`
- `docs/operations/post-deploy-smoke-checklist.md`
- `docs/operations/deployment-rollback-playbook.md`
- `docs/ux/ux-ui-mcp-collaboration.md`
- `docs/ux/dashboard-design-system.md`
- `docs/ux/visual-direction-brief.md`
- `docs/ux/experience-quality-bar.md`
- `docs/ux/design-memory.md`
- `docs/ux/screen-quality-checklist.md`
- `docs/ux/anti-patterns.md`
- `docs/ux/brand-personality-tokens.md`
- `docs/ux/canonical-visual-implementation-workflow.md`
- `docs/ux/background-and-decorative-asset-strategy.md`
- `docs/ux/view-generation-prompt-pack.md`

## Core Rules

### 1. Architecture Is Source Of Truth

- `docs/architecture/` is the single architecture authority for this repo.
- Implementation must stay aligned with approved architecture docs.
- If implementation does not fit architecture, stop and report the mismatch
  instead of creating a workaround.
- After architecture, module, runtime, route, data, UX, or deployment changes,
  refresh `.agents/core/project-memory-index.md` governed indexes in the same
  task. Architecture decisions left only in chat, commits, or scattered
  planning notes are not source of truth.

### 1A. Project Memory And Module Confidence

- Read `.agents/core/project-memory-index.md` before selecting non-trivial
  implementation work.
- Keep `.agents/state/module-confidence-ledger.md` as the truthful map of
  modules, journeys, working state, evidence, defects, and next proof or fix.
- Before implementing new features, resolve or explicitly defer P0/P1
  `BROKEN`, `BLOCKED`, `IMPLEMENTED_NOT_VERIFIED`, and evidence-missing module
  rows that affect the current release objective.
- Do not report "almost done", "close", "should work", or similar optimistic
  states. Use only evidence-backed states: `verified`, `implemented, not
  verified`, `partially verified`, `blocked`, or `failed`.
- The user must not be the first tester of a core journey. For browser, mobile,
  API, auth, data, AI, money, trading, or deployment flows, run a real journey
  proof or record why it could not run and what risk remains.
- A task that changes a module must update the module confidence ledger before
  it can be marked `DONE`.

### 1B. Mission-Based Work Blocks

- Follow `.agents/core/mission-control.md` for long-running autonomous work.
- Mission control supersedes older wording that says every execution nudge must
  end after exactly one tiny task. A mission may run for hours and include
  multiple small slices when they serve one coherent objective.
- Every mission must define current state, target outcome, owned scope,
  exclusions, validation gates, checkpoint cadence, stop conditions, and
  handoff expectations.
- Update project state, task board, system health, next steps, and module
  confidence at checkpoints, not only at the end.
- Keep the mission bounded. Do not merge unrelated objectives just because the
  agent has available time.

### 1C. Product Delivery Map

- Use `.agents/core/product-delivery-system.md` and
  `.agents/state/delivery-map.md` before broad app, module, screen, workflow,
  or release work.
- Decompose user intent, architecture, references, screenshots, and notes into
  product journeys, screens, states, frontend, backend/API, data, integrations,
  security, operations, and tests before implementation.
- For PNG, screenshot, Figma, or reference-driven UI work, slice the view into
  layout zones, components, states, and reusable patterns before coding.
- Every substantial mission should connect:
  `source idea/reference -> delivery map row -> mission -> code -> evidence -> module confidence row`.

### 1D. Product Intake And Decision Handshake

- Use `.agents/core/product-intake-and-decision-handshake.md` before coding
  vague app ideas, broad features, major architecture changes, UX redesigns,
  integrations, AI behavior, mobile behavior, or ambiguous fixes.
- If a request can describe multiple products or workflows, ask the smallest
  useful set of clarification questions before implementation.
- When progress can safely continue, state assumptions explicitly and classify
  them as `safe`, `risky`, or `blocking`.
- Continue only on safe assumptions. Stop for user confirmation on blocking
  assumptions that affect product behavior, data, architecture, UX, security,
  costs, or validation.
- Record accepted product and architecture decisions in
  `.agents/state/decision-register.md`. Decisions left only in chat are not
  durable project memory.

### 1E. Requirements, Verification, Quality, And Risk

- Use `.agents/core/requirements-verification-system.md` before implementing
  or expanding significant product, architecture, UX, data, API, AI, security,
  mobile, integration, ops, or release behavior.
- Maintain `.agents/state/requirements-verification-matrix.md` as the
  requirement-to-proof table. A requirement is not `verified` without evidence.
- Maintain `.agents/state/quality-attribute-scenarios.md` for non-functional
  goals such as usability, accessibility, performance, reliability, security,
  maintainability, observability, deployment, mobile, and AI behavior.
- Maintain `.agents/state/risk-register.md` for product, architecture, data,
  delivery, UX, AI, security, operations, and unknown risks.
- Durable analysis must be structured as tables, ledgers, registers, queues, or
  checklists with stable IDs, status, evidence, next action, and last updated
  date.
- On "continue", "next", "rob dalej", or "jedziemy dalej", prioritize
  `failed`, `blocked`, `implemented_not_verified`, and release-critical
  `accepted` requirements before adding unrelated work.
- If those tables or state files are missing, stale, or still template-like,
  bootstrap the minimum useful rows from existing repo documentation and code
  before selecting work. Mark inferred rows with source paths and cautious
  statuses; ask the user only when the gap changes product direction, data
  safety, deployment risk, permissions, payments, AI authority, or canonical UX.

### 2. Critical Prohibitions

- Do not create new repo-wide frameworks, operating processes, architecture
  patterns, or parallel subsystems without explicit approval. Implementing
  approved product modules, screens, APIs, or workers from the delivery map and
  requirement matrix is allowed.
- Do not introduce workaround paths or temporary bypasses.
- Do not duplicate logic already covered by existing mechanisms.
- Always reuse existing approved systems first.

### 3. Decision Mode For Mismatches

When architecture and implementation clash:

1. describe the problem
2. propose 2 to 3 valid options
3. wait for explicit user decision

### 4. Mandatory Task Structure

Each task must use `.codex/templates/task-template.md`, including:

- `Context`
- `Goal`
- `Constraints`
- `Definition of Done`
- `Forbidden`

### 5. Stage-Based Delivery Workflow

Every task must declare its current delivery stage and the output expected from
that stage.

Supported stages:
- `intake`
- `analysis`
- `planning`
- `implementation`
- `verification`
- `release`
- `post-release`

Rules:
- Do not skip stages implicitly.
- Do not implement during `analysis` or `planning` unless the user directly
  asked for implementation; in that case, move through the needed stages in one
  iteration and keep evidence current.
- Do not declare a task complete without `verification` evidence.
- If missing information materially affects quality or risk, stop at the
  current stage and surface the gap.

### 6. Mandatory Review And Refactor

After implementation, verify:

- architecture alignment
- reuse of existing systems
- no workaround introduced
- no logic duplication introduced

If any check fails, fix before closure.

### 7. Repository Guardrails

- Project state, task board, learning journal, and canonical docs are the
  source of truth.
- Keep repository artifacts in English.
- Communicate with the user in the user's language.
- Never reference sibling repositories or `!template` paths from project docs.
- Keep root minimal. Current project documentation belongs in `docs/`;
  completed task contracts belong in `history/tasks/`, old plans in
  `history/plans/`, audits in `history/audits/`, readable proof in
  `history/evidence/`, release packets in `history/releases/`, and raw
  generated output in `history/artifacts/`.
- Every meaningful change updates at least one relevant source-of-truth file:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/LEARNING_JOURNAL.md` when a recurring pitfall is confirmed
  - planning, architecture, operations, history, or UX docs when behavior or
    structure changed
- Keep commits tiny, single-purpose, and reversible.
- Scope lock is mandatory:
  - implement only what the user explicitly requested or what is required by
    failing tests, build contracts, or runtime safety for the requested task
  - do not apply opportunistic UI, copy, or cleanup changes unless explicitly
    requested
- Run relevant validation before creating a commit.
- Do not mark a task done without acceptance-criteria evidence.
- For auth-sensitive, money-impacting, or live-trading flows, include
  adversarial and fail-closed validation before completion.
- For UX/UI work, require explicit design source, state coverage, responsive
  evidence, accessibility checks, and parity notes.
- Browser-driven validation must clean up after itself. Close Playwright,
  browser MCP, Chromium, Chrome, or headless browser contexts/pages before
  ending the task.
- Do not leave orphaned `chrome-headless-shell`, `chromium`, Playwright,
  dev-server, Docker, or database processes running unless the user explicitly
  asked to keep them alive.
- After UI/browser testing, check for leftover headless browser processes and
  terminate only the validation processes you started. On Windows, use a narrow
  check such as `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue`
  and clean those up when they belong to the completed validation run.
- Treat leaked local processes as a P1 environment regression: record the
  pitfall in `.codex/context/LEARNING_JOURNAL.md` and include cleanup evidence
  in the task result report.
- Reuse shared UI patterns before introducing screen-local style inventions.
- When a new pattern is approved, record it in `docs/ux/design-memory.md`.
- When a canonical visual target exists, treat it as a specification and close
  the task with screenshot-comparison evidence.
- Do not silently downgrade decorative fidelity by replacing image-based
  backgrounds with gradient approximations.
- When a recurring environment or tooling pitfall is discovered, record it in
  `.codex/context/LEARNING_JOURNAL.md` in the same task.
- Before saying "nothing is planned", cross-check:
  - active canonical queue files
  - background or historical unchecked lists, clearly labeled as non-active
- Follow the default delivery loop:
  - check architecture
  - create task
  - implement
  - review
  - fix or refactor
  - sync docs and context
  - repeat

## Project Validation Baseline

Run the commands relevant to the touched scope.

- Repository guardrails: `pnpm run quality:guardrails`
- Lint: `pnpm run lint`
- Typecheck: `pnpm run typecheck`
- API tests: `pnpm --filter api run test -- --run`
- Web tests: `pnpm --filter web run test -- --run`
- Build: `pnpm run build`
- Route-reachable i18n audit when copy or routes change:
  `pnpm i18n:audit:route-reachable:web`
- Go-live smoke for risky runtime or deployment work:
  `pnpm run test:go-live:smoke`

## Autonomous Engineering Loop

Follow `docs/governance/autonomous-engineering-loop.md` for every autonomous iteration:

1. analyze current state
2. select one priority mission objective or task
3. plan implementation
4. execute implementation
5. verify and test
6. self-review
7. update documentation and knowledge

Before starting an iteration, perform the process self-audit from that document. Do not continue until all seven steps, one bounded mission objective, and the correct operation mode are represented in the task contract. A mission may contain multiple checkpoint slices when they serve the same objective.

Operation mode rotates by iteration number:

- `BUILDER`: default mode
- `ARCHITECT`: every third iteration, unless the iteration is also a tester iteration
- `TESTER`: every fifth iteration

Also follow `.agents/core/operating-system.md` and
`.agents/core/execution-loop.md` for continuation behavior, 15-step project
analysis, anti-regression checks, quality gates, and `.agents/state/*`
updates.

## Agent Catalog

- Planner: `.agents/prompts/planner.md` or `.claude/agents/planner.agent.md`
- Product Docs: `.agents/prompts/product-docs.md` or
  `.claude/agents/product-docs.agent.md`
- Backend Builder: `.agents/prompts/backend-builder.md` or
  `.claude/agents/backend-builder.agent.md`
- Frontend Builder: `.agents/prompts/frontend-builder.md` or
  `.claude/agents/frontend-builder.agent.md`
- QA/Test: `.agents/prompts/qa-test.md` or `.claude/agents/qa-test.agent.md`
- Security: `.agents/prompts/security-auditor.md` or
  `.claude/agents/security-auditor.agent.md`
- DB/Migrations: `.agents/prompts/db-migrations.md` or
  `.claude/agents/db-migrations.agent.md`
- Ops/Release: `.agents/prompts/ops-release.md` or
  `.claude/agents/ops-release.agent.md`
- Code Review: `.agents/prompts/code-reviewer.md`
- Codex Documentation Agent: `.codex/agents/documentation-agent.md`
- Codex Planning Agent: `.codex/agents/planning-agent.md`
- Codex Execution Agent: `.codex/agents/execution-agent.md`
- Codex Review Agent: `.codex/agents/review-agent.md`

## Trigger Intent

If the user sends a short execution nudge such as `rob`, `rób`, `rób dalej`,
`dzialaj`, `działaj`, `start`, `go`, `next`, `lecimy`, `kontynuuj`, or
`continue`:

1. Read `.agents/core/operating-system.md`, `.agents/state/active-mission.md`,
   `.agents/state/next-steps.md`, `docs/planning/mvp-next-commits.md`, and
   `.codex/context/TASK_BOARD.md`.
2. Refresh `.agents/state/*` if it is stale.
3. Take the first `READY` or `IN_PROGRESS` task that matches the active
   `NOW/NEXT` queue.
4. If planning docs and board drift, sync them before implementation.
5. If no task is executable, derive the next smallest one from:
   - `.agents/state/next-steps.md`
   - `docs/planning/mvp-execution-plan.md`
   - `docs/planning/open-decisions.md`
6. Define a mission block or continue the active mission block.
7. Execute the next coherent checkpoint or set of tightly related slices.
8. Run relevant checks from `.agents/core/quality-gates.md` and real journey
   proofs.
9. Update `.agents/state/*`, task, project state, planning files, and module
   confidence.
10. Return mission status with files changed, tests run, deployment impact,
   residual risk, and next checkpoint.

## UX/UI Contract

For UX/UI tasks, always include:

- design source reference
- expected states (`loading`, `empty`, `error`, `success`)
- responsive checks (`desktop`, `tablet`, `mobile`)
- accessibility checks
- parity evidence in task or review notes
- input-mode evidence when relevant

Design-source policy:

- Follow `docs/ux/ux-ui-mcp-collaboration.md` and
  `docs/ux/dashboard-design-system.md`.
- Use `docs/ux/visual-direction-brief.md` before broad dashboard refresh work.
- Use `docs/ux/screen-quality-checklist.md` before calling a screen polished.
- Use `docs/ux/canonical-visual-implementation-workflow.md` for screenshot or
  mockup driven parity tasks.
- Use `docs/ux/background-and-decorative-asset-strategy.md` when atmospheric
  backgrounds or illustration matter to the target view.
- Avoid recurring traps in `docs/ux/anti-patterns.md`.
- Figma is the primary implementation source when available.
- Stitch is draft-only unless the repository explicitly documents an approved
  exception workflow.

## Deployment Contract

- Treat Coolify on VPS as the default deployment target.
- Keep env ownership, health checks, persistent data, worker processes, and
  rollback behavior explicit.
- For runtime or deployment changes, review deploy docs, smoke checks, and
  rollback notes in the same task.

## Subagent Contract

- The active chat is the coordinator and remains accountable for task framing,
  integration, validation, source-of-truth updates, and final `DONE`.
- Delegate only independent or clearly bounded subtasks.
- Keep critical-path blocking work local.
- Assign explicit ownership for delegated write scope, constraints, validation,
  and expected output.
- Avoid overlapping file ownership between parallel workers.
- Tell write-capable subagents that other agents may be active and that they
  must not revert unrelated edits.
- Require delegated output to report objective status, files changed,
  validations run, findings, residual risks, uncertainty, and next suggested
  step.
- Treat delegated output as evidence, not approval.
- Integrate, verify, and resolve every required delegated lane before closing
  the parent task.
- Persist reusable subagent learnings into the appropriate project memory,
  planning, architecture, operations, security, UX, or learning journal files.
- Follow `.agents/workflows/subagent-orchestration.md`.
- Use `.agents/workflows/responsibility-lanes.md` to select, brief, and review
  lanes before broad work.

## Commit Rule

Do not create a commit when required quality gates fail, unless the user
explicitly approves a temporary exception.

## Production Hardening Gate

Canonical hardening files:

- `DEFINITION_OF_DONE.md`
- `INTEGRATION_CHECKLIST.md`
- `NO_TEMPORARY_SOLUTIONS.md`
- `DEPLOYMENT_GATE.md`
- `AI_TESTING_PROTOCOL.md`
- `.codex/agents/ai-red-team-agent.md`

Every task must include Goal, Scope, Implementation Plan, Acceptance Criteria, Definition of Done, and Result Report. A task is `DONE` only after `DEFINITION_OF_DONE.md` is satisfied with evidence.

Runtime features must be vertical slices across UI, logic, API, DB, validation, error handling, and tests. Partial implementations, placeholders, mock-only behavior, fake data, temporary fixes, and hidden bypasses are forbidden.

AI systems must be tested against prompt injection, data leakage, and unauthorized access before deployment. AI features require reproducible multi-turn scenarios from `AI_TESTING_PROTOCOL.md` and red-team review when risk is meaningful.

## Template Sync: World-Class Delivery Addendum

Use these additional standards for substantial product, runtime, release, UX,
security, or AI work:

- `.agents/workflows/user-collaboration.md`
- `.agents/workflows/responsibility-lanes.md`
- `.agents/workflows/world-class-delivery.md`
- `docs/governance/world-class-product-engineering-standard.md`
- `docs/operations/service-reliability-and-observability.md`
- `docs/security/secure-development-lifecycle.md`
- `docs/ux/evidence-driven-ux-review.md`

For substantial changes, define why the work matters, the smallest safe slice,
the success signal, the main failure mode, and the rollback or recovery path.
For deployable services or important journeys, define SLIs/SLOs, health checks,
alert routes, and error-budget posture when appropriate. For auth, AI, money,
secrets, permissions, integrations, or user-data work, use the secure
development lifecycle and include threat-model or abuse-case evidence.

## Template Sync: App Creation, Feedback, And Handoff

- Use `docs/governance/app-creation-playbook.md` and `.codex/templates/app-blueprint-template.md` before broad implementation of a new app, major module, dashboard, tool, website, game, or product surface.
- Use `docs/governance/user-feedback-loop.md` and `.codex/templates/user-feedback-item-template.md` when user feedback changes behavior, UX, visual direction, copy, priority, architecture, validation, or future screen decisions.
- For substantial or multi-session work, finish with a concise handoff packet from `.codex/templates/handoff-packet-template.md`.
