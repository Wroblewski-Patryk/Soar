# App Completion Index

Generated: 2026-07-23T00:51:39.929Z
Project: Soar
Root: C:/Personal/Projekty/Aplikacje/Soar
Source graph: docs/graphs/architecture-awareness.json

## Purpose

This index turns architecture-awareness entities into user-facing completion lanes.
Agents use it to decide what to plan next: backend/API proof, frontend/browser proof, auth/subscription/configuration gates, exchange integration proof, or cleanup.
Internal functions and modules are implementation details: they receive proof through their owning product boundary and are not dispatched as one issue per symbol.

## Counts

- Items: 86
- User flows: 5
- Needs browser/screenshot review: 0
- Missing test link: 0
- Missing doc link: 0
- Implemented, needs proof: 0
- Blocked: 0
- Known non-ok risk items: 0
- Priority review items indexed: 0/0
- Priority review truncated: false

## Flow Summary

- Account access: 52 entities; risks {"ok":52}; gates {"auth":52,"subscription":4,"configuration":3}
- Dashboard overview: 15 entities; risks {"ok":15}; gates {"configuration":1}
- Unclassified user workflow: 14 entities; risks {"ok":14}; gates {}
- Subscription and entitlement: 4 entities; risks {"ok":4}; gates {"subscription":4}
- Admin operation: 1 entities; risks {"ok":1}; gates {}

## Priority Review Queue

_None._

## Agent Rule

A user-facing feature is not complete until the backend/API state, frontend route/component state, configuration/auth/subscription gates, tests, docs, and browser screenshot/clickthrough evidence are either verified or explicitly blocked with an owner/action.
