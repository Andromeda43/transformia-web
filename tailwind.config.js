/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
      extend: {
        fontFamily: {
          'mono': ['"Space Mono"', 'monospace'],
          'sans': ['"Space Grotesk"', 'sans-serif'],
          'display': ['"Space Grotesk"', 'sans-serif'],
        },
        colors: {
          'neon-purple': '#b042ff',
          'neon-blue': '#4287ff',
          'neon-pink': '#ff42b0',
          'neon-yellow': '#e8ff42',
          'neon-orange': '#ff7842',
          'dark': '#0a0a14',
          'dark-blue': '#141428',
          'dark-purple': '#1a142d',
          'grid-line': 'rgba(128, 90, 213, 0.2)',
        },
        animation: {
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'float': 'float 6s ease-in-out infinite',
          'glow': 'glow 2s ease-in-out infinite alternate',
          'grid-flow': 'grid-flow 15s linear infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          glow: {
            '0%': { 
              textShadow: '0 0 5px rgba(176, 66, 255, 0.7), 0 0 10px rgba(176, 66, 255, 0.5)',
              boxShadow: '0 0 5px rgba(176, 66, 255, 0.7), 0 0 10px rgba(176, 66, 255, 0.5)'
            },
            '100%': { 
              textShadow: '0 0 10px rgba(176, 66, 255, 0.9), 0 0 20px rgba(176, 66, 255, 0.7), 0 0 30px rgba(176, 66, 255, 0.5)',
              boxShadow: '0 0 10px rgba(176, 66, 255, 0.9), 0 0 20px rgba(176, 66, 255, 0.7), 0 0 30px rgba(176, 66, 255, 0.5)'
            },
          },
          'grid-flow': {
            '0%': { backgroundPosition: '0% 0%' },
            '100%': { backgroundPosition: '100% 100%' },
          }
        },
        backgroundImage: {
          'grid-pattern': 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
          'radial-gradient': 'radial-gradient(circle, rgba(176, 66, 255, 0.15) 0%, rgba(10, 10, 20, 0) 70%)',
        },
        backgroundSize: {
          'grid': '40px 40px',
        }
      },
    },
    plugins: [],
  }