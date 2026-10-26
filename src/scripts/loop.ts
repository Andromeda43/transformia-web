// src/scripts/loop.ts — ayudante para las animaciones en bucle de las páginas de servicio.
// Convención: el HTML/CSS muestra el ESTADO FINAL de la animación (lo que se ve sin JS o con reduced-motion).
// La línea de tiempo arranca desde ese estado, lo "desarma" y lo vuelve a construir, así que empieza y
// termina igual: no hay parpadeo al cargar ni salto al repetir.
import { gsap } from 'gsap';
import { reduceMotion } from './env';

export function loopWhenVisible(
  root: HTMLElement,
  build: (tl: gsap.core.Timeline) => void,
  { repeatDelay = 0.2, threshold = 0.25 } = {}
) {
  if (reduceMotion) {
    root.querySelectorAll('svg').forEach((svg) => svg.pauseAnimations?.());
    return null;
  }
  const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay });
  build(tl);
  // Solo en desarrollo: deja las líneas de tiempo a mano para probarlas desde la consola.
  if (import.meta.env.DEV) ((window as any).__loops ??= []).push({ root, tl });

  let visible = false;
  const sync = () => {
    const run = visible && !document.hidden;
    run ? tl.play() : tl.pause();
    root.querySelectorAll('svg').forEach((svg) => (run ? svg.unpauseAnimations?.() : svg.pauseAnimations?.()));
  };
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      sync();
    },
    { threshold }
  ).observe(root);
  document.addEventListener('visibilitychange', sync);

  // Si cambia el tamaño, los tweens con valores calculados (posiciones del cursor, etc.) se recalculan.
  let t = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => tl.invalidate(), 200);
  });
  return tl;
}

/** Centro de `el` relativo a `root`, en px (para mover un cursor o un paquete hacia un elemento). */
export function centerIn(root: HTMLElement, el: Element) {
  const r = root.getBoundingClientRect();
  const e = el.getBoundingClientRect();
  return { x: e.left - r.left + e.width / 2, y: e.top - r.top + e.height / 2 };
}

/** Escribe `text` letra por letra dentro de `el` como tween de la línea de tiempo. */
export function typeText(el: HTMLElement, text: string, duration = 1) {
  const state = { n: 0 };
  return gsap.to(state, {
    n: text.length,
    duration,
    ease: 'none',
    onStart: () => (el.textContent = ''),
    onUpdate: () => (el.textContent = text.slice(0, Math.round(state.n))),
  });
}
