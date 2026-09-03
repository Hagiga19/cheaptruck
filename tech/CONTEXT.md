# Tech Context

## Purpose

Use this folder for CheapTruck technical architecture planning before and during implementation.

This area answers where the app runs, where data is stored, where user files and generated assets live, how services connect, and what infrastructure decisions must stay visible.

## Owns

- Application architecture and service boundaries
- Database choice, schema planning, migrations, and data ownership mapping
- Object storage for user photos, generated room renders, listing images, exports, and attachments
- Containers, local development setup, deployment targets, and environments
- Background jobs, queues, scheduled refreshes, and worker responsibilities
- Secrets, environment variables, observability, backups, and operational notes

## Does Not Own

- Product rules owned by `ui/`, `requests/`, `measurements/`, `marketplace/`, `room-designs/`, or `workflow/`
- Durable project decisions, which belong in `decisions/decision-log.md`
- Broad research notes that are not tied to an implementation direction, which belong in `docs/technical-research.md`
- Revenue planning

## Files

- `architecture-map.md` - living map of the app surfaces, services, data flow, and selected stack
- `data-and-storage.md` - database, object storage, media, version history, and retention planning
- `infrastructure.md` - containers, environments, deployment, jobs, secrets, backups, and monitoring
- `build-notes.md` - running implementation notes and updates as the app is built

## Rules

- Keep this folder technical, not product-spec heavy.
- Link data back to the folder that owns its meaning.
- Mark unchosen stack decisions as `Unknown` until selected.
- Record durable cross-project decisions in `decisions/decision-log.md` after they are chosen.
- Keep local setup and deployment notes practical enough for a future build session to follow.

## Status

Active support area. Initial technical architecture is not selected yet.
