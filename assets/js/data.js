/* ==========================================================================
   Bravo Paints — shared site data
   NOTE: technical specs (coverage, drying times, pack sizes) and colour
   names/codes are placeholders. Replace them with the official values from
   product data sheets before going live.
   ========================================================================== */

window.BRAVO = window.BRAVO || {};

BRAVO.products = [
  {
    id: "ultra-premium",
    name: "Ultra Premium",
    type: "Interior Emulsion",
    tagline: "Superior washability",
    badge: "Best seller",
    image: "assets/img/tin-ultra-premium.jpg",
    surfaces: ["interior", "ceiling"],
    finish: "Smooth matt",
    coverage: 12, // m² per litre, per coat
    touchDry: "1 hour",
    recoat: "2–4 hours",
    sizes: [1, 5, 20],
    description:
      "Our flagship interior emulsion. A rich, smooth matt finish with excellent hiding power that stands up to everyday scrubbing — ideal for living rooms, hallways and busy family spaces.",
    benefits: ["Highly washable, scrub-resistant film", "Excellent opacity and coverage", "Low odour, water-based formula", "Available in the full Bravo colour range"],
  },
  {
    id: "silk-touch",
    name: "Silk Touch",
    type: "Interior Emulsion",
    tagline: "Luxury finish",
    image: "assets/img/tin-silk-touch.jpg",
    surfaces: ["interior"],
    finish: "Soft sheen / silk",
    coverage: 11,
    touchDry: "1 hour",
    recoat: "3–4 hours",
    sizes: [1, 5, 20],
    description:
      "A luxurious soft-sheen emulsion that brings depth and elegance to feature walls, bedrooms and dining rooms. The subtle lustre makes colours glow and wipes clean with ease.",
    benefits: ["Elegant silk sheen", "Rich, vibrant colour", "Easy to wipe clean", "Smooth, brush-mark-free application"],
  },
  {
    id: "weather-shield",
    name: "Weather Shield",
    type: "Exterior Emulsion",
    tagline: "All-weather protection",
    badge: "Exterior",
    image: "assets/img/tin-weather-shield.jpg",
    surfaces: ["exterior"],
    finish: "Low sheen",
    coverage: 10,
    touchDry: "1–2 hours",
    recoat: "4 hours",
    sizes: [5, 20],
    description:
      "Tough exterior protection engineered for sun, rain and humidity. Weather Shield resists fading, cracking and mould growth to keep your home looking freshly painted for longer.",
    benefits: ["UV and fade resistant", "Water-repellent, breathable film", "Anti-fungal and anti-algae protection", "Flexible — resists cracking and peeling"],
  },
  {
    id: "roof-guard",
    name: "Roof Guard",
    type: "Roof Paint",
    tagline: "Ultimate protection",
    image: "assets/img/tin-roof-guard.jpg",
    surfaces: ["exterior", "roof"],
    finish: "Satin",
    coverage: 8,
    touchDry: "2 hours",
    recoat: "6 hours",
    sizes: [5, 20],
    description:
      "A high-build coating for metal, asbestos-free fibre cement and concrete roof tiles. Roof Guard seals, protects and restores colour while standing up to intense sun and heavy rain.",
    benefits: ["Heat-reflective formulation", "Excellent adhesion to roofing surfaces", "Resists chalking and fading", "Long-lasting weatherproof film"],
  },
  {
    id: "metal-guard",
    name: "Metal Guard",
    type: "Metal Paint",
    tagline: "Rust protection",
    image: "assets/img/tin-metal-guard.jpg",
    surfaces: ["metal", "wood"],
    finish: "High gloss",
    coverage: 12,
    touchDry: "4 hours",
    recoat: "16 hours",
    sizes: [1, 5, 20],
    description:
      "A durable gloss enamel for gates, burglar bars, railings, doors and trims. Metal Guard inhibits rust and delivers a hard-wearing, high-gloss finish on both metal and wood.",
    benefits: ["Rust-inhibiting protection", "Hard-wearing high-gloss finish", "Suitable for metal and wood", "Interior and exterior use"],
  },
];

BRAVO.surfaces = {
  interior: "Interior walls",
  exterior: "Exterior walls",
  ceiling: "Ceilings",
  roof: "Roofs",
  metal: "Metal",
  wood: "Wood",
};

