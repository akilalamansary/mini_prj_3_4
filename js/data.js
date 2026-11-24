/**
 * CSE-2340: Software Development I (IIUC)
 * Mini Project 3-4 (MP3-MP4)
 * Fallback & Offline Dataset for ShopNova Product Explorer
 * 
 * Provides fallback data with identical schema to DummyJSON products API
 * so the application remains 100% testable and resilient even in offline
 * classroom environments or restricted networks.
 */

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: "iPhone 15 Pro Max",
    description: "Titanium design with A17 Pro chip, customizable Action button, and 48MP camera system with 5x optical zoom.",
    category: "smartphones",
    price: 1199.99,
    discountPercentage: 10.5,
    rating: 4.88,
    stock: 24,
    brand: "Apple",
    sku: "APL-IP15PM-256",
    weight: 221,
    dimensions: { width: 76.7, height: 159.9, depth: 8.25 },
    warrantyInformation: "1 year manufacturer warranty",
    shippingInformation: "Free expedited 2-day shipping",
    availabilityStatus: "In Stock",
    returnPolicy: "30-day money back guarantee",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%2013%20Pro/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/smartphones/iPhone%2013%20Pro/1.png",
      "https://cdn.dummyjson.com/products/images/smartphones/iPhone%2013%20Pro/thumbnail.png"
    ],
    reviews: [
      { rating: 5, comment: "Amazing battery life and camera clarity!", date: "2024-05-12T10:00:00.000Z", reviewerName: "Sarah Khan" },
      { rating: 4, comment: "Lightweight titanium feels premium in hand.", date: "2024-04-18T14:30:00.000Z", reviewerName: "Tanvir Ahmed" }
    ]
  },
  {
    id: 2,
    title: "MacBook Pro 16\" M3 Max",
    description: "Extreme performance with Apple M3 Max chip, 36GB unified memory, Liquid Retina XDR display and 22-hour battery life.",
    category: "laptops",
    price: 2499.00,
    discountPercentage: 8.0,
    rating: 4.92,
    stock: 12,
    brand: "Apple",
    sku: "APL-MBP16-M3M",
    weight: 2140,
    dimensions: { width: 355.7, height: 248.1, depth: 16.8 },
    warrantyInformation: "2 years AppleCare eligible",
    shippingInformation: "Ships in 24 hours",
    availabilityStatus: "In Stock",
    returnPolicy: "14-day hassle-free return",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png",
      "https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/thumbnail.png"
    ],
    reviews: [
      { rating: 5, comment: "The fastest machine I have ever coded on.", date: "2024-06-01T08:15:00.000Z", reviewerName: "Mahmud Hasan" },
      { rating: 5, comment: "Display contrast and speakers are unmatched.", date: "2024-05-20T19:40:00.000Z", reviewerName: "Fatima Noor" }
    ]
  },
  {
    id: 3,
    title: "Samsung Galaxy S24 Ultra",
    description: "Galaxy AI powered smartphone with built-in S Pen, 200MP camera, Snapdragon 8 Gen 3, and flat dynamic AMOLED display.",
    category: "smartphones",
    price: 1299.99,
    discountPercentage: 12.0,
    rating: 4.79,
    stock: 18,
    brand: "Samsung",
    sku: "SAM-S24U-512",
    weight: 232,
    dimensions: { width: 79.0, height: 162.3, depth: 8.6 },
    warrantyInformation: "1 year international warranty",
    shippingInformation: "Free standard shipping",
    availabilityStatus: "In Stock",
    returnPolicy: "30-day return policy",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S24%20Ultra/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S24%20Ultra/1.png",
      "https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S24%20Ultra/thumbnail.png"
    ],
    reviews: [
      { rating: 5, comment: "Galaxy AI features like Live Translate are incredible.", date: "2024-03-10T11:22:00.000Z", reviewerName: "Rafiqul Islam" },
      { rating: 4, comment: "Zoom camera is the best on the market.", date: "2024-04-05T16:45:00.000Z", reviewerName: "Nusrat Jahan" }
    ]
  },
  {
    id: 4,
    title: "Dell XPS 15 9530",
    description: "13th Gen Intel Core i9, NVIDIA RTX 4070, 3.5K OLED InfinityEdge touch display, machined aluminum chassis.",
    category: "laptops",
    price: 1899.50,
    discountPercentage: 15.0,
    rating: 4.65,
    stock: 9,
    brand: "Dell",
    sku: "DEL-XPS15-OLED",
    weight: 1920,
    dimensions: { width: 344.7, height: 230.1, depth: 18.0 },
    warrantyInformation: "3 years Dell Premium Support",
    shippingInformation: "Free freight shipping",
    availabilityStatus: "In Stock",
    returnPolicy: "30-day money back",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/laptops/Dell%20XPS%2013%209310/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/laptops/Dell%20XPS%2013%209310/1.png"
    ],
    reviews: [
      { rating: 5, comment: "OLED screen is gorgeous for video editing.", date: "2024-02-14T09:12:00.000Z", reviewerName: "Asif Iqbal" },
      { rating: 4, comment: "Fans ramp up under heavy load, but performance is solid.", date: "2024-03-29T12:00:00.000Z", reviewerName: "Zubair Rahman" }
    ]
  },
  {
    id: 5,
    title: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise canceling with two processors, 8 microphones, LDAC audio codec, and up to 30 hours battery.",
    category: "audio",
    price: 398.00,
    discountPercentage: 20.0,
    rating: 4.85,
    stock: 45,
    brand: "Sony",
    sku: "SNY-WH1000XM5-BLK",
    weight: 250,
    dimensions: { width: 220, height: 260, depth: 75 },
    warrantyInformation: "1 year Sony limited warranty",
    shippingInformation: "Free shipping",
    availabilityStatus: "In Stock",
    returnPolicy: "30-day easy returns",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%20X/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/smartphones/iPhone%20X/thumbnail.png"
    ],
    reviews: [
      { rating: 5, comment: "ANC completely silences airplane engine noise.", date: "2024-05-01T15:20:00.000Z", reviewerName: "Kamrul Islam" },
      { rating: 5, comment: "Super comfortable for all-day coding sessions.", date: "2024-06-12T18:10:00.000Z", reviewerName: "Farzana Akter" }
    ]
  },
  {
    id: 6,
    title: "Dior Sauvage Eau de Parfum",
    description: "A radically fresh composition with notes of Calabrian bergamot, sensual Ambroxan, and Papua New Guinean vanilla.",
    category: "fragrances",
    price: 145.00,
    discountPercentage: 5.0,
    rating: 4.72,
    stock: 35,
    brand: "Dior",
    sku: "DIO-SAUV-100ML",
    weight: 350,
    dimensions: { width: 60, height: 140, depth: 60 },
    warrantyInformation: "Original batch authenticity guarantee",
    shippingInformation: "Standard shipping 3-5 business days",
    availabilityStatus: "In Stock",
    returnPolicy: "Non-returnable once seal broken",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/fragrances/Dior%20J'adore/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/fragrances/Dior%20J'adore/1.png"
    ],
    reviews: [
      { rating: 5, comment: "Massive projection and longevity. 10/10.", date: "2024-01-20T10:11:00.000Z", reviewerName: "Arman Chowdhury" },
      { rating: 4, comment: "Very iconic masculine scent.", date: "2024-02-17T17:05:00.000Z", reviewerName: "Mehedi Hasan" }
    ]
  },
  {
    id: 7,
    title: "Chanel Coco Mademoiselle",
    description: "An ambery fragrance with a strong personality and surprising freshness. Sparks of fresh orange awaken the senses.",
    category: "fragrances",
    price: 165.00,
    discountPercentage: 7.5,
    rating: 4.81,
    stock: 22,
    brand: "Chanel",
    sku: "CHN-COCO-50ML",
    weight: 300,
    dimensions: { width: 55, height: 130, depth: 55 },
    warrantyInformation: "Authenticity verified",
    shippingInformation: "Free shipping",
    availabilityStatus: "In Stock",
    returnPolicy: "Return unopened within 14 days",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/1.png"
    ],
    reviews: [
      { rating: 5, comment: "Elegant, sophisticated, lasts more than 12 hours.", date: "2024-04-10T13:40:00.000Z", reviewerName: "Sadia Sultana" }
    ]
  },
  {
    id: 8,
    title: "Hyaluronic Acid 2% + B5 Serum",
    description: "Multi-depth hydration formulation combining low-, medium- and high-molecular-weight hyaluronic acid.",
    category: "skincare",
    price: 18.50,
    discountPercentage: 15.0,
    rating: 4.62,
    stock: 80,
    brand: "The Ordinary",
    sku: "ORD-HA2B5-30ML",
    weight: 90,
    dimensions: { width: 35, height: 105, depth: 35 },
    warrantyInformation: "Dermatologist approved",
    shippingInformation: "Ships same day",
    availabilityStatus: "In Stock",
    returnPolicy: "30-day satisfaction guarantee",
    minimumOrderQuantity: 2,
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png"
    ],
    reviews: [
      { rating: 5, comment: "Instant hydration without any greasy feeling.", date: "2024-05-18T11:00:00.000Z", reviewerName: "Tasnim Ara" },
      { rating: 4, comment: "Great basic staple in daily skincare.", date: "2024-06-03T14:20:00.000Z", reviewerName: "Ayesha Siddiqua" }
    ]
  },
  {
    id: 9,
    title: "Ergonomic Mesh Office Chair",
    description: "Breathable Korean mesh high-back chair with 3D adjustable armrests, dynamic lumbar support, and tilt lock mechanism.",
    category: "furniture",
    price: 329.00,
    discountPercentage: 25.0,
    rating: 4.74,
    stock: 15,
    brand: "ErgoComfort",
    sku: "FUR-ERGO-CHAIR-GRY",
    weight: 18500,
    dimensions: { width: 68, height: 120, depth: 65 },
    warrantyInformation: "5-year structural warranty",
    shippingInformation: "Free heavy delivery",
    availabilityStatus: "In Stock",
    returnPolicy: "30-day home trial",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/1.png"
    ],
    reviews: [
      { rating: 5, comment: "My lower back pain disappeared after a week.", date: "2024-03-15T09:30:00.000Z", reviewerName: "Tareq Aziz" },
      { rating: 4, comment: "Very sturdy build, assembly took 20 minutes.", date: "2024-04-22T16:15:00.000Z", reviewerName: "Saiful Islam" }
    ]
  },
  {
    id: 10,
    title: "Minimalist Solid Oak Coffee Table",
    description: "Handcrafted from sustainable European oak with natural matte oil finish, rounded safety edges, and lower shelf.",
    category: "furniture",
    price: 450.00,
    discountPercentage: 10.0,
    rating: 4.58,
    stock: 7,
    brand: "Nordic Living",
    sku: "FUR-OAK-CTBL-NAT",
    weight: 22000,
    dimensions: { width: 110, height: 45, depth: 60 },
    warrantyInformation: "10-year wood stability warranty",
    shippingInformation: "White-glove assembly available",
    availabilityStatus: "In Stock",
    returnPolicy: "14-day return",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Sofa/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Sofa/1.png"
    ],
    reviews: [
      { rating: 5, comment: "Beautiful wood grain, centerpiece of our living room.", date: "2024-05-11T12:00:00.000Z", reviewerName: "Nazmul Huda" }
    ]
  },
  {
    id: 11,
    title: "Organic Fair-Trade Coffee Beans 1kg",
    description: "100% Arabica single-origin Ethiopian Yirgacheffe medium roast with tasting notes of bergamot, jasmine, and citrus.",
    category: "groceries",
    price: 24.99,
    discountPercentage: 5.0,
    rating: 4.90,
    stock: 120,
    brand: "Artisan Roasters",
    sku: "GRO-COF-ETH-1KG",
    weight: 1000,
    dimensions: { width: 15, height: 28, depth: 10 },
    warrantyInformation: "Freshness roast date guaranteed",
    shippingInformation: "Next day dispatch",
    availabilityStatus: "In Stock",
    returnPolicy: "Consumable - satisfaction guaranteed",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/groceries/Apple/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/groceries/Apple/thumbnail.png"
    ],
    reviews: [
      { rating: 5, comment: "Best pour-over coffee experience I've had at home.", date: "2024-05-25T08:00:00.000Z", reviewerName: "Shahadat Hossain" },
      { rating: 5, comment: "Fresh aromatic beans, superb crema.", date: "2024-06-08T10:15:00.000Z", reviewerName: "Rifat Ahmed" }
    ]
  },
  {
    id: 12,
    title: "Keychron Q1 Pro Mechanical Keyboard",
    description: "75% wireless custom mechanical keyboard, full CNC aluminum body, hot-swappable switches, QMK/VIA support, double-gasket.",
    category: "laptops",
    price: 199.00,
    discountPercentage: 10.0,
    rating: 4.87,
    stock: 31,
    brand: "Keychron",
    sku: "KEY-Q1P-RED-ISO",
    weight: 1750,
    dimensions: { width: 327, height: 145, depth: 35 },
    warrantyInformation: "1 year manufacturer warranty",
    shippingInformation: "Free shipping worldwide",
    availabilityStatus: "In Stock",
    returnPolicy: "30 days returns",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/laptops/Dell%20XPS%2013%209310/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/laptops/Dell%20XPS%2013%209310/thumbnail.png"
    ],
    reviews: [
      { rating: 5, comment: "Typing feel and thock sound are celestial.", date: "2024-04-14T21:00:00.000Z", reviewerName: "Adnan Sami" },
      { rating: 5, comment: "Bluetooth switching between Mac and PC is instant.", date: "2024-05-19T17:30:00.000Z", reviewerName: "Sohag Mia" }
    ]
  },
  {
    id: 13,
    title: "Logitech MX Master 3S Wireless Mouse",
    description: "Quiet clicks, 8K DPI sensor tracks on glass, MagSpeed electromagnetic scroll wheel, and ergonomic thumb rest.",
    category: "smartphones",
    price: 99.99,
    discountPercentage: 15.0,
    rating: 4.89,
    stock: 64,
    brand: "Logitech",
    sku: "LOG-MXM3S-PGR",
    weight: 141,
    dimensions: { width: 84.3, height: 124.9, depth: 51 },
    warrantyInformation: "2-year hardware warranty",
    shippingInformation: "Free express shipping",
    availabilityStatus: "In Stock",
    returnPolicy: "30-day money back guarantee",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%2013%20Pro/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/smartphones/iPhone%2013%20Pro/thumbnail.png"
    ],
    reviews: [
      { rating: 5, comment: "Best productivity mouse in existence.", date: "2024-05-02T13:20:00.000Z", reviewerName: "Kazi Nabil" }
    ]
  },
  {
    id: 14,
    title: "Ceramic Minimalist Table Lamp",
    description: "Warm LED dimmable accent lamp with handcrafted ceramic ribbed base and textured linen shade.",
    category: "furniture",
    price: 79.99,
    discountPercentage: 18.0,
    rating: 4.52,
    stock: 28,
    brand: "Nordic Living",
    sku: "HOM-LAMP-CER-WHT",
    weight: 1400,
    dimensions: { width: 25, height: 42, depth: 25 },
    warrantyInformation: "2 years electrical warranty",
    shippingInformation: "Padded safe shipping",
    availabilityStatus: "In Stock",
    returnPolicy: "30 days returns",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/thumbnail.png"
    ],
    reviews: [
      { rating: 5, comment: "Warm glow makes my bedroom feel like a boutique hotel.", date: "2024-03-22T19:00:00.000Z", reviewerName: "Sumaiya Binte" }
    ]
  },
  {
    id: 15,
    title: "Anker 737 Power Bank 24000mAh",
    description: "140W ultra-powerful two-way charging with smart digital display, capable of fast-charging a laptop and phone simultaneously.",
    category: "smartphones",
    price: 139.99,
    discountPercentage: 21.0,
    rating: 4.82,
    stock: 42,
    brand: "Anker",
    sku: "ANK-737-PB-140W",
    weight: 630,
    dimensions: { width: 54, height: 155, depth: 49 },
    warrantyInformation: "24-month worry-free warranty",
    shippingInformation: "Hazardous certified ground shipping",
    availabilityStatus: "In Stock",
    returnPolicy: "30-day money back",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S24%20Ultra/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S24%20Ultra/thumbnail.png"
    ],
    reviews: [
      { rating: 5, comment: "Charges my MacBook Pro at full speed. Essential travel gear.", date: "2024-05-14T11:45:00.000Z", reviewerName: "Arifur Rahman" }
    ]
  },
  {
    id: 16,
    title: "Vitamin C Brightening Facial Cleanser",
    description: "Antioxidant rich daily facial cleanser with Vitamin C, Aloe Vera, and gentle foaming botanicals for radiant skin.",
    category: "skincare",
    price: 22.00,
    discountPercentage: 12.0,
    rating: 4.49,
    stock: 55,
    brand: "GlowLab",
    sku: "SKN-VITC-CLN-200",
    weight: 240,
    dimensions: { width: 45, height: 160, depth: 45 },
    warrantyInformation: "Dermatologist tested, cruelty-free",
    shippingInformation: "Standard shipping",
    availabilityStatus: "In Stock",
    returnPolicy: "30-day return policy",
    minimumOrderQuantity: 1,
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    images: [
      "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
    ],
    reviews: [
      { rating: 4, comment: "Smells fresh like oranges, leaves skin glowing.", date: "2024-04-09T08:30:00.000Z", reviewerName: "Jannatul Ferdaus" }
    ]
  }
];

// Fallback category list
const FALLBACK_CATEGORIES = [
  "all",
  "smartphones",
  "laptops",
  "fragrances",
  "skincare",
  "furniture",
  "groceries",
  "audio"
];
