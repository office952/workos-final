const GIT = String.raw`(?:[Gg][Ii][Tt])(?:\.exe)?`;
const NODE = String.raw`(?:[Nn][Oo][Dd][Ee])(?:\.exe)?`;
const PUSH = String.raw`(?:[Pp][Uu][Ss][Hh])`;
const RESET = String.raw`(?:[Rr][Ee][Ss][Ee][Tt])`;
const CLEAN = String.raw`(?:[Cc][Ll][Ee][Aa][Nn])`;
const FORCE = String.raw`(?:--[Ff][Oo][Rr][Cc][Ee](?:-[Ww][Ii][Tt][Hh]-[Ll][Ee][Aa][Ss][Ee])?\b)`;
const HARD = String.raw`(?:--[Hh][Aa][Rr][Dd]\b)`;
const SEP = String.raw`(?:^|[\n;&]|&&|\|\|)\s*(?:["'])?`;
const GIT_GLOBALS = String.raw`(?:\s+(?:--no-pager|--porcelain|-C\s+\S+|--git-dir=\S+|--work-tree=\S+))*`;
const REMOVE_ITEM = String.raw`(?:[Rr][Ee][Mm][Oo][Vv][Ee]-[Ii][Tt][Ee][Mm])`;
const RECURSE = String.raw`(?:[Rr][Ee][Cc][Uu][Rr][Ss][Ee])`;
const RM = String.raw`(?:[Rr][Mm])(?:\.exe)?`;
const RMDIR = String.raw`(?:[Rr][Mm][Dd][Ii][Rr]|[Rr][Dd])(?:\.exe)?`;

export const CATASTROPHIC_COMMAND_MATCHER = [
  String.raw`${SEP}${GIT}${GIT_GLOBALS}\s+${PUSH}\b(?:\s+\S+)*\s+(?:${FORCE}|-[a-zA-Z]*f[a-zA-Z]*)`,
  String.raw`${SEP}${GIT}${GIT_GLOBALS}\s+${PUSH}\b(?:\s+\S+)*\s+\+`,
  String.raw`${SEP}${GIT}${GIT_GLOBALS}\s+${RESET}\b(?:\s+\S+)*\s+${HARD}`,
  String.raw`${SEP}${GIT}${GIT_GLOBALS}\s+${CLEAN}\b(?:\s+\S+)*\s+(?:${FORCE}|-[a-zA-Z]*f[a-zA-Z]*)`,
  String.raw`${SEP}${RM}\s+-[a-zA-Z]*r`,
  String.raw`${SEP}${REMOVE_ITEM}\b[\s\S]*-${RECURSE}\b`,
  String.raw`${SEP}${RMDIR}\s+/[sS]\b`,
  String.raw`${SEP}${NODE}\s+(?:-e|--[Ee][Vv][Aa][Ll])\s+[^\n]*(?:${PUSH}[^\n]*${FORCE}|${RESET}[^\n]*${HARD}|${RM}\s+-[a-zA-Z]*r)`,
].join("|");

export function matchesCatastrophicCommand(command) {
  return new RegExp(CATASTROPHIC_COMMAND_MATCHER).test(String(command ?? ""));
}
