# Infrastructure

## Status

Planning placeholder. No runtime, container, or deployment target has been selected.

## Local Development

| Need | Current answer | Notes |
| --- | --- | --- |
| App runtime | Unknown | Choose with the implementation stack. |
| Local database | Unknown | Could be local service, hosted development database, or file-backed prototype. |
| Object storage emulator | Unknown | Needed only if uploads and generated assets are implemented early. |
| Containers | Unknown | Decide whether Docker is useful for local database, workers, storage emulator, or full app parity. |
| Seed data | Unknown | Should include fake rooms, listings, measurements, and design options once implementation begins. |

## Environments

| Environment | Purpose | Status |
| --- | --- | --- |
| Local | Developer machine, fast iteration, fake or sandboxed integrations. | Needed. |
| Preview | Shareable builds for testing flows before production. | Unknown. |
| Production | Real users, real files, real Marketplace-adjacent behavior. | Future. |

## Background Work

Likely worker responsibilities:

- Refresh Marketplace listing health and prices.
- Re-run fit checks after dimensions or placements change.
- Generate room design options or preview assets.
- Update totals when listing availability or negotiated price changes.
- Trigger notifications for user review, missing information, stale listings, or seller replies.

## Secrets And Configuration

Track these only as names and purposes, never real secret values:

- Auth provider keys
- Database URL
- Object-storage credentials
- AI or rendering provider keys
- Marketplace-related tokens, if any approved integration exists later
- Email, SMS, or notification provider keys

## Operations Questions

- What should run in a container locally?
- Which jobs must be retryable?
- Which failures need visible user-facing recovery paths?
- Which logs contain private data and need redaction?
- What backup and restore process is required before real user data exists?
- What observability is needed for listing refreshes, rendering jobs, and seller-contact workflows?

## Guardrails

- Do not store secrets in this planning folder.
- Treat Marketplace automation as unverified until platform behavior is checked.
- Keep user photos, address data, and seller messages private by default.
- Make production deployment decisions only after the MVP implementation shape is chosen.
