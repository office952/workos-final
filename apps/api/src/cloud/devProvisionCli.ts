import {
  openProvisionedControlPlane,
  provisionCloudUser,
  provisionMembership,
  provisionOrganizationWithPlane,
} from "./provision.js";

function readArg(name: string): string {
  const index = process.argv.indexOf(`--${name}`);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value) {
    throw new Error(`Missing --${name}`);
  }
  return value;
}

const cloudRoot = readArg("root");
const displayName = readArg("org");
const email = readArg("email");
const password = readArg("password");

const controlPlane = openProvisionedControlPlane(cloudRoot);
const { organization, plane, paths } = await provisionOrganizationWithPlane(controlPlane, {
  displayName,
  bootstrapPolicy: "NEW_ORGANIZATION",
});
const user = await provisionCloudUser(controlPlane, { email, password });
provisionMembership(controlPlane, {
  userId: user.userId,
  organizationId: organization.organizationId,
  role: "owner",
});
controlPlane.close();

console.log(`organization: ${organization.displayName}`);
console.log(`user: ${user.email}`);
console.log(`plane: ${paths.sqlitePath}`);
