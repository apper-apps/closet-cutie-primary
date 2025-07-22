import moodboardData from "@/services/mockData/moodboards.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let moodboards = [...moodboardData];

export const getAll = async () => {
  await delay(300);
  return [...moodboards];
};

export const getById = async (id) => {
  await delay(200);
  const moodboard = moodboards.find(m => m.Id === id);
  if (!moodboard) {
    throw new Error("Moodboard not found");
  }
  return { ...moodboard };
};

export const createMoodboard = async (moodboardData) => {
  await delay(400);
  
  const newId = Math.max(...moodboards.map(m => m.Id), 0) + 1;
  const newMoodboard = {
    Id: newId,
    ...moodboardData,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
  
  moodboards.push(newMoodboard);
  return { ...newMoodboard };
};

export const updateMoodboard = async (id, updatedData) => {
  await delay(300);
  
  const index = moodboards.findIndex(m => m.Id === id);
  if (index === -1) {
    throw new Error("Moodboard not found");
  }
  
  const updatedMoodboard = { 
    ...moodboards[index], 
    ...updatedData,
    lastModified: new Date().toISOString()
  };
  moodboards[index] = updatedMoodboard;
  return { ...updatedMoodboard };
};

export const deleteMoodboard = async (id) => {
  await delay(250);
  
  const index = moodboards.findIndex(m => m.Id === id);
  if (index === -1) {
    throw new Error("Moodboard not found");
  }
moodboards.splice(index, 1);
  return true;
};

export const getPersonaRecommendations = async (answers) => {
  await delay(300);
  
  // Calculate persona based on answers
  const persona = calculatePersona(answers);
  
  return {
    ...persona,
    starterPacks: getPersonaStarterPacks(persona.type)
  };
};

const calculatePersona = (answers) => {
  const { style_preference, color_palette, lifestyle, inspiration } = answers;
  
  // Persona calculation logic
  if (style_preference === 'romantic' && color_palette === 'pastels') {
    return {
      type: 'dreamy_romantic',
      title: 'Dreamy Romantic',
      emoji: '🌸',
      description: 'You\'re drawn to soft, ethereal pieces that make you feel like you\'re floating on cloud nine. Your style is all about feminine grace with a touch of whimsy.',
      aestheticTags: ['Cottagecore', 'Soft Girl', 'Romantic', 'Dreamy', 'Feminine', 'Pastel']
    };
  } else if (style_preference === 'minimalist' && color_palette === 'neutrals') {
    return {
      type: 'serene_minimalist',
      title: 'Serene Minimalist',
      emoji: '🤍',
      description: 'You find beauty in simplicity and believe that less truly is more. Your wardrobe is carefully curated with timeless pieces that speak volumes through their quiet elegance.',
      aestheticTags: ['Minimalist', 'Clean Girl', 'Timeless', 'Neutral', 'Sophisticated', 'Modern']
    };
  } else if (style_preference === 'edgy' && color_palette === 'monochrome') {
    return {
      type: 'bold_rebel',
      title: 'Bold Rebel',
      emoji: '🖤',
      description: 'You\'re not afraid to make a statement and your style reflects your fearless personality. You mix textures, play with proportions, and always keep people guessing.',
      aestheticTags: ['Dark Academia', 'Grunge', 'Edgy', 'Alternative', 'Statement', 'Bold']
    };
  } else if (style_preference === 'vintage' || inspiration === 'art') {
    return {
      type: 'artsy_vintage',
      title: 'Artsy Vintage Soul',
      emoji: '🎨',
      description: 'You\'re inspired by the past and have an eye for unique, artistic pieces. Your style tells stories and each outfit is like a carefully curated gallery exhibition.',
      aestheticTags: ['Vintage', 'Artistic', 'Eclectic', 'Boho', 'Creative', 'Unique']
    };
  } else if (lifestyle === 'social' && color_palette === 'jewel_tones') {
    return {
      type: 'glamorous_socialite',
      title: 'Glamorous Socialite',
      emoji: '💎',
      description: 'You love to shine and aren\'t afraid to be the center of attention. Your style is luxurious, bold, and always photo-ready for any occasion.',
      aestheticTags: ['Glamorous', 'Luxe', 'Statement', 'Rich Colors', 'Social', 'Dramatic']
    };
  } else {
    // Default balanced persona
    return {
      type: 'balanced_chic',
      title: 'Balanced Chic',
      emoji: '✨',
      description: 'You have a wonderful balance of different style elements, creating looks that are both versatile and uniquely you. Your adaptable style works for any occasion.',
      aestheticTags: ['Versatile', 'Chic', 'Balanced', 'Adaptable', 'Modern', 'Stylish']
    };
  }
};

const getPersonaStarterPacks = (personaType) => {
  const starterPacks = {
    dreamy_romantic: [
      {
        name: 'Cottagecore Dreams',
        emoji: '🌿',
        description: 'Flowing dresses, floral prints, and earth-inspired pieces for that countryside aesthetic.',
        tags: ['Floral', 'Flowing', 'Natural', 'Soft']
      },
      {
        name: 'Soft Girl Essentials',
        emoji: '🎀',
        description: 'Pastel pieces, cute accessories, and sweet details that make hearts flutter.',
        tags: ['Pastel', 'Sweet', 'Cute', 'Feminine']
      }
    ],
    serene_minimalist: [
      {
        name: 'Clean Lines Collection',
        emoji: '⚪',
        description: 'Structured pieces in neutral tones that create effortless sophistication.',
        tags: ['Structured', 'Clean', 'Neutral', 'Timeless']
      },
      {
        name: 'Modern Basics',
        emoji: '🤎',
        description: 'Essential wardrobe staples that mix and match beautifully.',
        tags: ['Essential', 'Versatile', 'Quality', 'Basic']
      }
    ],
    bold_rebel: [
      {
        name: 'Dark Academia Vibes',
        emoji: '📚',
        description: 'Scholarly chic with dark colors, textures, and intellectual energy.',
        tags: ['Dark', 'Academic', 'Textured', 'Sophisticated']
      },
      {
        name: 'Alternative Edge',
        emoji: '⚡',
        description: 'Bold pieces that break conventions and make powerful statements.',
        tags: ['Alternative', 'Bold', 'Unique', 'Statement']
      }
    ],
    artsy_vintage: [
      {
        name: 'Vintage Treasures',
        emoji: '🏺',
        description: 'Timeless pieces with history, character, and artistic flair.',
        tags: ['Vintage', 'Unique', 'Artistic', 'Character']
      },
      {
        name: 'Bohemian Spirit',
        emoji: '🌙',
        description: 'Free-spirited pieces that celebrate creativity and individuality.',
        tags: ['Boho', 'Creative', 'Free-spirited', 'Artistic']
      }
    ],
    glamorous_socialite: [
      {
        name: 'Luxe Nights',
        emoji: '🥂',
        description: 'Show-stopping pieces perfect for making grand entrances.',
        tags: ['Luxe', 'Glamorous', 'Evening', 'Statement']
      },
      {
        name: 'Rich & Bold',
        emoji: '💜',
        description: 'Deep jewel tones and rich textures that command attention.',
        tags: ['Rich Colors', 'Luxurious', 'Bold', 'Attention-grabbing']
      }
    ],
    balanced_chic: [
      {
        name: 'Versatile Classics',
        emoji: '👗',
        description: 'Adaptable pieces that work from day to night, casual to formal.',
        tags: ['Versatile', 'Classic', 'Adaptable', 'Timeless']
      },
      {
        name: 'Modern Mix',
        emoji: '🌟',
        description: 'Contemporary pieces that blend different styles effortlessly.',
        tags: ['Modern', 'Mixed', 'Contemporary', 'Stylish']
      }
    ]
  };

  return starterPacks[personaType] || starterPacks.balanced_chic;
};