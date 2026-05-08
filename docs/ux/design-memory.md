# Design Memory

## Purpose

This file is the durable memory for reusable UX/UI decisions in Soar. Future
agents must review it before UX/UI implementation and update it when accepted
user feedback should influence more than one local task.

## Autonomous Capture Rules

- Capture reusable UX/UI feedback here when it affects future hierarchy,
  density, layout, interaction, state treatment, visual polish, or operator
  feel.
- Keep one-off screen feedback in the active task unless it should become a
  repeatable pattern.
- Ask the user before adding a rule only when it conflicts with existing
  design memory, changes global visual direction, or overrides an approved
  canonical visual source.
- Record rejected or deferred reusable feedback in the relevant task or open
  decision file so it is not rediscovered as new guidance.
- Before coding UX/UI, list which design-memory entries apply to the task and
  which do not.

## Entry Format

Use this shape for new reusable entries:

```markdown
- Rule:
  Scope:
  Apply when:
  Avoid:
  Source:
  Evidence:
```

## Intake Inbox

Use this section only for newly accepted UX/UI guidance that is not yet folded
into a stable pattern. Empty the inbox by moving items into an approved section
or an open decision.

- No pending UX/UI memory items.

## Approved Reuse Patterns

- Metrics rail:
  Show status, health, and risk before secondary detail.
- Dense decision tables:
  Use grouping, status hierarchy, and row-level affordances before adding more
  panels.
- Confirmation moments:
  Risky actions should include direct consequence framing and clear fallback.

## Reuse Notes

- Prefer shared dashboard treatment for analytics, bots, markets, and logs.
- Record approved operator patterns here when they should shape future modules.
- When a canonical screenshot drives implementation, record any background or
  decorative fidelity rules that should be reused instead of rediscovered.
- Strategy threshold ladders:
  Reuse one shared two-field sortable editor for `TTP`, `TSL`, and advanced
  `DCA` rows. Keep drag reorder available, but also expose keyboard move
  controls so order-sensitive ladders remain editable without pointer drag.
