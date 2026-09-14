export function tokenize(command) {
  const tokens = [];
  let current = "";
  let quote = null;
  const input = String(command ?? "");

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quote) {
      if (char === quote) {
        quote = null;
        continue;
      }
      if (char === "\\" && quote === '"') {
        index += 1;
        current += input[index] ?? "";
        continue;
      }
      current += char;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (/\s/.test(char)) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }
      continue;
    }
    current += char;
  }
  if (current.length > 0) {
    tokens.push(current);
  }
  return tokens;
}

function isPowerShell(token) {
  return /(^|[\\/])(powershell|pwsh)(\.exe)?$/i.test(token);
}

function isCmd(token) {
  return /(^|[\\/])cmd(\.exe)?$/i.test(token);
}

export function unwrapCommand(command) {
  let current = String(command ?? "").trim();
  for (let pass = 0; pass < 2; pass += 1) {
    const tokens = tokenize(current);
    if (tokens.length < 2) {
      return current;
    }
    if (isPowerShell(tokens[0])) {
      const flagIndex = tokens.findIndex((token) =>
        /^(-Command|-C|-c)$/i.test(token),
      );
      if (flagIndex >= 0 && tokens[flagIndex + 1]) {
        current = tokens.slice(flagIndex + 1).join(" ");
        continue;
      }
    }
    if (isCmd(tokens[0])) {
      const flagIndex = tokens.findIndex((token) => /^\/c$/i.test(token));
      if (flagIndex >= 0 && tokens[flagIndex + 1]) {
        current = tokens.slice(flagIndex + 1).join(" ");
        continue;
      }
    }
    return current;
  }
  return current;
}

export function splitShellSegments(command) {
  const segments = [];
  let current = "";
  let quote = null;
  const input = String(command ?? "");

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];
    if (quote) {
      if (char === quote) {
        quote = null;
      } else if (char === "\\" && quote === '"') {
        current += char + (next ?? "");
        index += 1;
        continue;
      }
      current += char;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      current += char;
      continue;
    }
    if (char === "&" && next === "&") {
      segments.push(current.trim());
      current = "";
      index += 1;
      continue;
    }
    if (char === "|" && next === "|") {
      segments.push(current.trim());
      current = "";
      index += 1;
      continue;
    }
    if (char === "\n" || char === "\r") {
      segments.push(current.trim());
      current = "";
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      continue;
    }
    if (char === ";" || (char === "&" && next !== ">") || (char === "|" && next !== "|")) {
      segments.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim().length > 0) {
    segments.push(current.trim());
  }
  return segments.filter((segment) => segment.length > 0);
}

export function basename(token) {
  return String(token ?? "")
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(/\.exe$/i, "")
    .replace(/\.cmd$/i, "")
    .toLowerCase();
}
