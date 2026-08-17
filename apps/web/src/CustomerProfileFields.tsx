import type { CustomerProfilePatch } from "@workos-final/domain";
import { Field } from "./ui/Field";

export type CustomerProfileFormValue = {
  displayName: string;
  cui: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
};

export function emptyCustomerProfileForm(
  displayName = "",
): CustomerProfileFormValue {
  return {
    displayName,
    cui: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  };
}

export function customerProfilePatchFromForm(
  value: CustomerProfileFormValue,
): CustomerProfilePatch {
  return {
    displayName: value.displayName,
    cui: value.cui,
    contactName: value.contactName,
    phone: value.phone,
    email: value.email,
    address: value.address,
    city: value.city,
    notes: value.notes,
  };
}

export function CustomerProfileFields({
  value,
  onChange,
  disabled = false,
}: {
  value: CustomerProfileFormValue;
  onChange: (next: CustomerProfileFormValue) => void;
  disabled?: boolean;
}) {
  function set<K extends keyof CustomerProfileFormValue>(
    key: K,
    next: CustomerProfileFormValue[K],
  ) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="client-profile-fields">
      <Field label="Nume">
        <input
          value={value.displayName}
          disabled={disabled}
          onChange={(event) => set("displayName", event.target.value)}
        />
      </Field>
      <Field label="CUI">
        <input
          value={value.cui}
          disabled={disabled}
          onChange={(event) => set("cui", event.target.value)}
        />
      </Field>
      <Field label="Persoană de contact">
        <input
          value={value.contactName}
          disabled={disabled}
          onChange={(event) => set("contactName", event.target.value)}
        />
      </Field>
      <Field label="Telefon">
        <input
          value={value.phone}
          disabled={disabled}
          onChange={(event) => set("phone", event.target.value)}
        />
      </Field>
      <Field label="Email">
        <input
          value={value.email}
          disabled={disabled}
          onChange={(event) => set("email", event.target.value)}
        />
      </Field>
      <Field label="Adresă">
        <input
          value={value.address}
          disabled={disabled}
          onChange={(event) => set("address", event.target.value)}
        />
      </Field>
      <Field label="Oraș">
        <input
          value={value.city}
          disabled={disabled}
          onChange={(event) => set("city", event.target.value)}
        />
      </Field>
      <Field label="Note">
        <textarea
          value={value.notes}
          disabled={disabled}
          onChange={(event) => set("notes", event.target.value)}
        />
      </Field>
    </div>
  );
}
