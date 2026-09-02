# Commercial price rules canon

Canonical current law for turning planned internal cost into a customer-facing price.
Runtime wins if this document disagrees.

## Permanent separation

```text
EIC / INTERNAL COST
≠ COMMERCIAL PRICE
≠ QUOTE SNAPSHOT
≠ QUOTE DOCUMENT / PDF
≠ ORDER
```

Resources / EIC answers: what should this product or service cost us internally?
Commercial answers: what price do we offer the customer?

Product commercial consumes planned product EIC `{ total, currency, completeness }`.
It does not inspect FACE / VOLUME / BACK / LIGHTING, quantities, resource identity, or rates.

Operational-service commercial is a **separate future channel**. See below. Do not claim the current projector implements it.

## Owner

Commercial owns the company policy and the customer-price projection.

Commercial does not own internal cost, resource rates, technical quantities, inventory, or actual consumption.

Quote Snapshot freezes this projection as historical offer evidence.
Quote Acceptance records that the frozen offer was accepted, without repricing.
Order Snapshot copies the accepted freeze and becomes the commercial job root.
Quote also freezes generic production-input evidence used later for Release.
Order copies that evidence. Order does not reprice. Production Release from Order copies the frozen planned EIC and does not reprice.

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

Product cost-plus markup. Not target margin. Not the service commercial strategy.

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

Product path (CURRENT_RUNTIME):

```text
EIC COMPLETE + EUR → Commercial COMPLETE
EIC PARTIAL → Commercial PARTIAL
currency mismatch or invalid policy/cost → Commercial UNAVAILABLE
```

PARTIAL may keep preview amounts in the projection. The operator UI must not present them as a final customer price.
A COMPLETE product commercial projection is not a COMPLETE job when a selected optional scope such as `SITE_INSTALLATION` is PARTIAL. Do not present `0 EUR` as an installation cost or price. Quote freeze stays blocked until every selected commercial scope is COMPLETE under its own strategy. See `docs/architecture/OPTIONAL_SITE_INSTALLATION_CANON.md` and `docs/architecture/OPERATIONAL_SERVICES_CANON.md`.

Canonical 60 mm none/none is COMPLETE.
30 / 80 / 100 mm, vinyl, and RAL stay PARTIAL while internal-cost evidence is unconfirmed.

## Service commercial channel — CURRENT_RUNTIME local in review

```text
SERVICE_COMMERCIAL_STRATEGY = MANUAL_FIXED_PER_REQUEST
PRODUCT_STRATEGY            = COST_PLUS
CURRENT_PRODUCT_PROJECTOR   = projectCommercialPrice
CURRENT_SERVICE_PROJECTOR   = projectManualFixedServicePrice
CURRENT_JOB_PROJECTOR       = projectLiveJobCommercial
SERVICE_MANUAL_PRICE_WRITE_PERMISSION = OWNER_ONLY
QUOTE_V2                    = IMPLEMENTED_LOCAL_IN_REVIEW
OWNER_ACCEPTED_RUNTIME      = NO
```

Accepted law now implemented locally, not Owner-accepted:

- product cost-plus remains unchanged;
- a service fixed price is a distinct commercial strategy;
- that fixed price may be frozen only after service facts + service EIC COMPLETE + Owner-written net + additive Quote v2;
- `200 EUR + TVA` belongs to the first real installation Request/offer when the Owner writes 200;
- it is not a universal list price and not an organization default;
- it does not complete EIC;
- later policy or rate changes never rewrite frozen Quotes;
- completing service EIC must not activate product cost-plus on that service.

`ALT_B_SCOPED` decides who may see money. Owner role decides who may write the service fixed price.

`CURRENT_RUNTIME` on the pre-quote branch: selected installation uses `projectManualFixedServicePrice`, not cost-plus from install EIC. The operator view must not treat a PARTIAL or 0 EUR projection as a sold price. Product-only Quote v1 is unchanged.

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
SERVICE_COST_PLUS = REJECTED
ORG_WIDE_200_EUR_LIST_PRICE = REJECTED
CUSTOMER_PRICE_AS_EIC = REJECTED
FX = NOT_IMPLEMENTED
```
