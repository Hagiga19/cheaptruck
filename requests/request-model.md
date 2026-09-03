# Request Model

## Status

First request structure defined. Exact storage format will be selected during implementation.

## Request Identity

- Request, project, room, and current-version identifiers
- Created and updated times
- Current request status and readiness state
- Room-model version used to resolve the request

## Submitted Parameters

Preserve what the user supplied through the UI before normalization or calculation:

- Original written request and clarification answers
- Uploaded room photos and references
- Desired room change and intended use
- Wanted item categories and each item's purpose and priority
- Preferred item dimensions, or permission for the system to choose them
- Style, color, material, and condition preferences
- Total budget, per-item limits, and price flexibility
- Confirmed project location and search radius
- Existing items to keep, move, remove, or replace
- Room and placement inputs passed to Measurements
- Per-item Marketplace-fetch choice

## Resolved Requirements

Store one resolved record for each wanted item:

- Item category, purpose, quantity, and priority
- Hard constraints that a candidate must satisfy
- Flexible preferences used for ranking
- Acceptable width, depth, height, orientation, and clearance limits supplied by Measurements
- Preferred dimensions when narrower than the safe limits
- Style, color, material, condition, and flexibility
- Item budget and allowed price flexibility
- Search location, radius, and collection constraints
- Whether Marketplace search is approved for the item
- Unknowns, conflicts, assumptions, confidence, and source for each value

The resolved record is the basis of the Marketplace search brief. It is not proof that a specific listing fits.

## Readiness

- `needs-information` - a decision-changing user value is missing or conflicting
- `needs-measurements` - the request is understood but safe dimensional limits are unavailable
- `ready-for-search` - every searched item has enough hard constraints for a useful Marketplace search
- `search-disabled` - the user does not want Marketplace results for this request or item

## Versions And Provenance

- Preserve the user's original words and raw UI values.
- Store user-provided, normalized, calculated, and system-chosen values separately.
- Record the source product area and source version for calculated values.
- Record when the user explicitly allowed the system to choose a value.
- A revision creates a new request version instead of erasing the previous one.

## Rules

- Never convert a preference into a hard constraint without user confirmation.
- System-choice permission allows a value to be derived within confirmed constraints; it does not allow dimensions, budget, location, or approval to be invented.
- Label unknown, conflicting, and low-confidence information.
- A changed room model, budget, location, or wanted item invalidates affected resolved requirements and search briefs.
- A Marketplace candidate cannot be recommended as usable until Measurements returns `fits` for that exact item.
