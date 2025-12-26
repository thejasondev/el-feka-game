// Word categories in Spanish for EL FEKA game
export const CATEGORIES = {
  deportes: {
    name: "DEPORTES",
    emoji: "⚽",
    words: [
      "Fútbol",
      "Boxeo",
      "Béisbol",
      "Natación",
      "Gimnasio",
      "Baloncesto",
      "Tenis",
      "Golf",
      "Ciclismo",
      "Skate",
      "Surf",
      "Voleibol",
      "Atletismo",
      "Lucha",
      "MMA",
    ],
  },
  tecnologia: {
    name: "TECNOLOGÍA",
    emoji: "📱",
    words: [
      "iPhone",
      "PlayStation",
      "Inteligencia Artificial",
      "Wifi",
      "Robot",
      "Laptop",
      "Drone",
      "Bitcoin",
      "TikTok",
      "Instagram",
      "Netflix",
      "Spotify",
      "YouTube",
      "Tesla",
      "Alexa",
    ],
  },
  ciencia: {
    name: "CIENCIA",
    emoji: "🔬",
    words: [
      "Átomo",
      "Vacuna",
      "Gravedad",
      "NASA",
      "Microscopio",
      "ADN",
      "Laboratorio",
      "Experimento",
      "Planeta",
      "Eclipse",
      "Química",
      "Física",
      "Biología",
      "Matemáticas",
      "Radiación",
    ],
  },
  alimentos: {
    name: "ALIMENTOS",
    emoji: "🍔",
    words: [
      "Tacos",
      "Hamburguesa",
      "Sushi",
      "Cerveza",
      "Asado",
      "Pizza",
      "Pollo",
      "Arroz",
      "Pasta",
      "Ensalada",
      "Helado",
      "Café",
      "Chocolate",
      "Vino",
      "Refresco",
    ],
  },
  cine: {
    name: "CINE",
    emoji: "🎬",
    words: [
      "Netflix",
      "Terror",
      "Cine",
      "Palomitas",
      "Actor",
      "Director",
      "Hollywood",
      "Oscar",
      "Estreno",
      "Secuela",
      "Animación",
      "Documental",
      "Serie",
      "Thriller",
      "Comedia",
    ],
  },
  nerd: {
    name: "NERD",
    emoji: "🤓",
    words: [
      "Mitocondria",
      "Schrödinger",
      "Fibonacci",
      "Blockchain",
      "Neurotransmisor",
      "Entropía",
      "Fotosíntesis",
      "Relatividad",
      "Cuántico",
      "Algoritmo",
      "Paradoja",
      "Sinapsis",
      "Cromosoma",
      "Hipótesis",
      "Teorema",
      "Mecatrónica",
      "Nanotecnología",
      "Criptografía",
      "Bioética",
      "Epigenética",
    ],
  },
  asere: {
    name: "CUBA",
    emoji: "🇨🇺",
    words: [
      "Asere",
      "Yuma",
      "Fula",
      "Guagua",
      "Paladar",
      "Jama",
      "Pasmao'",
      "Socio",
      "Pinchar",
      "Temba",
      "Jinetero",
      "Mango",
      "Papaya",
      "Guajiro",
      "Pinga",
      "Hueso",
      "Bisne",
      "Candela",
      "Ecobio",
      "Monina",
      "Batear",
      "Fiana",
      "Tonga",
      "Pipo",
      "Pura",
    ],
  },
  mixto: {
    name: "MIXTO",
    emoji: "🎲",
    words: [], // Will be filled dynamically
  },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export function getRandomWord(category: CategoryKey): {
  word: string;
  category: string;
} {
  if (category === "mixto") {
    const allCategories = Object.keys(CATEGORIES).filter(
      (k) => k !== "mixto"
    ) as CategoryKey[];
    const randomCategory =
      allCategories[Math.floor(Math.random() * allCategories.length)];
    const words = CATEGORIES[randomCategory].words;
    return {
      word: words[Math.floor(Math.random() * words.length)],
      category: CATEGORIES[randomCategory].name,
    };
  }

  const words = CATEGORIES[category].words;
  return {
    word: words[Math.floor(Math.random() * words.length)],
    category: CATEGORIES[category].name,
  };
}

export function selectImpostor(playerCount: number): number {
  return Math.floor(Math.random() * playerCount);
}

export function selectImpostors(playerCount: number, count: number): number[] {
  const indices: number[] = [];
  while (indices.length < count) {
    const rand = Math.floor(Math.random() * playerCount);
    if (!indices.includes(rand)) {
      indices.push(rand);
    }
  }
  return indices;
}
