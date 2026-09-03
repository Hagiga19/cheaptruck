# Workflow State Model

## Scope

Workflow tracks two levels:

- Project state: where the overall room project is.
- Item-role state: where each requested product role is, such as sofa, rug, desk, or lamp.

Use item-role state for partial failures so one unavailable listing or failed fit check does not block the entire project when replacements can continue.

## Project States

| State | Entry condition | Responsible owner | Next action |
| --- | --- | --- | --- |
| `draft-request` | User started or resumed a room project, but the request is not resolved. | UI / Requests | Preserve raw inputs and identify missing or conflicting values. |
| `needs-information` | A decision-changing request value is missing or conflicting. | Requests / UI | Ask the smallest useful clarification and save the answer. |
| `needs-measurements` | The request is understood, but room, placement, dimension, clearance, or access data is not ready. | Measurements / UI | Collect or confirm the missing measurement data. |
| `ready-for-search` | Search-approved item roles have resolved briefs with usable dimensional limits. | Requests | Send versioned search briefs to Marketplace. |
| `searching-marketplace` | Marketplace has one or more approved search briefs to run or refresh. | Marketplace | Build or refresh candidate pools. |
| `candidate-pool-ready` | Candidate pools have active, rejected, missing-info, or replacement candidates. | Marketplace | Send candidates needing fit evaluation to Measurements. |
| `checking-fit` | One or more candidates need placement-specific fit results. | Measurements | Return `fits`, `does-not-fit`, or `needs-confirmation`. |
| `generating-designs` | Enough fitting candidates exist to produce useful room options. | Room Designs | Generate or refresh design options. |
| `ready-for-review` | Design options are available to inspect. | Room Designs / UI | User compares options, inspects weak spots, and selects or revises. |
| `awaiting-user-approval` | Seller contact, negotiation, replacement, or a material uncertainty needs user approval. | UI / Workflow | Capture explicit approval, edit, skip, or decline. |
| `contacting-sellers` | User approved specific listings and message purposes. | Marketplace | Check availability, dimensions, pickup details, or negotiate. |
| `updating-design` | Listing facts, fit results, prices, request values, or room measurements changed after design generation. | Workflow / Room Designs | Refresh affected options and totals. |
| `complete` | The user has a current acceptable result or the purchasing path is finished for now. | Workflow / Room Designs | Preserve final state and history. |
| `paused` | The user, seller, or system is waiting and no immediate workflow action is available. | Workflow | Resume from the last responsible owner when new input arrives. |

## Item-Role States

| State | Meaning | Typical next state |
| --- | --- | --- |
| `requested` | User asked for this item role. | `brief-needed` |
| `brief-needed` | Requests needs resolution or measurement limits before search. | `brief-ready`, `needs-information`, or `needs-measurements` |
| `brief-ready` | Search brief is ready and Marketplace search is approved. | `searching` |
| `search-disabled` | User does not want Marketplace search for this role. | Manual design handling or skipped search |
| `searching` | Marketplace is collecting or refreshing candidates. | `pool-ready`, `thin-results`, or `no-results` |
| `thin-results` | Marketplace found too few or weak candidates to be confident. | User approval, broader search, request revision, or `pool-ready` |
| `no-results` | Marketplace found no candidates that satisfy the current hard constraints. | Request revision, broader search, wait, or `skipped` |
| `pool-ready` | Candidate pool exists and candidates can be evaluated. | `fit-checking` |
| `needs-dimensions` | Candidate looks useful but lacks required dimensions. | `seller-check-needed` or `fit-checking` |
| `fit-checking` | Measurements is checking a candidate in a specific placement. | `usable`, `does-not-fit`, or `needs-confirmation` |
| `needs-confirmation` | Fit, clearance, access, price, or listing evidence is too uncertain for a usable recommendation. | Clarification, seller check, updated fit check, or replacement search |
| `usable` | At least one candidate fits the intended placement. | `selected-in-design` or backup |
| `does-not-fit` | Candidate failed a placement-specific fit check. | Alternate placement, replacement search, or rejected |
| `selected-in-design` | Candidate is used in one or more design options. | `seller-check-needed`, `replacement-needed`, or `confirmed-for-purchase` |
| `seller-check-needed` | Availability, dimensions, pickup, or price needs seller confirmation. | `awaiting-seller` after approval |
| `awaiting-seller` | Message was sent and reply is not yet confirmed. | `confirmed-for-purchase`, `replacement-needed`, or `paused` |
| `confirmed-for-purchase` | Seller confirmed required facts within approved limits. | Keep in current option |
| `replacement-needed` | Selected or backup candidate became unavailable, stale, too expensive, or unsuitable. | `searching` |
| `replaced` | A replacement candidate now fills the same design role. | `selected-in-design` |
| `skipped` | User chose not to continue this role. | Preserve reason in history |

## Rules

- Every state must have a clear entry condition, responsible owner, timestamp, and next action.
- A project can return to an earlier state when information changes, but only the affected item roles should move backward when possible.
- Waiting on the user and waiting on a seller must be distinguishable.
- Partial failure should identify the affected item or design instead of failing the entire project.
- State changes should preserve source versions: request version, room-model version, candidate-pool version, item-record version, fit-check version, and design-option version when relevant.
- A stale listing, seller reply, price change, or unavailable item can return only the affected item role to `searching`, `fit-checking`, or `replacement-needed`.
- A changed room model can invalidate fit results and design options that depended on the old room version.
- A changed user goal, budget, location, or wanted item can invalidate affected search briefs and candidate pools.
- Unverified candidates can be shown as such, but they must not be counted as usable in recommended designs.

## Initial State Notes

- `searching-marketplace` starts when Requests has one or more ready search briefs approved for Marketplace fetching.
- `candidate-pool-ready` starts when Marketplace has candidates, pool status, and listing health ready for Measurement fit checks.
- `contacting-sellers` starts only after the user approves the listings and message purposes.
- `complete` does not mean every Marketplace item was purchased. It means the current workflow goal has an acceptable saved result and can be resumed later.
