# Room Creation Flow Notes

## Source

These notes are extracted from `app UI design.excalidraw`, the visual sketch for the room creation process.

Treat the Excalidraw file as the visual source and this file as the written planning version.

## Important Alignment

- The sketch shows an address page near the end of the wizard.
- The accepted UI rule is that the login/account page must collect or confirm the user's address before the user continues.
- In the room creation wizard, address should therefore be a confirm/edit step, not the first time the address is requested.

## Overall UI Direction

- Room creation is a guided wizard after account creation or sign-in.
- The interface should keep a persistent menu and user profile area visible during the process.
- The core work area is a custom room editor rather than a plain form.
- The menu includes: view your rooms, get inspired, find items, find a carrier, upload items, compare prices, and connect a Facebook account.
- The room editor supports a 2D/3D view toggle.
- Suggestions appear beside open questions so the user can answer faster.
- The system can either accept user-entered details or let the system choose where the user is unsure.

## Room Creation Wizard From Sketch

### Page 1 - Room Size And Shape

- Purpose: Let the user create the physical room outline.
- Main prompt: edit the size and shape of the home.
- Controls: add wall, add door, add window, add hanging object, adjust height and sizes.
- Room canvas: shows example walls and a changing design/background preview.
- Interaction note: tapping a wall or object opens a side tab with the added walls/items, size controls, and an optional picture for that object.

### Page 2 - Room Style

- Purpose: Ask what style the user wants for the room.
- Main prompt: what style should your room have?
- Inputs: answer box plus suggestion choices.
- Supporting UI: same room editor and navigation remain visible.

### Page 3 - Desired Items

- Purpose: Ask which item categories the user wants.
- Main prompt: what items do you want?
- Inputs: multiple-answer box plus suggestions.

### Page 4 - Needed Item Details

- Purpose: Size and describe the needed items before Marketplace search.
- Main prompt: what items do you need?
- Item rows: item A, item B, item C.
- Per-item inputs: length, height, width, scale bars, color chooser.
- Automation option: let the system choose values where the user does not know or does not care.
- Resolution note: these are submitted targets or preferences. Requests combines them with Measurement-supplied limits to create the final per-item search brief; entering a size here does not by itself confirm fit.

### Page 5 - Web Fetching Choice

- Purpose: Ask whether CheapTruck should fetch item options from the web.
- Main prompt: fetch everything from the web?
- Inputs: yes/no choice.
- If yes: show toggles for which items to fetch.
- If no: move to the next page without web fetching.

### Page 6 - Price Range

- Purpose: Capture the user's budget or price range.
- Main prompt: what is your price range?
- Input: price toggle or range bar.
- Related choice: toggle which items to fetch when Marketplace search is enabled.

### Page 7 - Address Confirmation

- Purpose: Confirm or edit the address used for location-based Marketplace search and pickup practicality.
- Main prompt in sketch: what is your address?
- Fields: state, city, address, apartment number, floor.
- Planning adjustment: because address is required at login, this step should show the saved address and allow editing.

### Design Options

- Purpose: Show generated room design choices after the wizard.
- Layout: option 1, option 2, option 3, option 4.
- Action: select the option.

## After Room Creation

- Destination: a user rooms dashboard.
- Content shown: your rooms, living room picture, kitchen picture, bedroom picture.
- Action: add another room.
- Persistent menu remains available.

## Open UI Questions

- Should Facebook connection be only a login option, only a Marketplace communication connection, or both?
- Should the wizard ask for exact full address or allow approximate location until seller contact is approved?
- Is the price range global for the whole room, per item, or both?
- Should "upload items" mean uploading existing owned furniture, Marketplace listings, or both?
- Should the room editor start from user measurements, uploaded photos, a drawn floor plan, or any of those?
