import { useRef, useState } from 'react';
import { SITE } from '../../data/site';

const ErrorMsg = ({ show, children }: { show: boolean; children: string }) => (
  <span className="field__error" role="alert" style={{ display: show ? 'flex' : 'none' }}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
    </svg>
    {children}
  </span>
);

/**
 * Formulario de consulta (isla de React). Valida al salir del campo, muestra el
 * error debajo y enfoca el primero que falla.
 *
 * El envío va a Web3Forms, que reenvía la consulta por mail a SITE.email. Así el
 * sitio sigue siendo estático: no hace falta servidor propio ni claves privadas.
 */
export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const check = (el: HTMLInputElement | HTMLTextAreaElement) => {
    const ok = el.checkValidity();
    setInvalid((prev) => ({ ...prev, [el.name]: !ok }));
    el.setAttribute('aria-invalid', String(!ok));
    return ok;
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.value || e.target.required) check(e.target);
  };
  const onInput = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if (invalid[el.name]) check(el);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current!;
    // El honeypot no se valida: lo llenan los bots, las personas no lo ven.
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')]
      .filter((f) => f.name !== 'botcheck');
    const bad = fields.filter((f) => !check(f));
    if (bad.length) { bad[0].focus(); return; }

    setError('');
    setSending(true);
    const datos = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...datos,
          access_key: SITE.formKey,
          subject: 'Consulta desde el sitio web CASA KIRA',
          from_name: 'Sitio Casa Kira',
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.message || 'Falló el envío');
      setSent(true);
      form.reset();
      setInvalid({});
    } catch {
      // Nunca dejar al visitante sin salida: si el envío falla, que sepa que
      // puede escribir igual, y por dónde.
      setError(`No pudimos enviar la consulta. Escribinos a ${SITE.email} o por WhatsApp al ${SITE.whatsappHumano}.`);
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="form-card" ref={formRef} onSubmit={onSubmit} noValidate>
      <h3>Consultas y cotización</h3>
      <p className="form-card__sub">Contanos qué máquina o repuesto necesitás y te respondemos a la brevedad.</p>

      {/* Trampa para bots: invisible y fuera del recorrido del teclado. Si viene
          con algo cargado, Web3Forms descarta el envío. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: 'none' }}
      />

      <div className="form-grid">
        <div className="field" data-invalid={String(!!invalid.nombre)}>
          <label htmlFor="f-nombre">Nombre y apellido <span className="req" aria-hidden="true">*</span></label>
          <input id="f-nombre" name="nombre" type="text" autoComplete="name" required onBlur={onBlur} onInput={onInput} />
          <ErrorMsg show={!!invalid.nombre}>Ingresá tu nombre para poder responderte.</ErrorMsg>
        </div>

        <div className="field">
          <label htmlFor="f-empresa">Empresa</label>
          <input id="f-empresa" name="empresa" type="text" autoComplete="organization" onBlur={onBlur} onInput={onInput} />
        </div>

        <div className="field" data-invalid={String(!!invalid.email)}>
          <label htmlFor="f-email">E-mail <span className="req" aria-hidden="true">*</span></label>
          <input id="f-email" name="email" type="email" inputMode="email" autoComplete="email" required onBlur={onBlur} onInput={onInput} />
          <ErrorMsg show={!!invalid.email}>Revisá el e-mail: falta el @ o el dominio.</ErrorMsg>
        </div>

        <div className="field">
          <label htmlFor="f-tel">Teléfono</label>
          <input id="f-tel" name="telefono" type="tel" inputMode="tel" autoComplete="tel" onBlur={onBlur} onInput={onInput} />
        </div>

        <div className="field field--full">
          <label htmlFor="f-dir">Dirección</label>
          <input id="f-dir" name="direccion" type="text" autoComplete="street-address" onBlur={onBlur} onInput={onInput} />
        </div>

        <div className="field field--full" data-invalid={String(!!invalid.consulta)}>
          <label htmlFor="f-consulta">Consulta <span className="req" aria-hidden="true">*</span></label>
          <textarea id="f-consulta" name="consulta" required onBlur={onBlur} onInput={onInput}></textarea>
          <ErrorMsg show={!!invalid.consulta}>Contanos brevemente qué necesitás.</ErrorMsg>
        </div>
      </div>

      <div className="form-foot">
        <button className="btn btn--primary" type="submit" disabled={sending} style={sending ? { opacity: 0.6, cursor: 'wait' } : undefined}>
          {sending ? 'Enviando…' : 'Enviar consulta'}
          {!sending && (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      <p className="form-status" role="status" aria-live="polite" data-show={String(sent)}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        Recibimos tu consulta. Te respondemos dentro del horario de atención.
      </p>

      <p className="form-status form-status--error" role="alert" data-show={String(!!error)}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
        </svg>
        {error}
      </p>
    </form>
  );
}
