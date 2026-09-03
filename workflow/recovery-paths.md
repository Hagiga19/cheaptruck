# Workflow Recovery Paths

## Recovery Rule

When something fails or changes, Workflow should move only the affected project part backward, preserve the old snapshot, and make the uncertainty visible to the user.

## Common Paths

| Situation | State change | Owner | Recovery action |
| --- | --- | --- | --- |
| Missing request value | Project -> `needs-information` | Requests / UI | Ask only for the answer that affects the next decision, then re-resolve affected item roles. |
| Conflicting user answers | Project -> `needs-information` | Requests / UI | Show the conflict and ask the user to choose or allow the system to choose when safe. |
| Missing room measurement | Project -> `needs-measurements` | Measurements / UI | Collect or estimate the missing room value, keeping confidence visible. |
| Missing item dimensions | Item role -> `needs-dimensions` | Marketplace / Measurements | Mark candidate unverified, ask seller only after approval, or keep it out of recommended designs. |
| Candidate does not fit | Item role -> `does-not-fit` | Measurements | Try allowed alternate placement or orientation; otherwise reject candidate and request replacement search. |
| No Marketplace results | Item role -> `no-results` | Marketplace / Requests | Show the failure reason, ask whether to loosen flexible preferences, widen radius, adjust budget, or skip search. |
| Thin Marketplace results | Item role -> `thin-results` | Marketplace | Keep weak candidates visible with labels and ask whether to search again, wait, or proceed with warnings. |
| Listing is stale | Item role -> `seller-check-needed` or `replacement-needed` | Marketplace | Refresh listing health before purchase decisions; if still uncertain, ask user whether to contact seller or search replacements. |
| Listing removed or sold | Item role -> `replacement-needed` | Marketplace / Room Designs | Preserve the old design snapshot, search replacements for the same role, fit-check replacements, and refresh affected options. |
| Seller does not reply | Item role -> `awaiting-seller` then `replacement-needed` or `paused` | Marketplace / Workflow | Keep unanswered status visible; after the chosen timeout, offer follow-up, replacement search, or pause. |
| Price exceeds budget | Project or item role -> `awaiting-user-approval` or `replacement-needed` | Marketplace / Room Designs / Requests | Update totals, show budget impact, ask for approval to accept, negotiate, relax budget, or replace. |
| Seller confirms different dimensions | Item role -> `fit-checking` | Marketplace / Measurements | Update item record, create a new fit check, and refresh designs that used the old dimensions. |
| User changes request after designs exist | Project -> `updating-design` | Requests / Workflow / Room Designs | Create a new request version, invalidate affected briefs, pools, fit checks, and design options only where needed. |
| User changes room measurements | Project -> `needs-measurements` or `updating-design` | Measurements / Workflow | Create a new room version and recheck affected placements and design options. |
| User declines seller contact | Project -> `ready-for-review` or `paused` | UI / Workflow | Keep the selected design saved, mark contact declined, and allow manual follow-up or replacement later. |

## MVP Manual Fallback

Marketplace access and seller communication are not verified yet. Until they are:

- Marketplace search may be manual or user-assisted.
- Seller contact may be manual or user-assisted.
- Workflow still tracks the same states, approvals, timestamps, listing health, and replacement reasons.
- Manual evidence should be recorded with the same confidence labels as automated evidence.

## Refresh Rules

- Refresh only affected item roles and design options when possible.
- Do not erase the prior design snapshot when refreshing.
- Do not describe a stale, unavailable, unfit, or unanswered item as usable.
- Show whether each price is listed, confirmed, negotiated, estimated, or missing.
- Keep the reason for every replacement connected to the old listing.
