# Risk and Compliance

## Status

Planning-stage risk register. No live Marketplace access, seller messaging, user-photo handling, or implementation architecture has been approved yet.

## Confirmed Product Rules

- The user must create an account or sign in before continuing into room work.
- Address must be captured or confirmed before Marketplace-dependent search decisions.
- Facebook sign-in is optional at this stage.
- Seller contact, negotiation, and Facebook-connected actions require explicit user approval.
- Marketplace automation boundaries are unknown until verified.
- Manual or user-assisted Marketplace collection must remain possible if automation is unavailable or not allowed.
- Stale listings, missing dimensions, estimated prices, and unconfirmed seller replies must be visible.
- Unverified candidates must not be counted as usable in recommended designs.

## Risk Areas

| Area | Risk | Current handling |
| --- | --- | --- |
| User photos | Room photos may expose private spaces or personal information. | Do not implement storage or AI processing until privacy rules are defined. |
| Address data | Address is needed for Marketplace relevance but is sensitive location data. | Capture or confirm only what the workflow needs; define storage and deletion later. |
| Marketplace access | Search, scraping, automation, or messaging may be limited by platform rules. | Treat as unverified; support manual fallback. |
| Seller messaging | Contact can disclose user interest, location constraints, budget, and negotiation terms. | Require explicit approval for listing and message purpose. |
| Measurement accuracy | Wrong dimensions can produce unsafe or impossible recommendations. | Keep confidence, missing values, and fit uncertainty visible. |
| Listing volatility | Prices, availability, dimensions, and seller replies can change quickly. | Use living candidate pools, listing health, refresh loops, and saved design versions. |
| AI output | Generated room designs may overstate fit, availability, or realism. | Show sources, confidence, stale data, fit state, and replacement sensitivity. |

## Before Implementation

- Verify whether Marketplace search can be automated, browser-assisted, manually entered, or only user-provided.
- Verify whether seller messaging can be assisted and what approvals are required.
- Define data stored for account, address, photos, room measurements, listings, and messages.
- Define retention, deletion, and export behavior for user projects.
- Define how stale listing checks are timestamped and shown.
- Define the user-facing disclaimer for fit estimates, unconfirmed listings, and purchase responsibility.
- Decide which events need audit history: address confirmation, seller approval, sent messages, seller replies, price changes, item replacements, and final selections.

## Open Questions

- What is the minimum location precision needed for useful Marketplace search?
- Can the MVP operate with user-pasted listings only?
- Should CheapTruck store full room photos, extracted measurements, or both?
- What must happen when a seller reply changes dimensions after a design is generated?
- What level of measurement confidence is acceptable before a design can be recommended?
