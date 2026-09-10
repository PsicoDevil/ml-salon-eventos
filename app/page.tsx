import Corporativo from "@/components/home/Corporativo";
import CtaFinal from "@/components/home/CtaFinal";
import ElEspacio from "@/components/home/ElEspacio";
import ElMomento from "@/components/home/ElMomento";
import Eventos from "@/components/home/Eventos";
import Experiencias from "@/components/home/Experiencias";
import GaleriaPreview from "@/components/home/GaleriaPreview";
import Hero from "@/components/home/Hero";
import Ubicacion from "@/components/home/Ubicacion";

/**
 * Home — rediseño V3: calidad visual, branding y UX premium.
 * Recorrido: Hero → El Momento → Eventos (interactivo) → El Espacio
 * → Experiencias → Galería → Corporativo → Ubicación → CTA final.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ElMomento />
      <Eventos />
      <ElEspacio />
      <Experiencias />
      <GaleriaPreview />
      <Corporativo />
      <Ubicacion />
      <CtaFinal />
    </>
  );
}

