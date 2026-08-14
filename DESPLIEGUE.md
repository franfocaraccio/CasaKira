# Puesta en producción — Casa Kira

Guía operativa para publicar el sitio en Cloudflare Pages y mudar el correo a Zoho
sin cortar nada. Documento vivo: marcar cada casilla a medida que se completa.

## Estado actual

- Dominio **casakira.com.ar**, registrado en **NIC Argentina**.
- Acceso a NIC por **TAD** (CUIT + Clave Fiscal nivel 2): organismo *NIC Argentina* →
  *Operaciones sobre dominios* → **Delegación de DNS**. — conseguido
- Sitio y correo viven en el **mismo hosting** (proveedor **wiroos**, servidor
  `wo50.wiroos.host`, panel cPanel, webmail en el puerto 2095).
- **No hay acceso al panel del hosting.** No hace falta para mover el DNS: la delegación se
  cambia en TAD. Sí condiciona tres cosas — ver Fase 0, Fase 2 (TTL) y Fase 5 (la baja).
- Certificado TLS **vencido** (el sitio no abre por HTTPS).
- Casilla en uso: **casakirasrl@casakira.com.ar** (está en el sitio, en facturas y en
  manos de clientes).

### DNS relevado el 2026-08-14 (consultado contra 1.1.1.1)

| Registro | Valor |
|---|---|
| NS | `ns1.wiroos.com`, `ns2.wiroos.com` |
| A `casakira.com.ar` | `149.56.87.21` |
| CNAME `www` | → `casakira.com.ar` |
| **MX** | **→ `casakira.com.ar`, prioridad 0** |
| CNAME `mail` | → `casakira.com.ar` |
| A `webmail`, `cpanel`, `ftp` | `149.56.87.21` |
| TXT SPF | `v=spf1 ip4:192.95.22.212 ip4:62.210.31.59 ip4:163.172.113.163 include:spf-a1.wo50.wiroos.host ~all` |
| TXT `default._domainkey` | DKIM de wiroos (RSA) |
| TXT `_dmarc` | `v=DMARC1; p=none` |

> **El MX apunta al apex, no a un host propio.** O sea: el correo se entrega a la misma
> IP que sirve el sitio. Si se mueve el registro A del apex a Cloudflare Pages sin tocar
> nada más, **el correo se corta en el acto**. Resolver esto (Fase 2) es condición para
> publicar el sitio.

## Objetivo

- Sitio en **Cloudflare Pages** (plan gratuito, **uso comercial permitido**, ancho de
  banda ilimitado para estáticos, TLS automático y renovado solo).
- Correo en **Zoho Mail** (~USD 1/casilla).
- DNS administrado en **Cloudflare**.
- Dar de baja el hosting viejo al final → se termina pagando menos que hoy.

## Principio rector

**Sitio y correo son dos migraciones independientes. No se hacen juntas.**
Primero se mueve el DNS sin cambiar nada de lo que sirve; después el sitio; después el
correo. **Nada del hosting viejo se cancela hasta que las dos cosas estén verificadas.**

---

## Fase 0 — Preparación (no toca nada en producción)

- [ ] Entrar a **TAD** y confirmar que `casakira.com.ar` figura en el listado de dominios
      del CUIT, y que la operación *Delegación de DNS* está disponible.
- [ ] Verificar de paso la **fecha de vencimiento** del dominio. Un vencimiento en medio
      de la migración es el peor escenario posible.
- [ ] **Pedirle a Casa Kira la lista completa de casillas y reenvíos** en uso. Es el único
      dato que no se puede averiguar desde afuera, y si falta uno, esa dirección deja de
      recibir en la Fase 4. No asumir que `casakirasrl@` es la única.
- [ ] Conseguir la **contraseña de cada casilla** (no el panel: la clave con la que leen su
      correo). Es lo que necesita Zoho para copiar el historial por IMAP.
- [ ] Reconstruir la zona a partir de la tabla de arriba más el escaneo de Cloudflare.
      Antes del cambio, probar a mano los subdominios habituales por si hay alguno en uso
      que no figure (`mail`, `webmail`, `cpanel`, `ftp`, `autodiscover`, `_dmarc`,
      `default._domainkey`).
- [x] Repo en GitHub con build reproducible (`npm run build`).
- [ ] Deploy en Cloudflare Pages verificado en la URL provisoria `*.pages.dev`
      (preset **Astro**, build `npm run build`, output `dist`), todavía sin dominio.

---

## Fase 1 — Preparar Zoho (el correo viejo sigue funcionando)

Todo esto se hace **sin tocar los MX**: el correo sigue entrando al hosting viejo.

- [ ] Crear la cuenta en **Zoho Mail** y agregar el dominio.
- [ ] **Verificar la titularidad** con el TXT que pide Zoho (se agrega en wiroos; es
      inocuo, no cambia el ruteo).
- [ ] Recrear **todas** las casillas y alias relevados en la Fase 0, con las **mismas
      direcciones**. `casakirasrl@casakira.com.ar` idéntica, no una nueva.
- [ ] **Primera pasada de migración IMAP** desde el cPanel con la herramienta de migración
      de Zoho. Si el historial no se copia, queda atrapado en el hosting viejo y se pierde
      al darlo de baja.
