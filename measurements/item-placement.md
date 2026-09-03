# Item Placement

## Purpose

Store the measured Marketplace item dimensions and the exact intended location for that item inside a measured room.

Marketplace owns the listing facts. Measurements owns the dimensional copy, confidence, placement, orientation, and fit result needed to decide whether that listing physically works in the room.

## Marketplace Item Measurement Record

- Marketplace listing reference
- Candidate pool and item role reference
- Item category
- Width, depth, height, and unit
- Dimension source: listing, seller, user, system estimate, or unknown
- Dimension confidence: confirmed, estimated, or unknown
- Notes about odd shapes, legs, overhangs, cushions, doors, drawers, or required opening space
- Delivery/access constraints when relevant, such as stairs, elevator, hallway, or doorway limits

## Intended Placement Record

- Room version being used
- Placement status: candidate, proposed, approved, rejected, or replaced
- Placement zone or wall anchor
- Exact x/y position inside the room model
- Orientation or rotation
- Footprint in the room
- Required clearance area
- Nearby doors, windows, openings, fixed objects, and existing furniture
- Fit result and explanation

## Rules

- A Marketplace item is not treated as fitting just because it has dimensions.
- A fit result requires both item dimensions and a specific intended placement.
- Moving, rotating, resizing, replacing, or re-measuring an item creates a new placement version or invalidates the previous fit result.
- Estimated item dimensions stay visible and normally produce `needs-confirmation`, not `fits`.
- If Marketplace listing facts change, Measurements keeps the old fit result for history and creates a refreshed check for the updated item data.
- A replacement candidate needs its own placement and fit result even when it is meant to serve the same design role.
