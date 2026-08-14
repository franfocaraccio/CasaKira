# Puesta en producción — Casa Kira

Guía operativa para publicar el sitio en Cloudflare Pages y mudar el correo a Zoho
sin cortar nada. Documento vivo: marcar cada casilla a medida que se completa.

## Próximos pasos

Los dos primeros son seguros: no cambian dónde está la web ni a dónde llega el correo.

1. ~~Entrar a **TAD** y confirmar el acceso al dominio.~~ — hecho el 2026-08-14.
2. ~~Publicar el sitio en Cloudflare y verificarlo en su URL provisoria.~~ — hecho el
   2026-08-14: `https://casakira.francisco-focaraccio.workers.dev`.
3. ~~Cargar y revisar la zona en Cloudflare.~~ — hecha el 2026-08-14, esperando delegación.
4. **Delegar en TAD** a `eloise.ns.cloudflare.com` y `rene.ns.cloudflare.com` (Fase 1).
   Es el siguiente, y el único paso que puede dejar el correo caído.
   **Hacerlo un lunes o martes a la mañana**, con el día por delante.

Dato que falta: la **contraseña de la casilla**, para la migración IMAP de la Fase 3.

**Orden de las fases: DNS → sitio → Zoho → corte del correo.** Zoho va después del DNS
porque su verificación de dominio necesita cargar un registro, y eso hoy sólo se puede
hacer una vez que la zona esté en Cloudflare.

## Estado actual

- Dominio **casakira.com.ar**, registrado en **NIC Argentina**.
- Acceso a NIC por **TAD** (CUIT + Clave Fiscal nivel 2): organismo *NIC Argentina* →
  *Operaciones sobre dominios* → **Delegación de DNS**. — conseguido
- Sitio y correo viven en el **mismo hosting** (proveedor **wiroos**, servidor
  `wo50.wiroos.host`, panel cPanel, webmail en el puerto 2095).
- **No hay acceso al panel del hosting.** No hace falta para mover el DNS: la delegación se
  cambia en TAD. Sí condiciona tres cosas — ver Fase 0, Fase 2 (TTL) y Fase 5 (la baja).
- Certificado TLS **vencido** (el sitio no abre por HTTPS).
- Única casilla en uso: **casakirasrl@casakira.com.ar** (está en el sitio, en facturas y
  en manos de clientes).

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

- Sitio en **Cloudflare** (Workers con assets estáticos; plan gratuito, **uso comercial
  permitido**, TLS automático y renovado solo).
- Correo en **Zoho Mail** (~USD 1/casilla).
- DNS administrado en **Cloudflare**.
- Dar de baja el hosting viejo al final → se termina pagando menos que hoy.

## Principio rector

**Sitio y correo son dos migraciones independientes. No se hacen juntas.**
Primero se mueve el DNS sin cambiar nada de lo que sirve; después el sitio; después el
correo. **Nada del hosting viejo se cancela hasta que las dos cosas estén verificadas.**

Cada fase termina con una verificación. Si esa verificación falla, se vuelve atrás en esa
fase y no se avanza a la siguiente.

---

## Fase 0 — Preparación (no toca nada en producción)

- [x] **Acceso al dominio confirmado en TAD** (2026-08-14). Titular **Eduardo Victor
      Dworetz** (una persona, no la SRL: el control depende de esa Clave Fiscal). Alta
      28/02/2007, **vencimiento 28/02/2027**, estado *Registrado*, *Delegado: SI*.
      Sin riesgo de vencimiento durante la migración.
- [x] La acción **DELEGAR** está disponible: es la que se usa en la Fase 1 para cargar los
      nameservers de Cloudflare. **No usar TRANSFERIR**, que cambia el titular a otro CUIT
      y desarma el acceso.
- [x] Casillas en uso: **una sola, `casakirasrl@casakira.com.ar`** (confirmado por el
      cliente el 2026-08-14). Sin reenvíos declarados. Si aparece algún alias más adelante
      hay que sumarlo antes de la Fase 4, o esa dirección deja de recibir.
- [ ] Conseguir la **contraseña de la casilla** (no el panel: la clave con la que leen su
      correo). Es lo que necesita Zoho para copiar el historial por IMAP.
