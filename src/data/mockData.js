export const INITIAL_USER = {
  id: "USR-101",
  uniqueId: "CUST-AKSHAT-8821",
  name: "Akshat",
  role: "customer", // 'customer' | 'cook' | 'admin'
  designation: "Student & PG Resident",
  location: "Koramangala 4th Block, Bengaluru",
  dietPreference: "Vegetarian",
  budgetCap: 120,
  activeSubscription: "Student Meal Pass (18 meals remaining)",
  favoriteCooks: [1, 3]
};

// Registered portal credentials with Unique IDs
export const REGISTERED_ACCOUNTS = {
  customer: {
    uniqueId: "CUST-AKSHAT-8821",
    name: "Akshat Sharma",
    role: "customer",
    designation: "Student & PG Resident",
    phone: "+91 98450 12345"
  },
  cook: {
    uniqueId: "COOK-SIMRAN-4102",
    pin: "4102",
    name: "Simran Kaur",
    kitchenName: "Maa Ki Rasoi",
    role: "cook",
    designation: "Verified Master Home Cook",
    fssaiId: "21226008000412"
  },
  admin: {
    uniqueId: "ADMIN-RAY-0091",
    passcode: "safety2026",
    name: "Dr. Ananya Ray",
    role: "admin",
    designation: "Senior Food Safety Compliance Officer",
    badgeNumber: "FSA-KA-8819"
  }
};

// Preset delivery addresses for testing all 3 distance brackets
export const DELIVERY_ADDRESSES = [
  {
    id: "addr-1",
    label: "Koramangala 4th Block (PG Hub)",
    detail: "Room 304, Green Nest PG, 5th Cross, Koramangala 4th Block",
    distanceKm: 1.8,
    tier: "local" // < 4 km
  },
  {
    id: "addr-2",
    label: "HSR Layout Sector 5 (Apartments)",
    detail: "Flat 202, Sunshine Residency, 14th Main, HSR Layout",
    distanceKm: 4.8,
    tier: "mid" // 4 - 6 km
  },
  {
    id: "addr-3",
    label: "Electronic City Phase 1 (Hostel Block)",
    detail: "Block C, Infosys Campus Road, Electronic City Phase 1",
    distanceKm: 7.5,
    tier: "extended" // > 6 km
  },
  {
    id: "addr-4",
    label: "Whitefield IT Park (Office Campus)",
    detail: "Tower 2, Cyber Pearl Tech Hub, Whitefield",
    distanceKm: 9.0,
    tier: "extended" // > 6 km
  }
];

/**
 * Calculates delivery fee based on customer distance:
 * - Distance < 4 km: ₹40
 * - 4 km <= Distance <= 6 km: ₹50
 * - Distance > 6 km: ₹50 + ₹10 per km extra
 */
export function calculateDeliveryFee(distanceKm) {
  const dist = parseFloat(distanceKm) || 1.8;
  if (dist < 4.0) {
    return {
      fee: 40,
      breakdown: "Flat ₹40 for neighborhood delivery (< 4 km)",
      tier: "local",
      baseFee: 40,
      extraFee: 0,
      extraKm: 0
    };
  } else if (dist <= 6.0) {
    return {
      fee: 50,
      breakdown: "Standard ₹50 for mid-range transit (4–6 km)",
      tier: "mid",
      baseFee: 50,
      extraFee: 0,
      extraKm: 0
    };
  } else {
    const extraKm = Math.round((dist - 6.0) * 10) / 10;
    const extraFee = Math.round(extraKm * 10);
    const totalFee = 50 + extraFee;
    return {
      fee: totalFee,
      breakdown: `₹50 base + ₹10/km for ${extraKm} km beyond 6 km`,
      tier: "extended",
      baseFee: 50,
      extraFee: extraFee,
      extraKm: extraKm
    };
  }
}

export const PLATFORM_STATS = {
  activeCooks: 524,
  mealsDelivered: 8412,
  capacityUtilized: 92.4,
  avgRating: 4.8,
  foodWasteSavedKg: 1840,
  avgCookMonthlyIncome: 24500
};

export const CATEGORIES = [
  { id: "all", label: "All Homestyle", icon: "🍱" },
  { id: "north-indian", label: "North Indian", icon: "🍛" },
  { id: "healthy", label: "Healthy & Light", icon: "🥗" },
  { id: "regional", label: "Regional Flavors", icon: "🌶️" },
  { id: "student-tiffin", label: "Student Tiffin", icon: "🎒" },
  { id: "high-protein", label: "High Protein", icon: "💪" },
  { id: "traditional", label: "Traditional Home Food", icon: "🥘" }
];

