"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Send } from "lucide-react";
import { site } from "@/data/site";
import {
  buildInquiryWhatsAppUrl,
  EVENT_TYPE_OPTIONS,
  SERVICE_PLAN_OPTIONS,
  validateInquiry,
  type EventInquiry,
} from "@/lib/whatsapp";

/**
 * Formulario de consulta → WhatsApp.
 *
 * Sin backend: al enviar se abre wa.me con el mensaje estructurado de
 * lib/whatsapp.ts (plantilla fija del brief). Validación nativa HTML;
 * la fecha alternativa es opcional; los demás campos son obligatorios.
 */

const labelClasses =
  "block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory/60";

const fieldClasses =
  "mt-2 w-full border border-ivory/15 bg-ivory/5 px-4 py-3 font-sans text-sm text-ivory placeholder:text-ivory/35 outline-none transition-colors duration-300 focus:border-gold [color-scheme:dark]";

const initialForm: EventInquiry = {
  nombre: "",
  tipoEvento: "",
  fechaPrincipal: "",
  fechaAlternativa: "",
  personas: "",
  servicio: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<EventInquiry>(initialForm);
  const [conversationOpened, setConversationOpened] = useState(false);
  const [error, setError] = useState<string>();

  const update =
    (field: keyof EventInquiry) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setError(undefined);
      setConversationOpened(false);
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const validationError = validateInquiry(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    const url = buildInquiryWhatsAppUrl(form);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
    setConversationOpened(true);
  };

  return (
    <form onSubmit={handleSubmit} className="text-left" aria-describedby={error ? "consulta-error" : undefined}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="consulta-nombre" className={labelClasses}>
            Nombre y apellido
          </label>
          <input
            id="consulta-nombre"
            name="nombre"
            type="text"
            required
            autoComplete="name"
            placeholder="¿Cómo te llamás?"
            value={form.nombre}
            onChange={update("nombre")}
            className={fieldClasses}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="consulta-tipo" className={labelClasses}>
            Tipo de evento
          </label>
          <select
            id="consulta-tipo"
            name="tipoEvento"
            required
            value={form.tipoEvento}
            onChange={update("tipoEvento")}
            className={fieldClasses}
          >
            <option value="" disabled className="bg-carbon text-ivory/40">
              Seleccioná el tipo de evento…
            </option>
            {EVENT_TYPE_OPTIONS.map((option) => (
              <option
                key={option}
                value={option}
                className="bg-carbon text-ivory"
              >
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="consulta-fecha" className={labelClasses}>
            Fecha principal
          </label>
          <input
            id="consulta-fecha"
            name="fechaPrincipal"
            type="date"
            required
            value={form.fechaPrincipal}
            onChange={update("fechaPrincipal")}
            className={fieldClasses}
          />
        </div>

        <div>
          <label htmlFor="consulta-alternativa" className={labelClasses}>
            Fecha alternativa{" "}
            <span className="font-medium normal-case tracking-normal text-ivory/40">
              (opcional)
            </span>
          </label>
          <input
            id="consulta-alternativa"
            name="fechaAlternativa"
            type="date"
            value={form.fechaAlternativa}
            onChange={update("fechaAlternativa")}
            className={fieldClasses}
          />
        </div>

        <div>
          <label htmlFor="consulta-personas" className={labelClasses}>
            Cantidad estimada de invitados
          </label>
          <input
            id="consulta-personas"
            name="personas"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            required
            placeholder="Ej.: 120"
            value={form.personas}
            onChange={update("personas")}
            className={fieldClasses}
          />
        </div>

        <fieldset className="sm:col-span-2">
          <legend className={labelClasses}>Servicio</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {SERVICE_PLAN_OPTIONS.map((plan) => (
              <label
                key={plan}
                className="flex cursor-pointer items-start gap-3 border border-ivory/15 px-4 py-3.5 font-sans text-sm text-ivory transition-colors duration-300 has-[:checked]:border-gold has-[:checked]:bg-gold/10 hover:border-ivory/35"
              >
                <input
                  type="radio"
                  name="servicio"
                  value={plan}
                  required
                  checked={form.servicio === plan}
                  onChange={update("servicio")}
                  className="mt-1 accent-gold"
                />
                <span>{plan}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-3 bg-ivory px-7 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:bg-white"
        >
          <Send className="h-4 w-4" aria-hidden />
          Enviar consulta por WhatsApp
        </button>
        <p className="max-w-xs font-sans text-xs leading-relaxed text-ivory/45">
          Se abre WhatsApp con tu consulta cargada: solo tenés que enviarla.
        </p>
      </div>

      {error && (
        <p id="consulta-error" role="alert" className="mt-6 text-sm text-ivory">
          {error}
        </p>
      )}

      {conversationOpened && (
        <p
          role="status"
          className="mt-6 border border-gold/30 bg-gold/10 px-4 py-3 font-sans text-sm text-ivory"
        >
          Confirmá el envío en WhatsApp. Si no se abrió,{" "}
          <a href={buildInquiryWhatsAppUrl(form)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            abrí tu consulta nuevamente
          </a>{" "}
          al {site.contacts.primary.phoneDisplay}.
        </p>
      )}
    </form>
  );
}
