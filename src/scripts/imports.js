// Este archivo importa todos los estilos CSS necesarios para el hero
// Se puede incluir desde el layout principal o archivo principal de Astro

// Importar estilos principales para el hero
import './styles/hero.css';

// Importar estilos para botones
import './styles/hero-buttons.css';

// Importar estilos para decoraciones
import './styles/hero-decorations.css';

// Exporta una función para inicializar el hero una vez que los estilos están cargados
export function initHero() {
  console.log('Hero styles loaded correctly');
  
  // Asegúrate de que el script de hero se cargue después
  const heroScript = document.createElement('script');
  heroScript.src = './scripts/hero.js';
  heroScript.defer = true;
  document.head.appendChild(heroScript);
}