export type Product = {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  images: string[]
  category: string
  description: string
  benefits: string[]
  ingredients?: string
  howToUse?: string
  inStock: boolean
  featured: boolean
}

export const products: Product[] = [
  {
    id: "1",
    name: "Luxe Nail Serum",
    price: 48,
    rating: 4.9,
    reviews: 127,
    image: "/luxury-nail-serum-bottle-minimalist-gold-packaging.jpg",
    images: [
      "/luxury-nail-serum-bottle-minimalist-gold-packaging.jpg",
      "/nail-serum-texture-close-up.jpg",
      "/nail-serum-application.jpg",
    ],
    category: "nails",
    description:
      "An intensive nail strengthening serum infused with keratin and biotin to promote healthy, resilient nails. This luxurious formula penetrates deep into the nail bed to repair damage and prevent breakage.",
    benefits: ["Strengthens weak nails", "Promotes growth", "Prevents breakage", "Hydrates cuticles"],
    ingredients: "Keratin, Biotin, Vitamin E, Jojoba Oil, Argan Oil, Rose Hip Extract",
    howToUse:
      "Apply daily to clean, dry nails. Massage gently into nail and cuticle. For best results, use before bed.",
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "Silk Hair Elixir",
    price: 72,
    rating: 4.8,
    reviews: 89,
    image: "/premium-hair-oil-serum-elegant-dark-bottle.jpg",
    images: [
      "/premium-hair-oil-serum-elegant-dark-bottle.jpg",
      "/hair-oil-serum-texture-gold.jpg",
      "/hair-treatment-application.jpg",
    ],
    category: "hair",
    description:
      "A weightless hair oil that transforms dry, damaged hair into silky, lustrous locks. Formulated with rare botanicals and precious oils for salon-quality results at home.",
    benefits: ["Adds brilliant shine", "Tames frizz", "Heat protection", "Deep nourishment"],
    ingredients: "Argan Oil, Camellia Oil, Silk Amino Acids, Vitamin E, Sweet Almond Oil",
    howToUse:
      "Apply 2-3 drops to damp or dry hair, focusing on mid-lengths and ends. Can be used as a pre-styling treatment or finishing oil.",
    inStock: true,
    featured: false,
  },
  {
    id: "3",
    name: "Rose Cuticle Oil",
    price: 32,
    rating: 5.0,
    reviews: 203,
    image: "/cuticle-oil-dropper-bottle-rose-gold-minimalist.jpg",
    images: [
      "/cuticle-oil-dropper-bottle-rose-gold-minimalist.jpg",
      "/cuticle-oil-dropper-application.jpg",
      "/rose-oil-texture-pink.jpg",
    ],
    category: "nails",
    description:
      "A delicate yet powerful cuticle treatment infused with pure rose extract and nourishing oils. This daily essential keeps cuticles soft, healthy, and beautifully groomed.",
    benefits: ["Softens cuticles", "Rose scent", "Quick absorption", "Non-greasy"],
    ingredients: "Rose Hip Oil, Vitamin E, Jojoba Oil, Rose Extract, Lavender Essential Oil",
    howToUse: "Apply a drop to each cuticle and massage in circular motions. Use daily for best results.",
    inStock: true,
    featured: false,
  },
  {
    id: "4",
    name: "Velvet Hand Cream",
    price: 38,
    rating: 4.9,
    reviews: 156,
    image: "/luxury-hand-cream-tube-elegant-packaging-cream.jpg",
    images: [
      "/luxury-hand-cream-tube-elegant-packaging-cream.jpg",
      "/hand-cream-texture-white-luxurious.jpg",
      "/hand-cream-application-elegant.jpg",
    ],
    category: "nails",
    description:
      "An ultra-rich hand cream that envelops skin in lasting moisture. This indulgent formula leaves hands feeling impossibly soft with a subtle, sophisticated scent.",
    benefits: ["24-hour moisture", "Anti-aging", "Non-greasy", "Elegant scent"],
    ingredients: "Shea Butter, Hyaluronic Acid, Vitamin C, Aloe Vera, Chamomile Extract",
    howToUse: "Apply generously to hands as needed throughout the day. Perfect after hand washing.",
    inStock: true,
    featured: false,
  },
  {
    id: "5",
    name: "Radiance Face Mist",
    price: 56,
    rating: 4.7,
    reviews: 94,
    image: "/facial-mist-spray-bottle-elegant-minimalist-gold.jpg",
    images: [
      "/facial-mist-spray-bottle-elegant-minimalist-gold.jpg",
      "/face-mist-spray-action.jpg",
      "/facial-mist-dewy-skin.jpg",
    ],
    category: "beauty",
    description:
      "An instant refresh in a bottle. This luxurious face mist hydrates, sets makeup, and delivers a dewy glow whenever your skin needs a pick-me-up.",
    benefits: ["Instant hydration", "Sets makeup", "Dewy finish", "Refreshing"],
    ingredients: "Rose Water, Hyaluronic Acid, Aloe Vera, Cucumber Extract, Green Tea",
    howToUse:
      "Hold 6-8 inches from face and mist evenly. Use over makeup for a dewy finish or on bare skin for hydration.",
    inStock: true,
    featured: true,
  },
  {
    id: "6",
    name: "Overnight Hair Mask",
    price: 64,
    rating: 4.8,
    reviews: 67,
    image: "/hair-mask-jar-luxury-beauty-product-dark-packaging.jpg",
    images: [
      "/hair-mask-jar-luxury-beauty-product-dark-packaging.jpg",
      "/hair-mask-texture-creamy-white.jpg",
      "/hair-mask-jar-open-view.jpg",
    ],
    category: "hair",
    description:
      "Wake up to transformed hair. This intensive overnight treatment repairs, restores, and rejuvenates while you sleep, delivering salon-worthy results by morning.",
    benefits: ["Deep repair", "Intense moisture", "Silk pillowcase safe", "Color-safe"],
    ingredients: "Keratin, Argan Oil, Coconut Oil, Honey Extract, Silk Proteins",
    howToUse:
      "Apply to damp hair before bed, focusing on damaged areas. Rinse thoroughly in the morning. Use 1-2 times weekly.",
    inStock: true,
    featured: false,
  },
  {
    id: "7",
    name: "Lash Growth Serum",
    price: 85,
    originalPrice: 95,
    rating: 4.6,
    reviews: 78,
    image: "/lash-serum-tube-gold-elegant.jpg",
    images: ["/lash-serum-tube-gold-elegant.jpg", "/lash-serum-applicator-wand.jpg"],
    category: "beauty",
    description:
      "Achieve longer, fuller lashes naturally. This scientifically formulated serum promotes lash growth and thickness for a dramatic, wide-eyed look.",
    benefits: ["Longer lashes", "Fuller appearance", "Gentle formula", "Visible results in 4 weeks"],
    ingredients: "Biotin, Peptides, Hyaluronic Acid, Vitamin B5, Castor Oil",
    howToUse: "Apply nightly to clean lash line using the precision applicator. Avoid getting in eyes.",
    inStock: true,
    featured: false,
  },
  {
    id: "8",
    name: "Hydrating Lip Oil",
    price: 28,
    rating: 4.9,
    reviews: 142,
    image: "/lip-oil-tube-pink-gold-minimalist.jpg",
    images: ["/lip-oil-tube-pink-gold-minimalist.jpg", "/placeholder.svg?height=600&width=600"],
    category: "beauty",
    description:
      "Luxurious lip care meets subtle color. This nourishing lip oil delivers hydration while imparting a beautiful, natural-looking tint.",
    benefits: ["Deep hydration", "Subtle color", "Non-sticky", "Plumping effect"],
    ingredients: "Jojoba Oil, Vitamin E, Rose Hip Oil, Shea Butter, Natural Pigments",
    howToUse: "Apply directly to lips as needed. Use alone or over lipstick for added shine.",
    inStock: false,
    featured: false,
  },
]

export const categories = [
  { id: "all", name: "All Products" },
  { id: "nails", name: "Nail Care" },
  { id: "beauty", name: "Beauty" },
]
