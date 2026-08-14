import { describe, expect, it } from "vitest";
import { returnCantLinearMeters } from "./returnCant.js";

describe("RETURN_CANT quantity", () => {
  it("converts confirmed perimeter mm to linear meters in one place", () => {
    expect(returnCantLinearMeters(12500)).toBe(12.5);
  });
});
