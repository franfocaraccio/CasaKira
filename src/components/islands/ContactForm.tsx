import { useRef, useState } from 'react';

const ErrorMsg = ({ show, children }: { show: boolean; children: string }) => (
  <span className="field__error" role="alert" style={{ display: show ? 'flex' : 'none' }}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
    </svg>
    {children}
  </span>
);

/**
 * Formulario de consulta (isla de React). Valida al salir del campo, muestra el
 * error debajo y enfoca el primero que falla. Prototipo: sin backend todavía,
 * sólo muestra el estado de éxito (ver DESPLIEGUE.md, pendiente de backend).
 */
export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current!;
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')];
    const bad = fields.filter((f) => !check(f));
    if (bad.length) { bad[0].focus(); return; }
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); form.reset(); setInvalid({}); }, 900);
  };

  return (
    <form className="form-card" ref={formRef} onSubmit={onSubmit} noValidate>
      <h3>Consultas y cotización</h3>
      <p className="form-card__sub">Contanos qué máquina o repuesto necesitás y te respondemos a la brevedad.</p>

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
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      <p className="form-status" role="status" aria-live="polite" data-show={String(sent)}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        Recibimos tu consulta. Te respondemos dentro del horario de atención.
      </p>
    </form>
  );
}
