export function parseHookInput(raw) {
  const text = String(raw ?? "")
    .replace(/^\uFEFF/, "")
    .trim();
  if (text.length === 0) {
    return { ok: false, error: "empty" };
  }
  try {
    const value = JSON.parse(text);
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      return { ok: false, error: "invalid_shape" };
    }
    return { ok: true, value };
  } catch {
    return { ok: false, error: "invalid_json" };
  }
}
