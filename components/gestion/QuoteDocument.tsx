import { quoteDocument } from "@/lib/presupuesto-documento";
import Image from "next/image";
import type { Quote, calculateQuote } from "@/lib/presupuestos";
import "./quote-document.css";

export default function QuoteDocument({ quote, result }: { quote: Quote; result: ReturnType<typeof calculateQuote> }) {
  const document = quoteDocument(quote, result);
  return <article className="quote-document">
    <header className="qd-header">
      <div className="qd-heading"><Image className="qd-logo" src={document.logo} alt="Salón de Eventos María Luisa" width={1254} height={1254} sizes="(max-width: 480px) 72px, 105px" /><div><p className="qd-brand">{document.name}</p><p className="qd-eyebrow">PRESUPUESTO</p></div></div>
      <h3>{document.event}</h3>
      {document.schedule && <p className="qd-schedule">{document.schedule}</p>}
    </header>
    <div className="qd-body">{document.sections.map((section) => <section key={section.title} className={`qd-section${section.quiet ? " qd-quiet" : ""}`}>
      <h4>{section.title}</h4>
      <table><tbody>{section.rows.map((row, index) => <tr key={index} className={`${row.monetary ? "qd-money" : ""}${row.total ? " qd-total" : ""}`}>
        {row.label ? <><th scope="row">{row.label}</th><td>{row.value}</td></> : <td colSpan={2}>{row.value}</td>}
      </tr>)}</tbody></table>
      {section.note && <p className="qd-note">{section.note}</p>}
    </section>)}</div>
    <footer className="qd-footer"><p>Presupuesto comercial · Importes en pesos argentinos</p></footer>
  </article>;
}
