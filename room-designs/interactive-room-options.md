# Interactive Room Options

## Purpose

Define how room design options become explorable, priced, and replaceable room experiences instead of static pictures.

## User Promise

The user should feel that each option is a real room they can inspect and change.

Every visible product should feel replaceable without breaking the whole design.

## Option Views

Each design option should support:

- Static preview images for quick comparison
- An interactive 3D room view for inspection
- Clickable or tappable furniture hotspots
- Visible item prices inside the option
- Replacement choices for important item roles
- Updated totals when products are replaced

## Furniture Hotspots

Each placed item should expose:

- Product role, such as sofa, chair, rug, coffee table, TV stand, side table, lamp, shelf, storage, or decor
- Selected Marketplace listing
- Listed, confirmed, negotiated, estimated, or missing price
- Fit status for the intended placement
- Listing health and freshness
- Why the item belongs in the design
- Replacement action

## Replaceable Product Roles

A design should not depend on one fragile listing when alternatives exist.

For each important role, the option should keep:

- The selected item
- Backup items from the same candidate pool
- The constraints that replacements must satisfy
- The style reason the item fills that role
- The budget effect of replacing it
- The fit effect of replacing it

When the user replaces an item, Room Designs should recalculate only the affected role, option total, confidence notes, and visual state.

## 3D Room State

The 3D view should be generated from product state, not treated as a separate drawing.

It needs:

- Room dimensions and fixed features from Measurements
- Intended furniture placements and clearances
- Approximate product shape and scale
- Product image or material hint when available
- Item hotspot positions
- Camera views for quick room understanding

If exact 3D models are unavailable, the MVP can use simple scaled shapes with product images, colors, labels, and price hotspots.

## V1 Minimum 3D State

The first interactive MVP does not need photorealistic models. It needs a trustworthy spatial room view generated from the same product state used by the design option.

Minimum state:

- Room outline, wall height, doors, windows, openings, and fixed objects from Measurements.
- One placed object for each selected item role.
- Position, rotation, footprint, and approximate height for each placed object.
- Selected listing image, dominant color, or material hint when available.
- Hotspot anchor for each important product.
- Price label and listing-health label for each selected product.
- Camera presets for overview, seating view, and item-inspection view.
- Current option total and warning count.

Do not create a separate visual-only room that can drift away from the measured placements and fit results.

## Quality Bar

An interactive option is ready when:

- The room scale looks believable
- Furniture does not visually overlap in impossible ways
- Important products are clickable
- Prices and listing health are visible
- Replacements preserve the design direction or clearly explain the tradeoff
- Uncertain dimensions, stale listings, or missing prices are visible

## Replacement Interaction

When the user opens a product hotspot, the interface should be able to show:

- The selected item.
- Backup candidates for the same role.
- Why each backup is a reasonable substitute.
- Price difference from the current item.
- Fit status for the same placement or the alternate placement required.
- Listing health and missing information.

When the user chooses a replacement:

- Keep the old item in history.
- Recalculate the affected role, option total, confidence notes, and visual state.
- Keep the design direction unless the replacement changes a hard style or function constraint.
- Mark the option for user review when the replacement changes budget, fit confidence, or a hard preference.

## Warning Behavior

The 3D view should make uncertainty visible without blocking inspection.

Show warnings for:

- Missing or estimated dimensions.
- Stale listing health.
- Missing, estimated, changed, or unconfirmed prices.
- Selected items with no backup candidates.
- Items that fit only with a narrow clearance or low-confidence measurement.

Warnings belong to the affected product hotspot and option summary, not only to a separate report.

## Later Tool Notes

Planning does not require extra connected tools.

Implementation will likely need a browser-based 3D layer, such as Three.js or React Three Fiber, plus reliable listing images, dimensions, prices, and availability from Marketplace.
