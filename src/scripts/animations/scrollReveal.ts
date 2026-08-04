// src/scripts/animations/scrollReveal.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  stagger?: number;
  y?: number;
}

export function revealOnScroll(selector: string, options: RevealOptions = {}): void {
  const { stagger = 0.1, y = 40 } = options;
  const targets = gsap.utils.toArray<HTMLElement>(selector);
  if (targets.length === 0) return;

  gsap.set(targets, { opacity: 0, y });

  targets.forEach((target, index) => {
    ScrollTrigger.create({
      trigger: target,
      scroller: document.body,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(target, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * stagger,
          ease: 'power2.out',
        });
      },
    });
  });
}
