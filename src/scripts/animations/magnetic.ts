// src/scripts/animations/magnetic.ts
import gsap from 'gsap';

export function initMagneticHover(el: HTMLElement, strength = 20): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const mapRotation = gsap.utils.mapRange(0, 1, -strength, strength);

  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    gsap.to(el, {
      rotateX: mapRotation(1 - relY),
      rotateY: mapRotation(relX),
      y: -5,
      transformPerspective: 1000,
      duration: 0.4,
      ease: 'power2.out',
    });
  });

  el.addEventListener('mouseleave', () => {
    gsap.to(el, { rotateX: 0, rotateY: 0, y: 0, duration: 0.5, ease: 'power2.out' });
  });
}
