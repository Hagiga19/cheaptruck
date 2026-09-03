# Marketplace Search Rules

## Status

V1 product direction: each search creates or refreshes a living candidate pool, not a single final pick. Search access and automation behavior are still unverified.

## Search Inputs

- Versioned per-item search brief from Requests
- Hard constraints and flexible ranking preferences
- Budget, price flexibility, location, and travel radius
- Acceptable dimension ranges and placement limits supplied by Measurements through the request brief
- Optional design-direction filters when refreshing an existing design

## Search Output

For each searched item, Marketplace returns a candidate pool with:

- Multiple active candidates when available
- Ranking label and short reason for each candidate
- Listing health, price, location, and last checked time
- Missing fields and confidence notes
- Rejected candidates when rejection teaches the next search
- Replacement candidates when refreshing an existing selected design

## Candidate Evaluation

- Match to request
- Match to design direction
- Dimension completeness and fit status
- Price and total budget effect
- Location and collection practicality
- Listing freshness and availability confidence
- Missing or suspicious information

Search should return multiple viable candidates, not one unexplained choice. A thin result should be marked as `thin-results` instead of pretending the choice is strong.

Marketplace can reject an obvious dimensional mismatch during search, but only Measurements can mark a specific listing as fitting.

## Replacement Search

When a listing becomes unavailable, stale, too expensive, or unsuitable after fit checks, Marketplace reuses the same item role, request constraints, style direction, budget, location, and placement limits to search for replacements.

Replacement candidates must be sent back through Measurements before Room Designs can treat them as usable in the affected option.
