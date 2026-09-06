import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

export type ContinuityFacts = {
  requestId?: string | null;
  requestReference?: string | null;
  customerName?: string | null;
  quoteId?: string | null;
  quoteReference?: string | null;
  jobId?: string | null;
  planId?: string | null;
};

const ContinuityFactsContext = createContext<ContinuityFacts>({});
const ContinuitySetContext = createContext<(facts: ContinuityFacts) => void>(() => undefined);

export function ContinuityProvider({ children }: { children: ReactNode }) {
  const [facts, setFacts] = useState<ContinuityFacts>({});
  const setter = useMemo(() => setFacts, []);
  return (
    <ContinuitySetContext.Provider value={setter}>
      <ContinuityFactsContext.Provider value={facts}>{children}</ContinuityFactsContext.Provider>
    </ContinuitySetContext.Provider>
  );
}

export function useContinuityFacts(facts: ContinuityFacts) {
  const setFacts = useContext(ContinuitySetContext);
  const customerName = facts.customerName;
  const jobId = facts.jobId;
  const planId = facts.planId;
  const quoteId = facts.quoteId;
  const quoteReference = facts.quoteReference;
  const requestId = facts.requestId;
  const requestReference = facts.requestReference;
  useEffect(() => {
    setFacts({
      customerName,
      jobId,
      planId,
      quoteId,
      quoteReference,
      requestId,
      requestReference,
    });
    return () => {
      setFacts({});
    };
  }, [
    setFacts,
    customerName,
    jobId,
    planId,
    quoteId,
    quoteReference,
    requestId,
    requestReference,
  ]);
}

export function ObjectContinuity() {
  const facts = useContext(ContinuityFactsContext);
  const items = [
    facts.requestId
      ? {
          key: "request",
          label: facts.requestReference ?? "Cerere",
          href: `/requests/${encodeURIComponent(facts.requestId)}`,
        }
      : null,
    facts.quoteId
      ? {
          key: "quote",
          label: facts.quoteReference ?? "Ofertă",
          href: `/quotes/${encodeURIComponent(facts.quoteId)}`,
        }
      : null,
    facts.jobId
      ? {
          key: "job",
          label: "Lucrare",
          href: `/jobs/${encodeURIComponent(facts.jobId)}`,
        }
      : null,
    facts.planId
      ? {
          key: "plan",
          label: "Execuție",
          href: `/execution/${encodeURIComponent(facts.planId)}`,
        }
      : null,
  ].filter((item): item is { key: string; label: string; href: string } => item !== null);

  if (items.length === 0 && !facts.customerName) {
    return null;
  }

  return (
    <p className="ui20-continuity" data-testid="ui20-continuity">
      {facts.customerName ? <span>{facts.customerName}</span> : null}
      {items.map((item) => (
        <Link key={item.key} to={item.href}>
          {item.label}
        </Link>
      ))}
    </p>
  );
}