- [ ] Reconstruir la zona a partir de la tabla de arriba más el escaneo de Cloudflare.
      Antes del cambio, probar a mano los subdominios habituales por si hay alguno en uso
      que no figure (`mail`, `webmail`, `cpanel`, `ftp`, `autodiscover`, `_dmarc`,
      `default._domainkey`).
- [x] Repo en GitHub con build reproducible (`npm run build`).
- [x] **Deploy en Cloudflare funcionando** (2026-08-14) en
      `https://casakira.francisco-focaraccio.workers.dev`. Verificadas las 6 páginas, una
      ficha de máquina y el sitemap: todas 200, imágenes OK.
      Ojo con el nombre: Cloudflare manda los proyectos nuevos a **Workers**, no a Pages,
      así que la URL provisoria es `*.workers.dev` y el dominio propio se agrega en el
      Worker → *Settings* → *Domains & Routes*. Para servir estáticos es equivalente.

---

## Fase 1 — DNS a Cloudflare (sin cambiar lo que sirve)

> **Por qué esta fase va primero.** Zoho verifica la titularidad del dominio con un
> registro DNS (TXT o CNAME) o subiendo un archivo al sitio. Las dos vías necesitan el
> panel del hosting, al que no hay acceso. Recién con el DNS en Cloudflare se puede
> agregar ese registro, así que Zoho no puede arrancar antes.

El objetivo de esta fase es que, al terminar, **nada haya cambiado para el usuario**:
mismo sitio viejo, mismo correo. Sólo cambia quién responde el DNS.

- [x] **Zona cargada y revisada en Cloudflare** (2026-08-14). El escaneo trajo los 25
      registros, **incluido el DKIM**. Aparecieron seis subdominios del panel de hosting
      que no se veían desde afuera: `autoconfig`, `autodiscover`, `cpcalendars`,
      `cpcontacts`, `webdisk`, `whm`. El cliente confirmó que **no usa ninguna otra
      dirección web**, así que la lista está completa.
      Quedó así: los 10 A, el CNAME `mail` y el CNAME `www` en **DNS only**; MX
      `casakira.com.ar` → `wo50.wiroos.host` prioridad 0; los 5 SRV y los 7 TXT (SPF,
      DKIM, DMARC y los cuatro de caldav/carddav) sin tocar.
      Dos correcciones que hubo que hacer sobre lo que propuso el escaneo, las dos
      imprescindibles:
      1. Cloudflare deja **todo en Proxied** por defecto. Proxiados, `webmail` (puerto
         2095), `cpanel` (2083), `whm`, `ftp` y `mail` **dejan de funcionar**: el proxy
         sólo entiende tráfico web. Van todos en **DNS only**. El apex y `www` también,
         para que en esta fase el sitio viejo se sirva igual que siempre.
      2. **Desacoplar el MX del apex**: contenido `wo50.wiroos.host` en vez de
         `casakira.com.ar`. Es el nombre real de la máquina del hosting (resuelve a
         `149.56.87.21`). Apuntar al nombre y no a la IP: si el proveedor mueve el
         servidor, el correo lo sigue solo. **Ojo con el campo Name**: va
         `casakira.com.ar`, el servidor va en *Content*. Si se cambia el Name, el dominio
         queda sin MX y el correo no tiene a dónde llegar.
- [ ] **No borrar ningún registro** todavía. Los `cpanel`, `whm`, `ftp` y compañía no los
      usamos, pero mientras el hosting viejo siga vivo tienen que estar. Se limpian en la
      Fase 5.
- [ ] Tener presente que **no se pudieron bajar los TTL** (requerían el panel del hosting,
      al que no hay acceso). Los de la web y el correo son de **4 h**: después del cambio
      puede haber hasta ese lapso de convivencia entre lo viejo y lo nuevo, y un eventual
      rollback tarda lo mismo. Por eso la delegación se hace **temprano y a principio de
      semana**, nunca un viernes a la tarde: el local abre los sábados de 9 a 12 y un
      correo caído el fin de semana no lo ve nadie hasta el lunes.
