# Requests Context

## Purpose

Use this folder for the user's complete room-design request and the requirements calculated from it. A request preserves what the user submitted, combines it with confirmed measurement constraints, and produces a precise per-item brief for Marketplace search and later design work.

## Owns

- The current user goal
- Raw parameters submitted through the UI
- User intent, priorities, and permission for the system to choose
- Derived per-item requirements and acceptable ranges
- Hard constraints, flexible preferences, and unresolved values
- Marketplace search briefs produced from the request
- Required and optional information
- Readiness and missing-information detection
- Clarification answers and request revisions
- Source, confidence, and version history for every value

## Does Not Own

- Room geometry, dimensional calculations, or final fit results
- Marketplace search execution, listings, prices, or availability
- Styling and layout decisions
- Interface presentation

## Files

- `request-model.md` - information contained in one request
- `resolution-rules.md` - how submitted parameters become precise item requirements and search briefs
- `clarification-rules.md` - how missing or conflicting information is handled

## Status

The first request structure and resolution contract are defined. Exact category-specific limits depend on the measurement and Marketplace rules still to be defined.
