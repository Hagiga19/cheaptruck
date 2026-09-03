# Design Engine

## Purpose

Define how the system creates a practical and visually coherent room design.

## Inputs

- Current request version
- Room model and confirmed constraints
- Existing items that remain
- Marketplace candidate pools and listing health
- Fit results
- Budget and design priorities

## Responsibilities

- Interpret the requested style without losing practical needs.
- Respect the resolved item categories, quantities, priorities, and constraints from Requests.
- Decide placement, candidate combinations, and visual relationships.
- Prefer strong candidate pools, but surface weak pools when the user should understand a tradeoff.
- Present additional item categories as suggestions instead of silently adding them to the request.
- Respect confirmed room constraints and fit results.
- Balance appearance, function, budget, and listing uncertainty.
- Explain why each selected item belongs in the design.
- Produce meaningful alternatives instead of superficial variations.
- Create multiple design options with distinct style, layout, budget, or tradeoff logic.
- Treat every placed product as a replaceable role, not a permanent static object.
- Produce enough room state for both static previews and interactive 3D visualization.
- Refresh only affected options when Marketplace replaces or updates a selected item.

## V1 MVP Scope

The first immersive Room Designs MVP supports one rectangular living room.

This matches the V1 Measurements model and keeps the first design pass focused on common, Marketplace-friendly furniture roles.

Supported in V1:

- One rectangular living room with confirmed or clearly estimated measurements.
- User-requested living-room item roles, such as sofa, chair, coffee table, rug, TV stand, side table, lamp, shelf, storage, or decor.
- Existing furniture that must remain when Measurements provides position and size.
- Multiple design options using real Marketplace candidates that have usable fit results.
- Simple 3D room state built from measured room geometry, placements, approximate product shapes, listing images or colors, price labels, and hotspots.

Not supported in V1:

- Bedrooms, kitchens, bathrooms, outdoor spaces, or multi-room projects.
- L-shaped, curved, split-level, or irregular rooms.
- Electrical, plumbing, renovation, mounted-structural, or safety-critical installation planning.
- Claims that an item is buyable, available, or confirmed unless Marketplace evidence supports that status.

If the user starts outside the V1 scope, Room Designs should preserve the request and explain the current limitation instead of inventing an unsupported design.

## Style Representation

Each design option should carry a short style direction that can guide Marketplace selection and visual composition.

V1 style state includes:

- Primary style label, such as modern, cozy, minimalist, vintage, industrial, boho, classic, or mixed.
- Mood words from the user's own request.
- Color preferences and colors to avoid.
- Material preferences, such as wood, metal, fabric, leather, glass, or natural fibers.
- Flexibility level for each preference: hard constraint, flexible preference, system-chosen, or unknown.
- Explanation of how the selected items support the style.

Style should rank and combine candidates, but it must not override hard request constraints, budget, fit results, or listing health.

## Living Room Layout Rules

For the V1 rectangular living room:

- Start with the main seating role and orient it toward the user's stated focal point when available.
- Keep walking paths and door swings clear according to Measurements.
- Place surfaces, storage, rugs, and accent pieces around the seating and focal point.
- Prefer item combinations that satisfy more requested roles before adding optional suggestions.
- Use backups that preserve the same role, scale, and style reason where possible.
- Show when a layout depends on weak, stale, missing, or low-confidence Marketplace data.

Room Designs may propose additional roles, but suggestions must be labeled as optional and must not become part of the request without user approval.

## Option Generation

V1 should produce up to four design options when enough fitting candidates exist.

Each option should be meaningfully different through at least one of:

- Style direction
- Layout arrangement
- Budget tradeoff
- Candidate quality or listing-health tradeoff
- Replacement resilience

Avoid superficial variations where the same products are rearranged without a useful reason.

## Candidate Use Rules

- Use only candidates that Measurements marked `fits` for selected items in recommended design options.
- Show `needs-confirmation` candidates only as warnings, backups, or optional alternatives unless the user explicitly approves the uncertainty.
- Do not include `does-not-fit` candidates in a recommended option.
- Prefer roles with at least one backup candidate when the Marketplace pool can support it.
- Keep pool strength visible when a role has no backup or depends on a stale listing.

## Backup Rules

Each important selected product role should carry:

- Preferred target: two backup candidates.
- Minimum useful MVP target: one backup candidate.
- Allowed exception: zero backups only when Marketplace results are thin or unavailable, and the option marks that role as replacement-sensitive.

A backup is not usable until it has its own fit result for the intended placement or a clearly labeled alternate placement.

## Quality Checks

Before an option is ready for user review, Room Designs should verify:

- The option references the request, room, candidate pool, item, fit, and price versions it used.
- Every selected Marketplace item has a `fits` result for its intended placement.
- The total separates listed, confirmed, negotiated, estimated, and missing prices.
- The 3D state can place every important item without impossible overlap.
- Listing health and confidence warnings are visible.
- The option explains the main tradeoff in plain language.

## Failure Response

When suitable listings cannot be found:

- If one role fails, keep the rest of the option only if the missing role and consequence are visible.
- If a hard required role has no fitting candidate, do not present the option as complete.
- Offer the next useful path: widen radius, relax flexible preferences, adjust budget, ask for dimensions, skip the role, wait, or use manual item input.
- Preserve the failed search and reason so the next search is smarter.
