import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SkipLink from "@/components/layout/SkipLink";
import MotionProvider from "@/components/motion/MotionProvider";
import { buildBaseMetadata } from "@/lib/seo";

/* Display: Cormorant Garamond — serif editorial de alto contraste. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

/* Texto/UI: Manrope — sans moderna, alta legibilidad (fuente variable). */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = buildBaseMetadata();

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${cormorant.variable} ${manrope.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-ivory font-sans text-ink antialiased">
        <MotionProvider>
          <SkipLink />
          <Header />
          <main
            id="contenido"
            tabIndex={-1}
            className="flex-1 focus:outline-none"
          >
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}

