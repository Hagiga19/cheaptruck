# Room Model

## Status

V1 supports a simple measured room model. Rectangular rooms come first; L-shaped, curved, or irregular rooms come later after the basic flow is proven.

## V1 Room Shape

- One rectangular room outline
- Measurement unit selected once for the room
- Wall lengths stored as confirmed or estimated values
- Door, window, opening, fixed object, and existing-furniture positions measured relative to the room
- Candidate placement zones that can later receive Marketplace items

## Coordinate Rules

- The room has one consistent origin point and orientation.
- Every wall, opening, fixed object, placement zone, and placed item uses the same coordinate system.
- UI may draw the room, but Measurements owns the measured room data behind that drawing.
- Room versions are preserved when measurements change, because existing item fit results may no longer be valid.

## Room Information

- Measurement unit
- Floor outline and wall lengths
- Ceiling height when relevant
- Doors, windows, and openings
- Built-in or fixed objects
- Existing furniture that must remain
- Clear walking and functional areas
- Candidate placement zones
- Photos and their reference points
- Source and confidence for every measurement

## Minimum Required Before Search

- Room unit
- Room width and length, or enough confirmed wall lengths to derive them
- Door/opening locations that affect placement or delivery
- Fixed objects that cannot be moved
- At least one valid placement zone for each requested item category

If the minimum set is missing, Requests can still preserve the user's goal, but Marketplace search should not treat item sizes as safe.

## Measurement Confidence

- `confirmed` - directly provided or verified by the user
- `estimated` - inferred from a photo, sketch, listing, or rough user input
- `unknown` - not available yet

## Rules

- Store exact values separately from estimates.
- Do not treat a photo-derived estimate as a confirmed measurement.
- Keep enough information to explain a fit result to the user.
- Preserve earlier room versions when measurements change.
- Do not mark a room ready for fit checks when a required measurement is unknown.
