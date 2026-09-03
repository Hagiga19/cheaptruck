# Seller Messaging

## Purpose

Define how seller availability and price negotiation are handled after the user selects a design.

## Initial Rules

- Require explicit user approval before contacting a seller.
- Show the user which listings and message purpose are being approved.
- Keep availability checks separate from negotiation requests.
- Let the user approve negotiation limits before asking for a lower price.
- Preserve sent messages, seller replies, timestamps, and resulting status changes.
- Never represent an unanswered message as confirmation.
- Update the relevant item record and listing health when availability, price, dimensions, pickup details, or seller confidence changes.
- Send changed item facts back through Workflow so affected design totals can refresh.
- If an item is unavailable or the seller does not reply in time, trigger replacement mode instead of silently removing the design.

## To Define

- Message templates and allowed personalization
- Negotiation limits and user approval points
- Timeouts and follow-up behavior
- Whether contact is manual, user-assisted, or automated after Marketplace access is verified