export const HOME_COOKS = [
  {
    id: 1,
    name: "Maa Ki Rasoi",
    cookName: "Simran Kaur",
    uniqueId: "COOK-SIMRAN-4102",
    rating: 4.8,
    reviewsCount: 342,
    distanceKm: 1.2,
    locality: "Koramangala 5th Block",
    lat: 12.9360,
    lng: 77.6250,
    cuisine: "North Indian Homestyle",
    tagline: "Pure homestyle North Indian meals prepared fresh with cold-pressed oils and love.",
    image: "/images/hero_thali.jpg",
    cookAvatar: "/images/cook_simran.jpg",
    priceRange: "₹80–₹120",
    deliveryRadiusKm: 3.5,
    prepTimeMins: "20–30 mins",
    isHygieneVerified: true,
    fssaiVerified: true,
    experienceYears: 16,
    dietType: "veg",
    dailyCapacity: 30,
    bookedCapacity: 12,
    availableCapacity: 18,
    hygieneScore: 98,
    hygieneChecklist: [
      "RO Purified Water used for all cooking",
      "Fresh daily vegetable procurement at 6 AM",
      "Sterilized stainless steel containers",
      "Zero artificial colors or preservatives",
      "Hairnet, apron & sanitized workspace"
    ],
    menu: [
      {
        id: "m1-1",
        name: "Homestyle Dal Tadka",
        price: 40,
        desc: "Slow-cooked yellow arhar dal with cumin, garlic & desi ghee tadka",
        category: "Mains",
        isPopular: true,
        diet: "veg"
      },
      {
        id: "m1-2",
        name: "Steamed Jeera Basmati Rice",
        price: 30,
        desc: "Fragrant long-grain basmati tempered with royal cumin seeds",
        category: "Breads & Rice",
        diet: "veg"
      },
      {
        id: "m1-3",
        name: "4 Phulkas / Rotis with Desi Ghee",
        price: 30,
        desc: "100% whole wheat chakki atta rotis, puffed on tawa and brushed with pure desi ghee",
        category: "Breads & Rice",
        isPopular: true,
        diet: "veg"
      },
      {
        id: "m1-4",
        name: "Seasonal Sabzi (Aloo Bhindi Masala)",
        price: 40,
        desc: "Crisp pan-tossed bhindi with baby potatoes and mild homestyle spices",
        category: "Mains",
        diet: "veg"
      },
      {
        id: "m1-5",
        name: "Full Tiffin Thali (AI Recommended)",
        price: 100,
        desc: "Dal Tadka + Seasonal Sabzi + 4 Desi Ghee Rotis + Steamed Rice + Salad & Pickle",
        category: "Combo Thali",
        isPopular: true,
        isThali: true,
        diet: "veg"
      },
      {
        id: "m1-6",
        name: "Homestyle Rice Kheer",
        price: 35,
        desc: "Slow simmered creamy milk pudding with cardamom, raisins and crushed almonds",
        category: "Dessert",
        diet: "veg"
      }
    ],
    reviews: [
      {
        user: "Rohan V.",
        role: "Software Engineer at Swiggy",
        rating: 5,
        comment: "Reminds me of home! Phulkas are so soft and dal has zero excess oil. Perfect for daily eating.",
        date: "Yesterday"
      },
      {
        user: "Pooja Sharma",
        role: "Student, St. Joseph's",
        rating: 5,
        comment: "Affordable and truly hygienic. No acidity like restaurant food. 10/10 recommend Maa Ki Rasoi!",
        date: "3 days ago"
      }
    ]
  },
  {
    id: 2,
    name: "Annapurna Ghar Ka Swad",
    cookName: "Sudha Ben Patel",
    uniqueId: "COOK-SUDHA-2081",
    rating: 4.9,
    reviewsCount: 420,
    distanceKm: 1.8,
    locality: "HSR Layout Sector 2",
    lat: 12.9121,
    lng: 77.6446,
    cuisine: "Gujarati & Kathiyawadi",
    tagline: "Authentic Gujarati rasoi with mild sweet-tangy dals and wholesome rotlas.",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=700&q=80",
    cookAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    priceRange: "₹90–₹140",
    deliveryRadiusKm: 4.0,
    prepTimeMins: "25–35 mins",
    isHygieneVerified: true,
    fssaiVerified: true,
    experienceYears: 22,
    dietType: "veg",
    dailyCapacity: 25,
    bookedCapacity: 13,
    availableCapacity: 12,
    hygieneScore: 99,
    hygieneChecklist: [
      "Traditional brass & iron cookware",
      "Pure organic groundnut oil",
      "Handmade spices stone-ground at home",
      "FSSAI Certified kitchen registration"
    ],
    menu: [
      {
        id: "m2-1",
        name: "Kathiyawadi Sev Tameta Sabzi",
        price: 50,
        desc: "Tangy tomato curry topped with crispy ratlami sev and fresh coriander",
        category: "Mains",
        isPopular: true,
        diet: "veg"
      },
      {
        id: "m2-2",
        name: "Gujarati Khatti-Meethi Dal",
        price: 45,
        desc: "Slow simmered tuver dal with kokum, jaggery and peanut tempering",
        category: "Mains",
        diet: "veg"
      },
      {
        id: "m2-3",
        name: "Full Kathiyawadi Thali",
        price: 110,
        desc: "Sev Tameta + Gujarati Dal + 4 Phulkas + Khichdi + Roasted Papad & Chhach",
        category: "Combo Thali",
        isPopular: true,
        isThali: true,
        diet: "veg"
      }
    ],
    reviews: [
      {
        user: "Mayank Trivedi",
        role: "Architect",
        rating: 5,
        comment: "Sudha Ben's kadhi khichdi is unmatched comfort food after a long work day.",
        date: "2 days ago"
      }
    ]
  },
  {
    id: 3,
    name: "Amma's Chettinad Tiffin",
    cookName: "Meenakshi Ammal",
    uniqueId: "COOK-MEENA-1190",
    rating: 4.7,
    reviewsCount: 280,
    distanceKm: 0.9,
    locality: "Tavarekere / Koramangala Border",
    lat: 12.9300,
    lng: 77.6100,
    cuisine: "South Indian Homestyle",
    tagline: "Steaming aromatic sambar, stone-ground chutneys and feather-light idlis & meals.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80",
    cookAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    priceRange: "₹70–₹110",
    deliveryRadiusKm: 3.0,
    prepTimeMins: "15–25 mins",
    isHygieneVerified: true,
    fssaiVerified: true,
    experienceYears: 19,
    dietType: "veg",
    dailyCapacity: 35,
    bookedCapacity: 13,
    availableCapacity: 22,
    hygieneScore: 97,
    hygieneChecklist: [
      "Natural banana leaf wrapping options",
      "Traditional hand-churned sesame oil",
      "Daily fresh coconut grinding",
      "Double-sanitized tiffin crates"
    ],
    menu: [
      {
        id: "m3-1",
        name: "Madras Sambar & Steamed Rice Bowl",
        price: 45,
        desc: "Shallots, drumstick and yellow lentils in fragrant homemade sambar podi",
        category: "Mains",
        isPopular: true,
        diet: "veg"
      },
      {
        id: "m3-2",
        name: "Amma's Chettinad Mini Meals",
        price: 85,
        desc: "Sambar Rice + Rasam + Curd Rice + Veg Poriyal + Appalam + Mango Pickle",
        category: "Combo Thali",
        isPopular: true,
        isThali: true,
        diet: "veg"
      }
    ],
    reviews: [
      {
        user: "Karthik Raja",
        role: "Data Analyst",
        rating: 5,
        comment: "Closest you can get to authentic home food in Bangalore. The rasam cures any fatigue!",
        date: "1 week ago"
      }
    ]
  },
  {
    id: 4,
    name: "Punjabi Chulha by Harpreet Ji",
    cookName: "Harpreet Singh & Mother",
    uniqueId: "COOK-HARP-3342",
    rating: 4.9,
    reviewsCount: 510,
    distanceKm: 2.1,
    locality: "BTM 2nd Stage",
    lat: 12.9166,
    lng: 77.6101,
    cuisine: "Punjabi & North Indian",
    tagline: "Authentic slow-simmered Dal Makhani and tawa-stuffed parathas with fresh white butter.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80",
    cookAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    priceRange: "₹100–₹150",
    deliveryRadiusKm: 4.5,
    prepTimeMins: "25–35 mins",
    isHygieneVerified: true,
    fssaiVerified: true,
    experienceYears: 14,
    dietType: "veg",
    dailyCapacity: 20,
    bookedCapacity: 12,
    availableCapacity: 8,
    hygieneScore: 98,
    hygieneChecklist: [
      "Overnight slow-simmered dal without heavy commercial cream",
      "Pure cow milk paneer made fresh at home",
      "Steel packaging seals"
    ],
    menu: [
      {
        id: "m4-1",
        name: "Homestyle Dal Makhani",
        price: 60,
        desc: "Black urad dal slow-cooked for 8 hours with ginger, tomatoes and fresh churned makhan",
        category: "Mains",
        isPopular: true,
        diet: "veg"
      },
      {
        id: "m4-2",
        name: "Punjabi Special Thali",
        price: 120,
        desc: "Dal Makhani + Paneer Bhurji + 3 Laccha Parathas + Jeera Pulao + Sweet Lassi",
        category: "Combo Thali",
        isPopular: true,
        isThali: true,
        diet: "veg"
      }
    ],
    reviews: [
      {
        user: "Gaurav S.",
        role: "Founder, Fintech startup",
        rating: 5,
        comment: "Rich flavor yet light on the stomach. The white butter tastes like village churned butter.",
        date: "4 days ago"
      }
    ]
  },
  {
    id: 5,
    name: "Nani's Sattvik Rasoi",
    cookName: "Kanta Devi",
    uniqueId: "COOK-KANTA-5509",
    rating: 4.8,
    reviewsCount: 195,
    distanceKm: 1.5,
    locality: "Jayanagar 4th Block",
    lat: 12.9299,
    lng: 77.5826,
    cuisine: "Sattvik & Jain Friendly",
    tagline: "Pure sattvik cooking with zero onion, zero garlic. Peaceful food for body and soul.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
    cookAvatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80",
    priceRange: "₹85–₹120",
    deliveryRadiusKm: 3.5,
    prepTimeMins: "20–30 mins",
    isHygieneVerified: true,
    fssaiVerified: true,
    experienceYears: 28,
    dietType: "pure-jain",
    dailyCapacity: 25,
    bookedCapacity: 10,
    availableCapacity: 15,
    hygieneScore: 100,
    hygieneChecklist: [
      "Strict zero onion, zero garlic kitchen",
      "Filtered water only",
      "Rock salt (sendha namak) and organic hing"
    ],
    menu: [
      {
        id: "m5-1",
        name: "Sattvik Moong Dal & Lauki Sabzi",
        price: 50,
        desc: "Gentle yellow moong dal with bottle gourd sabzi tempered in cumin & ghee",
        category: "Mains",
        diet: "pure-jain"
      },
      {
        id: "m5-2",
        name: "Sattvik Thali",
        price: 95,
        desc: "Moong Dal + Lauki Sabzi + 4 Phulkas + Steamed Rice + Cooling Mint Chaas",
        category: "Combo Thali",
        isPopular: true,
        isThali: true,
        diet: "pure-jain"
      }
    ],
    reviews: [
      {
        user: "Aarav Jain",
        role: "Chartered Accountant",
        rating: 5,
        comment: "Lifesaver for Jain food lovers in Bangalore. Extremely clean and tasty.",
        date: "5 days ago"
      }
    ]
  },
  {
    id: 6,
    name: "Konkan Katta by Sunita Tai",
    cookName: "Sunita Ghorpade",
    uniqueId: "COOK-SUNITA-7712",
    rating: 4.7,
    reviewsCount: 210,
    distanceKm: 2.4,
    locality: "Indiranagar 100ft Rd",
    lat: 12.9784,
    lng: 77.6408,
    cuisine: "Maharashtrian Homestyle",
    tagline: "Authentic Pithla Bhakri, fresh Varana Bhaat, and seasonal Konkani spice blends.",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=700&q=80",
    cookAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    priceRange: "₹95–₹130",
    deliveryRadiusKm: 4.0,
    prepTimeMins: "25–35 mins",
    isHygieneVerified: true,
    fssaiVerified: true,
    experienceYears: 18,
    dietType: "veg",
    dailyCapacity: 28,
    bookedCapacity: 14,
    availableCapacity: 14,
    hygieneScore: 97,
    hygieneChecklist: [
      "Traditional iron tawa for jowar bhakris",
      "House-made Goda Masala",
      "Strict sanitization before every meal cycle"
    ],
    menu: [
      {
        id: "m6-1",
        name: "Pithla Bhakri Combo",
        price: 85,
        desc: "Gram flour pithla tempered with green chillies & mustard + 2 Jowar Bhakris + Thecha",
        category: "Combo Thali",
        isPopular: true,
        isThali: true,
        diet: "veg"
      },
      {
        id: "m6-2",
        name: "Varan Bhaat with Desi Ghee",
        price: 60,
        desc: "Comforting yellow dal rice topped with home ghee and lemon twist",
        category: "Mains",
        diet: "veg"
      }
    ],
    reviews: [
      {
        user: "Omkar Deshmukh",
        role: "UI/UX Designer",
        rating: 5,
        comment: "The garlic thecha and hot jowar bhakri will make you forget everything else.",
        date: "2 days ago"
      }
    ]
  }
];

