# Workflow Context

## Purpose

Use this folder for the end-to-end CheapTruck process, shared task states, handoffs, retries, and updates across product areas.

Workflow coordinates the domains but does not own their internal rules or facts.

## Owns

- Order of major steps
- Entry and completion conditions
- Cross-area handoffs
- Approval points
- Retry, replacement, and refresh behavior
- Overall project status

## Files

- `main-flow.md` - the complete user and system journey, phase gates, and refresh loops
- `state-model.md` - project states, item-role states, and transition rules
- `handoffs.md` - what each product area receives, produces, and returns to workflow
- `recovery-paths.md` - what happens when information, fit, listings, sellers, or prices fail

## Status

V1 workflow defined. Exact timeouts, automation boundaries, and category-specific rules still need definition by the owning product areas.
