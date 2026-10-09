"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { clearPlatformCredentials, savePlatformCredentials } from "@/generation/actions";

import { CloseIcon } from "./icons";

export function KeyModal({
  configured,
  onClose,
  onSaved,
  onCleared,
}: {
  configured: boolean;
  onClose: () => void;
  onSaved: () => void;
  onCleared: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [apiKey, setApiKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ref.current?.showModal();
    panelRef.current?.focus();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await savePlatformCredentials({ api_key: apiKey });
      onSaved();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo guardar la llave");
    } finally {
      setBusy(false);
    }
  }

  async function onClear() {
    setBusy(true);
    setError(null);
    try {
      await clearPlatformCredentials();
      setApiKey("");
      onCleared();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo quitar la llave");
    } finally {
      setBusy(false);
    }
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="ohf-keys-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div ref={panelRef} tabIndex={-1} className="ohf-dialog-panel ohf-keys-panel">
        <div className="ohf-keys-head">
          <div>
            <div id="ohf-keys-title" className="ohf-keys-title">
              Llave de API
            </div>
            <p className="ohf-keys-copy">
              {configured
                ? "Ya hay una llave guardada en este navegador. Escribe un nuevo par id:secret para reemplazarla."
                : "Pega tu llave de la plataforma con el formato id:secret. Se guarda en una cookie httpOnly de este navegador y solo se envía a la plataforma al generar."}
            </p>
          </div>
          <button type="button" className="ohf-icon-btn" aria-label="Cerrar" onClick={onClose}>
            <CloseIcon size={13} />
          </button>
        </div>

        <form className="ohf-keys-form" onSubmit={(event) => void onSubmit(event)}>
          <label className="ohf-field">
            <div className="ohf-field-label">Llave de API</div>
            <input
              className="ohf-input ohf-input--mono"
              name="api_key"
              type="password"
              autoComplete="off"
              spellCheck={false}
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
          </label>

          {error && (
            <div className="ohf-alert" role="alert">
              <span className="ohf-alert-text">{error}</span>
            </div>
          )}

          <div className="ohf-keys-actions">
            {configured && (
              <button type="button" className="ohf-btn-quiet" disabled={busy} onClick={() => void onClear()}>
                Quitar llave
              </button>
            )}
            <button type="submit" className="ohf-keys-save" disabled={busy || !apiKey.trim()}>
              {busy ? "Guardando…" : configured ? "Reemplazar llave" : "Guardar llave"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}