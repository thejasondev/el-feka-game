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
      "Spotify",
      "YouTube",
      "Tesla",
      "Alexa",
      "ChatGPT",
    ],
  },
  musica: {
    name: "MÚSICA",
    emoji: "🎵",
    words: [
      "Reggaetón",
      "Salsa",
      "Rock",
      "Hip Hop",
      "Bachata",
      "Cumbia",
      "Merengue",
      "Pop",
      "Trap",
      "R&B",
      "Electrónica",
      "Balada",
      "Corrido",
      "Mariachi",
      "Jazz",
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
    name: "CINE & SERIES",
    emoji: "🎬",
    words: [
      "Netflix",
      "Hollywood",
      "Oscar",
      "Palomitas",
      "Titanic",
      "Harry Potter",
      "Spiderman",
      "Batman",
      "Fast & Furious",
      "La Casa de Papel",
      "Squid Game",
      "Breaking Bad",
      "Friends",
      "Stranger Things",
      "Game of Thrones",
      "The Office",
      "Narcos",
      "Avatar",
      "Avengers",
      "Star Wars",
    ],
  },
  lugares: {
    name: "LUGARES",
    emoji: "🏠",
    words: [
      "Aeropuerto",
      "Hospital",
      "Escuela",
      "Banco",
      "Restaurante",
      "Playa",
      "Estadio",
      "Hotel",
      "Museo",
      "Parque",
      "Supermercado",
      "Iglesia",
      "Gimnasio",
      "Disco",
      "Centro Comercial",
    ],
  },
  profesiones: {
    name: "PROFESIONES",
    emoji: "👔",
    words: [
      "Doctor",
      "Abogado",
      "Chef",
      "Policía",
      "Bombero",
      "Maestro",
      "Piloto",
      "Enfermera",
      "Arquitecto",
      "DJ",
      "Youtuber",
      "Influencer",
      "Taxista",
      "Dentista",
      "Veterinario",
    ],
  },
  fiestas: {
    name: "FIESTAS",
    emoji: "🎉",
    words: [
      "Cumpleaños",
      "Boda",
      "Halloween",
      "Navidad",
      "Año Nuevo",
      "Quinceañera",
      "Bautizo",
      "Graduación",
      "Baby Shower",
      "Carnaval",
      "San Valentín",
      "Día de Muertos",
      "Pool Party",
      "Despedida",
      "Fin de Año",
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
      "Telescopio",
      "Fósil",
    ],
  },
  nerd: {
    name: "NERD",
    emoji: "🤓",
    words: [
      "Mitocondria",
      "Fibonacci",
      "Blockchain",
      "Algoritmo",
      "Paradoja",
      "Cuántico",
      "Relatividad",
      "Matrix",
      "Hacker",
      "Código",
      "Virus",
      "Galaxia",
      "Agujero Negro",
      "Dimensión",
      "Metaverso",
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
