import type { Metadata } from "next";
import QuoteBuilder from "@/components/gestion/QuoteBuilder";
import "@/components/gestion/quote-print.css";

export const metadata: Metadata = {
  title: "Generador de presupuestos",
  robots: { index: false, follow: false },
};

export default function PresupuestosPage() {
  return <QuoteBuilder />;
}
