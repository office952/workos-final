export function isWorklogEvidencePath(path: string): boolean {
  return path.replaceAll("\\", "/").includes("docs/worklog/screenshots/");
}

export function shouldWriteWorklogEvidence(path: string): boolean {
  if (process.env.WORKOS_WRITE_WORKLOG_SCREENSHOTS === "1") {
    return true;
  }
  const fileName = path.replaceAll("\\", "/").split("/").pop() ?? "";
  return fileName.startsWith("v3-nav-");
}
