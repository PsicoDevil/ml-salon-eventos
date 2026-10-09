import AireLibre from "@/components/home/AireLibre";
import Catering from "@/components/home/Catering";
import Contacto from "@/components/home/Contacto";
import Corporativo from "@/components/home/Corporativo";
import CtaFinal from "@/components/home/CtaFinal";
import ElEspacio from "@/components/home/ElEspacio";
import ElMomento from "@/components/home/ElMomento";
import Entretenimiento from "@/components/home/Entretenimiento";
import Eventos from "@/components/home/Eventos";
import Experiencias from "@/components/home/Experiencias";
import FiestasDe15 from "@/components/home/FiestasDe15";
import GaleriaPreview from "@/components/home/GaleriaPreview";
import Hero from "@/components/home/Hero";
import Servicios from "@/components/home/Servicios";
import Ubicacion from "@/components/home/Ubicacion";

/**
 * Home — recorrido del brief (18 puntos) sobre el rediseño V3:
 * Hero → El Momento → Fiestas de 15 (insignia) → Eventos (7 ocasiones)
 * → El Espacio → Experiencias → Aire Libre (diurno) → Servicios (planes)
 * → Catering → Entretenimiento → Galería → Corporativo → Ubicación
 * → Contacto (formulario → WhatsApp) → CTA final.
 *
 * Anclas de navegación (data/navigation.ts): #fiestas-de-15, #eventos,
 * #servicios y #contacto.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ElMomento />
      <FiestasDe15 />
      <Eventos />
      <ElEspacio />
      <Experiencias />
      <AireLibre />
      <Servicios />
      <Catering />
      <Entretenimiento />
      <GaleriaPreview />
      <Corporativo />
      <Ubicacion />
      <Contacto />
      <CtaFinal />
    </>
  );
}

