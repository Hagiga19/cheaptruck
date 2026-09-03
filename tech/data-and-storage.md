# Data And Storage

## Status

Planning placeholder. No database or object-storage provider has been chosen.

## Database Needs

CheapTruck likely needs structured records for:

- Users, accounts, addresses, consent, and profile state
- Room projects and current workflow state
- Requests, item roles, constraints, missing information, and resolved briefs
- Room measurements, fixed features, item dimensions, placements, clearances, and fit results
- Marketplace listings, candidate pools, listing health, price history, seller-contact status, and backup items
- Design options, selected products, render state, replacement choices, totals, and design history
- Audit history for user approvals, seller-contact actions, photo handling, and important state changes

## Object Storage Needs

CheapTruck likely needs object storage for:

- User-uploaded room photos
- Marketplace listing images captured or referenced for comparison
- Generated room renders or 3D preview assets
- Exports, snapshots, and support attachments

## Ownership Map

| Data kind | Technical home | Meaning owned by |
| --- | --- | --- |
| Account, address, and consent | Database | `ui/`, `workflow/`, `decisions/` |
| Request and item-role state | Database | `requests/` |
| Room dimensions and fit results | Database | `measurements/` |
| Listing facts and candidate pools | Database plus optional stored media | `marketplace/` |
| Design snapshots and render references | Database plus object storage | `room-designs/` |
| Project and item-role transitions | Database audit tables or event log | `workflow/` |
| User photos and generated assets | Object storage with database references | Owning domain depends on the asset purpose |

## Open Questions

- Which database should V1 use?
- Does V1 need relational migrations from day one?
- Which files must be private, signed-url only, or removable on request?
- Which records need immutable audit history before seller messaging or user-photo handling?
- How long should stale listing records, generated assets, and old design snapshots be retained?
- What data should be exportable by the user?

## Guardrails

- Do not duplicate product rules in schema notes.
- Do not store uncertain listing, price, dimension, or availability facts as confirmed values.
- Keep raw source values, normalized values, confidence, and timestamps distinguishable.
- Do not choose a provider until the implementation path is selected.
