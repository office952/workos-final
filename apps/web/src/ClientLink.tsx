import { Link } from "react-router-dom";
import { customerHref } from "@workos-final/domain";

type ClientLinkProps = {
  customerId: string | null | undefined;
  displayName: string | null | undefined;
  prefix?: string;
};

export function ClientLink({
  customerId,
  displayName,
  prefix = "Client: ",
}: ClientLinkProps) {
  if (!displayName) {
    return null;
  }
  const label = `${prefix}${displayName}`;
  if (!customerId) {
    return <span className="jobs-customer">{label}</span>;
  }
  return (
    <Link className="jobs-customer" to={customerHref(customerId)}>
      {label}
    </Link>
  );
}
