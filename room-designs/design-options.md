# Design Options

## Status

V1 MVP output contract for rectangular living room options.

The option should feel buyable and inspectable, not like a static moodboard.

## Each Option Contains

- Design name and short direction
- Room and request version used
- Layout and item placements
- Static preview image or images
- Interactive 3D room view state
- Furniture hotspots with item name, role, price, dimensions, listing health, and replacement action
- Selected Marketplace items and alternatives
- Replacement candidates for every important item role
- Candidate pool references and listing health for selected items
- Fit result for every placed item
- Listed-price total
- Confirmed or negotiated-price total when available
- Missing information and confidence notes
- Reasons the option matches the request
- Effects of unavailable or changed listings

Every total must show which prices are listed, confirmed, negotiated, estimated, or missing.

An option should identify which selected items are strong, weak, stale, or replacement-sensitive so the user can tell whether the design is ready to pursue.

## V1 Option Set

Generate up to four options when candidate pools are strong enough.

Useful option types:

- Best overall fit: strongest balance of style, budget, fit confidence, and listing health.
- Cheapest workable room: lowest total that still satisfies hard constraints.
- Strongest style match: best visual direction while keeping fit and budget warnings visible.
- Most resilient option: selected items have the best backups and least listing risk.

If fewer than four meaningful options exist, show fewer options with clear reasons instead of padding weak variations.

## Required Item Role Record

Inside an option, each selected product role should include:

- Role name and purpose in the room
- Selected Marketplace item reference
- Candidate pool reference
- Placement and fit result reference
- Price type and current price
- Listing health and last checked time
- Style reason for choosing it
- Known weaknesses, missing values, and confidence
- Backup candidates and whether each backup has been fit-checked
- Replacement sensitivity: low, medium, or high

## Option Readiness

- `complete` - every required role has a fitting selected item, visible price status, and no hidden blocking uncertainty.
- `partial` - at least one requested role is missing, weak, stale, or waiting on confirmation, but the option still teaches the user something useful.
- `blocked` - a hard requirement cannot be satisfied without changed user input, new measurements, or new Marketplace candidates.
- `stale` - the option was valid earlier but depends on outdated listing, price, availability, fit, request, or room-model data.

A `partial`, `blocked`, or `stale` option can be shown, but it must not be described as ready to pursue.

## Totals

Each option should show:

- Listed-price total
- Confirmed-price total when available
- Negotiated-price total when available
- Missing-price count
- Price-change warnings since the option was generated
- Budget difference from the user's approved limit

Totals should update when a selected product is replaced, when Marketplace refreshes a price, or when the user changes budget.
