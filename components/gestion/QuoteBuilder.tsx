"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Container from "@/components/ui/Container";
import QuoteDocument from "@/components/gestion/QuoteDocument";
import { planes } from "@/data/servicios";
import { EVENT_TYPE_OPTIONS, buildRecipientlessWhatsAppUrl } from "@/lib/whatsapp";
import { calculateQuote, cardsExplanation, emptyQuote, money, quoteEconomicRows, quoteMessage, type Quote } from "@/lib/presupuestos";

const fieldClass = "mt-2 block min-h-12 w-full min-w-0 border border-ink/25 bg-white/60 px-3 py-3 text-base text-ink outline-none focus:border-gold";
const actionClass = "inline-flex min-h-12 items-center justify-center border border-gold/50 bg-carbon px-5 py-3 text-center text-sm font-semibold text-ivory transition-colors hover:bg-carbon-2 disabled:cursor-not-allowed disabled:opacity-50";

function Group({ title, children, open = false }: { title: string; children: ReactNode; open?: boolean }) {
  return <details open={open} className="border border-ink/15 bg-ivory p-5 sm:p-7"><summary className="cursor-pointer py-1 font-display text-2xl font-medium">{title}</summary><div className="mt-6 grid min-w-0 gap-5 sm:grid-cols-2">{children}</div></details>;
}

