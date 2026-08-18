import { mkdirSync } from "node:fs";
import {
  createControlPlane,
  type BootstrapPolicy,
  type ControlPlane,
  type MembershipRole,
} from "./controlPlane.js";
import { derivePlanePaths } from "./paths.js";
import { createProductSystemRuntime } from "../productSystem/runtime.js";
import {
  openControlPlaneDatabase,
  resolveControlPlaneSqlitePath,
} from "../persistence/controlPlaneSqlite.js";

export function openProvisionedControlPlane(cloudRoot: string): ControlPlane {
  const db = openControlPlaneDatabase(resolveControlPlaneSqlitePath(cloudRoot));
  return createControlPlane(db, cloudRoot);
}

export async function provisionOrganizationWithPlane(
  controlPlane: ControlPlane,
  input: {
    displayName: string;
    slug?: string;
    bootstrapPolicy?: BootstrapPolicy;
  },
) {
  const organization = controlPlane.createOrganization({
    displayName: input.displayName,
    slug: input.slug,
  });
  const plane = controlPlane.createPlane({
    organizationId: organization.organizationId,
    bootstrapPolicy: input.bootstrapPolicy ?? "NEW_ORGANIZATION",
  });
  const paths = derivePlanePaths(controlPlane.cloudRoot, plane.planeKey);
  mkdirSync(paths.documentsRoot, { recursive: true });
  const runtime = createProductSystemRuntime(paths.sqlitePath, {
    documentsRoot: paths.documentsRoot,
    planeIdentity: {
      planeId: plane.planeId,
      organizationId: organization.organizationId,
    },
  });
  runtime.close();
  return { organization, plane, paths };
}

export async function provisionCloudUser(
  controlPlane: ControlPlane,
  input: { email: string; password: string },
) {
  return controlPlane.createUser(input);
}

export function provisionMembership(
  controlPlane: ControlPlane,
  input: {
    userId: string;
    organizationId: string;
    role: MembershipRole;
  },
) {
  return controlPlane.addMembership(input);
}
