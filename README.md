# CheapTruck

AI-assisted affordable home-design planning workspace using real items from Facebook Marketplace.

Start with `CODEX.md`, then read the `CONTEXT.md` inside the product area that owns the task.

## Structure

```text
cheaptruck/
|-- CODEX.md
|-- CONTEXT.md
|-- REFERENCES.md
|-- ui/
|-- requests/
|-- measurements/
|-- marketplace/
|-- room-designs/
|-- workflow/
|-- tech/
|-- decisions/
`-- docs/
```

Each active folder contains a short context router or focused support files. Website code will be added only after the relevant product behavior is defined.

## First App Prototype

The first runnable UI prototype lives in `app/`.

```powershell
cd app
npm install
npm run dev
```

The prototype is front-end only. It covers account/sign-in with required address confirmation, project start, the room-creation wizard, a 2D/3D room editor, item and Marketplace fetch controls, budget, address confirmation, design options, and saved rooms.
