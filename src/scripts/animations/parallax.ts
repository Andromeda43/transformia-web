// src/scripts/animations/parallax.ts
import gsap from 'gsap';

interface ParallaxTarget {
  el: HTMLElement;
  strength: number;
}

export function initParallax(container: HTMLElement, targets: ParallaxTarget[]): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const movers = targets.map(({ el, strength }) => ({
    el,
    strength,
    quickX: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }),
    quickY: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }),
  }));

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    movers.forEach(({ strength, quickX, quickY }) => {
      const clampedStrength = gsap.utils.clamp(0, 60, strength);
      quickX(relX * clampedStrength);
      quickY(relY * clampedStrength);
    });
  });
}
