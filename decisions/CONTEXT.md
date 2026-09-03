# Decisions Context

## Purpose

Use this folder for durable project decisions that future CheapTruck planning sessions should treat as settled unless the user changes direction.

Decisions explain what was chosen, why it was chosen, what tradeoff it creates, and what still needs follow-up.

## Owns

- Product-wide decisions
- Cross-area ownership decisions
- Durable technical direction decisions once implementation begins
- Approval, privacy, Marketplace, and safety decisions that affect more than one folder
- Reasons behind major workflow or data-model choices

## Does Not Own

- Detailed domain rules that belong in `ui/`, `requests/`, `measurements/`, `marketplace/`, `room-designs/`, or `workflow/`
- Living implementation architecture notes that belong in `tech/`
- Raw session notes
- Open research notes without a decision attached
- Revenue planning

## Files

- `decision-log.md` - durable decisions in reverse chronological order

## Decision Rules

- Record a decision only when it should constrain future work.
- Keep each entry short enough to scan.
- Link the decision to its tradeoff instead of making it sound cost-free.
- Put open questions in `docs/next-steps.md` or the owning domain unless they are direct follow-up to a decision.
- If a decision changes, add a new entry that supersedes the old one instead of rewriting history.

## Status

Active support area. Current decisions cover product-domain ownership, technical planning ownership, account and address gating, Marketplace candidate pools, measured placement ownership, workflow state separation, seller-contact approval, and the immersive Room Designs MVP direction.
