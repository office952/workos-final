# Commercial price rules canon

Canonical current law for turning planned internal cost into a customer-facing price.
Runtime wins if this document disagrees.

## Permanent separation

```text
EIC / INTERNAL COST
≠ COMMERCIAL PRICE
≠ QUOTE SNAPSHOT
≠ ORDER
```

Resources / EIC answers: what should this product cost us internally?
Commercial answers: what price do we offer the customer?

Commercial consumes planned EIC `{ total, currency, completeness }`.
It does not inspect FACE / VOLUME / BACK / LIGHTING, quantities, resource identity, or rates.

## Owner

Commercial owns the company policy and the customer-price projection.

Commercial does not own internal cost, resource rates, technical quantities, inventory, or actual consumption.

Quote Snapshot freezes this projection as historical offer evidence.
Quote Acceptance records that the frozen offer was accepted, without repricing.
Future Order consumes the accepted quote. Order is not implemented.

## Policy

One code-owned, owner-confirmed default policy:

```text
id = DEFAULT_COMMERCIAL_POLICY
version = 1
currency = EUR
markupPercent = 35
vatPercent = 21
rounding = 0.01
defaultDiscountPercent = 0
defaultAdjustment = 0
```

This is company-level configuration, not a Product System technical setting.
There is no admin write and no fake Edit/Save.

Discount and manual adjustment stay in the model at 0. Quote will own per-offer values later.
The first product UI does not expose editable discount or adjustment.

## Formula

Cost-plus markup. Not target margin.

```text
markupAmount = round(internalCost × markupPercent / 100)
subtotal = round(internalCost + markupAmount + adjustment)
discountAmount = round(subtotal × discountPercent / 100)
netPrice = round(subtotal − discountAmount)
vatAmount = round(netPrice × vatPercent / 100)
grossPrice = round(netPrice + vatAmount)
```

Internal EIC remains VAT-exclusive.
Rounding is 0.01 EUR, centralized in domain.

## Completeness gate

```text
EIC COMPLETE + EUR → Commercial COMPLETE
EIC PARTIAL → Commercial PARTIAL
currency mismatch or invalid policy/cost → Commercial UNAVAILABLE
```

PARTIAL may keep preview amounts in the projection. The operator UI must not present them as a final customer price.

Canonical 60 mm none/none is COMPLETE.
30 / 80 / 100 mm, vinyl, and RAL stay PARTIAL while internal-cost evidence is unconfirmed.

## Planned vs actual

Customer price uses planned / accepted EIC.
Actual Internal Cost is retrospective. It does not reprice the customer.

## Persistence and freeze

The live projection is current-policy output.
Quote Snapshot freezes policy id/version, inputs, and calculated outputs.
Later policy or rate changes do not rewrite an old quote.
Production Snapshot remains technical/production truth and does not store Commercial.

## Currency

EUR only. No FX. No RON in V1.

## Rejected

```text
LEGACY_COST_ENGINE = REJECTED
LEGACY_QUOTE_ORCHESTRATOR = REJECTED
LEGACY_CPP = REJECTED
LEGACY_INTAKE_PRICE_BRIDGES = REJECTED
FRONTEND_PRICING_AUTHORITY = REJECTED
PER_UNIT_COMMERCIAL_PRICE_ENGINE = REJECTED
FX = NOT_IMPLEMENTED
```
