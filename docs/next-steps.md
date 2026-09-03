# Next Steps

## Current Focus

Route the Room Designs MVP dependencies back into Measurements, Marketplace, and UI.

The first Room Designs MVP contract is now defined for rectangular living rooms with multiple options, interactive 3D room views, visible furniture prices, listing health, and replaceable product roles.

## Immediate Sequence

1. Define living-room placement limits and clearance defaults in `measurements/room-model.md`, `measurements/item-placement.md`, and `measurements/fit-rules.md`.
2. Define living-room candidate ranking and backup expectations in `marketplace/candidate-pools.md` and `marketplace/search-rules.md`.
3. Update UI notes for design comparison, product hotspots, replacement choices, and option readiness.
4. Decide the account/profile owner before implementation.
5. Decide address precision for search versus seller contact.
6. Decide which events need audit history before seller messaging or user-photo handling is built.
7. Draft the first-pass technical architecture in `tech/`: database, object storage, containers, environments, jobs, and deployment direction.

## Later Queue

1. Decide what can be manual before Marketplace automation.
2. Verify live Marketplace access, account, and seller communication constraints before implementation.
3. Define exact workflow timeouts and stale-listing thresholds.
4. Define privacy and consent requirements before user photos, address data, or seller messaging are implemented.
5. Keep `tech/build-notes.md` updated once implementation starts.
6. Decide the first implementation architecture only after the MVP behavior is stable.

Do not begin implementation or revenue planning yet.
