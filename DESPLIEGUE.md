# Puesta en producción — Casa Kira

Guía operativa para publicar el sitio en Cloudflare Pages y mudar el correo a Zoho
sin cortar nada. Documento vivo: marcar cada casilla a medida que se completa.

## Estado: migración terminada

Las cinco fases se completaron entre el **14 y el 16 de agosto de 2026**.

- **Sitio** en `https://casakira.com.ar`, servido por Cloudflare, con certificado que se
  renueva solo. El del hosting viejo estaba vencido.
- **Correo** en Zoho Mail Lite, con el historial completo migrado, SPF y DKIM en `pass`.
- **DNS** administrado en Cloudflare, delegado desde NIC.
- **Hosting viejo** dado de baja y sus registros borrados de la zona.

Lo que queda son dos decisiones abiertas, ninguna urgente: `includeSubDomains` en HSTS y
subir el DMARC a `quarantine`. Están al final, en la Fase 5.

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
- [x] **Delegación aplicada** el 2026-08-14. NIC tardó 20 minutos en publicarla (el primer
      *Ejecutar cambios* devolvió un error genérico `null`; salió al segundo intento).
- [x] **Verificado contra los nameservers de Cloudflare**: apex y `webmail` → `149.56.87.21`;
      `www` y `mail` → CNAME al apex; **MX → `wo50.wiroos.host` prioridad 0**; SPF, DKIM y
      DMARC intactos. El sitio viejo responde HTTP 200. Los puertos 993, 587, 465 y 2095 del
      servidor de correo responden. (El 25 da timeout desde la máquina de desarrollo: es el
      bloqueo de salida habitual de las conexiones domiciliarias, no un problema del
      servidor.)
- [x] **Prueba real de correo OK** (2026-08-15): el cliente recibe y responde con
      normalidad. **Fase 1 cerrada.**
- [x] Beneficio colateral: los TTL pasaron de 4 h a **300 s** (Cloudflare los pone en
      Auto). De acá en adelante los cambios —y las vueltas atrás— se ven en minutos. El
      corte del correo de la Fase 4 es bastante menos riesgoso por esto.

---

## Fase 2 — Publicar el sitio (el correo no se toca)

**Hecha el 2026-08-15. El sitio nuevo está publicado en `casakira.com.ar`.**

- [x] **Canónico: `casakira.com.ar`, sin `www`.** Es lo que ya declaran `astro.config.mjs`
      (`site`) y `src/data/site.ts` (`SITE.dominio`): no hubo que tocar el repo.
- [x] **Antes de nada, convertir `mail` de CNAME a registro A** → `149.56.87.21`, DNS only.
      Era un CNAME al apex, así que al mover el apex al Worker habría empezado a apuntar al
      sitio web. El MX ya no dependía de él, pero **cualquier cliente de correo configurado
      contra `mail.casakira.com.ar` (Outlook, el celular) habría dejado de funcionar**.
- [x] **Borrar el A del apex** (`149.56.87.21`). Cloudflare no deja conectar el dominio al
      Worker mientras exista: *"Hostname already has externally managed DNS records"*. Entre
      el borrado y el alta el sitio queda caído, así que van seguidos.
- [x] En el Worker → *Domains* → **+ Add Domain** (el botón azul, **no** el *Edit* del menú
      `...` de la fila, que mueve el dominio existente en vez de agregar uno). Subdominio
      vacío para el apex; `www` para el otro, borrando antes su CNAME.
- [x] **Redirect Rule `www` → apex**, desde la plantilla *Redirect from WWW to root*
      (`https://www.*` → `https://${1}`, 301) con **Preserve query string** tildado.
      Cloudflare avisa que *"la regla puede no aplicarse porque www no está proxeado"*: es
      un falso positivo, no reconoce los dominios conectados a un Worker. *Ignore and deploy*.
- [x] **Verificado**: las 6 páginas, una ficha, `robots.txt` y el sitemap dan 200 en el
      dominio real; sin prototipos en el sitemap; HTTP redirige a HTTPS en apex y en `www`;
      `www/catalogo` termina en `casakira.com.ar/catalogo/` conservando la query string.
      Certificado emitido por Cloudflare (Google Trust Services, vence 13/11/2026, se
      renueva solo) — el certificado vencido del hosting viejo dejó de ser un tema.
- [x] **Correo intacto tras el cambio**: MX en `wo50.wiroos.host`, `mail` y `webmail` en
      `149.56.87.21`.
