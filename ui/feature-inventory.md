# UI Feature Inventory

## Status

First accepted features added: account creation or sign-in before the room-design workflow, plus required address capture or confirmation on the login/account page.

## Required Fields

For every visible feature record:

| Field | Meaning |
| --- | --- |
| Screen | Where the feature appears |
| Feature | The control, object, or information shown |
| User need | Why the feature is necessary |
| Owner | Which product area owns its rules or data |
| Inputs | What the user can provide |
| Outputs | What the interface shows in response |
| States | Default, loading, incomplete, error, and complete states |
| Status | Proposed, accepted, changed, or removed |

Do not add a feature without a clear user need and owner.

## Accepted Features

| Screen | Feature | User need | Owner | Inputs | Outputs | States | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Create account or sign in | Account creation entry | Save projects, designs, Marketplace items, and updates under one user identity | UI presentation; account/auth owner to define | Name, email, password or other account details to define | New account session and access to project start | Default, loading, validation error, account created | Accepted |
| Create account or sign in | Sign-in entry | Let returning users reopen saved rooms and previous design versions | UI presentation; account/auth owner to define | Existing login credentials to define | Signed-in account session and access to saved projects | Default, loading, invalid details, signed in, recovery needed | Accepted |
| Create account or sign in | Optional Facebook sign-in | Make entry faster for users who prefer Facebook-connected identity | UI presentation; account/auth owner to define; Marketplace implications to research | Facebook authorization approval | Signed-in account session or clear fallback to standard account creation | Default, loading, Facebook unavailable, authorization declined, signed in | Accepted |
| Create account or sign in | Address entry and confirmation | Give CheapTruck a location base for Marketplace distance, search radius, pickup practicality, and local room-project context | UI presentation; account/profile owner to define; Requests and Marketplace consume location later | User address, saved address confirmation, edited address | Captured or confirmed address available before project start | Default, loading, address missing, address invalid, address confirmed | Accepted |

## Sketch-Derived Features

| Screen | Feature | User need | Owner | Inputs | Outputs | States | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Start or resume room project | Persistent menu | Give users quick access to major tasks during and after room creation | UI | Menu selection | Opens selected area or shortcut | Default, active section, unavailable | Proposed |
| Start or resume room project | User profile access | Let users manage account identity and saved context | UI presentation; account/profile owner to define | Profile click | Profile view or account menu | Default, loading, signed out | Proposed |
| Room creation wizard | Custom room editor canvas | Let users shape the room visually instead of filling only a form | UI presentation; Measurements owns room geometry | Drag, draw, resize, select object | Visible room outline and selected object state | Empty, editing, incomplete, valid | Proposed |
| Room creation wizard | 2D/3D view toggle | Let users switch between precise layout editing and spatial preview | UI presentation; Measurements and Room Designs consume view state | Toggle choice | 2D or 3D room view | 2D, 3D, loading preview | Proposed |
| Room creation wizard | Add wall, door, window, and hanging object controls | Capture fixed room structure that affects fit and design | UI presentation; Measurements owns geometry rules | Add object command, position, size | Room object added to canvas and side tab | Default, selected, invalid placement, added | Proposed |
| Room creation wizard | Object side tab | Let users review and adjust walls/items without losing the room canvas | UI presentation; Measurements owns dimensions | Object selection, size edits, optional picture | Object details, size controls, image preview | Closed, open, editing, saved | Proposed |
| Room creation wizard | Style answer box and suggestions | Help users describe the desired room style quickly | UI presentation; Requests owns captured preference | Free text, suggestion selection | Saved style preference | Empty, suggested, answered | Proposed |
| Room creation wizard | Desired-items multiple-answer box | Capture which items the user wants CheapTruck to include | UI presentation; Requests owns wanted item categories | Multiple text answers, suggestion selections | Wanted item list | Empty, partial, answered | Proposed |
| Room creation wizard | Needed-item sizing rows | Capture preferred item dimensions or permission to calculate them before search | UI presentation; Requests owns the submitted preference; Measurements owns safe dimension limits and fit rules | Length, height, width, scale bars, or system-choice permission | Submitted target dimensions or system-choice permission | Missing, estimated, confirmed, system-chosen | Proposed |
| Room creation wizard | Color chooser per needed item | Capture visual constraints for Marketplace search and design matching | UI presentation; Requests and Room Designs consume color preference | Color selection or text color | Item color preference | Default, selected, system-chosen | Proposed |
| Room creation wizard | Let the system choose control | Let uncertain users continue without inventing exact values | UI presentation; owning product area records system-chosen value and confidence | System-choice toggle | Marked field for AI/system selection | Off, on, needs review | Proposed |
| Room creation wizard | Fetch from web choice | Ask whether CheapTruck should search Marketplace for item options | UI presentation; Marketplace owns search behavior | Yes/no choice | Web fetching enabled or skipped | Unanswered, yes, no | Proposed |
| Room creation wizard | Item fetch toggles | Let users decide which needed items should be searched online | UI presentation; Marketplace owns search behavior | Per-item toggle | Selected fetch list | None selected, partial, all selected | Proposed |
| Room creation wizard | Price range control | Capture budget constraints before design generation | UI presentation; Requests owns budget preference | Range slider or toggle bar | Saved price range | Empty, partial, set | Proposed |
| Room creation wizard | Project address confirmation | Confirm the location used for Marketplace search and pickup planning | UI presentation; account/profile owner to define; Requests stores the confirmed project location; Marketplace consumes it | Saved address confirmation or edited address | Confirmed project location | Saved, editing, invalid, confirmed | Proposed |
| Compare design options | Option selection grid | Let users compare generated room directions and choose one | UI presentation; Room Designs owns option content | Option click | Selected design option | Loading, options ready, selected | Proposed |
| Compare design options | Candidate-pool summary | Help users understand whether a design is easy to buy or depends on weak/stale listings | UI presentation; Marketplace owns candidate pools and listing health; Measurements owns fit results | Option inspection | Pool strength, listing health, backup count, and missing info shown per item role | Loading, strong, thin, stale, missing info | Proposed |
| Item and seller review | Seller-contact approval panel | Let users approve exactly which sellers are contacted and why | UI presentation; Marketplace owns message records and approval requirements | Approve message purpose, negotiation limit, skip item, request replacement | Approved seller action or replacement request | Needs decision, approved, awaiting reply, declined, replacement needed | Proposed |
| Browse saved rooms | Rooms dashboard | Let users return to created rooms and add another room | UI presentation; Room Designs owns saved room records | Open room, add another room | Saved room opened or new wizard started | Empty, rooms available, loading | Proposed |
