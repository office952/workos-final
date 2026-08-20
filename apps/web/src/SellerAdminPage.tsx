import { useEffect, useState } from "react";
import type { SellerProfile, SellerProfileInput } from "@workos-final/domain";
import { useCanAdministerOrganization } from "./CloudSessionContext";
import { OwnerWriteHint } from "./OwnerWriteHint";
import { fetchSellerProfile, updateSellerProfile } from "./sellerApi";
import { Field } from "./ui/Field";
import { PageHeader } from "./ui/PageHeader";

type PageState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; seller: SellerProfile | null };

const EMPTY_DRAFT: SellerProfileInput = {
  legalName: "",
  brand: "",
  fiscalId: "",
  tradeRegister: "",
  address: "",
  locality: "",
  iban: "",
  bank: "",
};

export function SellerAdminPage() {
  const canAdminister = useCanAdministerOrganization();
  const [page, setPage] = useState<PageState>({ kind: "loading" });
  const [draft, setDraft] = useState<SellerProfileInput>(EMPTY_DRAFT);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchSellerProfile()
      .then((seller) => {
        if (!cancelled) {
          setPage({ kind: "ready", seller });
          setDraft(seller ? toDraft(seller) : EMPTY_DRAFT);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPage({ kind: "error" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (page.kind === "loading") {
    return <p>Se încarcă datele firmei…</p>;
  }
  if (page.kind === "error") {
    return <p>Nu s-au putut încărca datele firmei.</p>;
  }

  return (
    <section>
      <PageHeader
        title="Date firmă"
        lead="Identitatea vânzătorului folosită pe oferte noi. Nu este catalogul de clienți și nu este un Settings general."
      />
      <p className="page-lead">
        {page.seller
          ? `Vânzător curent: ${page.seller.legalName}. Ofertele deja create păstrează datele de atunci.`
          : "Datele firmei nu sunt configurate. Ownerul poate salva prima identitate. Ofertele noi rămân blocate până atunci."}
      </p>
      {!canAdminister ? <OwnerWriteHint /> : null}
      <form
        className="seller-form"
        onSubmit={(event) => {
          event.preventDefault();
          setBusy(true);
          setNotice(null);
          void updateSellerProfile(draft)
            .then((seller) => {
              setPage({ kind: "ready", seller });
              setDraft(toDraft(seller));
            })
            .catch(() => {
              setNotice("Datele firmei nu au putut fi salvate.");
            })
            .finally(() => {
              setBusy(false);
            });
        }}
      >
        <Field label="Denumire legală">
          <input
            value={draft.legalName}
            onChange={(event) => setDraft({ ...draft, legalName: event.target.value })}
            disabled={busy || !canAdminister}
          />
        </Field>
        <Field label="Marcă">
          <input
            value={draft.brand}
            onChange={(event) => setDraft({ ...draft, brand: event.target.value })}
            disabled={busy || !canAdminister}
          />
        </Field>
        <Field label="CIF">
          <input
            value={draft.fiscalId}
            onChange={(event) => setDraft({ ...draft, fiscalId: event.target.value })}
            disabled={busy || !canAdminister}
          />
        </Field>
        <Field label="Registrul comerțului">
          <input
            value={draft.tradeRegister}
            onChange={(event) => setDraft({ ...draft, tradeRegister: event.target.value })}
            disabled={busy || !canAdminister}
          />
        </Field>
        <Field label="Adresă">
          <input
            value={draft.address}
            onChange={(event) => setDraft({ ...draft, address: event.target.value })}
            disabled={busy || !canAdminister}
          />
        </Field>
        <Field label="Localitate">
          <input
            value={draft.locality}
            onChange={(event) => setDraft({ ...draft, locality: event.target.value })}
            disabled={busy || !canAdminister}
          />
        </Field>
        <Field label="IBAN">
          <input
            value={draft.iban}
            onChange={(event) => setDraft({ ...draft, iban: event.target.value })}
            disabled={busy || !canAdminister}
          />
        </Field>
        <Field label="Bancă">
          <input
            value={draft.bank}
            onChange={(event) => setDraft({ ...draft, bank: event.target.value })}
            disabled={busy || !canAdminister}
          />
        </Field>
        {canAdminister ? (
          <div className="action-row">
            <button type="submit" disabled={busy || draft.legalName.trim().length === 0}>
              Salvează datele firmei
            </button>
          </div>
        ) : null}
      </form>
      {notice ? <p className="status-bad">{notice}</p> : null}
    </section>
  );
}

function toDraft(seller: SellerProfile): SellerProfileInput {
  return {
    legalName: seller.legalName,
    brand: seller.brand,
    fiscalId: seller.fiscalId,
    tradeRegister: seller.tradeRegister,
    address: seller.address,
    locality: seller.locality,
    iban: seller.iban,
    bank: seller.bank,
  };
}
