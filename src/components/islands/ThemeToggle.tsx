import { useEffect, useState } from 'react';

/**
 * Switch de tema día/noche (isla de React). El tema inicial lo fija un script
 * inline en el <head> para evitar el flash; este switch sólo lo invierte y lo
 * persiste. El deslizamiento de la perilla lo maneja el CSS por [data-theme].
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Al montar, sincronizar con lo que dejó el script anti-flash.
  useEffect(() => {
    const current = (document.documentElement.dataset.theme as 'light' | 'dark') || 'light';
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('casakira-theme', next);
    } catch {
      /* modo privado: sin persistencia, no es crítico */
    }
    setTheme(next);
  }

  const label = 'Cambiar a modo ' + (theme === 'dark' ? 'claro' : 'oscuro');

  return (
    <button
      className="theme-switch"
      type="button"
      role="switch"
      aria-checked={theme === 'dark'}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <span className="theme-switch__track" aria-hidden="true">
        <span className="theme-switch__knob">
          {theme === 'dark' ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
