# Marketplace Candidate Pools

## Purpose

Maintain a living shortlist of Marketplace candidates for each requested item so a room design stays buyable as listings, prices, and seller replies change.

## Candidate Pool

Each searched item has its own pool tied to a request version and search brief.

- Item role, category, priority, and quantity
- Search brief version and search time
- Location, radius, budget, and price flexibility used
- Active candidates, rejected candidates, and replacement candidates
- Pool status: searching, needs-fit-check, usable-options-ready, thin-results, no-results, stale, or refresh-needed
- Reason the pool changed, such as new search, changed request, changed fit result, seller reply, listing removed, or price change

The pool should normally keep several candidates instead of one unexplained recommendation.

## Candidate Labels

- `strong-match` - likely useful if Measurements confirms fit
- `budget-match` - low price or good value but may compromise style or condition
- `style-match` - visually strong but weaker on price, distance, or certainty
- `needs-dimensions` - promising but missing required dimensions
- `seller-check-needed` - promising but availability, pickup details, or price need confirmation
- `backup` - viable replacement if the preferred item fails
- `rejected` - failed a hard request, price, location, availability, or obvious dimension rule

Labels explain why the candidate is in the pool; they are not proof that the item fits.

## Listing Health

Marketplace tracks listing health separately from design quality.

- `fresh` - recently checked and no known issue
- `stale` - not checked recently enough for a buy decision
- `needs-seller-reply` - awaiting availability, dimension, pickup, or price confirmation
- `sold-risk` - old, suspicious, or seller response suggests it may be gone
- `unavailable` - removed, sold, or seller confirmed unavailable
- `price-changed` - listed or negotiated price changed after a design used it
- `missing-critical-info` - a decision-changing value is unknown

Designs can reference listing health, but Marketplace owns the health value and its evidence.

## Replacement Mode

When a selected listing becomes unavailable, stale, too expensive, or missing critical information:

1. Keep the old item and design snapshot for history.
2. Reuse the same item role, request constraints, placement limits, style direction, budget, and location.
3. Search for replacements that can serve the same design purpose.
4. Send each replacement candidate through Measurements for a new fit result.
5. Refresh only the affected design options and totals.

A replacement is not treated as equivalent until the reason it replaces the old item is recorded.

## Rules

- Do not silently hide weak candidates; mark the weakness and confidence.
- Do not let a single unavailable item destroy the whole project when replacements can be searched.
- Do not contact sellers until the user approves the listing and message purpose.
- Preserve listed price, negotiated price, availability evidence, and check time separately.
- Manual collection and user-assisted seller contact are acceptable for MVP while Marketplace access is unverified.
