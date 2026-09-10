/**
 * Enlace de accesibilidad: primer elemento enfocable del documento.
 * Solo visible al recibir foco por teclado.
 */
export default function SkipLink() {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink focus:outline-2 focus:outline-offset-2 focus:outline-violet"
    >
      Saltar al contenido principal
    </a>
  );
}
