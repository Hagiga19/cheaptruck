# Technical Research

## Status

Planning-stage research queue. No implementation architecture has been selected.

Use this file only for technical questions that affect multiple product areas. Domain-specific findings should stay with the domain that owns the behavior.

Once a technical direction becomes part of the implementation plan, move the active architecture notes into `tech/`.

## Broad Research Areas

| Area | Why it matters | Current status |
| --- | --- | --- |
| Room-photo understanding | Affects UI intake, Measurements, and Room Designs. | Unverified. Do not choose an approach yet. |
| Measurement capture | Affects fit checks, 3D room state, and user trust. | V1 assumes explicit or confirmed measurements with visible confidence. |
| Interactive room rendering | Affects Room Designs, UI, and Measurements handoffs. | Likely browser-based later; exact library not chosen. |
| Marketplace access | Affects Marketplace, Workflow, risk, and seller approval. | Unverified; manual fallback required. |
| Listing health refresh | Affects candidate pools, design versions, and user review. | Product rules exist; timing and automation are not defined. |
| Authentication and address handling | Affects onboarding, privacy, and Marketplace relevance. | Account and address gate is decided; technical owner not chosen. |
| Data storage and version history | Affects every project state and saved design snapshot. | Need schema only after MVP behavior is stable. |
| Notifications | Affects seller replies, stale listings, and paused projects. | Not defined. |

## Candidate Technical Directions

- Use simple user-confirmed room measurements before trying advanced photo-based measurement.
- Represent the MVP room as structured state first, then render static previews or 3D views from that state.
- Keep Marketplace listings as normalized records with source, timestamp, price type, availability, dimensions, and confidence.
- Preserve versions for request, room model, candidate pool, fit check, design option, and seller-contact status.
- Treat automated Marketplace access as optional until platform behavior is verified.

## Evidence Rules

- Add links and sources only after they are actually verified.
- Date any platform-policy or API finding because it can change.
- Separate product assumptions from confirmed technical constraints.
- Record broad technical decisions in `decisions/decision-log.md` once a direction is chosen.