- [x] **DNSSEC verificado apagado** (2026-08-14): el dominio no tiene DS ni DNSKEY. Si
      hubiera estado activo, delegar sin desactivarlo primero deja el dominio sin resolver.
      Nada que hacer.
- [x] Nameservers asignados por Cloudflare: **`eloise.ns.cloudflare.com`** y
      **`rene.ns.cloudflare.com`**.
- [ ] En **TAD** → NIC Argentina → *Delegar* → pantalla **Delegaciones**: hay dos filas,
      `ns1.wiroos.com` y `ns2.wiroos.com`, sin IPs (correcto, no hace falta glue). **Editar
      esas dos filas** reemplazando el texto por los dos de Cloudflare y recién ahí
      *Ejecutar cambios*. No hace falta agregar ni borrar filas, ni usar *Autodelegar*.
      El plan gratuito no admite otra vía (no hay setup por CNAME).
      Ignorar la recomendación de Cloudflare de *"permitir sólo IPs de Cloudflare en el
      origen"*: es para quien tiene servidor propio detrás del proxy, no es nuestro caso.

> **Esta pantalla es el punto de no retorno de la fase.** No entrar a ejecutar cambios
> hasta que la zona esté cargada y revisada en Cloudflare: si se delega antes, Cloudflare
> no tiene qué responder y **se caen el sitio y el correo a la vez**, con hasta 4 h de
> espera para volver atrás.
- [ ] Esperar a que Cloudflare marque la zona como **Active** y verificar que **el sitio
      viejo sigue abriendo y el correo sigue entrando y saliendo**. No avanzar si algo falla.

---

## Fase 2 — Publicar el sitio (el correo no se toca)

- [ ] En el Worker → *Settings* → *Domains & Routes*, agregar `casakira.com.ar` y
      `www.casakira.com.ar`. Al estar la zona en la misma cuenta, Cloudflare reescribe los
      registros solo.
- [ ] Elegir el canónico y agregar una **Redirect Rule** del otro hacia él.
- [ ] Si el canónico pasa a ser `www`, actualizar **las dos** declaraciones del dominio en
      el repo — `astro.config.mjs` (`site`) y `src/data/site.ts` (`SITE.dominio`) — y
      volver a buildear. Alimentan el sitemap, los `canonical` y el JSON-LD.
- [ ] Verificar HTTPS y que el certificado lo emitió Cloudflare.
- [ ] Verificar que **el correo sigue funcionando** después del cambio.

---

## Fase 3 — Preparar Zoho (el correo viejo sigue funcionando)

Nada de esto toca los MX: el correo sigue entrando al hosting viejo.

- [ ] Contratar **Zoho Mail Lite** (~USD 1/casilla al mes, sólo facturación anual → unos
      USD 12/año por la única casilla). **El plan gratuito no sirve acá**: no incluye
      IMAP/POP ni la herramienta de migración, así que no se podría copiar el historial ni
      leer el correo desde Outlook o el celular, sólo desde la web de Zoho.
- [ ] Crear la cuenta y agregar el dominio.
- [ ] **Verificar la titularidad** con el registro que pida Zoho, cargado **en Cloudflare**.
      Es inocuo: no cambia el ruteo del correo.
- [ ] Crear **`casakirasrl@casakira.com.ar` idéntica**, no una dirección nueva. Está en el
      sitio, en las facturas y en manos de clientes.
- [ ] **Primera pasada de migración IMAP** con la herramienta de Zoho, contra
      `wo50.wiroos.host`, usando la dirección completa y su contraseña. Si el historial no
      se copia, queda atrapado en el hosting viejo y se pierde al darlo de baja.
- [ ] Anotar los valores que da el panel de Zoho: **MX, SPF y DKIM**. Los MX suelen ser
      `mx.zoho.com` (10), `mx2.zoho.com` (20), `mx3.zoho.com` (50), pero **cambian según el
      data center** (`.com` / `.eu`): usar siempre los que muestre la consola, no estos.

---

## Fase 4 — Cambiar el correo a Zoho

- [ ] **Segunda pasada IMAP** (delta) para traer lo que llegó desde la Fase 3.
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
