# Puesta en producción — Casa Kira

Guía operativa para publicar el sitio y dejar el dominio y el correo sanos.
Documento vivo: marcar cada casilla a medida que se completa.

## Estado actual (relevado el 2026-08-12)

- Dominio **casakira.com.ar**, registrado en **NIC Argentina**.
- Sitio y correo viven en el **mismo hosting cPanel** (webmail en el puerto 2095).
- Los registros **MX del dominio apuntan a ese cPanel** → sitio y mail están acoplados.
- Certificado TLS **vencido** (el sitio no abre por HTTPS).
- Casilla en uso: **casakirasrl@casakira.com.ar** (está en el sitio, en facturas y en manos de clientes).

## Objetivo

- Sitio en **Cloudflare Pages** (plan gratuito, **uso comercial permitido**, ancho de banda ilimitado para estáticos, TLS automático).
- Correo en **Zoho Mail** (~USD 1/casilla) o **Google Workspace** (más caro, suma Drive/Calendar/Meet).
- Dar de baja el cPanel viejo al final → probablemente se termine pagando menos que hoy.

## Principio rector

**Sitio y correo son dos migraciones independientes. No se hacen juntas.**
Primero se mueve el sitio dejando el correo intacto; después se migra el correo como
proyecto aparte. **Nada del hosting viejo se cancela hasta que las dos cosas estén
verificadas funcionando.**

---

## Prerrequisito bloqueante — arrancar YA

Lleva tiempo y frena todo lo demás, por eso va primero.

- [ ] Conseguir el **acceso a NIC Argentina** del titular del dominio (usuario/clave o CUIT del titular). En PyMEs de esta antigüedad suele estar a nombre de alguien que no trabaja más; destrabarlo lleva días.
- [ ] **Relevar el DNS actual completo** antes de tocar nada: registros **MX**, **TXT/SPF**, **DKIM**, y cualquier **subdominio** en uso (correo, webmail, algún panel). Guardar una copia.
- [ ] Conseguir el acceso al **panel del hosting cPanel** (para la migración IMAP del correo más adelante).

---

## Vía A — Sitio web (Cloudflare Pages)

No toca el correo en ningún paso.

- [x] Repo en GitHub con build reproducible (`npm run build`). — hecho
- [ ] Crear cuenta en **Cloudflare**.
- [ ] En **Pages**, conectar el repo `franfocaraccio/CasaKira`.
  - Framework preset: **Astro**
  - Build command: `npm run build`
  - Output directory: `dist`
  - (el sitio es Astro + React + Tailwind; genera estático en `dist/`)
- [ ] Verificar el deploy en la URL provisoria `*.pages.dev` (sin tocar el dominio todavía): navegar las 6 secciones, las 13 fichas, el toggle de tema y el menú mobile.
- [ ] **(Se completa en la Vía C)** apuntar el dominio.

---

## Vía B — Correo (Zoho Mail o Google Workspace)

Proyecto aparte, se hace con el correo viejo todavía activo.

- [ ] Elegir proveedor (recomendado **Zoho Mail** si sólo se necesita correo profesional).
- [ ] Crear la cuenta y **verificar la titularidad del dominio** (registro TXT que pide el proveedor).
- [ ] Recrear la casilla **casakirasrl@casakira.com.ar idéntica** (misma dirección, no una nueva).
- [ ] **Migrar el historial por IMAP** desde el cPanel: copiar todos los mails viejos a la casilla nueva. Si esto no se hace, el historial queda atrapado en el hosting viejo y se pierde al darlo de baja.
- [ ] Preparar los valores de **MX + SPF + DKIM + DMARC** del proveedor nuevo (los da el proveedor; copiar y pegar). Si SPF/DKIM quedan mal, los mails de Casa Kira caen en spam.

---

## Vía C — Cambio de DNS (donde las dos vías se encuentran)

Recién acá se tocan los nameservers. Necesita el acceso a NIC.ar del prerrequisito.

- [ ] Mover la administración de DNS a **Cloudflare**, **importando primero TODOS los registros actuales**, incluidos los MX que apuntan al cPanel. Así el sitio se puede publicar sin que el correo se entere.
- [ ] Apuntar el **dominio al sitio de Cloudflare Pages** (Vía A). Verificar `casakira.com.ar` por HTTPS.
- [ ] **Cuando la Vía B esté lista y verificada**, recién ahí **cambiar los MX** (y SPF/DKIM/DMARC) al proveedor de correo nuevo.
- [ ] Probar correo en las dos direcciones: enviar desde la casilla nueva y recibir un mail externo en ella.

---

## Cierre — sólo cuando A, B y C están verificadas

- [ ] Confirmar que sitio (HTTPS) y correo (enviar/recibir) funcionan por al menos unos días.
- [ ] **Dar de baja el hosting cPanel viejo.** Es el paso más caro si se hace antes de tiempo: no adelantarlo.
- [ ] El certificado TLS deja de ser un tema: Cloudflare lo emite y renueva solo.

---

## Pendiente de producto independiente de todo esto

- [ ] **Backend del formulario de contacto.** Hoy no envía nada. Opciones: una Pages Function de Cloudflare, un servicio tipo Formspree, o —lo más simple y probablemente lo que mejor convierte acá— que el formulario abra WhatsApp con los datos ya cargados, igual que las fichas de producto.

## Orden recomendado de ejecución

1. Prerrequisito (NIC.ar + relevar DNS) — arranca ya, es lento.
2. Vía A hasta `*.pages.dev` — seguro, no toca DNS ni correo.
3. Vía C: DNS a Cloudflare preservando todo + dominio al sitio.
4. Vía B: migración de correo como proyecto aparte.
5. Vía C: cambiar MX al correo nuevo y verificar.
6. Cierre: dar de baja el cPanel.
