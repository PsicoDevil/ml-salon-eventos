This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## WhatsApp de ML: operación manual

El número temporal `5493834037325` se configura únicamente en
`data/site.ts`, en `contacts.primary.whatsappNumber`. Los teléfonos
confirmados de Hugo y Walter se muestran solo en el footer; su publicación
no cambia el destinatario temporal de WhatsApp.
Los mensajes del flotante, los iconos sociales y el formulario se generan
en `lib/whatsapp.ts`. La web abre una conversación; el visitante confirma
y envía el mensaje desde WhatsApp.

Las siguientes plantillas se transcriben del brief recibido. Son respuestas
para uso manual de Hugo, por ejemplo como respuestas rápidas de WhatsApp
Business; la web no las envía ni las presenta como respuestas automáticas.

### A. Consulta con datos del formulario

```text
¡Hola, [Nombre]! ¿Cómo estás?

¡Muchas gracias por escribirnos y por elegir ML Salón de Eventos para tu celebración!

Recibimos tu consulta para un evento de [tipo de evento], previsto para el [fecha principal], con aproximadamente [cantidad] invitados.

Nos comentaste que te interesa [servicio elegido]. Vamos a revisar la disponibilidad de la fecha y las opciones correspondientes para poder orientarte con el presupuesto.

Si la fecha principal no estuviera disponible, también podemos revisar la alternativa que nos indicaste: [fecha alternativa].

En cuanto tengamos la información, te respondemos por acá.

¡Gracias por contactarnos!
```

Si no hay fecha alternativa, eliminar la frase correspondiente.
No confirmar disponibilidad ni precios hasta verificarlos.

### B. Consulta directa sin formulario

```text
¡Hola! ¿Cómo estás? Gracias por comunicarte con ML Salón de Eventos.

¡Con gusto te asesoramos!

Para poder orientarte, contanos:
• ¿Qué tipo de evento querés realizar?
• ¿Qué fecha tenés en mente?
• ¿Cuántos invitados aproximadamente serían?
• ¿Te interesa el Servicio Salón o la Experiencia María Luisa?

Con esos datos podemos revisar tu consulta y orientarte sobre las opciones disponibles.

¡Te leemos!
```

## Generador operativo de presupuestos

Acceso directo: `/gestion/presupuestos`. No aparece en la navegación pública ni en el sitemap. Tiene `noindex` y se excluye en robots; estas medidas no son control de acceso. No tiene autenticación: cualquier persona que conozca o descubra la URL puede abrirla. No colocar secretos en el código cliente.

Los datos se mantienen solamente en el estado React de la pestaña. No se envían al servidor, no hay backend de presupuestos, base de datos, cookies, localStorage ni recuperación de borradores. Recargar o cerrar descarta el formulario. Los PDF que el usuario descargue o comparta sí quedan bajo el control del dispositivo o de la aplicación de destino.

1. Completar cliente, evento, servicio y datos de tarjetas. El nombre comercial es siempre **MARÍA LUISA**, centralizado en `data/brand.ts`: no se solicita ni se puede editar. Los precios de tarjetas y los datos personales empiezan vacíos. El importe separado del servicio comienza en 0: representa que no se agrega un cargo distinto de las tarjetas.
2. Elegir la modalidad: cantidad de tarjetas a valor completo × precio unitario; total de tarjetas acordado; o solo servicio, sin tarjetas. La cantidad general de invitados es informativa y no sustituye la cantidad explícita de tarjetas. En modo acordado, el precio unitario es solo referencia y el importe manual prevalece. No hay campos ni cálculos por edades: para grupos con distintas tarifas, cargar el total acordado. La política se incluye como aclaración fija.
3. Elegir el servicio contratado (visible sin desplegar otro bloque). Cargar su importe separado solo si corresponde; dejar 0 si ya está cubierto por las tarjetas. Se suman una sola vez tarjetas, servicio y adicionales, y se resta una sola vez el descuento manual. No se admite un descuento mayor al subtotal. Los cálculos usan centavos enteros. La fórmula activa y los campos faltantes se muestran en pantalla; cambiar de modalidad no suma valores de la modalidad anterior.
4. Revisar el borrador y pulsar «Preparar vista previa del PDF». El documento A4 incluye la política de edades y solo incorpora pago, vigencia y observaciones si se completaron. Se pagina automáticamente; cualquier edición invalida la vista PDF anterior.
5. Descargar PDF o usar «Imprimir presupuesto» para imprimir solo el documento, con estilos A4 en blanco y negro. El PDF incluye enlaces a Google Maps. La impresión de un presupuesto incompleto queda bloqueada.
6. Para compartir, revisar el mensaje con cliente, evento, fecha, invitados (si se indicaron) y total. Abrir WhatsApp sin destinatario prefijado o usar el selector nativo de archivos cuando el navegador lo admita. Si no admite compartir archivos, se descarga el PDF y se solicita abrir WhatsApp para adjuntarlo manualmente; si se bloquea la apertura, queda disponible el enlace explícito. No se envían mensajes ni se adjuntan archivos automáticamente. La disponibilidad real de Web Share depende del navegador, HTTPS y de las aplicaciones del dispositivo.

El PDF vectorial se genera en el cliente, sin librerías nuevas ni servicios remotos. Incluye el logo dorado proporcionado por el usuario (`public/images/brand/maria-luisa-logo.png`), el nombre fijo MARÍA LUISA, tipografía PDF estándar y tonos marfil/azul/dorado. El logo se incorpora como imagen compacta en el PDF; los textos y tablas siguen siendo vectoriales. Los datos e importes de documentos de referencia no se precargan como valores comerciales.

Datos comerciales pendientes: opciones concretas del plato principal, precios, condiciones de pago y vigencia (estos últimos se ingresan por presupuesto). Robot o espejo mágico requiere confirmar disponibilidad. Los nuevos teléfonos de Hugo y Walter se muestran solo en el footer y no sustituyen el destinatario temporal de WhatsApp de la web pública.

Comprobación de la lógica sin dependencias adicionales: `node scripts/check-presupuestos.mjs`.
