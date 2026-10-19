import { brand } from "@/data/brand";
import { site } from "@/data/site";
import { calculateQuote, type Quote } from "@/lib/presupuestos";
import { QUOTE_LOGO, quoteDocument } from "@/lib/presupuesto-documento";

type PdfLogo = { hex: string; width: number; height: number };

/** Reutiliza el logo real; JPEG compacto embebido, sin servicios externos. */
export async function loadQuoteLogo(): Promise<PdfLogo> {
  const image = new Image();
  image.src = QUOTE_LOGO;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = 400; canvas.height = 400;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo preparar el logo.");
  context.drawImage(image, 0, 0, 400, 400);
  const bytes = atob(canvas.toDataURL("image/jpeg", 0.9).split(",")[1]);
  return { hex: Array.from(bytes, (char) => char.charCodeAt(0).toString(16).padStart(2, "0")).join(""), width: 400, height: 400 };
}

type Item = { kind: "section" | "text" | "row" | "total"; lines: string[]; values?: string[]; height: number; monetary?: boolean; quiet?: boolean; column?: boolean };

/** PDF A4 vectorial: datos temporales, paginación y enlace de ubicación. */
export function createQuotePdf(quote: Quote, logo?: PdfLogo): Blob {
  const result = calculateQuote(quote);
  const documentData = quoteDocument(quote, result);
  if (!result.valid) throw new Error("Completá los datos válidos del presupuesto.");
  const context = document.createElement("canvas").getContext("2d");
  if (!context) throw new Error("No se pudo preparar el PDF en este navegador.");
  const width = 595.28, height = 841.89, margin = 44, contentWidth = width - margin * 2;
  const special: Record<string, number> = { "€": 128, "‘": 145, "’": 146, "“": 147, "”": 148, "•": 149, "–": 150, "—": 151, "…": 133 };
  const encode = (value: string) => [...value.normalize("NFC")].map((char) => {
    const code = special[char] ?? char.charCodeAt(0);
    return `\\${(code <= 255 ? code : 63).toString(8).padStart(3, "0")}`;
  }).join("");
  const wrap = (value: string, maxWidth: number, size = 10, bold = false): string[] => {
    context.font = `${bold ? "bold " : ""}${size}px Arial`;
    const lines: string[] = [];
    for (const paragraph of value.replace(/\r/g, "").split("\n")) {
      let current = "";
      for (const word of paragraph.split(/\s+/)) {
        if (!word) continue;
        const pieces = context.measureText(word).width > maxWidth ? [...word] : [word];
        for (const piece of pieces) {
          const candidate = current + (piece === word && current ? " " : "") + piece;
          if (context.measureText(candidate).width > maxWidth && current) { lines.push(current); current = piece; }
          else current = candidate;
        }
      }
      lines.push(current);
    }
    return lines;
  };

  const eventLines = wrap(documentData.event, contentWidth, 25, true);
  const scheduleLines = documentData.schedule ? wrap(documentData.schedule, contentWidth, 10) : [];
  const firstTop = 139 + eventLines.length * 29 + scheduleLines.length * 14;
  const items: Item[] = [];
  const labelWidth = 157;
  for (const section of documentData.sections) {
    items.push({ kind: "section", lines: [section.title], height: section.quiet ? 26 : 33, quiet: section.quiet });
    for (const row of section.rows) {
      const size = section.quiet ? 9 : 10;
      const lines = row.label ? wrap(row.label, labelWidth - 20, size, true) : [];
      const values = wrap(row.value, row.label ? contentWidth - labelWidth - 20 : contentWidth - 20, size, !!row.monetary);
      // Fragmentar solamente filas que no cabrían en una página (observaciones largas).
      const count = Math.max(lines.length, values.length);
      for (let start = 0; start < count; start += 22) {
        const label = start === 0 ? lines.slice(0, 22) : [];
        const value = values.slice(start, start + 22);
        items.push({ kind: row.total ? "total" : "row", lines: label, values: value, column: !!row.label, monetary: row.monetary, quiet: section.quiet, height: Math.max(label.length, value.length) * 13 + (row.total ? 16 : section.quiet ? 4 : 12) });
      }
    }
    if (section.note) {
      const lines = wrap(section.note, contentWidth - 20, 8.5);
      items.push({ kind: "text", lines, height: lines.length * 12 + 5 });
    }
  }
  const groups: Item[][] = [];
  for (const item of items) {
    if (item.kind === "section" || !groups.length) groups.push([]);
    groups[groups.length - 1].push(item);
  }
  const top = (page: number) => page === 0 ? firstTop : 65;
  const bottom = height - 72;
  const sizeOf = (list: Item[]) => list.reduce((sum, item) => sum + item.height, 0);
  const pages: Item[][] = [[]];
  const remaining = () => bottom - top(pages.length - 1) - sizeOf(pages[pages.length - 1]);
  const ensure = (space: number) => {
    if (space > remaining() && pages[pages.length - 1].length) pages.push([]);
  };
  for (const group of groups) {
    // Mantener juntas las secciones cortas y acompañar cada título con contenido.
    if (sizeOf(group) <= 220) ensure(sizeOf(group));
    for (let index = 0; index < group.length; index++) {
      const item = group[index];
      const previousPageCount = pages.length;
      const attachedNote = group[index + 1]?.kind === "text" ? group[index + 1].height : 0;
      ensure(item.kind === "section" ? sizeOf(group.slice(index, index + 3)) : item.height + attachedNote);
      if (pages.length !== previousPageCount && index > 0 && item.kind !== "section") {
        pages[pages.length - 1].push({ ...group[0], lines: [`${group[0].lines[0]} (continuación)`] });
      }
      pages[pages.length - 1].push(item);
    }
  }
  // Evitar una última página casi vacía trasladando secciones completas.
  if (pages.length > 1) {
    const last = pages[pages.length - 1], previous = pages[pages.length - 2];
    while (sizeOf(last) < 180) {
      let index = previous.length - 1;
      while (index > 0 && previous[index].kind !== "section") index--;
      const section = previous.slice(index);
      if (index === 0 || sizeOf(previous) - sizeOf(section) < 200 || sizeOf(last) + sizeOf(section) > bottom - top(pages.length - 1)) break;
      last.unshift(...previous.splice(index));
    }
  }

  const streams: string[] = [];
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const commands: string[] = [];
    const text = (value: string, x: number, baseline: number, size = 10, font = "F1", color = "0.09 0.075 0.06") => {
      commands.push(`BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x.toFixed(2)} ${(height - baseline).toFixed(2)} Tm (${encode(value)}) Tj ET`);
    };
    const navy = "0.098 0.22 0.306", gold = "0.60 0.45 0.20", ink = "0.10 0.16 0.20";
    const rectangle = (x: number, y: number, w: number, h: number, fill: string) => commands.push(`${fill} rg ${x} ${height - y - h} ${w} ${h} re f`);
    const rule = (y: number, color = "0.77 0.82 0.85") => commands.push(`${color} RG 0.5 w ${margin} ${height - y} m ${width - margin} ${height - y} l S`);
    const centered = (value: string, y: number, size: number, font = "F1", color = navy) => {
      context.font = `${font === "F2" || font === "F3" ? "bold " : font === "F4" ? "italic " : ""}${size}px ${font === "F3" || font === "F4" ? "Times New Roman" : "Arial"}`;
      text(value, (width - context.measureText(value).width) / 2, y, size, font, color);
    };
    rectangle(0, 0, width, height, "1 0.992 0.973");
    if (pageIndex === 0) {
      rectangle(margin, 27, contentWidth, 3, navy);
      if (logo) commands.push(`q 72 0 0 72 ${margin} ${height - 107} cm /Logo Do Q`);
      else text(brand.monogram, margin, 65, 27, "F3", navy);
      text(documentData.name, margin + 92, 57, 12, "F2", navy);
      text("PRESUPUESTO", margin + 92, 91, 28, "F3", navy);
      rule(110, gold);
      eventLines.forEach((line, index) => centered(line, 139 + index * 29, 25, "F4", gold));
      scheduleLines.forEach((line, index) => centered(line, 139 + eventLines.length * 29 + index * 14, 10));
    } else {
      text(documentData.name, margin, 32, 12, "F2", navy);
      text("PRESUPUESTO · Continuación", width - margin - 155, 32, 9, "F1", navy);
      rule(44, gold);
    }
    let y = top(pageIndex);
    for (const item of pages[pageIndex]) {
      if (item.kind === "section") {
        if (item.quiet) {
          rectangle(margin, y + 6, 2, 14, gold);
          text(item.lines[0].toUpperCase(), margin + 10, y + 17, 9, "F2", navy);
        } else {
          rectangle(margin, y + 7, contentWidth, 26, navy);
          rectangle(margin, y + 7, 3, 26, gold);
          text(item.lines[0], margin + 12, y + 25, 17, "F4", "1 0.992 0.973");
        }
      } else if (item.kind === "text") item.lines.forEach((line, index) => text(line, margin + 10, y + 10 + index * 12, 8.5, "F1", "0.30 0.35 0.38"));
      else {
        const total = item.kind === "total", fontSize = total ? 12 : item.quiet ? 9 : 10;
        if (total) rectangle(margin, y, contentWidth, item.height, "0.94 0.90 0.83");
        else if (!item.quiet && item.column) rectangle(margin, y, labelWidth, item.height, "0.93 0.955 0.965");
        if (item.quiet) rectangle(margin, y, contentWidth, item.height, "0.96 0.95 0.93");
        for (let index = 0; index < Math.max(item.lines.length, item.values?.length ?? 0); index++) {
          const baseline = y + (total ? 19 : item.quiet ? 11 : 15) + index * 13;
          text(item.lines[index] ?? "", margin + 10, baseline, fontSize, "F2", ink);
          const value = item.values?.[index] ?? "";
          context.font = `${item.monetary ? "bold " : ""}${fontSize}px Arial`;
          const x = item.monetary ? width - margin - 10 - context.measureText(value).width : margin + (item.column ? labelWidth : 0) + 10;
          text(value, x, baseline, fontSize, item.monetary ? "F2" : "F1", ink);
        }
        if (!item.quiet) rule(y + item.height);
      }
      y += item.height;
    }
    const address = [site.address.street, site.address.reference, site.address.city, site.address.province, site.address.country].join(", ");
    commands.push(`0.6 G 0.4 w ${margin} 62 m ${width - margin} 62 l S`);
    wrap(address, contentWidth, 7.5).forEach((line, index) => text(line, margin, height - 49 + index * 10, 7.5));
    text("Ver ubicación en Google Maps", margin, height - 20, 7.5, "F1", "0.25 0.2 0.12");
    text("Importes en pesos argentinos", width - margin - 210, height - 20, 7);
    text(`${pageIndex + 1} / ${pages.length}`, width - margin - 30, height - 20, 8);
    streams.push(commands.join("\n"));
  }
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>", "",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic /Encoding /WinAnsiEncoding >>",
  ];
  const logoId = logo ? objects.length + 1 : undefined;
  if (logo) {
    const stream = `${logo.hex}>`;
    objects.push(`<< /Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  }
  const children: number[] = [];
  for (const stream of streams) {
    const pageId = objects.length + 1, streamId = pageId + 1, linkId = pageId + 2;
    children.push(pageId);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R /F4 6 0 R >> ${logoId ? `/XObject << /Logo ${logoId} 0 R >>` : ""} >> /Contents ${streamId} 0 R /Annots [${linkId} 0 R] >>`);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    objects.push(`<< /Type /Annot /Subtype /Link /Rect [${margin} 17 ${margin + 145} 30] /Border [0 0 0] /A << /S /URI /URI (${encode(site.mapsUrl)}) >> >>`);
  }
  objects[1] = `<< /Type /Pages /Count ${pages.length} /Kids [${children.map((id) => `${id} 0 R`).join(" ")}] >>`;
  // ASCII con caracteres escapados: offsets y longitudes exactos en bytes.
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}
