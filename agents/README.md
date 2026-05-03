# Agent System

This directory defines the canonical project roles. Tool-specific folders such as `.agents/`, `.codex/`, and `.claude/` may contain richer prompts, but their behavior must remain consistent with these definitions.

Required roles:

- `analyzer.md` - checks architecture, code, tests, and documentation alignment.
- `planner.md` - converts gaps into tasks and execution order.
- `builder.md` - implements scoped changes.
- `tester.md` - runs verification and AI behavior simulations.
- `fixer.md` - repairs failed checks within the iteration limit.

All agents follow the AI production loop and stop after 3 failed iterations on the same problem.