export const AI_DEMAND_PREDICTION = {
  activeSector: "Koramangala 4th & 5th Block",
  predictedDemandPeak: "12:15 PM – 1:45 PM",
  demandIntensity: "High (+42% vs yesterday)",
  topRequestedDishes: [
    "Dal Tadka & Phulkas (48 requests)",
    "Light Seasonal Sabzi (34 requests)",
    "Student Budget Thali under ₹100 (62 requests)"
  ],
  cookActionPrompt: "Spike in student lunch demand detected in your 1.5 km zone. We recommend prepping 10–12 extra meal boxes to maximize kitchen capacity.",
  estimatedIncrementalRevenue: 1320,
  heatMapHotspots: [
    { area: "Jyoti Nivas College Hostels", count: "38 students hungry" },
    { area: "Koramangala 80ft Road Tech Parks", count: "29 office professionals" },
    { area: "HSR Sector 1 PG Hub", count: "45 bachelor tiffins" }
  ]
};

export const INITIAL_ORDERS = [
  {
    id: "TM-8041",
    customer: "Akshat (You)",
    customerId: "CUST-AKSHAT-8821",
    cook: "Maa Ki Rasoi",
    items: "Full Tiffin Thali (Dal Tadka, Sabzi, 4 Rotis, Rice)",
    price: 140, // ₹100 items + ₹40 delivery fee
    deliveryFee: 40,
    status: "Delivered",
    orderedAt: "Today, 1:15 PM",
    deliveryAddress: "GreenPG Block B, Koramangala 4th Block (1.8 km)",
    estimatedDelivery: "Delivered in 24 mins"
  },
  {
    id: "TM-8099",
    customer: "Tanmay B.",
    customerId: "CUST-TANMAY-4491",
    cook: "Maa Ki Rasoi",
    items: "Dal Tadka + 4 Phulkas + Jeera Rice",
    price: 150, // ₹100 items + ₹50 delivery fee (4.8 km)
    deliveryFee: 50,
    status: "Simmering on Stove",
    orderedAt: "Just now (12 mins ago)",
    deliveryAddress: "Stanza Living, HSR Sector 5 (4.8 km)",
    estimatedDelivery: "18 mins left"
  }
];

