# Fit Rules

## Purpose

Determine whether a Marketplace item can physically work in a specific room location.

## Inputs

- Room geometry and placement zone
- Item width, depth, height, and orientation
- Exact intended item position in the measured room
- Required walking or functional clearance
- Doorway, hallway, stairway, or elevator access when relevant
- Measurement confidence and missing values

## Result States

- `fits` - dimensions and required clearance are confirmed
- `does-not-fit` - a known constraint is violated
- `needs-confirmation` - dimensions or access information are missing or uncertain

## V1 Fit Check

1. Confirm the room version and measurement unit.
2. Confirm the item's width, depth, height, and dimension source.
3. Confirm the item's intended placement and orientation.
4. Check that the item footprint stays inside the placement zone.
5. Check that required clearance is not blocked by walls, doors, windows, fixed objects, or existing furniture.
6. Check delivery/access path for large items when relevant.
7. Return a fit state with a short user-facing explanation.

## Clearance Rules

- Clearance must be tied to the item category and how the item is used.
- A clearance can be confirmed, estimated, or unknown.
- Unknown required clearance should return `needs-confirmation`.
- A known clearance violation should return `does-not-fit`.
- Category-specific clearance defaults still need definition.

## Placement Rules

- Fit is checked for a specific item in a specific room version at a specific position.
- Moving or rotating the item requires a new fit check.
- A candidate item can have multiple possible placements, each with its own result.
- The system may suggest alternate orientations, but it must keep the chosen placement visible.

## Rules To Define

- Clearance by item category
- Rotation and alternate orientation checks
- Placement against walls, windows, doors, and fixed objects
- Delivery-path checks for large items
- Safety margins for approximate measurements
- User-facing explanation of each result