BRAVO.families = [
  { id: "neutrals", name: "Whites & Neutrals", swatch: "#efe7da" },
  { id: "reds", name: "Reds & Terracottas", swatch: "#c4643f" },
  { id: "yellows", name: "Yellows", swatch: "#f2c230" },
  { id: "greens", name: "Greens", swatch: "#7b9a66" },
  { id: "blues", name: "Blues", swatch: "#1f4e85" },
  { id: "purples", name: "Purples", swatch: "#9d86ad" },
  { id: "greys", name: "Greys & Charcoals", swatch: "#6c6f73" },
];

/* name, hex, family, code */
BRAVO.colours = [
  // Whites & neutrals
  ["Brilliant White", "#fbfbf8", "neutrals"],
  ["Ivory Lace", "#f6f0e1", "neutrals"],
  ["Linen Whisper", "#efe7da", "neutrals"],
  ["Warm Sand", "#e4d3b7", "neutrals"],
  ["Desert Dune", "#d4bc95", "neutrals"],
  ["Mushroom", "#b9a690", "neutrals"],
  ["Latte", "#a88c6d", "neutrals"],
  // Reds & terracottas
  ["Terracotta Warmth", "#c4643f", "reds"],
  ["Clay Pot", "#b5562f", "reds"],
  ["Sunset Coral", "#e07a5f", "reds"],
  ["Peach Blossom", "#f2b49b", "reds"],
  ["Rosewood", "#9b3f3a", "reds"],
  ["Brick Dust", "#a34a35", "reds"],
  ["Postbox Red", "#c22a2a", "reds"],
  // Yellows
  ["Sunshine Days", "#f2c230", "yellows"],
  ["Mustard Seed", "#d9a521", "yellows"],
  ["Golden Hour", "#f5b942", "yellows"],
  ["Lemon Zest", "#f6dd5a", "yellows"],
  ["Butter Cream", "#f7e7a6", "yellows"],
  ["Honey Glow", "#e3a23b", "yellows"],
  ["Ochre Earth", "#c08a2b", "yellows"],
  // Greens
  ["Sage Serenity", "#7b9a66", "greens"],
  ["Olive Grove", "#6a7a3c", "greens"],
  ["Forest Canopy", "#2f5a3e", "greens"],
  ["Mint Breeze", "#bcd8c1", "greens"],
  ["Eucalyptus", "#8fae9b", "greens"],
  ["Pistachio", "#c9d49a", "greens"],
  ["Emerald Deep", "#1f5e4f", "greens"],
  // Blues
  ["Ocean Breeze", "#1f4e85", "blues"],
  ["Bravo Navy", "#0a1f3c", "blues"],
  ["Sky Splash", "#74c3d4", "blues"],
  ["Teal Lagoon", "#21808d", "blues"],
  ["Powder Blue", "#b9d5e8", "blues"],
  ["Denim Day", "#3e6b9e", "blues"],
  ["Royal Cobalt", "#3757cb", "blues"],
  // Purples
  ["Purple Haze", "#9d86ad", "purples"],
  ["Lavender Mist", "#cbbfdc", "purples"],
  ["Plum Velvet", "#5e3a5e", "purples"],
  ["Lilac Dream", "#b6a1c9", "purples"],
  ["Heather", "#8a6f8f", "purples"],
  ["Orchid Bloom", "#a865a3", "purples"],
  // Greys & charcoals
  ["Cloud Grey", "#d9dadb", "greys"],
  ["Pebble", "#b4b2ad", "greys"],
  ["Slate", "#6c6f73", "greys"],
  ["Storm Front", "#4a4f57", "greys"],
  ["Charcoal", "#33363b", "greys"],
  ["Midnight Black", "#1b1c1f", "greys"],
].map(([name, hex, family], i) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  hex,
  family,
  code: "BP-" + String(1001 + i),
}));

BRAVO.colourStories = {
  terracotta: { family: "reds", title: "Terracotta Warmth" },
  ocean: { family: "blues", title: "Ocean Breeze" },
  sage: { family: "greens", title: "Sage Serenity" },
  sunshine: { family: "yellows", title: "Sunshine Days" },
  purple: { family: "purples", title: "Purple Haze" },
};
