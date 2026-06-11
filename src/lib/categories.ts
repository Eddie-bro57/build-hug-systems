export type Category = {
  slug: string;
  name: string;
  emoji: string;
  image: string;
  description: string;
  examples: string[];
  gradient: string;
};

export const categories: Category[] = [
  {
    slug: "food",
    name: "Food & Cooking",
    emoji: "🍳",
    image: "/categories/food.jpg",
    description: "Recipes, techniques, and kitchen know-how.",
    examples: ["Bake banana bread", "Cook jollof rice", "Make sourdough starter"],
    gradient: "from-[#ffb86b] to-[#ff6f61]",
  },
  {
    slug: "home",
    name: "DIY & Home",
    emoji: "🔧",
    image: "/categories/home.jpg",
    description: "Fix it, build it, clean it.",
    examples: ["Unclog a drain", "Paint a wall", "Hang a picture frame"],
    gradient: "from-[#f59e0b] to-[#b45309]",
  },
  {
    slug: "sports",
    name: "Sports & Fitness",
    emoji: "⚽",
    image: "/categories/sports.jpg",
    description: "Train, play, and improve your game.",
    examples: ["Do a proper push-up", "Dribble a basketball", "Start running 5K"],
    gradient: "from-[#34d399] to-[#059669]",
  },
  {
    slug: "music",
    name: "Music",
    emoji: "🎵",
    image: "/categories/music.jpg",
    description: "Play instruments, sing, and produce sound.",
    examples: ["Read sheet music", "Tune a guitar", "Make a beat in FL Studio"],
    gradient: "from-[#a78bfa] to-[#6366f1]",
  },
  {
    slug: "tech",
    name: "Technology",
    emoji: "💻",
    image: "/categories/tech.jpg",
    description: "Software, gadgets, and digital skills.",
    examples: ["Build a website", "Set up a VPN", "Reset a router"],
    gradient: "from-[#60a5fa] to-[#2563eb]",
  },
  {
    slug: "health",
    name: "Health & Wellness",
    emoji: "🩺",
    image: "/categories/health.jpg",
    description: "Care for your body and mind with expert-backed steps.",
    examples: ["Do yoga for beginners", "Meal prep for the week", "Improve your posture"],
    gradient: "from-[#14b8a6] to-[#0f766e]",
  },
  {
    slug: "art",
    name: "Creative Arts",
    emoji: "🎨",
    image: "/categories/art.jpg",
    description: "Create, draw, paint, and make things by hand.",
    examples: ["Mix watercolors", "Crochet a scarf", "Make pottery at home"],
    gradient: "from-[#f43f5e] to-[#be185d]",
  },
  {
    slug: "travel",
    name: "Travel & Lifestyle",
    emoji: "✈️",
    image: "/categories/travel.jpg",
    description: "Plan trips, build habits, navigate the world.",
    examples: ["Apply for a passport", "Book a cheap flight", "Start a morning routine"],
    gradient: "from-[#22d3ee] to-[#0891b2]",
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
