# Clarification Rules

## Purpose

Define how the system identifies and collects information needed to continue a request.

## Initial Rules

- Ask only for information that affects the next decision.
- Group closely related questions when that makes answering easier.
- Explain what measurement or choice is needed in user-facing language.
- Prefer UI controls for known parameter sets and chat for open or unusual details.
- Confirm conflicts instead of choosing one value silently.
- Do not invent dimensions, budget, location, style preferences, or user approval.
- Save each accepted answer back into the current request version.
- Do not ask for a flexible preference when the user has already allowed the system to choose it.
- Re-resolve only the items affected by a new answer or changed measurement.

## Readiness Checks

### Before Request Resolution

- The wanted item category or intended function is known.
- The relevant room and placement area can be identified.
- Conflicting user answers that change the item requirement are resolved.

### Before Marketplace Search

- The user approved Marketplace fetching for the item.
- The item has a resolved category and purpose.
- A usable dimensional range is available when size affects placement.
- The relevant budget or price flexibility is known.
- Search location and radius are confirmed.
- No unresolved conflict affects a hard search constraint.

### Before An Item Is Recommended As Usable

- The listing satisfies the request's hard constraints.
- The listing has enough actual dimensions for Measurements to evaluate it.
- Measurements returned `fits` for that exact item and intended placement.
- Price and location remain within the approved request limits.
- Availability uncertainty, listing health, and missing seller information are shown and handled by Marketplace.

A `needs-confirmation` candidate may be shown separately as unverified, but it must not be described as usable or included in a recommended design.

### Before Seller Contact

- The user selected or approved the relevant candidate or design.
- Any unresolved fit, price, or listing uncertainty is visible to the user.
- Marketplace has the user's approved contact and negotiation limits.
- The message purpose is clear: availability check, dimension question, pickup detail, or negotiation.
