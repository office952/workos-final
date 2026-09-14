import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type {
  DraftValue,
  DraftValues,
  FormSchema,
  ProductTemplate,
} from "@workos-final/domain";
import { FormRenderer } from "../FormRenderer";
import {
  sectionTitleForView,
  type BlueprintFact,
  type ConfiguratorScopeId,
  type ConfiguratorView,
} from "./configuratorView";

export type ConfiguratorWorkspaceMode = "edit" | "review";

export type ConfiguratorWorkspaceProps = {
  view: ConfiguratorView;
  mode: ConfiguratorWorkspaceMode;
  template?: ProductTemplate;
  schema?: FormSchema;
  values?: DraftValues;
  onChange?: (fieldId: string, value: DraftValue) => void;
  onVerify?: () => void;
  onScopeChange: (scopeId: ConfiguratorScopeId) => void;
  onTargetChange?: (targetId: string) => void;
  busy?: boolean;
  review?: ReactNode;
  notices?: ReactNode;
};

function factClass(kind: BlueprintFact["kind"]): string {
  switch (kind) {
    case "fixed":
      return "cfg-fact is-fixed";
    case "configured":
      return "cfg-fact is-configured";
    case "inherited":
      return "cfg-fact is-inherited";
    case "personalized":
      return "cfg-fact is-personalized";
    case "derived":
      return "cfg-fact is-derived";
    case "missing":
      return "cfg-fact is-missing";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function kindLabel(kind: BlueprintFact["kind"]): string | null {
  switch (kind) {
    case "fixed":
      return null;
    case "configured":
      return null;
    case "inherited":
      return "Moștenit";
    case "personalized":
      return "Personalizat";
    case "derived":
      return "Derivat";
    case "missing":
      return "Necesar";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function ConfiguratorWorkspace({
  view,
  mode,
  template,
  schema,
  values,
  onChange,
  onVerify,
  onScopeChange,
  onTargetChange,
  busy = false,
  review = null,
  notices = null,
}: ConfiguratorWorkspaceProps): ReactNode {
  const editing = mode === "edit" && view.activeScopeId !== "compozitie";
  const composition = view.activeScopeId === "compozitie";
  const objectLabel = view.context.objectLabel;
  const requestVisible = view.context.requestReference
    ? `Cerere ${view.context.requestReference}`
    : view.context.returnLabel;
  const clientVisible = view.context.clientName
    ? `Client ${view.context.clientName}`
    : null;

  return (
    <section className="configurator-final" aria-labelledby="cfg-page-title">
      <nav className="cfg-object-context" aria-label="Context obiect">
        <Link
          className="cfg-context-return"
          to={view.context.returnHref}
          aria-label={
            view.context.requestReference ? "Înapoi la cerere" : view.context.returnLabel
          }
        >
          <span aria-hidden="true">← </span>
          {requestVisible}
        </Link>
        {clientVisible ? (
          <span className="cfg-context-client">{clientVisible}</span>
        ) : null}
        {objectLabel ? <span className="cfg-context-object">{objectLabel}</span> : null}
      </nav>

      <header className="cfg-page-identity">
        <h1 id="cfg-page-title">{view.title}</h1>
        <p className="cfg-page-status" data-complete={view.complete ? "true" : "false"}>
          {view.statusLabel}
        </p>
      </header>

      <nav className="cfg-rail" aria-label="Module de configurare">
        <div className="cfg-rail-line" aria-hidden="true" />
        <div className="cfg-rail-items">
          {view.scopes.map((scope) => {
            const active = scope.id === view.activeScopeId;
            return (
              <button
                key={scope.id}
                type="button"
                className={active ? "cfg-rail-item is-active" : "cfg-rail-item"}
                aria-current={active ? "true" : undefined}
                onClick={() => onScopeChange(scope.id)}
              >
                <span className="cfg-rail-tick" aria-hidden="true" />
                {scope.label}
              </button>
            );
          })}
        </div>
      </nav>

      {view.activeScopeId === "litere" && view.targets.length > 0 ? (
        <div className="cfg-targets" role="group" aria-label="Configurezi">
          <p className="cfg-targets-label">Configurezi:</p>
          <div className="cfg-targets-list">
            {view.targets.map((target) => {
              const active = target.id === view.activeTargetId;
              return (
                <button
                  key={target.id}
                  type="button"
                  className={active ? "cfg-target is-active" : "cfg-target"}
                  aria-pressed={active}
                  onClick={() => onTargetChange?.(target.id)}
                >
                  {target.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="cfg-workspace">
        <aside className="cfg-blueprint" aria-label="Adevăr de produs">
          <div className="cfg-blueprint-head">
            <h2>{view.blueprintTitle}</h2>
            {view.blueprintIncomplete ? (
              <p className="cfg-incomplete-badge" role="status">
                Incomplet
              </p>
            ) : null}
          </div>
          {view.sections.map((section) => (
            <section key={section.id} className="cfg-blueprint-section">
              <h3>{section.label}</h3>
              <dl>
                {section.facts.map((fact) => (
                  <div
                    key={fact.id}
                    className={factClass(fact.kind)}
                    data-fact-id={fact.id}
                    data-fact-kind={fact.kind}
                  >
                    <dt className="visually-hidden">{fact.label}</dt>
                    <dd>
                      {fact.label}: {fact.display}
                      {kindLabel(fact.kind) ? (
                        <span className="cfg-fact-kind">{kindLabel(fact.kind)}</span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </aside>

        <div className="cfg-editor">
          <header className="cfg-editor-head">
            <h2>{composition ? "Compoziție" : view.editorTitle}</h2>
            <p>{composition ? "Verifică într-un singur loc configurația disponibilă. Nu se modifică aici." : view.editorLead}</p>
          </header>

          {notices}

          {composition ? (
            <div className="cfg-composition">
              {view.compositionItems.map((item) => (
                <article
                  key={item.scopeId}
                  className={
                    item.complete
                      ? "cfg-composition-item is-complete"
                      : "cfg-composition-item"
                  }
                >
                  <div>
                    <h3>{item.label}</h3>
                    {item.summary ? <p>{item.summary}</p> : null}
                    {!item.complete ? (
                      <p className="cfg-necessary" role="status">
                        Incomplet
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="cfg-edit-link"
                    onClick={() => onScopeChange(item.scopeId)}
                  >
                    {item.editLabel}
                  </button>
                </article>
              ))}
              {view.complete ? (
                <p className="cfg-composition-complete" role="status">
                  Configurare completă
                </p>
              ) : (
                <p className="cfg-composition-incomplete" role="status">
                  Compoziția rămâne incompletă până sunt complete modulele sursă.
                </p>
              )}
            </div>
          ) : null}

          {editing && template && schema && values && onChange ? (
            <>
              {view.editorSections.map((section) => (
                <section key={section.id} className="cfg-editor-section">
                  <FormRenderer
                    template={template}
                    schema={schema}
                    values={values}
                    onChange={onChange}
                    includeComponentIds={[section.componentId]}
                    sectionTitleFor={(componentId, fallback) =>
                      sectionTitleForView(view, componentId) || fallback
                    }
                    presentation="configurator"
                  />
                </section>
              ))}
              <div className="cfg-editor-actions">
                {view.blueprintIncomplete ? (
                  <p className="cfg-incomplete-banner" role="status">
                    Configurare incompletă. Câmpurile necesare sunt marcate NECESAR.
                  </p>
                ) : null}
                <button
                  type="button"
                  className="cfg-verify"
                  onClick={onVerify}
                  disabled={busy}
                >
                  Verifică configurația
                </button>
              </div>
            </>
          ) : null}

          {mode === "review" && !composition ? review : null}
        </div>
      </div>
    </section>
  );
}
