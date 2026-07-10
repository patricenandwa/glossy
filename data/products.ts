import silkGlaze from "@/assets/product-silk-glaze.jpg";
import morningDew from "@/assets/product-morning-dew.jpg";
import glassHour from "@/assets/product-glass-hour.jpg";
import nightGloss from "@/assets/product-night-gloss.jpg";
import honeySheen from "@/assets/product-honey-sheen.jpg";
import roseTint from "@/assets/product-rose-tint.jpg";
import mauveMist from "@/assets/product-mauve-mist.jpg";
import cocoaGlaze from "@/assets/product-cocoa-glaze.jpg";
import { StaticImageData } from "next/image";

export type Shade = {
  name: string;
  hex: string;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  image: StaticImageData | string;
  gallery: (StaticImageData | string)[];
  shades: Shade[];
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  description: string;
  benefits: string[];
  ingredients: string;
  howToUse: string;
};

export const products: Product[] = [
  {
    slug: "silk-glaze",
    name: "Silk Glaze",
    tagline: "The everyday nude",
    price: 1500,
    image: silkGlaze,
    gallery: [silkGlaze, gallerySwap(morningDew), gallerySwap(honeySheen)],
    shades: [
      { name: "Barely There", hex: "#f4dcd6" },
      { name: "Peach Whisper", hex: "#e89088" },
      { name: "Warm Suede", hex: "#9c5c56" },
    ],
    rating: 4.9,
    reviewCount: 128,
    stock: 42,
    featured: true,
    bestSeller: true,
    description:
      "Our signature clear-to-nude gloss. Cushioned, weightless and quietly luminous — the one you'll reach for every morning.",
    benefits: [
      "Non-sticky, cushioned wear",
      "Hydrates with shea butter & vitamin E",
      "12-hour comfortable shine",
      "Vegan & cruelty free",
    ],
    ingredients:
      "Polyisobutene, Hydrogenated Polyisobutene, Butyrospermum Parkii (Shea) Butter, Tocopheryl Acetate (Vitamin E), Jojoba Oil, Peppermint Oil, Mica.",
    howToUse:
      "Glide across bare lips or layer over your favourite lipstick for instant dimension. Reapply throughout the day for lasting shine.",
  },
  {
    slug: "morning-dew",
    name: "Morning Dew",
    tagline: "Fresh from the wand",
    price: 1400,
    image: morningDew,
    gallery: [morningDew, silkGlaze, glassHour],
    shades: [
      { name: "Bare", hex: "#fbe6e0" },
      { name: "Petal", hex: "#f0b5b0" },
    ],
    rating: 4.8,
    reviewCount: 96,
    stock: 30,
    featured: true,
    bestSeller: false,
    description:
      "A dewy, plumping gloss with the softest tint. Feels like a balm, finishes like a gloss.",
    benefits: [
      "Subtle plumping effect",
      "Cooling peppermint finish",
      "Buildable soft tint",
      "Fragrance free",
    ],
    ingredients:
      "Polybutene, Hydrogenated Polyisobutene, Ricinus Communis (Castor) Seed Oil, Menthol, Peppermint Oil, Tocopheryl Acetate.",
    howToUse:
      "Apply one thin layer for a natural sheen or two for a pillowy, cushioned finish.",
  },
  {
    slug: "glass-hour",
    name: "Glass Hour",
    tagline: "The mirror-shine pink",
    price: 1600,
    image: glassHour,
    gallery: [glassHour, roseTint, morningDew],
    shades: [
      { name: "Ballet", hex: "#f8d7da" },
      { name: "Pink Champagne", hex: "#e6a5b6" },
      { name: "Rose Reign", hex: "#d63384" },
    ],
    rating: 5.0,
    reviewCount: 210,
    stock: 55,
    featured: true,
    bestSeller: true,
    description:
      "A high-shine pink tint with a true glass finish. The gloss that turned into a TikTok favourite.",
    benefits: [
      "Mirror-glass reflection",
      "Buildable pink pigment",
      "Kissable, never sticky",
      "8+ hour wear",
    ],
    ingredients:
      "Polybutene, Hydrogenated Polydecene, Ozokerite, CI 15850, CI 77491, Squalane, Tocopherol.",
    howToUse:
      "Sweep across the centre of the lip and press together for a natural pillow effect.",
  },
  {
    slug: "night-gloss",
    name: "Night Gloss",
    tagline: "For after 7pm",
    price: 1800,
    image: nightGloss,
    gallery: [nightGloss, cocoaGlaze, mauveMist],
    shades: [
      { name: "Burgundy", hex: "#5a1f2b" },
      { name: "Espresso", hex: "#3d2b1f" },
    ],
    rating: 4.9,
    reviewCount: 74,
    stock: 20,
    featured: true,
    bestSeller: true,
    description:
      "Deep pigment meets high shine. Formulated for the confident evening lip.",
    benefits: [
      "Rich, sheer-to-full pigment",
      "Cushioned all-night wear",
      "Doesn't feather or bleed",
      "Vegan formula",
    ],
    ingredients:
      "Polyisobutene, Hydrogenated Polyisobutene, CI 77491, CI 15850, Butyrospermum Parkii (Shea) Butter, Tocopheryl Acetate.",
    howToUse:
      "Line lips with a nude pencil, then apply Night Gloss from the centre out for a plush, blurred finish.",
  },
  {
    slug: "honey-sheen",
    name: "Honey Sheen",
    tagline: "Warm caramel glow",
    price: 1500,
    image: honeySheen,
    gallery: [honeySheen, cocoaGlaze, silkGlaze],
    shades: [
      { name: "Honey", hex: "#e0a37a" },
      { name: "Toffee", hex: "#b57046" },
    ],
    rating: 4.7,
    reviewCount: 61,
    stock: 38,
    featured: false,
    bestSeller: false,
    description:
      "A warm, honeyed nude with a subtle golden shimmer. Made for melanin.",
    benefits: [
      "Golden micro-shimmer",
      "Nourishing honey extract",
      "Buildable, natural finish",
      "Skin-loving oils",
    ],
    ingredients:
      "Polybutene, Squalane, Mel (Honey) Extract, Mica, Tocopheryl Acetate, Rosa Canina Fruit Oil.",
    howToUse:
      "Layer over a lip balm base or wear alone for a soft, sun-kissed finish.",
  },
  {
    slug: "rose-tint",
    name: "Rose Tint",
    tagline: "Sunlit coral pink",
    price: 1500,
    image: roseTint,
    gallery: [roseTint, glassHour, mauveMist],
    shades: [
      { name: "Coral", hex: "#f18c7b" },
      { name: "Rose", hex: "#d46b6b" },
    ],
    rating: 4.8,
    reviewCount: 88,
    stock: 33,
    featured: false,
    bestSeller: true,
    description:
      "A sunlit coral gloss that flatters every undertone. Weightless, wearable, and always fresh.",
    benefits: [
      "Universal coral pink",
      "High shine, low weight",
      "Vitamin E enriched",
      "Non-sticky finish",
    ],
    ingredients:
      "Polybutene, Hydrogenated Polyisobutene, CI 15850, Butyrospermum Parkii (Shea) Butter, Tocopheryl Acetate.",
    howToUse:
      "Apply directly from the wand for a fresh, natural stain.",
  },
  {
    slug: "mauve-mist",
    name: "Mauve Mist",
    tagline: "Soft rose-mauve",
    price: 1500,
    image: mauveMist,
    gallery: [mauveMist, roseTint, glassHour],
    shades: [
      { name: "Mauve", hex: "#b76e79" },
      { name: "Dusty Rose", hex: "#c78a90" },
    ],
    rating: 4.9,
    reviewCount: 52,
    stock: 25,
    featured: false,
    bestSeller: false,
    description:
      "A quiet, romantic mauve — like your natural lip, but softer and more polished.",
    benefits: [
      "Universally flattering mauve",
      "Comfortable, cushioned wear",
      "Long-lasting soft tint",
      "Cruelty free",
    ],
    ingredients:
      "Polybutene, Hydrogenated Polyisobutene, CI 77491, Squalane, Tocopheryl Acetate.",
    howToUse:
      "Perfect over lip liner for a your-lips-but-better finish.",
  },
  {
    slug: "cocoa-glaze",
    name: "Cocoa Glaze",
    tagline: "Warm cocoa brown",
    price: 1700,
    image: cocoaGlaze,
    gallery: [cocoaGlaze, honeySheen, nightGloss],
    shades: [
      { name: "Cocoa", hex: "#704214" },
      { name: "Chocolate", hex: "#5a2f14" },
    ],
    rating: 4.9,
    reviewCount: 118,
    stock: 45,
    featured: false,
    bestSeller: true,
    description:
      "A rich cocoa brown with a glossy chocolate finish. Made in Nairobi, made for us.",
    benefits: [
      "Deep, rich pigment",
      "Cocoa butter enriched",
      "12-hour comfortable wear",
      "Warm, luxurious scent",
    ],
    ingredients:
      "Polybutene, Theobroma Cacao (Cocoa) Seed Butter, CI 77491, CI 15850, Tocopheryl Acetate.",
    howToUse:
      "Wear alone as a sheer wash or layer for a rich chocolate finish.",
  },
];

// Helper to ensure gallery reuses valid product image imports rather than a string
function gallerySwap(img: string | StaticImageData): string | StaticImageData {
  return img;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeatured(): Product[] {
  return products.filter((p) => p.featured);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.bestSeller);
}

export function getRelated(slug: string, count = 4): Product[] {
  return products.filter((p) => p.slug !== slug).slice(0, count);
}
