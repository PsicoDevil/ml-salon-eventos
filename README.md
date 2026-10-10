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
definitivos de Hugo y de su hermano quedan pendientes de confirmación.
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
