// src/scripts/motion.ts
// Motor de movimiento global. Se carga una sola vez desde MainLayout.
// Contrato con el HTML (atributos data-*):
//   data-reveal            → aparece una vez al entrar en pantalla (opcional data-reveal-delay="0.2")
//   data-split             → título que se revela línea por línea con máscara
//   data-count="56.57"     → contador (data-decimals, data-suffix, data-prefix)
//   data-magnetic          → botón que sigue levemente al cursor
//   data-spotlight         → tarjeta con brillo que sigue al cursor (usa --mx / --my en CSS)
//   data-rotate='["a","b"]'→ palabra que rota con un fundido vertical
// Sin JS o con prefers-reduced-motion, todo el contenido es visible y estático.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { reduceMotion, finePointer } from './env';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Si el navegador pierde frames, las animaciones siguen el reloj real en vez de "frenarse":
// así ningún elemento se queda a medio camino (montado sobre otro) mientras se hace scroll.
gsap.ticker.lagSmoothing(0);

const root = document.documentElement;

function initReveals() {
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  if (!items.length) return;
  ScrollTrigger.batch(items, {
    // Se dispara antes de que el elemento sea visible, para que ya esté en su sitio al verlo.
    start: 'top bottom',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.05,
        delay: (_i: number, el: Element) => Number((el as HTMLElement).dataset.revealDelay ?? 0),
        overwrite: true,
        onComplete: () => {
          // Primero se marca como revelado y luego se limpian los estilos inline, para que la regla
          // inicial de CSS (opacity 0 + desplazamiento) no vuelva a aplicarse.
          batch.forEach((el) => el.setAttribute('data-revealed', ''));
          gsap.set(batch, { clearProps: 'transform,opacity' });
        },
      }),
  });
}

function initSplits() {
  const titles = gsap.utils.toArray<HTMLElement>('[data-split]');
  titles.forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      onSplit(self) {
        el.setAttribute('data-split-done', '');
        return gsap.from(self.lines, {
          yPercent: 100,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.07,
          delay: Number(el.dataset.splitDelay ?? 0),
          scrollTrigger: { trigger: el, start: 'top bottom-=40', once: true },
          // Al terminar se deshace el split: el título vuelve a ser texto normal y fluye al redimensionar.
          onComplete: () => self.revert(),
        });
      },
    });
  });
}

function initCounters() {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals ?? 0);
    const prefix = el.dataset.prefix ?? '';
    const suffix = el.dataset.suffix ?? '';
    const format = (n: number) =>
      prefix + n.toLocaleString('es-CO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    // Si ya está a la vista al cargar, se deja el valor final (no hay salto a 0 frente al usuario).
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const state = { v: 0 };
    el.textContent = format(0);
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom-=60',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => (el.textContent = format(state.v)),
        }),
    });
  });
}

function initMagnetic() {
  if (!finePointer) return;
  gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic || 0.3);
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

function initSpotlight() {
  if (!finePointer) return;
  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

function initRotators() {
  document.querySelectorAll<HTMLElement>('[data-rotate]').forEach((el) => {
    let words: string[] = [];
    try {
      words = JSON.parse(el.dataset.rotate ?? '[]');
    } catch {
      return;
    }
    if (words.length < 2) return;
    let index = 0;
    let visible = true;
    new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(el);
    window.setInterval(() => {
      if (!visible || document.hidden) return;
      index = (index + 1) % words.length;
      gsap
        .timeline()
        .to(el, { yPercent: -60, opacity: 0, duration: 0.25, ease: 'power2.in' })
        .call(() => {
          el.textContent = words[index];
        })
        .fromTo(el, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
    }, 2800);
  });
}

function init() {
  if (reduceMotion) {
    root.classList.add('motion-ready');
    return;
  }
  initReveals();
  initCounters();
  initMagnetic();
  initSpotlight();
  initRotators();
  // Los títulos esperan a las fuentes para medir bien las líneas; luego se recalculan los disparadores una sola vez.
  document.fonts.ready.then(() => {
    initSplits();
    ScrollTrigger.refresh();
  });
  root.classList.add('motion-ready');
}

init();