export const ADMIN_AUDITS = [
  {
    id: "AUD-104",
    cookName: "Maa Ki Rasoi (Simran Kaur)",
    cookId: "COOK-SIMRAN-4102",
    verificationType: "Annual Surprise Hygiene Audit",
    status: "Verified & Passed (Score: 98%)",
    date: "12 Sep 2026",
    auditor: "Dr. Ananya Ray (Food Safety Officer)",
    notes: "Spotless modular kitchen, water filter tested TDS < 90, stainless steel food grade containers."
  },
  {
    id: "AUD-105",
    cookName: "Annapurna Ghar Ka Swad (Sudha Ben)",
    cookId: "COOK-SUDHA-2081",
    verificationType: "FSSAI Registration & Kitchen Video KYC",
    status: "Verified & Approved (Score: 99%)",
    date: "10 Sep 2026",
    auditor: "Kunal Mehra (Compliance Specialist)",
    notes: "FSSAI license valid till 2028. Dedicated cooking utensils and hygienic spice storage."
  },
  {
    id: "AUD-106",
    cookName: "Radha's Kitchen (New Applicant)",
    cookId: "COOK-RADHA-9042",
    verificationType: "Onboarding Hygiene Inspection",
    status: "Pending Review",
    date: "Today, 10:30 AM",
    auditor: "Pending Assignment",
    notes: "Water filter certificate submitted; kitchen prep area inspection video awaiting clearance."
  }
];
