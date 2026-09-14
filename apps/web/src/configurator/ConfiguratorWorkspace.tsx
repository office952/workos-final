import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type {
  DraftValue,
  DraftValues,
  FormSchema,
  ProductTemplate,
} from "@workos-final/domain";
import { FormRenderer } from "../FormRenderer";
import {
  configuratorRailMode,
  configuratorRailSlot,
  projectVisualLabel,
} from "./configuratorPresentation";
import {
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
  onConfirm?: () => void;
  onEdit?: () => void;
  busy?: boolean;
  reviewNote?: ReactNode;
  notices?: ReactNode;
  invalidFieldIds?: readonly string[];
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
      return null;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function focusWithoutScroll(node: HTMLElement | null): void {
  node?.focus({ preventScroll: true });
}

type PageScrollOrigin = {
  windowX: number;
  windowY: number;
  root: number;
  content: number;
};

function readPageScroll(): PageScrollOrigin {
  const content = document.getElementById("continut-principal");
  const root = document.scrollingElement;
  return {
    windowX: window.scrollX,
    windowY: window.scrollY,
    root: root instanceof HTMLElement ? root.scrollTop : 0,
    content: content instanceof HTMLElement ? content.scrollTop : 0,
  };
}

function writePageScroll(origin: PageScrollOrigin): void {
  window.scrollTo(origin.windowX, origin.windowY);
  const root = document.scrollingElement;
  if (root instanceof HTMLElement) {
    root.scrollTop = origin.root;
  }
  const content = document.getElementById("continut-principal");
  if (content instanceof HTMLElement) {
    content.scrollTop = origin.content;
  }
}

function FactRows({ facts }: { facts: readonly BlueprintFact[] }): ReactNode {
  return (
    <dl>
      {facts.map((fact) => {
        const visual = projectVisualLabel(fact.label);
        const extra = kindLabel(fact.kind);
        return (
          <div
            key={fact.id}
            className={factClass(fact.kind)}
            data-fact-id={fact.id}
            data-fact-kind={fact.kind}
          >
            <dt>
              <span className="visually-hidden">{fact.label}</span>
              <span aria-hidden="true">{visual}:</span>
            </dt>
            <dd>
              <span className="cfg-fact-value">{fact.display}</span>
              {extra ? <span className="cfg-fact-kind">{extra}</span> : null}
            </dd>
          </div>
        );
      })}
    </dl>
  );
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
  onConfirm,
  onEdit,
  busy = false,
  reviewNote = null,
  notices = null,
  invalidFieldIds = [],
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
  const verifyDisabled = busy;
  const showValidation = invalidFieldIds.length > 0;
  const railMode = configuratorRailMode(view.scopes.length);
  const editorHeadingRefs = useRef<Record<string, HTMLElement | null>>({});
  const pageScrollRef = useRef<PageScrollOrigin | null>(null);
  const [activeSectionId, setActiveSectionId] = useState(
    view.editorSections[0]?.componentId ?? view.sections[0]?.id ?? "ROOT",
  );

  function retainPageScroll(action: () => void): void {
    pageScrollRef.current = readPageScroll();
    action();
  }

  useLayoutEffect(() => {
    const origin = pageScrollRef.current;
    if (!origin) {
      return;
    }
    writePageScroll(origin);
    let frames = 0;
    let frame = 0;
    const hold = () => {
      writePageScroll(origin);
      frames += 1;
      if (frames < 3) {
        frame = window.requestAnimationFrame(hold);
        return;
      }
      pageScrollRef.current = null;
    };
    frame = window.requestAnimationFrame(hold);
    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [mode]);

  function selectSection(sectionId: string): void {
    setActiveSectionId(sectionId);
    focusWithoutScroll(editorHeadingRefs.current[sectionId] ?? null);
  }

  return (
    <section className="configurator-final" aria-labelledby="cfg-page-title">
      <div className="cfg-chrome">
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
            <>
              <span className="cfg-context-dot" aria-hidden="true">
                ·
              </span>
              <span className="cfg-context-client">{clientVisible}</span>
            </>
          ) : null}
          {objectLabel ? (
            <>
              <span className="cfg-context-dot" aria-hidden="true">
                ·
              </span>
              <span className="cfg-context-object">{objectLabel}</span>
            </>
          ) : null}
          <span className="cfg-context-rule" aria-hidden="true" />
        </nav>

        <header className="cfg-page-identity">
          <h1 id="cfg-page-title">{view.title}</h1>
          <span className="cfg-title-rule" aria-hidden="true" />
          <p className="cfg-page-status" data-complete={view.complete ? "true" : "false"}>
            {view.statusLabel}
          </p>
        </header>

        <nav
          className="cfg-rail"
          aria-label="Module de configurare"
          data-rail-mode={railMode}
          data-rail-count={view.scopes.length}
        >
          <div className="cfg-rail-line" aria-hidden="true" />
          {railMode === "distributed" ? (
            <div className="cfg-rail-ghosts" aria-hidden="true">
              {view.scopes.map((scope, index) => (
                <span key={scope.id} data-slot={configuratorRailSlot(index)} />
              ))}
            </div>
          ) : null}
          <div className="cfg-rail-items">
            {view.scopes.map((scope, index) => {
              const active = scope.id === view.activeScopeId;
              return (
                <button
                  key={scope.id}
                  type="button"
                  data-slot={configuratorRailSlot(index)}
                  className={active ? "cfg-rail-item is-active" : "cfg-rail-item"}
                  aria-current={active ? "true" : undefined}
                  onClick={() => onScopeChange(scope.id)}
                >
                  <span className="cfg-rail-mark">
                    <span className="cfg-rail-hug">
                      <span className="cfg-rail-text">{scope.label}</span>
                      {scope.complete ? (
                        <span className="cfg-section-check is-complete">
                          <span className="visually-hidden">Complet</span>
                          <span aria-hidden="true">✓</span>
                        </span>
                      ) : null}
                    </span>
                    <span className="cfg-rail-reserve" aria-hidden="true" />
                  </span>
                  <span className="cfg-rail-tick" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </nav>
      </div>

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
          </div>
          <div className="cfg-blueprint-body">
            {view.sections.map((section) => (
              <section
                key={section.id}
                className={
                  section.id === activeSectionId
                    ? "cfg-blueprint-section is-active"
                    : "cfg-blueprint-section"
                }
              >
                <h3>
                  <button
                    type="button"
                    className="cfg-blueprint-jump"
                    aria-current={section.id === activeSectionId ? "true" : undefined}
                    onClick={() => selectSection(section.id)}
                  >
                    <span>{section.label}</span>
                    {section.complete ? (
                      <span className="cfg-section-check">
                        <span className="visually-hidden">Complet</span>
                        <span aria-hidden="true">✓</span>
                      </span>
                    ) : null}
                  </button>
                </h3>
                <FactRows facts={section.facts} />
              </section>
            ))}
          </div>
        </aside>

        {composition ? (
          <div className="cfg-review">
            <p className="cfg-review-lead">
              Rezumat numai-citire al acestui produs. Nu se modifică aici.
            </p>
            <div className="cfg-composition">
              {view.compositionItems.map((item, index) => (
                <article
                  key={item.scopeId}
                  className={
                    item.complete
                      ? "cfg-composition-item is-complete"
                      : "cfg-composition-item"
                  }
                >
                  <div className="cfg-composition-head">
                    <div className="cfg-composition-title">
                      <span className="cfg-composition-dot" aria-hidden="true" />
                      <h3>
                        {index + 1}. {item.label}
                      </h3>
                    </div>
                    <button
                      type="button"
                      className="cfg-edit-link"
                      onClick={() => onScopeChange(item.scopeId)}
                    >
                      {item.editLabel}
                    </button>
                  </div>
                  {item.summary ? <p>{item.summary}</p> : null}
                  {!item.complete ? (
                    <p className="cfg-composition-gap" role="status">
                      Incomplet
                    </p>
                  ) : null}
                </article>
              ))}
              {view.complete ? (
                <p className="cfg-composition-complete" role="status">
                  <span className="cfg-composition-dot" aria-hidden="true" />
                  Configurare completă
                </p>
              ) : (
                <p className="cfg-composition-incomplete" role="status">
                  Acest produs rămâne incomplet până sunt complete modulele lui.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="cfg-editor">
            <div className="cfg-editor-accent" aria-hidden="true" />
            <header className="cfg-editor-head">
              <h2>{view.editorTitle}</h2>
              {mode === "review" ? (
                <p>Revizuiește configurația înainte de confirmare.</p>
              ) : view.editorLead ? (
                <p>{view.editorLead}</p>
              ) : null}
            </header>

            {notices}

            {mode === "review" ? (
              <>
                <div className="cfg-editor-body">
                  {view.editorSections.map((section) => {
                    const facts =
                      view.sections.find((item) => item.id === section.componentId)?.facts ?? [];
                    return (
                      <section key={section.id} className="cfg-editor-section">
                        <div className="cfg-section-kicker">
                          <span className="cfg-section-dash" aria-hidden="true" />
                          <h3>{section.label}</h3>
                        </div>
                        <FactRows facts={facts} />
                      </section>
                    );
                  })}
                  {reviewNote}
                </div>
                <div className="cfg-editor-actions">
                  <button
                    type="button"
                    className="cfg-modify"
                    onClick={() => retainPageScroll(() => onEdit?.())}
                    disabled={busy}
                  >
                    Modifică configurația
                  </button>
                  <div className="cfg-verify-slot">
                    <button
                      type="button"
                      className="cfg-verify"
                      onClick={() => retainPageScroll(() => onConfirm?.())}
                      disabled={busy || !onConfirm}
                    >
                      Confirmă configurația
                    </button>
                  </div>
                </div>
              </>
            ) : null}

            {editing && template && schema && values && onChange ? (
              <>
                <div className="cfg-editor-body">
                  {view.editorSections.map((section) => {
                    const identityFacts =
                      view.sections
                        .find((item) => item.id === section.componentId)
                        ?.facts.filter((fact) => fact.kind === "fixed") ?? [];
                    return (
                      <section key={section.id} className="cfg-editor-section">
                        <div className="cfg-section-kicker">
                          <span className="cfg-section-dash" aria-hidden="true" />
                          <h3
                            ref={(node) => {
                              editorHeadingRefs.current[section.componentId] = node;
                            }}
                            tabIndex={-1}
                          >
                            {section.label}
                          </h3>
                        </div>
                        {identityFacts.map((fact) => (
                          <p key={fact.id} className="cfg-fact-block">
                            {projectVisualLabel(fact.label)}: {fact.display}
                          </p>
                        ))}
                        <FormRenderer
                          template={template}
                          schema={schema}
                          values={values}
                          onChange={onChange}
                          includeComponentIds={[section.componentId]}
                          sectionTitleFor={() => ""}
                          presentation="configurator"
                          invalidFieldIds={invalidFieldIds}
                        />
                      </section>
                    );
                  })}
                </div>
                <div className="cfg-editor-actions">
                  {view.blueprintIncomplete && !showValidation ? (
                    <p className="cfg-incomplete-hint">
                      Completează câmpurile marcate cu *.
                    </p>
                  ) : null}
                  <div className="cfg-verify-slot">
                    <button
                      type="button"
                      className="cfg-verify"
                      onClick={() => retainPageScroll(() => onVerify?.())}
                      disabled={verifyDisabled}
                    >
                      Verifică configurația
                    </button>
                  </div>
                </div>
              </>
            ) : null}

          </div>
        )}
      </div>
    </section>
  );
}
