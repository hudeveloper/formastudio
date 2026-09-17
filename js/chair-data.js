// Chair data and configuration for forma studio
const chairVariants = [
  {
    id: "sapphire",
    name: "Velvet Sapphire",
    category: "Lounge Chair",
    price: "$1,450",
    image: "./Images/Gemini_Generated_Image_wor6mawor6mawor6.png",
    colorHex: "#1a4dc4",
    swatchBorder: "#3b82f6",
    bgGradient: "radial-gradient(ellipse at 50% 50%, #205cd4 0%, #1545ad 45%, #0c2d78 100%)",
    accentColor: "#1d4ed8",
    description: "Deep oceanic royal velvet with iridescent micro-sheen. Sourced from Como, Italy.",
    hotspots: [
      {
        id: "backrest",
        x: "67%",
        y: "41%",
        title: "Curved Backrest",
        text: "Contoured anatomical support engineered with high-resiliency molded memory foam."
      },
      {
        id: "cushion",
        x: "67%",
        y: "61%",
        title: "Seat Cushion",
        text: "Premium microfiber upholstery: durable, easy-care, and fade-resistant. Internal structural wood frame."
      },
      {
        id: "leg",
        x: "33%",
        y: "70%",
        title: "Monolithic Arch Base",
        text: "Continuously joined structural arch reinforced with kiln-dried Nordic ash hardwood."
      }
    ]
  },
  {
    id: "emerald",
    name: "Emerald Green",
    category: "Lounge Chair",
    price: "$1,450",
    image: "./Images/Gemini_Generated_Image_4ixyyn4ixyyn4ixy.png",
    colorHex: "#184936",
    swatchBorder: "#10b981",
    bgGradient: "radial-gradient(ellipse at 50% 50%, #1b6348 0%, #0e402e 45%, #062319 100%)",
    accentColor: "#059669",
    description: "Lush botanical forest velvet with rich dual-tone nap and stain-repellent nano-coating.",
    hotspots: [
      {
        id: "backrest",
        x: "67%",
        y: "41%",
        title: "Curved Backrest",
        text: "Sculptural continuous crest rail shaped by master artisan upholsterers."
      },
      {
        id: "cushion",
        x: "67%",
        y: "61%",
        title: "Seat Cushion",
        text: "Ultra-dense multi-layer foam core offering medium-plush firmness and cloud-like sink."
      },
      {
        id: "leg",
        x: "33%",
        y: "70%",
        title: "Monolithic Arch Base",
        text: "Seamlessly upholstered twin column legs with integrated acoustic floor glides."
      }
    ]
  },
  {
    id: "terracotta",
    name: "Rust Terracotta",
    category: "Lounge Chair",
    price: "$1,450",
    image: "./Images/Gemini_Generated_Image_6d43a6d43a6d43a6.png",
    colorHex: "#c84f18",
    swatchBorder: "#f97316",
    bgGradient: "radial-gradient(ellipse at 50% 50%, #b94b1a 0%, #7c2d12 45%, #431407 100%)",
    accentColor: "#ea580c",
    description: "Earthy Tuscan rust velvet delivering warm tactile comfort and sun-kissed ambiance.",
    hotspots: [
      {
        id: "backrest",
        x: "67%",
        y: "41%",
        title: "Curved Backrest",
        text: "Relaxed 105° lumbar angle designed for hours of contemplative lounging."
      },
      {
        id: "cushion",
        x: "67%",
        y: "61%",
        title: "Seat Cushion",
        text: "Breathable natural fiber backing with anti-sag sinuous spring suspension."
      },
      {
        id: "leg",
        x: "33%",
        y: "70%",
        title: "Monolithic Arch Base",
        text: "Solid reinforced timber frame certified by the Forest Stewardship Council (FSC)."
      }
    ]
  },
  {
    id: "ivory",
    name: "Ivory Bouclé",
    category: "Lounge Chair",
    price: "$1,520",
    image: "./Images/Gemini_Generated_Image_2rpvww2rpvww2rpv.png",
    colorHex: "#d9d2c5",
    swatchBorder: "#e5e7eb",
    bgGradient: "radial-gradient(ellipse at 50% 50%, #4b5563 0%, #2a313d 45%, #151921 100%)",
    accentColor: "#6b7280",
    description: "Cream off-white plush velvet with soft heathered nuances. Minimalist Scandinavian pure aesthetic.",
    hotspots: [
      {
        id: "backrest",
        x: "67%",
        y: "41%",
        title: "Curved Backrest",
        text: "Sculptural organic silhouette inspired by modern modernist architecture."
      },
      {
        id: "cushion",
        x: "67%",
        y: "61%",
        title: "Seat Cushion",
        text: "Oeko-Tex Standard 100 certified velvet upholstery free from harmful chemicals."
      },
      {
        id: "leg",
        x: "33%",
        y: "70%",
        title: "Monolithic Arch Base",
        text: "Concealed structural steel inner bracket for lifetime structural stability."
      }
    ]
  },
  {
    id: "berry",
    name: "Berry Magenta",
    category: "Lounge Chair",
    price: "$1,450",
    image: "./Images/Gemini_Generated_Image_dvuih8dvuih8dvui.png",
    colorHex: "#9b1d55",
    swatchBorder: "#ec4899",
    bgGradient: "radial-gradient(ellipse at 50% 50%, #961b53 0%, #5d0f33 45%, #31071b 100%)",
    accentColor: "#db2777",
    description: "Dramatic jewel-toned ruby velvet that commands attention in boutique and residential spaces.",
    hotspots: [
      {
        id: "backrest",
        x: "67%",
        y: "41%",
        title: "Curved Backrest",
        text: "Triple-stitched seams with bonded nylon thread for enduring durability."
      },
      {
        id: "cushion",
        x: "67%",
        y: "61%",
        title: "Seat Cushion",
        text: "Dual-density cushion core: soft outer pillow-top over firm supportive base."
      },
      {
        id: "leg",
        x: "33%",
        y: "70%",
        title: "Monolithic Arch Base",
        text: "Weighted lower pedestal core providing exceptional balance and tip prevention."
      }
    ]
  },
  {
    id: "ochre",
    name: "Mustard Ochre",
    category: "Lounge Chair",
    price: "$1,450",
    image: "./Images/Gemini_Generated_Image_lfjeqslfjeqslfje.png",
    colorHex: "#b88a1a",
    swatchBorder: "#eab308",
    bgGradient: "radial-gradient(ellipse at 50% 50%, #9c7314 0%, #5e4308 45%, #2f2104 100%)",
    accentColor: "#d97706",
    description: "Warm golden velvet radiating mid-century optimism and artistic flair.",
    hotspots: [
      {
        id: "backrest",
        x: "67%",
        y: "41%",
        title: "Curved Backrest",
        text: "Ergonomic wraparound cocoon feeling for focused reading and lounging."
      },
      {
        id: "cushion",
        x: "67%",
        y: "61%",
        title: "Seat Cushion",
        text: "Flame-retardant CAL 117 certified high-density polyurethane filling."
      },
      {
        id: "leg",
        x: "33%",
        y: "70%",
        title: "Monolithic Arch Base",
        text: "Hand-finished upholstery tensioned for smooth, wrinkle-free lines."
      }
    ]
  },
  {
    id: "sage",
    name: "Sage Mint",
    category: "Lounge Chair",
    price: "$1,450",
    image: "./Images/Gemini_Generated_Image_ode7r5ode7r5ode7.png",
    colorHex: "#417258",
    swatchBorder: "#34d399",
    bgGradient: "radial-gradient(ellipse at 50% 50%, #3d6a52 0%, #234333 45%, #0f2219 100%)",
    accentColor: "#059669",
    description: "Soothing eucalyptus velvet blending biophilic serenity with sculptural presence.",
    hotspots: [
      {
        id: "backrest",
        x: "67%",
        y: "41%",
        title: "Curved Backrest",
        text: "Graceful horseshoe geometry with continuous radius bending."
      },
      {
        id: "cushion",
        x: "67%",
        y: "61%",
        title: "Seat Cushion",
        text: "100,000+ Martindale rub count for heavy domestic and commercial use."
      },
      {
        id: "leg",
        x: "33%",
        y: "70%",
        title: "Monolithic Arch Base",
        text: "Felt-padded heavy floor bases suitable for hardwood and marble floors."
      }
    ]
  },
  {
    id: "cognac",
    name: "Warm Cognac",
    category: "Lounge Chair",
    price: "$1,480",
    image: "./Images/Gemini_Generated_Image_w4nkw3w4nkw3w4nk.png",
    colorHex: "#7b411d",
    swatchBorder: "#b45309",
    bgGradient: "radial-gradient(ellipse at 50% 50%, #753b17 0%, #46200a 45%, #240e04 100%)",
    accentColor: "#b45309",
    description: "Rich amber cognac velvet evoking vintage leather clubs and timeless private libraries.",
    hotspots: [
      {
        id: "backrest",
        x: "67%",
        y: "41%",
        title: "Curved Backrest",
        text: "Sculptural backrest contour tailored with invisible hand-sewn closure."
      },
      {
        id: "cushion",
        x: "67%",
        y: "61%",
        title: "Seat Cushion",
        text: "Multi-layered viscoelastic comfort layer for zero-pressure seating."
      },
      {
        id: "leg",
        x: "33%",
        y: "70%",
        title: "Monolithic Arch Base",
        text: "Engineered solid core with 450 lbs dynamic load capacity."
      }
    ]
  }
];

const productSpecs = {
  designer: "Studio Forma Design Lab (Milan)",
  dimensions: {
    width: "84 cm (33.1\")",
    depth: "82 cm (32.3\")",
    height: "78 cm (30.7\")",
    seatHeight: "44 cm (17.3\")",
    weight: "26 kg (57.3 lbs)"
  },
  materials: [
    "Premium Italian Microfiber Velvet (100% Recyclable Polyester)",
    "FSC-Certified Solid European Beech & Ash Inner Substructure",
    "High-Resiliency Multi-Density Foam (Non-Toxic, Zero CFCs)",
    "Non-marking acoustic floor glides"
  ],
  warranty: "10-Year Structural Frame Warranty, 2-Year Fabric Coverage",
  delivery: "Complimentary White Glove Delivery & In-Room Assembly Globally"
};

// Expose globally for direct file:// browser support
window.chairVariants = chairVariants;
window.productSpecs = productSpecs;
