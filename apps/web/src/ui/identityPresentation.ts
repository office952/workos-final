export function identityTriggerAccessibleName(
  shortName: string,
  accountLabel?: string | null,
): string {
  const organization = shortName.trim();
  const account = accountLabel?.trim() ?? "";
  if (account && account !== organization) {
    return `${organization}. ${account}`;
  }
  return organization;
}
