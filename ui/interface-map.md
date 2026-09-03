# Interface Map

## Status

Initial outline. Screen order and contents are not final.

Accepted direction: users must create an account or sign in before starting the room-design workflow. Facebook sign-in should be offered as an optional path, not the only path. The login/account page must collect or confirm the user's address before the user continues.

## Candidate Views

1. Create an account or sign in, with optional Facebook sign-in.
2. Start or resume a room project.
3. Create a new room with a guided room creation wizard.
4. Edit room size, shape, walls, doors, windows, hanging objects, height, and sizes.
5. Describe the room style with an answer box and suggestions.
6. Choose wanted item categories with multiple answers and suggestions.
7. Size needed items, choose colors, or let the system choose.
8. Choose whether to fetch Marketplace item options from the web and which items to fetch.
9. Set price range or budget.
10. Confirm or edit the saved address for this room project.
11. Compare generated room-design options.
12. Inspect Marketplace candidate pools, fit notes, listing health, and price details.
13. Select a design and approve seller contact.
14. Review availability, negotiation, and replacement updates.
15. Browse saved rooms and previous design versions.

## View Details

### 1. Create Account or Sign In

- User goal: Enter CheapTruck with an account and address so room projects, saved designs, Marketplace items, and location-based updates can be preserved.
- Information shown: Brand entry point, account creation option, sign-in option, optional Facebook sign-in, address entry or saved-address confirmation, and basic privacy reassurance.
- Actions available: Create account, sign in, continue with Facebook, enter address, confirm saved address, edit address, recover access if already registered.
- Source product area: UI owns presentation; account/auth ownership still needs definition before implementation.
- States: Default, loading, account-created, signed-in, address-missing, address-invalid, address-confirmed, Facebook sign-in unavailable, already-registered, and recovery-needed.
- What moves the user forward: Successful account creation or sign-in plus captured or confirmed address opens the start/resume project view.

### 2. Start Or Resume Room Project

- User goal: Start a new room or return to an existing saved room.
- Information shown: Primary create-new-room action, saved room entry points, persistent menu, user profile, and shortcuts for view your rooms, get inspired, find items, find a carrier, upload items, compare prices, and connect Facebook account.
- Actions available: Create new room, open saved room, add another room, use menu shortcuts, open profile.
- Source product area: UI owns presentation; Room Designs owns saved room records; Workflow owns project state.
- States: No rooms yet, saved rooms available, loading saved rooms, room unavailable, and ready to continue.
- What moves the user forward: Choosing create new room opens the room creation wizard; choosing a saved room opens its latest project state.

### 3. Room Creation Wizard

- User goal: Provide enough room, style, item, budget, and location information for CheapTruck to generate useful room design options.
- Information shown: A custom room editor, 2D/3D toggle, step-specific prompt, answer controls, suggestions, persistent menu, and user profile.
- Actions available: Add room structure, answer prompts, accept suggestions, enter item dimensions, choose colors, let the system choose unknown values, choose web fetching, set price range, confirm or edit address, and continue between pages.
- Source product area: UI owns presentation; Requests owns user intent, submitted item preferences, and resolved search briefs; Measurements owns room geometry, safe dimension limits, listing dimensions, and fit results; Marketplace owns web fetching; Room Designs owns generated options; Workflow owns step order.
- States: Editing, incomplete, loading suggestions, validation needed, ready for next page, and wizard complete.
- What moves the user forward: Each page collects or confirms the information needed by the next product area, ending in generated design options.

### 4. Compare Design Options

- User goal: Review the generated room directions and select the best option.
- Information shown: Design option cards or panels, option name or number, room preview, selected items, candidate-pool strength, listing health, price summary, fit confidence, and missing information notes.
- Actions available: Inspect option, compare options, inspect item pool, select option, go back to adjust room inputs.
- Source product area: UI owns presentation; Room Designs owns option content; Measurements owns fit results; Marketplace owns listing facts.
- States: Generating, options ready, partial options, no suitable options, stale listing warning, and option selected.
- What moves the user forward: Selecting an option opens item and seller-contact review.

### 5. Item And Seller Review

- User goal: Understand the actual Marketplace items behind a selected design before contacting sellers.
- Information shown: Selected listings, backup candidates, listing health, price type, distance, fit result, missing dimensions, seller questions, and message purpose.
- Actions available: Approve availability check, approve dimension question, set negotiation limit, skip an item, request replacements, or return to design comparison.
- Source product area: UI owns presentation; Marketplace owns listing facts, candidate pools, health, and seller messages; Measurements owns fit results; Room Designs owns the selected option.
- States: Ready to approve, needs user decision, awaiting seller reply, seller confirmed, seller declined, replacement search needed, and updated design ready.
- What moves the user forward: User approval lets Marketplace contact sellers or start replacement search for specific items.

## For Each View Define

- User goal
- Information shown
- Actions available
- Source product area
- Loading, empty, error, and confirmation states
- What moves the user forward
