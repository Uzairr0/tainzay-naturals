export const ABOUT_PAGE = {
  meta: {
    title: 'About Us',
    description:
      'Learn about Tainzay Naturals — a wellness brand offering vitamins, supplements, and health products across Pakistan. A project of Tainzy International.',
  },
  breadcrumb: 'About Us',
  hero: {
    image:
      'https://res.cloudinary.com/tainzay/image/upload/v1787383949/About-Us-hero.png',
    alt: 'About Tainzay Naturals — vitamins, supplements and wellness products',
    backgroundColor: '#eef3ef',
  },
  intro: {
    title: 'Your trusted wellness partner',
    paragraphs: [
      'Tainzy Naturals is a wellness-focused brand and a project of Tainzy International, built on a commitment to making quality healthcare and nutritional products more accessible to people across Pakistan.',
      'With roots in the pharmaceutical distribution sector, Tainzy International has developed a strong understanding of healthcare needs and the importance of quality, reliability, and trust. Tainzy Naturals brings this experience into a modern consumer-focused wellness brand, offering a growing range of vitamins, nutritional supplements, wellness products, and everyday healthcare solutions.',
      'Our philosophy is simple: wellness should be as clear as the nature that inspires it. We aim to combine carefully selected formulations, responsible quality standards, and accessible pricing to help people make better choices for their everyday health and wellbeing.',
      'Today, Tainzy Naturals offers a growing portfolio of products across nutritional wellness, immunity support, vitamins and minerals, pain relief, digestive health, and cognitive wellbeing, serving customers across Pakistan.',
      'From pharmaceutical experience to everyday wellness — Tainzy Naturals is committed to building a healthier future, one product at a time.',
    ],
    stats: [
      { value: '16+', label: 'Products' },
      { value: '12', label: 'Categories' },
      { value: 'Nationwide', label: 'Supply' },
    ],
  },
  promise: {
    eyebrow: 'Our promise to you',
    statement:
      'Quality medicines, competitive wholesale pricing, and reliable supply — every order, every partner.',
  },
  pillars: {
    title: 'Why choose Tainzay',
    subtitle:
      'We combine quality products, wholesale value, and dependable service so your pharmacy or facility can focus on patient care.',
    items: [
      {
        icon: 'quality',
        title: 'Quality assured',
        description:
          'Products manufactured to stringent quality standards with consistent formulation and packaging you can trust.',
      },
      {
        icon: 'pricing',
        title: 'Wholesale pricing',
        description:
          'Tiered bulk rates designed for pharmacies, hospitals, and distributors — competitive pricing on every order.',
      },
      {
        icon: 'range',
        title: 'Wide product range',
        description:
          'Tablets, capsules, syrups, gels, and drops across 12 therapeutic categories in one catalogue.',
      },
      {
        icon: 'supply',
        title: 'Reliable supply',
        description:
          'Consistent stock availability and responsive support so your shelves stay full and patients stay served.',
      },
    ],
  },
  storyBlocks: [
    {
      title: 'Quality-first manufacturing',
      paragraphs: [
        'Every Tainzay product is produced with rigorous quality controls — from ingredient sourcing and formulation to final packaging. We work with manufacturing processes aligned to good manufacturing practice standards.',
        'That commitment means pharmacies and hospitals receive medicines they can confidently dispense to patients, batch after batch.',
      ],
      image:
        'https://res.cloudinary.com/tainzay/image/upload/v1787124181/Family_Health-desktop.webp',
      alt: 'Family health supported by quality Tainzay pharmaceutical products',
      imagePosition: 'left',
    },
    {
      title: 'Products for every therapeutic need',
      paragraphs: [
        'From pain relief and cold & flu to vitamins, brain health, and gastrointestinal care — our catalogue covers the categories your customers ask for most.',
        'Browse by therapeutic area or explore the full wholesale catalogue to find the right products for your pharmacy shelves.',
      ],
      image:
        'https://res.cloudinary.com/tainzay/image/upload/v1787131787/product-hero.png',
      alt: 'Tainzay pharmaceutical product range across multiple categories',
      imagePosition: 'right',
      showCategories: true,
      cta: { label: 'Browse all products', href: '/products' },
    },
    {
      title: 'Your trusted wholesale partner',
      paragraphs: [
        'We serve pharmacies, hospitals, clinics, and distributors across Pakistan with responsive support and dependable fulfilment.',
        'Whether you are placing your first wholesale order or expanding an existing partnership, Tainzay is here to help you grow with confidence.',
      ],
      image:
        'https://res.cloudinary.com/tainzay/image/upload/v1787125010/Mix_People_600x600_jpg.webp',
      alt: 'Healthcare professionals and partners working with Tainzay',
      imagePosition: 'left',
      cta: { label: 'Request a quote', href: '/contact' },
    },
  ],
  productForms: {
    title: 'Product forms we supply',
    subtitle:
      'Backed by our current catalogue and expanding range — the dosage forms your pharmacy and facility need most.',
    items: [
      {
        icon: 'tablets',
        label: 'Tablets',
        description: 'Solid oral doses for vitamins, pain relief, and daily care.',
      },
      {
        icon: 'capsules',
        label: 'Capsules',
        description: 'Easy-to-swallow capsules for targeted nutritional support.',
      },
      {
        icon: 'syrups',
        label: 'Syrups',
        description: 'Liquid formulations for cough, cold, digestion, and more.',
      },
      {
        icon: 'gels',
        label: 'Gels',
        description: 'Topical relief products for pain and muscle comfort.',
      },
      {
        icon: 'drops',
        label: 'Drops',
        description: 'Precise liquid drops for respiratory and specialty care.',
      },
    ],
    cta: { label: 'View full catalogue', href: '/products' },
  },
  cta: {
    title: 'Ready to partner with Tainzay?',
    subtitle:
      'Get competitive wholesale pricing, reliable supply, and responsive support for your pharmacy, hospital, or distribution business.',
    primary: { label: 'Request a quote', href: '/contact' },
    secondary: { label: 'Browse products', href: '/products' },
    whatsappLabel: 'Chat on WhatsApp',
  },
} as const;

export type AboutPillarIcon = (typeof ABOUT_PAGE.pillars.items)[number]['icon'];
export type AboutProductFormIcon = (typeof ABOUT_PAGE.productForms.items)[number]['icon'];
