# Measurements Context

## Purpose

Use this folder for how users build and present a room at scale, how Marketplace item sizes are represented, where items are supposed to be placed in the measured room, and how physical fit is calculated.

## Owns

- Room geometry, scale, and units
- Walls, openings, fixed features, and obstacles
- Placement zones and access paths
- Item dimensions used for fit checks
- Exact intended item position and orientation in the measured room
- Measurement confidence and uncertainty
- Fit results and explanations

## Does Not Own

- The visual screen layout
- Marketplace listing availability, price, or seller communication
- Style and design quality

## Files

- `room-model.md` - the measurable representation of a room
- `item-placement.md` - Marketplace item dimensions and intended measured placement
- `fit-rules.md` - how room and item dimensions produce a fit result

## Status

V1 planning now covers rectangular room measurement, measured Marketplace item placement, and fit-result rules. Category-specific clearance defaults and non-rectangular room support still need definition.
