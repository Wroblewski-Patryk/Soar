# View Generation Prompt Pack

Use this file when asking AI to generate a new Soar screen, redesign an
existing dashboard view, or propose a polished UI implementation plan.

## Intent

This prompt pack helps the AI produce beautiful views that still fit Soar's
operator-grade UX, trading safety posture, and shared dashboard system.

## Core Prompt

```text
Design and implement a Soar view for: {screen_or_flow}

Project context:
- Soar is a trading operator platform, not a generic SaaS dashboard and not a casino-style crypto app.
- The UI should feel like a premium operator cockpit: high-signal, deliberate, fast, credible.
- Visual personality: Technical Sharpness + Premium Restraint + Calm Utility.
- Reuse shared dashboard shell, state patterns, risk/mode badges, and existing shared components before inventing new ones.

Required UX behavior:
- Include loading, empty, error, and success states.
- Consider desktop, tablet, and mobile as distinct layouts.
- Preserve accessibility: focus visibility, labels, keyboard use where relevant, readable contrast.
- Keep mode/risk/runtime truth visually primary when relevant.
- Make risky actions visibly different from safe actions.

Visual direction:
- Strong hierarchy through spacing, typography, and composition first.
- Use color for operational meaning, not decoration.
- Avoid template-like card soup.
- Avoid noisy gradients, glow, or "crypto casino" aesthetics.
- Aim for a screen that looks polished enough for a product showcase, while still believable in live operations.

Output:
1. Layout concept
2. Shared components to reuse
3. New reusable components if needed
4. State handling plan
5. Responsive strategy for desktop/tablet/mobile
6. Accessibility notes
7. Implementation plan in repo terms
```

## Compact Prompt

Use this shorter version when the AI already knows the repo well.

```text
Create a Soar screen for {screen_or_flow}.
Make it feel like a premium operator cockpit, not generic SaaS and not crypto-casino UI.
Reuse shared shell, badges, and state components.
Design explicit loading/empty/error/success states.
Differentiate desktop, tablet, and mobile intentionally.
Prioritize risk, mode, and runtime truth in the hierarchy.
Use strong composition, disciplined accents, and scannable density.
Avoid equal-weight card grids, decorative glow, and one-off local styles.
```

## JSON Contract

Use this when the target AI/tool prefers structured input.

```json
{
  "goal": "screen or flow to design",
  "product_context": {
    "product_type": "trading operator platform",
    "visual_personality": [
      "Technical Sharpness",
      "Premium Restraint",
      "Calm Utility"
    ],
    "avoid": [
      "generic SaaS admin look",
      "crypto casino aesthetics",
      "equal-weight card soup",
      "decorative glow without meaning"
    ]
  },
  "design_constraints": {
    "reuse_shared_components": true,
    "reuse_dashboard_shell": true,
    "required_states": ["loading", "empty", "error", "success"],
    "surfaces": ["desktop", "tablet", "mobile"],
    "accessibility": [
      "focus visibility",
      "labels",
      "keyboard support when relevant",
      "readable contrast"
    ]
  },
  "ui_priorities": [
    "risk-first hierarchy",
    "mode and runtime truth visibility",
    "scannable data density",
    "premium but credible polish"
  ],
  "deliverables": [
    "layout concept",
    "component mapping",
    "responsive plan",
    "state handling plan",
    "implementation notes"
  ]
}
```

## Review Questions

Before accepting an AI-generated view, ask:

- Does this look like Soar, or like a generic dashboard template?
- Is the primary operator task obvious within seconds?
- Is there a clear scan path on desktop?
- Does tablet add utility instead of just scaling mobile?
- Are risky actions visually distinct?
- Would this still feel credible during real trading activity?
