# Request Resolution Rules

## Purpose

Turn submitted UI parameters into precise, traceable item requirements that Marketplace can search without losing what the user actually asked for.

## Inputs

- Current submitted request version
- Clarification answers
- User permission for the system to choose unspecified preferences
- Confirmed room-model version
- Placement limits and acceptable dimension ranges supplied by Measurements

## Resolution Process

For each wanted item:

1. Preserve the submitted category, purpose, preferences, and target values.
2. Normalize equivalent terms without changing their meaning.
3. Classify each value as a hard constraint, flexible preference, or unknown.
4. Combine user targets with Measurement-supplied limits to calculate an acceptable requirement range.
5. Detect contradictions, such as a preferred size outside the safe range or an item budget above the total budget.
6. Ask only for unresolved information that materially affects the next search decision.
7. Produce a versioned Marketplace search brief with source and confidence attached.

## Marketplace Search Brief

Each searched item must provide:

- Request version and room-model version
- Category, purpose, quantity, and priority
- Required and excluded characteristics
- Acceptable dimensional range and permitted orientations
- Preferred style, color, material, condition, and flexibility
- Maximum price or allocated budget and price flexibility
- Search location, radius, and collection constraints
- Replacement equivalence notes, such as the item's design role and which preferences may flex
- Unknowns that Marketplace may attempt to resolve from a listing or seller
- Values that still require user confirmation

## Safety Rules

- Use Measurement-supplied limits; Requests does not calculate room geometry or physical fit.
- A user-entered target dimension is a preference until Measurements confirms that it is safe for the intended placement.
- Keep broad preferences broad when the user has allowed the system to choose.
- Do not silently relax hard constraints to obtain more Marketplace results.
- Marketplace may use the brief to build candidate pools and rank candidates, but Measurements must validate each candidate's actual dimensions and access path before it is treated as fitting.
- If a required listing dimension is missing, the result remains unverified until the value is obtained or the user knowingly accepts the uncertainty.
- Replacement searches may reuse the original brief, but changed user goals, budgets, location, or room measurements require a new request version or refreshed brief.
