# Workflow Handoffs

## Handoff Rule

Every cross-area handoff must include:

- Source owner and source version
- Target owner
- Current state
- Known values, unknowns, conflicts, and confidence
- Timestamp or last checked time
- User approvals or limits when relevant
- Next action requested

Workflow records that a handoff happened. The receiving product area owns the result it produces.

## Area Handoffs

| Handoff | Sends | Returns |
| --- | --- | --- |
| UI -> Requests | Raw user words, wizard answers, wanted items, style preferences, budget, Marketplace-fetch choices, address confirmation, and clarification answers | Versioned request, readiness state, missing-information prompts, and resolved per-item requirements |
| UI -> Measurements | Room editor values, photos, wall/object inputs, existing furniture, placement hints, and user-confirmed measurements | Room model version, measurement confidence, placement zones, and missing measurement prompts |
| Measurements -> Requests | Safe dimension ranges, placement limits, clearance needs, access constraints, and room-model version | Search briefs can be resolved or marked blocked by missing measurements |
| Requests -> Marketplace | Versioned search brief per approved item role, including hard constraints, flexible preferences, budget, location, radius, and unknowns Marketplace may resolve | Candidate pool status and listing records |
| Marketplace -> Measurements | Candidate listing reference, dimensions, dimension source, access information, missing fields, and candidate-pool version | Placement-specific fit result and explanation |
| Measurements -> Room Designs | Room model, intended placements, clearance areas, and fit results for specific candidates | Design engine can use fitting candidates and show uncertainty |
| Marketplace -> Room Designs | Candidate pools, selected listings, backup candidates, listing health, current price, availability, and seller status | Design options can show real products, weak spots, replacements, and totals |
| Room Designs -> UI | Generated options, 3D room state, hotspots, selected products, backups, totals, fit notes, and listing-health warnings | User selection, revisions, replacement requests, or seller-contact approval |
| UI -> Marketplace | Explicit seller-contact approval, message purpose, approved listings, negotiation limits, and user decisions | Seller message records and updated listing facts |
| Marketplace -> Workflow | Availability, seller replies, price changes, missing dimensions, stale listings, or unavailable items | Workflow triggers targeted design refresh or replacement mode |
| Workflow -> Room Designs | Affected request, room, listing, fit, or price changes | Refreshed affected design options and preserved previous snapshots |

## Approval Handoffs

Require explicit user approval before:

- Fetching Marketplace results when the user has not enabled fetching for an item role
- Contacting a seller
- Asking a seller for dimensions, pickup details, or availability
- Negotiating or making an offer
- Using a candidate with visible unresolved fit, price, or listing uncertainty
- Replacing a selected item when the replacement changes a hard user constraint

## Version Handoffs

- Requests must reference the room-model version used to create search briefs.
- Marketplace candidate pools must reference the search brief version that produced them.
- Measurements fit results must reference the item-record version, room-model version, placement version, and candidate-pool version.
- Room Designs options must reference the request, room, candidate pool, item, fit, and price versions they used.
- History keeps old versions instead of overwriting them.