- [x] **HSTS activado** el 2026-08-16: `max-age=15552000` (6 meses) más `nosniff`.
      **`includeSubDomains` queda APAGADO** y no se toca hasta dar de baja el hosting viejo:
      el certificado de `webmail.casakira.com.ar` (emitido por cPanel) **venció el
      17/11/2021**. Con la opción activada el navegador del cliente le bloquearía el acceso
      al webmail sin posibilidad de saltear el aviso, y el bloqueo duraría los 6 meses
      aunque se desactivara. Reevaluar en la Fase 5.

---

## Fase 3 — Preparar Zoho (el correo viejo sigue funcionando)

Nada de esto toca los MX: el correo sigue entrando al hosting viejo.

**En curso desde el 2026-08-16.** Data center **US** (`mailadmin.zoho.com`), así que los
valores son los `.com`.

> **Regla que se aplicó en cada pantalla: nunca usar las opciones "Configure
> automatically" / "Log in to my DNS" de Zoho.** Piden acceso al DNS y cargan
> verificación, MX, SPF y DKIM de una sola vez. Eso cortaría el correo antes de terminar
> de copiar el historial. Todo se carga a mano en Cloudflare, en el orden que decidimos.

- [x] Contratar **Zoho Mail Lite** (~USD 1/casilla al mes, sólo facturación anual → unos
      USD 12/año por la única casilla). **El plan gratuito no sirve acá**: no incluye
      IMAP/POP ni la herramienta de migración, así que no se podría copiar el historial ni
      leer el correo desde Outlook o el celular, sólo desde la web de Zoho.
- [x] Crear la cuenta y agregar el dominio.
- [x] **Verificación de titularidad**: TXT en el apex,
      `zoho-verification=zb00062311.zmverify.zoho.com`. Convive sin problema con el SPF
      viejo (varios TXT pueden coexistir; el único que debe ser único es el SPF).
- [x] Casilla **`casakirasrl@casakira.com.ar`** creada, idéntica a la de siempre. Queda como
      **Super Administrador** de la organización: quien tenga esa contraseña administra
      toda la cuenta de Zoho.
- [x] **DKIM adelantado** (no hace falta esperar al corte): selector **`zmail._domainkey`**,
      TXT de 234 caracteres, verificado y activado. Convive con el `default._domainkey` de
      wiroos porque son selectores distintos. Cada mail se firma con el del servidor que lo
      envía.
- [ ] **Primera pasada de migración IMAP** — *en progreso desde el 2026-08-16*. Parámetros:
      IMAP, `wo50.wiroos.host`, puerto 993 SSL, **sin** *Skip certificate check* (ese host
      tiene un Let's Encrypt válido; el certificado vencido de 2021 es el del webmail, otro
      servicio). Todas las carpetas menos `Spam`, todos los mails. Límite de 5 conexiones
      —bajar a 2 o 3 si el hosting rechaza por exceso— y pausa automática al 80% de la
      cuota. Si el historial no se copia, queda atrapado en el hosting viejo y se pierde al
      darlo de baja.
      **Ojo con la cuota**: Mail Lite trae 5 GB. Si la casilla es más grande, la migración
      pausa en vez de fallar, y se resuelve subiendo el plan.
- [x] **MX de destino, confirmados en la consola** (data center US):

      | Prioridad | Servidor |
      |---|---|
      | 10 | `mx.zoho.com` |
      | 20 | `mx2.zoho.com` |
      | 50 | `mx3.zoho.com` |

- [x] **SPF adelantado también** (2026-08-16), en su versión combinada: autoriza a los dos
      proveedores a la vez, así que se puede aplicar antes del corte sin romper el envío
      actual. El registro quedó:

      ```
      v=spf1 include:zohomail.com ip4:192.95.22.212 ip4:62.210.31.59 ip4:163.172.113.163 include:spf-a1.wo50.wiroos.host ~all
      ```

      El include de Zoho es **`zohomail.com`**, no `zoho.com`. Se **reemplazó** el TXT
      existente, no se agregó otro: con dos registros SPF los dos se invalidan y todo el
      correo del dominio pasa a ser sospechoso.
      Consultas DNS: 3 de las 10 permitidas (`zohomail.com` → `spf.zohomail.com`, más el
      include de wiroos; los dos terminan en listas de IPs). Hay margen de sobra.
      Al dar de baja el hosting se recorta a `v=spf1 include:zohomail.com ~all`.

