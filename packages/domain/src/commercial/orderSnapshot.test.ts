import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { composeProductProcessesFromTruth } from "../processes/composition.js";
import {
  compileAggregate,
  compileDefinition,
  confirmReviewedDefinition,
} from "../product/compiler.js";
import { seededDisplayLabelCatalog } from "../product/displayMetadata.js";
import {
  CANONICAL_PRODUCT_CODE,
  frontlitPlexiAl06FormSchema,
  frontlitPlexiAl06Template,
} from "../product/frontlitPlexiAl06.js";
import type { DraftValues } from "../product/types.js";
import { compileEic } from "../resources/eic.js";
import { DEFAULT_COMMERCIAL_POLICY, type CommercialPolicy } from "./policy.js";
import { projectCommercialPrice } from "./price.js";
import { freezeOrderSnapshot } from "./orderSnapshot.js";
import { recordQuoteAcceptance } from "./quoteAcceptance.js";
import { freezeQuoteSnapshot, type QuoteSnapshot } from "./quoteSnapshot.js";

const readyValues: DraftValues = {
  "root.inscription": "WORKOS",
  "face.finish": "none",
  "face.confirmedAreaMm2": 250000,
  "volume.depthMm": "60",
  "volume.finish": "none",
  "volume.confirmedPerimeterMm": 12500,
};

function frozenAcceptedQuote() {
  const definition = compileDefinition(
    frontlitPlexiAl06Template,
    frontlitPlexiAl06FormSchema,
    {
      templateCode: CANONICAL_PRODUCT_CODE,
      values: readyValues,
    },
  );
  const truth = confirmReviewedDefinition(definition, definition.reviewId);
  if ("ok" in truth) {
    throw new Error("expected confirmed truth");
  }
  const aggregate = compileAggregate(
    truth,
    frontlitPlexiAl06Template,
    frontlitPlexiAl06FormSchema,
    seededDisplayLabelCatalog(),
  );
  const eic = compileEic(
    aggregate,
    composeProductProcessesFromTruth(truth, frontlitPlexiAl06Template),
  );
  const frozen = freezeQuoteSnapshot(
    truth,
    aggregate,
    eic,
    projectCommercialPrice(eic),
    { createdAt: "2026-08-17T00:00:00.000Z" },
  );
  if (!frozen.ok) {
    throw new Error("expected frozen quote");
  }
  const accepted = recordQuoteAcceptance(frozen.snapshot, {
    acceptedAt: "2026-08-17T01:00:00.000Z",
  });
  if (!accepted.ok) {
    throw new Error("expected acceptance");
  }
  return { quote: frozen.snapshot, acceptance: accepted.decision };
}

describe("order snapshot freeze", () => {
  it("copies the accepted golden quote without calculating", () => {
    const { quote, acceptance } = frozenAcceptedQuote();
    const first = freezeOrderSnapshot(quote, acceptance, {
      createdAt: "2026-08-17T02:00:00.000Z",
    });
    const second = freezeOrderSnapshot(quote, acceptance, {
      createdAt: "2026-08-17T12:00:00.000Z",
    });
    expect(first.ok && second.ok).toBe(true);
    if (!first.ok || !second.ok) {
      return;
    }
    expect(first.snapshot.status).toBe("FROZEN");
    expect(first.snapshot.orderSnapshotId).toBe(
      `ord:${acceptance.acceptanceId}:${first.snapshot.contentHash}`,
    );
    expect(first.snapshot.sourceQuoteSnapshotId).toBe(quote.quoteSnapshotId);
    expect(first.snapshot.sourceQuoteContentHash).toBe(quote.contentHash);
    expect(first.snapshot.sourceAcceptanceId).toBe(acceptance.acceptanceId);
    expect(first.snapshot.sourceAcceptedAt).toBe("2026-08-17T01:00:00.000Z");
    expect(first.snapshot.eic.total).toBe(382.5);
    expect(first.snapshot.commercial).toEqual(quote.commercial);
    expect(first.snapshot.commercial.grossPrice).toBe(624.82);
    expect(first.snapshot.truth.values["volume.depthMm"]).toBe("60");
    expect(first.snapshot.contentHash).toBe(second.snapshot.contentHash);
    expect(second.snapshot.createdAt).toBe("2026-08-17T12:00:00.000Z");
    expect(quote.status).toBe("FROZEN");
    expect(JSON.stringify(first.snapshot)).not.toMatch(
      /compileDefinition|compileAggregate|compileEic|projectCommercialPrice|ExecutionPlan|OrderOrchestrator/i,
    );
  });

  it("does not reprice when the current commercial policy changes", () => {
    const { quote, acceptance } = frozenAcceptedQuote();
    const frozen = freezeOrderSnapshot(quote, acceptance);
    const later = projectCommercialPrice(quote.eic, {
      ...DEFAULT_COMMERCIAL_POLICY,
      version: 2,
      markupPercent: 70,
      vatPercent: 19,
    } satisfies CommercialPolicy);
    expect(frozen.ok).toBe(true);
    if (!frozen.ok) {
      return;
    }
    expect(later.grossPrice).not.toBe(frozen.snapshot.commercial.grossPrice);
    expect(frozen.snapshot.commercial.markupPercent).toBe(35);
    expect(frozen.snapshot.commercial.vatPercent).toBe(21);
    expect(frozen.snapshot.commercial.grossPrice).toBe(624.82);
    expect(frozen.snapshot.eic.total).toBe(382.5);
  });

  it("does not reread a later product configuration", () => {
    const { quote, acceptance } = frozenAcceptedQuote();
    const frozen = freezeOrderSnapshot(quote, acceptance);
    const laterQuote: QuoteSnapshot = {
      ...quote,
      truth: {
        ...quote.truth,
        values: { ...quote.truth.values, "volume.depthMm": "30" },
      },
    };
    expect(frozen.ok).toBe(true);
    if (!frozen.ok) {
      return;
    }
    expect(frozen.snapshot.truth.values["volume.depthMm"]).toBe("60");
    expect(laterQuote.truth.values["volume.depthMm"]).toBe("30");
  });

  it("blocks a frozen quote without a matching acceptance", () => {
    const { quote, acceptance } = frozenAcceptedQuote();
    expect(
      freezeOrderSnapshot(quote, {
        ...acceptance,
        quoteSnapshotId: "qts:other",
      }),
    ).toMatchObject({ ok: false, error: "quote_not_accepted" });
    expect(
      freezeOrderSnapshot(quote, {
        ...acceptance,
        quoteContentHash: "0".repeat(64),
      }),
    ).toMatchObject({ ok: false, error: "acceptance_mismatch" });
    expect(
      freezeOrderSnapshot(
        { ...quote, eic: { ...quote.eic, completeness: "PARTIAL" } },
        acceptance,
      ),
    ).toMatchObject({ ok: false, error: "incompatible_order_source" });
  });

  it("does not import live compilers on the order freeze path", () => {
    const source = readFileSync(new URL("./orderSnapshot.ts", import.meta.url), "utf8");
    expect(source).not.toMatch(/compileDefinition|compileAggregate|compileEic/);
    expect(source).not.toMatch(/projectCommercialPrice|composeProductProcesses/);
  });
});
