# Room Designs Context

## Purpose

Use this folder for the styling, layout, and room-visualization intelligence that turns a request, room model, and real Marketplace candidates into coherent design options.

It also owns saved rooms, design history, interactive room options, and product replacement behavior, while keeping history separate from the rules that generate designs.

## Owns

- Style interpretation and design direction
- Layout and item-combination logic
- Design options, explanations, and totals
- Interactive 3D room option behavior
- Replaceable product roles inside each option
- Saved room projects and design versions
- Recalculation when inputs or listings change

## Does Not Own

- The user's original request
- Measurement truth and fit calculations
- Marketplace listing facts or seller responses
- Interface presentation

## Files

- `design-engine.md` - styling, layout, and composition rules
- `design-options.md` - contents of a generated option
- `interactive-room-options.md` - 3D room views, furniture hotspots, and replacement behavior
- `history-and-versions.md` - saved rooms and change history
- `research-notes.md` - design references and research

## Status

First immersive MVP contract defined for rectangular living rooms. Next priority is to route any required clearance, candidate-ranking, and UI-review details back to Measurements, Marketplace, and UI.