export default function QuoteBuilder() {
  const [quote, setQuote] = useState<Quote>(emptyQuote);
  const [attempted, setAttempted] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>();
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const revision = useRef(0);
  const result = calculateQuote(quote);
  const preparedMessage = message ?? quoteMessage(quote, result);

  useEffect(() => () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); }, [pdfUrl]);

  const change = (key: keyof Quote, value: string) => {
    revision.current++;
    setQuote((current) => ({ ...current, [key]: value,
      // El cero inicial significa «sin cargo separado» al cotizar tarjetas.
      // Al elegir solo servicio, pedir su precio en lugar de asumir que es gratis.
      ...(key === "cardsMode" && value === "none" && current.serviceAmount === "0" ? { serviceAmount: "" } : {}),
      ...(key === "cardsMode" && value !== "none" && !current.serviceAmount.trim() ? { serviceAmount: "0" } : {}),
    }));
    setPdfUrl(undefined); setMessage(null); setStatus("");
  };
  const changeExtra = (index: number, key: "selected" | "name" | "amount", value: string | boolean) => {
    revision.current++;
    setQuote((current) => ({ ...current, extras: current.extras.map((extra, i) => i === index ? { ...extra, [key]: value } : extra) }));
    setPdfUrl(undefined); setMessage(null); setStatus("");
  };
  const field = (key: Exclude<keyof Quote, "extras">, label: string, options: { type?: string; required?: boolean; multiline?: boolean; hint?: string; numeric?: boolean; full?: boolean; maxLength?: number } = {}) => {
    const error = attempted ? result.errors[key] : undefined;
    const props = { id: `quote-${key}`, name: key, value: quote[key], onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => change(key, event.target.value), className: fieldClass, "aria-invalid": !!error, "aria-describedby": error ? `error-${key}` : options.hint ? `hint-${key}` : undefined, required: options.required, maxLength: options.maxLength ?? (options.multiline ? 4000 : 120) };
    return <div className={`min-w-0 ${options.full ? "sm:col-span-2" : ""}`}><label htmlFor={props.id} className="text-sm font-semibold">{label}{options.required ? " *" : ""}</label>{options.multiline ? <textarea {...props} rows={3} /> : <input {...props} type={options.type ?? "text"} inputMode={options.numeric ? "decimal" : key === "guests" || key === "cardsQuantity" ? "numeric" : undefined} autoComplete="off" />}{options.hint && <p id={`hint-${key}`} className="mt-2 text-xs leading-relaxed text-ink/65">{options.hint}</p>}{error && <p id={`error-${key}`} className="mt-2 text-sm text-red-800">{error}</p>}</div>;
  };
  const validate = () => {
    setAttempted(true);
    if (!result.valid) {
      document.querySelectorAll<HTMLDetailsElement>('[role="form"] details').forEach((section) => { section.open = true; });
      setStatus("Revisá los campos señalados para corregirlos.");
      return false;
    }
    return true;
  };
  const makeFile = async () => {
    const { createQuotePdf, loadQuoteLogo } = await import("@/lib/presupuesto-pdf");
    const logo = await loadQuoteLogo();
    return new File([createQuotePdf(quote, logo)], "presupuesto-ml.pdf", { type: "application/pdf" });
  };
  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file), anchor = document.createElement("a");
    anchor.href = url; anchor.download = file.name; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };
  const preparePdf = async (download = false) => {
    if (!validate()) return;
    const startedAt = revision.current;
    setBusy(true);
    try {
      const file = await makeFile();
      if (revision.current !== startedAt) { setStatus("Los datos cambiaron. Prepará nuevamente el PDF actualizado."); return; }
      setPdfUrl(URL.createObjectURL(file));
      if (download) downloadFile(file);
      setStatus(download ? "PDF preparado para descargar." : "Vista previa del PDF lista. Podés seguir editando.");
    }
    catch { setStatus("No se pudo preparar el PDF. Volvé a intentarlo."); }
    finally { setBusy(false); }
  };
  const shareFile = async () => {
    if (!validate()) return;
    const startedAt = revision.current;
    setBusy(true);
    try {
      const file = await makeFile();
      if (revision.current !== startedAt) { setStatus("Los datos cambiaron. Prepará nuevamente el presupuesto actualizado."); return; }
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({ files: [file], title: "Presupuesto", text: preparedMessage });
        setStatus("Se abrió el selector para compartir. Elegí el destino y confirmá el envío.");
      } else {
        downloadFile(file);
        window.open(buildRecipientlessWhatsAppUrl(preparedMessage), "_blank", "noopener,noreferrer");
        setStatus("PDF preparado para descargar. Se solicitó abrir WhatsApp: elegí el destinatario y adjuntá el archivo manualmente. Si no se abrió, usá «Abrir WhatsApp con este mensaje».");
      }
    } catch (error) { setStatus(error instanceof DOMException && error.name === "AbortError" ? "Compartir cancelado. Podés volver a intentarlo." : "No se pudo compartir el archivo. Usá «Descargar PDF» y adjuntalo manualmente en WhatsApp."); }
    finally { setBusy(false); }
  };

  return <section className="quote-builder bg-ivory-2 pb-20 pt-32 sm:pt-40" data-valid={result.valid}><Container>
    <div className="quote-noprint">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet">Gestión de presupuestos</p>
    <h1 className="mt-4 font-display text-4xl sm:text-5xl">Una propuesta, a medida.</h1>
    <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink/75">Completá los datos, revisá el desglose y prepará el PDF. Los campos con * son obligatorios. Los importes se expresan en pesos argentinos.</p>
    <p className="mt-4 max-w-2xl text-xs leading-relaxed text-ink/65">Esta herramienta no solicita contraseña: cualquiera que conozca su dirección puede abrirla. Los datos solo permanecen en esta pestaña y se pierden al recargar o cerrarla.</p>
    </div>

    <div className="quote-noprint sticky top-20 z-20 mt-6 flex flex-wrap items-center justify-between gap-2 border border-gold/40 bg-carbon p-4 text-sm text-ivory lg:hidden"><span>Total del borrador</span><strong>{result.amountsReady ? money(result.total) : "Importes pendientes"}</strong><a href="#quote-preview" className="inline-flex min-h-11 items-center underline underline-offset-4">Ver detalle</a></div>
    <div className="quote-noprint mt-10 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div role="form" aria-label="Datos del presupuesto" className="min-w-0 space-y-5">
        <Group title="1. Cliente y evento" open>
          {field("client", "Nombre del cliente", { required: true })}
          <div className="min-w-0"><label htmlFor="quote-event" className="text-sm font-semibold">Tipo de evento *</label><input id="quote-event" name="event" list="event-options" value={quote.event} onChange={(e) => change("event", e.target.value)} maxLength={120} required className={fieldClass} aria-invalid={attempted && !!result.errors.event} /><datalist id="event-options">{EVENT_TYPE_OPTIONS.map((item) => <option key={item} value={item} />)}</datalist>{attempted && result.errors.event && <p className="mt-2 text-sm text-red-800">{result.errors.event}</p>}</div>
          {field("date", "Fecha del evento", { type: "date", required: true })}
          {field("time", "Horario (opcional)", { hint: "Podés indicar una franja horaria." })}
        </Group>
        <Group title="2. Cómo calcular el presupuesto" open>
          <fieldset className="min-w-0 space-y-3 sm:col-span-2"><legend className="mb-3 text-sm font-semibold">Elegí una forma de calcular</legend>{[
            { value: "calculated", label: "Calcular cantidad × precio por tarjeta", hint: "Para tarjetas que abonan el valor completo." },
            { value: "agreed", label: "Usar un total de tarjetas acordado", hint: "Para un importe cerrado, por ejemplo si hay distintas tarifas." },
            { value: "none", label: "Presupuestar solo el servicio, sin tarjetas", hint: "Cargá el importe del servicio en el siguiente bloque." },
          ].map((mode) => <label key={mode.value} className={`flex cursor-pointer items-start gap-3 border p-4 ${quote.cardsMode === mode.value ? "border-gold bg-white/70" : "border-ink/15"}`}><input type="radio" name="cards-mode" value={mode.value} checked={quote.cardsMode === mode.value} onChange={() => change("cardsMode", mode.value)} className="mt-1 h-5 w-5 shrink-0 accent-violet" /><span><span className="block text-sm font-semibold">{mode.label}</span><span className="mt-1 block text-xs leading-relaxed text-ink/70">{mode.hint}</span></span></label>)}</fieldset>
          {field("guests", "Cantidad de invitados (opcional)", { hint: "Dato del evento; no se usa automáticamente como cantidad de tarjetas.", full: true })}
          {quote.cardsMode === "calculated" && <>
            {field("cardsQuantity", "Cantidad de tarjetas a valor completo", { required: true, hint: "Ingresá la cantidad a cotizar con este precio. No se asumen edades ni descuentos." })}
            {field("ticket", "Precio por tarjeta", { required: true, numeric: true })}
            <p className="text-xs leading-relaxed text-ink/70 sm:col-span-2">Si el grupo combina tarjetas completas, medias tarjetas o invitados que no pagan, usá «Total de tarjetas acordado» e ingresá el importe correspondiente. La política de edades figura en el presupuesto.</p>
          </>}
          {quote.cardsMode === "agreed" && <>
            {field("cardsAmount", "Importe total de tarjetas acordado", { numeric: true, required: true, full: true, hint: "Este es el único importe de tarjetas que se suma al presupuesto." })}
            {field("ticket", "Precio unitario de referencia (opcional)", { numeric: true, full: true, hint: "Solo informativo en esta modalidad. No se multiplica ni se suma por separado." })}
          </>}
          <div aria-live="polite" className="border-l-2 border-gold bg-white/60 p-4 text-sm leading-relaxed sm:col-span-2"><p className="font-semibold">{cardsExplanation(quote, result)}</p><p className="mt-2 text-xs">Total final = tarjetas + importe separado del servicio + adicionales − descuento. Se actualiza al escribir.</p></div>
        </Group>
        <Group title="3. Servicio y adicionales" open>
          <div className="min-w-0 sm:col-span-2"><label htmlFor="quote-service" className="text-sm font-semibold">Servicio contratado *</label><select id="quote-service" value={quote.service} onChange={(e) => change("service", e.target.value)} className={fieldClass} required aria-invalid={attempted && !!result.errors.service}><option value="">Seleccioná un servicio</option>{planes.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}</select>{attempted && result.errors.service && <p className="mt-2 text-sm text-red-800">{result.errors.service}</p>}</div>
          {field("serviceAmount", "Importe separado del servicio", { numeric: true, full: true, required: true, hint: "Dejá 0 si el servicio ya está cubierto por las tarjetas. Si cotizás sin tarjetas, cargá aquí el precio del servicio. Solo se suma una vez." })}
          <fieldset className="min-w-0 space-y-4 sm:col-span-2"><legend className="mb-4 text-sm font-semibold">Adicionales con costo extra</legend>{quote.extras.map((extra, index) => <div key={extra.id} className="border border-ink/15 p-4"><label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={extra.selected} onChange={(e) => changeExtra(index, "selected", e.target.checked)} className="h-5 w-5 accent-violet" />{extra.name || "Adicional"}</label>{extra.selected && <div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-2"><div className="min-w-0"><label htmlFor={`${extra.id}-name`} className="text-sm">Descripción editable</label><input id={`${extra.id}-name`} value={extra.name} onChange={(e) => changeExtra(index, "name", e.target.value)} maxLength={200} className={fieldClass} aria-invalid={attempted && !!result.errors[`${extra.id}-name`]} />{attempted && result.errors[`${extra.id}-name`] && <p className="mt-2 text-sm text-red-800">{result.errors[`${extra.id}-name`]}</p>}</div><div className="min-w-0"><label htmlFor={`${extra.id}-amount`} className="text-sm">Importe manual *</label><input id={`${extra.id}-amount`} inputMode="decimal" value={extra.amount} onChange={(e) => changeExtra(index, "amount", e.target.value)} className={fieldClass} aria-invalid={attempted && !!result.errors[`${extra.id}-amount`]} />{attempted && result.errors[`${extra.id}-amount`] && <p className="mt-2 text-sm text-red-800">{result.errors[`${extra.id}-amount`]}</p>}</div></div>}</div>)}</fieldset>
          {field("discount", "Descuento manual (opcional)", { numeric: true, full: true })}
        </Group>
        <Group title="4. Condiciones y observaciones">
          {field("payment", "Condiciones de pago (opcional)", { multiline: true, full: true })}
          {field("validity", "Vigencia del presupuesto (opcional)", { full: true })}
          {field("notes", "Observaciones (opcional)", { multiline: true, full: true })}
        </Group>
        {attempted && !result.valid && <div role="alert" className="border border-red-800/25 bg-white/50 p-4 text-sm text-red-800"><p>Revisá los siguientes datos:</p><ul className="mt-2 list-inside list-disc">{Object.keys(result.errors).map((key) => <li key={key}>{({ client: "Cliente", event: "Tipo de evento", date: "Fecha", service: "Servicio", guests: "Invitados", cardsAmount: "Importe total de tarjetas", ticket: "Precio de tarjeta", discount: "Descuento", serviceAmount: "Importe del servicio", total: "Total" } as Record<string, string>)[key] ?? "Descripción o importe de un adicional"}: {result.errors[key]}</li>)}</ul></div>}
        <button type="button" onClick={() => void preparePdf()} disabled={busy} className={`${actionClass} w-full`}>{busy ? "Preparando…" : "Preparar vista previa del PDF"}</button>
      </div>
      <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <div className="border border-gold/40 bg-carbon p-6 text-ivory">
          <h2 className="font-display text-3xl">Resumen del presupuesto</h2><p className="mt-4 text-sm leading-relaxed text-ivory/80">{cardsExplanation(quote, result)}</p>
          <dl className="mt-6 space-y-3 text-sm">
            {quoteEconomicRows(result).map((item) => <div key={item.key} className="flex flex-wrap justify-between gap-2"><dt>{item.label}</dt><dd className="font-semibold">{item.pending ? "Pendiente" : money(item.amount)}</dd></div>)}
          </dl><div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-gold/40 pt-5 text-xl"><span>Total final</span><strong data-testid="quote-total">{result.amountsReady ? money(result.total) : "Importes pendientes"}</strong></div>
          {!result.valid && <div className="mt-4 border-t border-ivory/20 pt-4 text-sm"><p className="font-semibold">Para generar el PDF, falta completar o corregir:</p><ul className="mt-2 list-inside list-disc space-y-2">{Object.entries(result.errors).map(([key, error]) => <li key={key}>{({ client: "Nombre del cliente", event: "Tipo de evento", date: "Fecha del evento", service: "Servicio contratado", guests: "Cantidad de invitados", cardsQuantity: "Cantidad de tarjetas", ticket: "Precio por tarjeta", cardsAmount: "Total acordado de tarjetas", serviceAmount: "Importe separado del servicio" } as Record<string, string>)[key] ?? error}</li>)}</ul></div>}
        </div>
        <p role="status" aria-live="polite" className="mt-4 text-sm leading-relaxed">{status}</p>
      </aside>
    </div>

    <section aria-labelledby="quote-preview" className="quote-preview-section mt-14 min-w-0">
      <h2 id="quote-preview" className="quote-noprint scroll-mt-48 font-display text-3xl">Vista previa del presupuesto</h2>
      <p className="quote-noprint mt-3 text-sm text-ink/65">El detalle se actualiza al editar los datos. Revisalo antes de descargar o imprimir; si modificás algo, prepará nuevamente la vista del PDF.</p>
      {!result.valid && <p className="quote-noprint mt-3 text-sm font-semibold text-ink/75">Borrador incompleto: completá los datos y los importes para descargarlo o imprimirlo.</p>}
      <p className="quote-print-warning">Presupuesto incompleto. Completá los datos y los importes antes de imprimir.</p>
      <QuoteDocument quote={quote} result={result} />
      {pdfUrl && <div className="quote-noprint mt-6"><p className="mb-3 text-sm">Documento generado en A4. Si el visor de tu teléfono no lo muestra, abrí o descargá el archivo.</p><a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4">Abrir PDF generado</a><iframe title="Vista previa PDF A4" src={pdfUrl} className="mt-4 h-[65vh] w-full max-w-4xl border border-ink/15" /></div>}
      <div className="quote-noprint mt-6 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => void preparePdf(true)} disabled={busy || !result.valid} className={actionClass}>Descargar PDF</button><button type="button" onClick={() => { if (validate()) window.print(); }} disabled={busy || !result.valid} className={actionClass}>Imprimir presupuesto</button><button type="button" onClick={() => void shareFile()} disabled={busy || !result.valid} className={actionClass}>Compartir PDF desde el dispositivo</button></div>
    </section>
    <section className="quote-noprint mt-10 max-w-4xl border border-gold/40 p-5 sm:p-7" aria-labelledby="quote-share"><h2 id="quote-share" className="font-display text-3xl">Compartir por WhatsApp</h2><label htmlFor="quote-message" className="mt-5 block text-sm font-semibold">Revisá o editá el mensaje antes de abrir WhatsApp</label><textarea id="quote-message" value={preparedMessage} onChange={(e) => setMessage(e.target.value)} rows={7} maxLength={4000} className={fieldClass} /><p className="mt-3 text-sm leading-relaxed text-ink/70">Elegís el destinatario en WhatsApp y confirmás el envío allí. El PDF no se adjunta automáticamente: descargalo y adjuntalo, o compartilo con el selector del dispositivo si está disponible.</p>{result.valid && preparedMessage.trim() ? <a href={buildRecipientlessWhatsAppUrl(preparedMessage)} target="_blank" rel="noopener noreferrer" className={`${actionClass} mt-5`}>Abrir WhatsApp con este mensaje</a> : <p className="mt-4 text-sm">Completá el presupuesto para habilitar el enlace de WhatsApp.</p>}</section>
  </Container></section>;
}
