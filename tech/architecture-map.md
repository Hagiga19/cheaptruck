# Architecture Map

## Status

Planning placeholder. No implementation stack has been selected yet.

## Current Architecture Shape

```text
User
-> Web app
-> CheapTruck application backend
-> Product-domain data stores
-> Marketplace collection or import path
-> Room design and rendering workers
-> Object storage for photos, listing media, and generated room assets
```

## App Surfaces

| Surface | Purpose | Status |
| --- | --- | --- |
| Web app | Account, address confirmation, room project creation, review, and design selection. | Needed for V1. |
| Admin or operator tools | Manual Marketplace entry, debugging project state, and support review if needed. | Unknown. |
| Worker process | Refresh listings, run design generation, render assets, and maintain derived snapshots. | Likely needed. |

## Service Boundaries

| Area | Technical boundary | Product owner |
| --- | --- | --- |
| Account and address | Auth profile, address record, consent state, and search-region derivation. | `ui/`, `workflow/`, `decisions/` |
| Request intake | Raw request, resolved constraints, missing-info prompts, and item-role briefs. | `requests/` |
| Room model and fit | Room dimensions, fixed features, item dimensions, placement, clearances, and fit results. | `measurements/` |
| Marketplace records | Listing facts, candidate pools, health, seller-contact records, and price updates. | `marketplace/` |
| Design options | Design snapshots, selected layouts, product roles, replacement options, and render state. | `room-designs/` |
| Workflow state | Project state, item-role state, approval gates, retries, and refresh loops. | `workflow/` |

## Stack Decisions

| Decision | Current answer | Notes |
| --- | --- | --- |
| Frontend framework | Unknown | Choose when app building begins. |
| Backend framework | Unknown | Should support auth, jobs, file uploads, and structured project state. |
| Database | Unknown | Needs versioned project state and relational links between users, rooms, listings, fit checks, and designs. |
| Object storage | Unknown | Must handle user photos, listing images, generated previews, and exports. |
| Queue or jobs | Unknown | Needed if listing refresh, design rendering, or seller-response checks are asynchronous. |
| Container runtime | Unknown | Decide whether local dev and deployment need Docker or another container path. |
| Deployment target | Unknown | Pick only after the first implementation stack is chosen. |

## Update Rule

Update this file whenever a technical choice changes the shape of the app, the services, or the ownership map.