- [ ] Anotar los valores que da el panel de Zoho: **MX, SPF y DKIM**. Los MX suelen ser
      `mx.zoho.com` (10), `mx2.zoho.com` (20), `mx3.zoho.com` (50), pero **cambian según el
      data center** (`.com` / `.eu`): usar siempre los que muestre la consola, no estos.

---

## Fase 2 — DNS a Cloudflare (sin cambiar lo que sirve)

El objetivo de esta fase es que, al terminar, **nada haya cambiado para el usuario**:
mismo sitio viejo, mismo correo. Sólo cambia quién responde el DNS.

- [ ] Agregar el dominio en Cloudflare y dejar que escanee la zona.
- [ ] **Revisar registro por registro** contra la exportación de la Fase 0. El escaneo
      suele perderse el DKIM y algún TXT. Faltantes se cargan a mano.
- [ ] Dejar el **A del apex en `149.56.87.21` y en DNS only (nube gris)**. En esta fase el
      sitio viejo tiene que seguir sirviéndose igual.
- [ ] **Desacoplar el MX del apex** (el punto crítico):
      **MX** `casakira.com.ar` → **`wo50.wiroos.host`**, prioridad 0. Es el nombre real de
      la máquina del hosting (resuelve a `149.56.87.21`, la misma IP que sirve la web y el
      correo hoy). Apuntar al nombre y no a la IP: si el proveedor mueve el servidor, el
      correo lo sigue solo. A partir de acá el correo ya no depende del A del apex.
- [ ] Dejar en **DNS only** `mail`, `webmail`, `cpanel` y `ftp`. Proxiados no funcionan:
      el webmail va por el puerto 2095, que Cloudflare no proxea.
- [ ] Tener presente que **no se pudieron bajar los TTL** (requerían el panel del hosting,
      al que no hay acceso). Los de la web y el correo son de **4 h**: después del cambio
      puede haber hasta ese lapso de convivencia entre lo viejo y lo nuevo, y un eventual
      rollback tarda lo mismo. No es motivo de alarma, pero conviene hacer el cambio
      temprano en el día y no un viernes.
- [ ] En **TAD** → NIC Argentina → *Delegación de DNS*: cargar los dos nameservers que da
      Cloudflare. El plan gratuito no admite otra vía (no hay setup por CNAME).
- [ ] Esperar a que Cloudflare marque la zona como **Active** y verificar que **el sitio
      viejo sigue abriendo y el correo sigue entrando y saliendo**. No avanzar si algo falla.

---

## Fase 3 — Publicar el sitio (el correo no se toca)

- [ ] En **Pages** → *Custom domains*, agregar `casakira.com.ar` y `www.casakira.com.ar`.
      Al estar la zona en la misma cuenta, Cloudflare reescribe los registros solo.
- [ ] Elegir el canónico y agregar una **Redirect Rule** del otro hacia él.
- [ ] Si el canónico pasa a ser `www`, actualizar **las dos** declaraciones del dominio en
      el repo — `astro.config.mjs` (`site`) y `src/data/site.ts` (`SITE.dominio`) — y
      volver a buildear. Alimentan el sitemap, los `canonical` y el JSON-LD.
- [ ] Verificar HTTPS y que el certificado lo emitió Cloudflare.
- [ ] Verificar que **el correo sigue funcionando** después del cambio.

---

## Fase 4 — Cambiar el correo a Zoho

- [ ] **Segunda pasada IMAP** (delta) para traer lo que llegó desde la Fase 1.
- [ ] Cambiar los **MX** a los de Zoho y **borrar el MX viejo**. Deben quedar sólo los de
      Zoho.
- [ ] **Reemplazar el SPF, no agregarle nada**: sólo puede haber **un** registro SPF. El de
      wiroos se va entero y entra el de Zoho (`v=spf1 include:zoho.com ~all` o el que
      indique la consola según el data center).
- [ ] Cargar el **DKIM de Zoho** con su selector propio. El `default._domainkey` actual es
      de wiroos: se borra recién cuando el correo viejo ya no se usa.
- [ ] Dejar el **DMARC en `p=none`** por ahora. Endurecerlo a `quarantine` sólo después de
      unas semanas sin rebotes.
- [ ] Probar en las dos direcciones: enviar desde la casilla nueva a un Gmail externo y
      recibir un mail externo en ella. Revisar que no caiga en spam y que el encabezado
      muestre SPF y DKIM en `pass`.

---

## Fase 5 — Cierre (sólo con todo verificado y estable)

- [ ] Confirmar sitio (HTTPS) y correo (enviar/recibir) funcionando **varios días**.
- [ ] **Dar de baja el hosting viejo.** Es el paso más caro si se adelanta. Nadie del
      equipo tiene acceso al panel de wiroos: la baja la tiene que gestionar quien paga la
      factura, con el proveedor. Es trámite comercial, no técnico.
- [ ] Recién ahí borrar del DNS `mail`, `webmail`, `cpanel`, `ftp` y el DKIM viejo.

---

## Pendiente de producto, independiente de todo esto

- [ ] **Backend del formulario de contacto.** Hoy no envía nada. Opciones: una Pages
      Function de Cloudflare, un servicio tipo Formspree, o —lo más simple y probablemente
      lo que mejor convierte acá— que el formulario abra WhatsApp con los datos ya
      cargados, igual que las fichas de producto. Ojo: tener casilla en Zoho no resuelve
      esto por sí solo, hace falta algo que envíe.