---

## Fase 4 — Cambiar el correo a Zoho

**Hecha el 2026-08-16. El correo está en Zoho.**

Con el DKIM y el SPF adelantados en la Fase 3, el corte se redujo a los MX. Se hizo el
mismo día en vez de esperar a un martes: el cliente no estaba usando la casilla, así que
la ventana de riesgo era mínima.

- [x] **Los MX se cambiaron sin esperar a que terminara la migración**, y conviene dejar
      escrito por qué se puede: la copia IMAP se conecta a `wo50.wiroos.host` **por su
      nombre**, que resuelve en la zona de wiroos, no en la nuestra. Cambiar el MX de
      `casakira.com.ar` no la interrumpe. Y cortando antes se evita que sigan entrando
      mails al servidor viejo, que después habría que traer en una segunda pasada.
- [x] MX en `10 mx.zoho.com`, `20 mx2.zoho.com`, `50 mx3.zoho.com`, y borrado el de
      `wo50.wiroos.host`. Verificado contra Cloudflare y contra los resolvedores de Google,
      Quad9 y OpenDNS: propagó en minutos gracias al TTL de 300 s.
- [x] ~~SPF~~ y ~~DKIM~~: hechos por adelantado en la Fase 3.
- [x] **Migración terminada al 100%, 0 fallidas.** Como los MX ya estaban cambiados cuando
      terminó, **no hizo falta la segunda pasada**: no quedó ventana de mails sin copiar.
- [x] **Probado en las dos direcciones**: entra correo externo, sale correo desde Zoho, no
      cae en spam, y el encabezado muestra **SPF `pass` y DKIM `pass`**.
- [x] **Historial verificado a ojo** en la bandeja de Zoho: están las decenas de carpetas
      del cliente y el correo viejo de meses anteriores. Y entró correo real de terceros
      el mismo día del corte.
- [ ] Dejar el **DMARC en `p=none`** por ahora. Endurecerlo a `quarantine` sólo después de
      unas semanas sin rebotes.

> **Aviso conocido de Zoho:** la consola puede seguir mostrando *"The MX Records of your
> domain are not pointed to Zoho"* después del corte. Es una notificación vieja que no se
> refresca sola; se limpia entrando a *Email Configuration → MX* y pulsando *Verify*. No
> indica ningún problema real: contrastar siempre contra una consulta DNS.

---

## Fase 5 — Cierre

**Hecha el 2026-08-16.** Fran decidió dar el hosting viejo por terminado y ejecutar la
limpieza en el momento, sin el período de espera que preveía este documento.

- [x] **Baja del hosting viejo**: decisión tomada. Es trámite comercial de quien paga la
      factura; nadie del equipo tiene acceso al panel de wiroos.
- [x] **DNS limpio**: borrados los 10 registros A del panel (`mail`, `webmail`, `cpanel`,
      `ftp`, `whm`, `webdisk`, `autoconfig`, `autodiscover`, `cpcalendars`, `cpcontacts`),
      los 5 SRV y los 4 TXT de caldav/carddav, y el DKIM viejo `default._domainkey`.
      Se conservó el TXT `zoho-verification`, que Zoho sigue usando.
- [x] **SPF recortado** a `v=spf1 include:zohomail.com ~all`. Bajó de 3 consultas DNS a 2,
      y deja de autorizar IPs que ya no envían nada en nombre del dominio.
- [x] **Verificado después de la limpieza**: las 6 páginas, una ficha, `robots.txt` y el
      sitemap dan 200; HTTP y `www` siguen redirigiendo al canónico; MX, SPF, DKIM y la
      verificación de Zoho intactos.

### Queda pendiente

- [ ] **`includeSubDomains` en HSTS**: ahora sí es viable, porque no queda ningún
      subdominio fuera de Cloudflare. Es un compromiso de 6 meses difícil de revertir —
      decisión de Fran, sin resolver.
- [ ] Con el correo estable unas semanas, subir el **DMARC a `p=quarantine`**.

---

## Pendiente de producto, independiente de todo esto

- [ ] **Backend del formulario de contacto.** Hoy no envía nada. Opciones: una Pages
      Function de Cloudflare, un servicio tipo Formspree, o —lo más simple y probablemente
      lo que mejor convierte acá— que el formulario abra WhatsApp con los datos ya
      cargados, igual que las fichas de producto. Ojo: tener casilla en Zoho no resuelve
      esto por sí solo, hace falta algo que envíe.
