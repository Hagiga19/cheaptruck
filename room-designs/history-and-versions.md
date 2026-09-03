# Room and Design History

## Purpose

Preserve the user's rooms, requests, generated designs, selections, and later updates without erasing earlier states.

## Versioned Records

- Room model
- User request
- Design option
- Selected Marketplace items
- Candidate pool snapshot and listing health
- Price and availability snapshot
- User selection or approval
- Replacement reason and old-to-new item relationship
- Interactive room state used for the shown option

## Initial Rules

- A meaningful user change creates a new version.
- Each design records the exact request, room, and listing versions it used.
- Listing updates can refresh an option without deleting its previous snapshot.
- Replacements create a new option snapshot tied to the old item and replacement reason.
- Users can identify the current design and review earlier versions.
- History stores product state; the UI decides how that history is presented.

## V1 Snapshot Rules

Preserve a design snapshot when:

- The option is first generated.
- The user selects an option.
- A seller reply changes availability, dimensions, pickup details, or price.
- A selected item is replaced.
- A room measurement changes after designs exist.
- The user changes a hard request value, wanted item, budget, or location.

Each snapshot should make clear whether it is current, superseded, stale, or blocked.

## Replacement History

When an item is replaced, store:

- Original item record and listing health at the time of replacement.
- Replacement item record and candidate pool reference.
- Reason for replacement, such as sold, stale, price changed, does not fit, missing dimensions, seller declined, or user preference changed.
- Fit result and placement used by the replacement.
- Total price before and after replacement.
- Whether the design direction changed.

Do not overwrite the old option just because the refreshed option is better.
