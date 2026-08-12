import { useEffect, useRef, useState } from 'react';

interface Link { href: string; label: string }
interface Props { links: Link[]; waHref: string; telHref: string; telLabel: string }

/**
 * Menú mobile (isla de React): el botón hamburguesa y la hoja a pantalla
 * completa. Cierra con Escape, bloquea el scroll de fondo y devuelve el foco.
 */
export default function MobileMenu({ links, waHref, telHref, telLabel }: Props) {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) firstLinkRef.current?.focus();
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); burgerRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        ref={burgerRef}
        className="icon-btn nav__burger"
        type="button"
        aria-label="Abrir menú"
        aria-expanded={open}
        aria-controls="sheet"
        onClick={() => setOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div
        className="sheet"
        id="sheet"
        data-open={String(open)}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <div className="wrap sheet__head">
          <span className="brand">
            <svg className="logo" viewBox="0 0 212 70" aria-hidden="true">
              <g className="lettering">
                <text transform="translate(20.4 63.6) rotate(-90)" font-size="22.6" textLength="55.8" lengthAdjust="spacingAndGlyphs">CASA</text>
                <text x="23.1" y="65" font-size="88.2" textLength="183" lengthAdjust="spacingAndGlyphs">KIRA</text>
              </g>
            </svg>
          </span>
          <button className="icon-btn" type="button" aria-label="Cerrar menú" onClick={() => { setOpen(false); burgerRef.current?.focus(); }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="wrap sheet__body">
          {links.map((l, i) => (
            <a
              key={l.href}
              ref={i === 0 ? firstLinkRef : undefined}
              className="sheet__link"
              href={l.href}
              onClick={() => setOpen(false)}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              {l.label}
            </a>
          ))}
        </div>

        <div className="wrap sheet__foot">
          <a className="btn btn--primary btn--wide" href={waHref} target="_blank" rel="noopener">Consultar por WhatsApp</a>
          <a className="btn btn--ghost btn--wide" href={telHref}>Llamar al {telLabel}</a>
        </div>
      </div>
    </>
  );
}
