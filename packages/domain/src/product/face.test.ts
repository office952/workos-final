import { describe, expect, it } from "vitest";
import { faceAreaSquareMeters } from "./face.js";

describe("FACE quantity", () => {
  it("converts confirmed area mm2 to square meters in one place", () => {
    expect(faceAreaSquareMeters(250000)).toBe(0.25);
  });
});
