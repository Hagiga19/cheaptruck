# CheapTruck Codex Guide

## Purpose

CheapTruck is an AI-assisted home-design website that helps people design rooms affordably with items found on Facebook Marketplace.

The product collects what the user wants, understands the room and its measurements, builds living Marketplace candidate pools, checks whether candidates fit in exact measured placements, creates design options, and refreshes those options as availability and prices change.

## Current Stage

The project is in product-structure and UI-flow planning.

- Work on one product area at a time.
- Do not begin implementation until the relevant behavior and flow are clear.
- Keep planning files short, focused, and easy for future Codex sessions to load.
- Do not plan revenue yet.
- Current UI direction comes from `ui/app UI design.excalidraw` and the written companion notes in `ui/room-creation-flow-notes.md`.

## Read Order

1. Read this file.
2. Read the `CONTEXT.md` inside the folder that owns the current task.
3. Read only the additional files directly relevant to that task.

Do not load the entire project unless the task crosses multiple product areas.

For room-creation UI work, read `ui/CONTEXT.md`, then `ui/room-creation-flow-notes.md`, then `ui/interface-map.md` and `ui/feature-inventory.md` as needed.

For workflow work, read `workflow/CONTEXT.md`, then `workflow/main-flow.md`, `workflow/state-model.md`, `workflow/handoffs.md`, and `workflow/recovery-paths.md` as needed.

For technical architecture work, read `tech/CONTEXT.md`, then `tech/architecture-map.md`, `tech/data-and-storage.md`, `tech/infrastructure.md`, and `tech/build-notes.md` as needed.

For decisions work, read `decisions/CONTEXT.md`, then `decisions/decision-log.md`.

For project-wide docs work, read `docs/CONTEXT.md`, then only the supporting file that matches the task.

## Core Product Areas

| Folder | Owns |
| --- | --- |
| `ui/` | Every user-facing screen, interface object, interaction, and the reason it is presented to the user. Current room-creation direction is based on `ui/app UI design.excalidraw`. |
| `requests/` | The user's complete request, including raw submissions, resolved constraints, missing information, per-item Marketplace search briefs, and later changes. |
| `measurements/` | How the user builds and presents the room, its scale and fixed features, Marketplace item dimensions, exact intended item placement, measurement uncertainty, and all space and fit calculations. |
| `marketplace/` | Listing search, candidate pools, filtering, comparison, item data, listing health, availability, pricing, seller communication, negotiation, replacement items, and listing updates. |
| `room-designs/` | The room-design and styling intelligence, layouts, item combinations, immersive 3D room options, replaceable product roles, cost totals, saved rooms, and design history. Keep design logic and history separate inside this folder. |
| `workflow/` | The end-to-end process, task states, handoffs between product areas, retries, and what happens when information, listings, availability, or prices change. |

## Supporting Areas

| Folder | Owns |
| --- | --- |
| `tech/` | Implementation architecture, database and object-storage planning, containers, environments, deployment, jobs, secrets, backups, observability, and build notes. |
| `decisions/` | Important product and technical decisions, including why they were made. Start with `decisions/CONTEXT.md`. |
| `docs/` | Session notes, next steps, and project-wide supporting documentation. Start with `docs/CONTEXT.md`. |

## Ownership Rules

- `ui/` presents and collects information but does not own the underlying product rules.
- `requests/` is the source of truth for the user's goal and constraints.
- `measurements/` is the source of truth for room dimensions, Marketplace item dimensions, exact intended item placement, and whether an item physically fits.
- `marketplace/` is the source of truth for listing details, candidate pools, listing health, seller responses, availability, and negotiated prices.
- `room-designs/` decides how the room should look, how suitable items work together, how interactive room options behave, and how products can be replaced without losing the design direction.
- `workflow/` coordinates the other areas but does not replace their rules.
- `tech/` decides how product-domain data is stored, processed, deployed, and operated, but it does not own what that data means.
- Marketplace may provide listing dimensions, but Measurements owns the dimensional copy used for fit checks and the item's measured position in the room.
- AI behavior belongs to the product area it serves; do not create a general `ai/` folder unless a truly shared need appears.

## Main Workflow

```text
Account created or signed in
-> address captured or confirmed
-> room project started or resumed
-> room creation wizard collects room shape, style, wanted items, item details, web-fetch choice, budget, and project address confirmation
-> request created
-> missing information collected
-> room represented and measured
-> item requirements and search briefs resolved
-> Marketplace candidate pools created or refreshed
-> candidate item dimensions and intended placements recorded
-> candidate items checked for fit in those placements
-> immersive room design options produced with priced, replaceable products
-> selected sellers contacted
-> availability, prices, and listing health updated
-> affected designs and totals refreshed
```

## File Rules

- Use lowercase kebab-case for folders and files, except `CODEX.md` and each area's `CONTEXT.md`.
- Give every core product folder one short `CONTEXT.md` that explains its boundaries and routes to its detailed files.
- Put information in the folder that owns it instead of duplicating it.
- Record cross-area decisions in `decisions/decision-log.md`.
- Mark unknown assumptions clearly, especially Marketplace access and communication capabilities.
- When the structure changes, update this file first.

## Working Rules

- Ask focused questions when required information is missing.
- Do not silently invent room dimensions, item dimensions, item positions, prices, availability, or seller responses.
- Keep measurement confidence, placement confidence, and unknown values visible.
- Treat listings and prices as changeable information.
- Keep Marketplace candidate pools and listing health visible when designs depend on them.
- Preserve previous room and design versions when a user makes changes.
- For UI work, preserve the Excalidraw sketch as the visual source and update the written UI notes when the flow changes.
- Keep explanations concise unless the user asks for detail.
