# Screen Quality Checklist

## Memory Preflight

- Was `docs/ux/design-memory.md` reviewed before implementation?
- Was `docs/ux/visual-direction-brief.md` reviewed before implementation?
- Was `docs/ux/anti-patterns.md` reviewed before implementation?
- Were applicable memory entries recorded in the active task?
- Was new user feedback classified as reusable rule, visual direction,
  anti-pattern, screen-specific feedback, open decision, or recurring agent
  mistake?
- If feedback was not stored as durable memory, is the reason recorded?

- Is the most important decision or action obvious within 5 seconds?
- Are `loading`, `empty`, `error`, and `success` states designed?
- Does the layout change intentionally across desktop, tablet, and mobile?
- Are touch, pointer, and keyboard needs covered where relevant?
- Does the screen communicate risk and system state clearly?
- Is hierarchy created through spacing, typography, and status treatment before
  color effects?
- Would this remain usable during stress, urgency, or repeated daily operation?

## Canonical Asset Questions

- Does the screen depend on decorative or atmospheric imagery?
- If yes, was the correct medium chosen: code-native, SVG, or raster asset?
- Were canonical background elements preserved instead of approximated away?
- If a canonical reference exists, is the remaining difference documented and
  explicitly acceptable?
