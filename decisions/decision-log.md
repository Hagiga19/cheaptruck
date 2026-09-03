# Decision Log

## Format

Use this format for each decision:

```md
## YYYY-MM-DD - Decision title

- Decision:
- Reason:
- Tradeoff:
- Follow-up:
```

## Decisions

## 2026-09-03 - Add Tech as the implementation architecture area

- Decision: Use `tech/` as the owner for implementation architecture, database planning, object storage, containers, environments, deployment, background jobs, secrets, backups, observability, and running build notes.
- Reason: CheapTruck needs one place to track where the app runs and where objects and records live before app building starts.
- Tradeoff: Technical notes now have their own support area, but product rules must still stay in the product domain that owns their meaning.
- Follow-up: Fill the first-pass architecture map only after the MVP behavior is stable enough to choose the initial stack.

## 2026-09-03 - Start Room Designs MVP with rectangular living rooms

- Decision: The first immersive Room Designs MVP supports rectangular living rooms, up to four meaningful design options, simple product-state-driven 3D views, visible price and listing-health warnings, and one to two backup candidates for important product roles when Marketplace pools allow it.
- Reason: This scope matches the V1 Measurements model and proves the core CheapTruck promise with common secondhand furniture before expanding to more room types or irregular geometry.
- Tradeoff: The MVP will not handle every room type at first, but it can be much clearer about fit, price, replacement, and buyability.
- Follow-up: Define living-room clearance defaults, Marketplace ranking rules, UI option review, and address/account ownership before implementation.

## 2026-09-03 - Use context routers for supporting folders

- Decision: Add `CONTEXT.md` routers to `decisions/` and `docs/` so support-area work follows the same read-order pattern as the core product folders.
- Reason: Future sessions should be able to update decisions or project-wide docs without loading the whole workspace.
- Tradeoff: There are two more small files to maintain, but support-area ownership is clearer.
- Follow-up: Keep each router short and update it only when folder ownership changes.

## 2026-09-03 - Capture or confirm address before room projects continue

- Decision: Account creation or sign-in comes first, and the user address must be captured or confirmed before the room workflow continues.
- Reason: Marketplace search radius, pickup feasibility, delivery assumptions, and local item availability depend on location.
- Tradeoff: Onboarding has one more gate before the user reaches room design, but later search and fit work can avoid wrong-location results.
- Follow-up: UI should define the exact account, optional Facebook sign-in, and address-edit screens before implementation.

## 2026-09-03 - Require user approval before seller contact

- Decision: CheapTruck must get explicit user approval before contacting sellers, negotiating, or taking Facebook-connected actions for specific listings and purposes.
- Reason: Seller communication can expose user intent, personal data, pickup constraints, and negotiation limits.
- Tradeoff: The product cannot fully automate purchase pursuit without an approval step, but trust and account safety are clearer.
- Follow-up: Verify Marketplace access, messaging limits, and allowed automation before building live seller-contact behavior.

## 2026-09-03 - Make Room Designs MVP immersive, priced, and replaceable

- Decision: The next Room Designs MVP should produce multiple design options with an interactive room view, visible item prices, listing health, and replaceable product roles.
- Reason: CheapTruck's core value is not only finding cheap items; it is showing a room that feels real, buyable, and resilient when secondhand listings change.
- Tradeoff: The design output contract is more complex than static moodboards, but it better matches the Marketplace-based product promise.
- Follow-up: Define the first supported room type, minimum 3D room state, backup count per product role, and replacement behavior.

## 2026-09-03 - Track project state and item-role state separately

- Decision: Workflow tracks the whole room project state separately from each requested item role's state.
- Reason: A single listing can be missing dimensions, fail fit, sell, or need replacement without blocking the entire room project.
- Tradeoff: The workflow has more state to display, but failures and refreshes can stay targeted.
- Follow-up: Define exact seller-reply timeouts, stale-listing thresholds, and category-specific recovery behavior later.

## 2026-09-03 - Treat Marketplace as living candidate pools

- Decision: Marketplace owns per-item candidate pools, listing health, seller-contact records, and replacement searches so designs can stay buyable as secondhand inventory changes.
- Reason: Facebook Marketplace listings are unstable; a design built around one unexplained item becomes fragile when price, availability, dimensions, or seller response changes.
- Tradeoff: Requests, Measurements, Room Designs, and UI must reference Marketplace pool and listing-health state without taking ownership of it.
- Follow-up: Validate Marketplace access and define MVP rules for manual listing collection, pool refresh timing, and seller contact approval.

## 2026-09-03 - Keep measured item placement in Measurements

- Decision: `measurements/` owns the dimensional copy of each Marketplace item used for fit checks and the item's exact intended placement in the measured room.
- Reason: Fit depends on the specific item size, position, orientation, clearance, and access path, not only on listing facts or design preference.
- Tradeoff: Marketplace, Room Designs, and Measurements will all reference the same item, so handoffs must keep listing facts, design intent, and measured placement separate.
- Follow-up: Define category-specific clearance defaults and how multiple possible placements are compared.

## 2026-09-02 - Organize planning by product ownership

- Decision: Use `ui/`, `requests/`, `measurements/`, `marketplace/`, `room-designs/`, and `workflow/` as the core product folders.
- Reason: These areas match how CheapTruck receives information, reasons about a room, finds real items, creates designs, and presents the result.
- Tradeoff: Some tasks cross folders, so `workflow/` must define handoffs while each domain remains the source of truth for its own rules.
- Follow-up: Define each area one at a time, beginning with the UI interface map.

## 2026-09-02 - Keep AI behavior inside its owning domain

- Decision: Do not create a general `ai/` folder at this stage.
- Reason: Request clarification, fit reasoning, Marketplace matching, and room styling have different inputs and ownership.
- Tradeoff: Shared AI rules may need a dedicated location later if real duplication appears.
- Follow-up: Revisit only after the domain behaviors are defined.
