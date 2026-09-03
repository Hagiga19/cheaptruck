# Main Workflow

## Workflow Promise

CheapTruck should move a room project forward only when the next owner has enough confirmed or clearly labeled information to act.

Workflow coordinates the sequence, states, and refresh loops. It does not own request meaning, measurements, listing facts, fit calculations, design logic, or UI presentation.

## Phase Flow

| Phase | Primary owner | Starts when | Produces | Next gate |
| --- | --- | --- | --- | --- |
| Account and address gate | UI / future auth owner | User opens CheapTruck | Signed-in user and confirmed or editable address | User can start or resume a room project |
| Project start | Workflow / UI | Account gate is complete | New or resumed room project with current state | Room creation wizard opens |
| Room and request intake | UI | User starts wizard | Raw room inputs, photos, style, wanted items, budget, Marketplace choice, and address confirmation | Requests and Measurements can preserve their source values |
| Request resolution | Requests | Intake has decision-changing values | Versioned request, unknowns, clarification needs, and per-item requirements | Either ask clarification or request measurement limits |
| Room measurement | Measurements | Room inputs exist or are needed for search | Room model version, placement zones, confidence, and safe dimension ranges | Requests can create search briefs |
| Search brief creation | Requests | Request values and measurement limits are ready | Versioned Marketplace search brief per searched item role | Marketplace search approved or disabled per item |
| Candidate pool search | Marketplace | Search brief is approved | Candidate pool with listing health, prices, missing fields, and ranking labels | Candidate dimensions can be checked |
| Fit checking | Measurements | Candidate has dimensions or enough evidence to evaluate | `fits`, `does-not-fit`, or `needs-confirmation` for a specific item placement | Usable candidates can feed design options |
| Design generation | Room Designs | Enough fitting candidates exist | Multiple priced room options, 3D room state, hotspots, totals, backups, and weak spots | User can compare and select |
| User review | UI / Room Designs | Design options are ready | Selected option, requested replacements, or changed inputs | Seller-contact approval or affected refresh |
| Seller approval and contact | UI / Marketplace | User approves listings and message purposes | Availability, dimensions, pickup details, and negotiated prices when available | Listing facts refresh affected records |
| Design refresh | Workflow / Room Designs | Listing health, price, availability, dimensions, request, or measurements change | Updated affected options and preserved previous snapshots | Project returns to review or contact flow |
| Completion and history | Room Designs / Workflow | User is satisfied or purchasing path is complete | Current room result plus previous versions | Project can be reopened later |

## Happy Path

1. User creates an account or signs in.
2. User confirms an address before starting the room workflow.
3. User starts a room project and completes the room creation wizard.
4. UI sends raw room inputs to Measurements and raw request inputs to Requests.
5. Requests asks only for missing or conflicting values that affect the next search decision.
6. Measurements creates a room model, placement zones, and safe dimension ranges for wanted item roles.
7. Requests creates Marketplace search briefs for the approved item roles.
8. Marketplace builds living candidate pools instead of single final picks.
9. Measurements checks candidate item dimensions in exact intended placements.
10. Room Designs generates immersive options using fitting candidates, visible prices, listing health, backups, and confidence notes.
11. User selects an option and approves seller contact for specific listings and message purposes.
12. Marketplace verifies availability, dimensions, pickup details, and negotiated prices within approved limits.
13. Any changed item facts trigger a targeted refresh of affected design options and totals.
14. The current result and previous versions remain available in room history.

## Core Loops

- Clarification loop: if Requests lacks a decision-changing value, Workflow moves the project to `needs-information` and UI collects only the missing answer.
- Measurement loop: if Measurements lacks room, item, placement, clearance, or access data, Workflow moves the affected project or item role to `needs-measurements` or `needs-confirmation`.
- Marketplace refresh loop: if listings become stale, unavailable, too expensive, or incomplete, Marketplace refreshes the affected candidate pool or starts replacement mode.
- Design refresh loop: if a selected item, price, fit result, request, or room model changes, Room Designs updates only the affected options and preserves prior snapshots.

## Done For V1

A workflow pass is complete when the project can show:

- Current project state and responsible owner
- Current request version and room-model version
- Item-role progress from requested item to usable or blocked candidate
- Candidate pool health for each Marketplace-searched role
- Fit result for every placed item in a design option
- User approval status for seller contact
- Listing health, price status, and refresh needs
- Current design result and previous snapshots
