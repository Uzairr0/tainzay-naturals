export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  image: string;
  date: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Wholesale Supply Tips for Growing Pharmacies',
    excerpt:
      'Learn how pharmacies can manage inventory, reduce stockouts, and partner with reliable pharmaceutical wholesalers for consistent supply.',
    slug: 'wholesale-supply-tips-for-pharmacies',
    image: '/blog/post-1.svg',
    date: '2026-07-12',
  },
  {
    id: 'blog-2',
    title: 'Antibiotics Stewardship in Retail Pharmacy',
    excerpt:
      'A practical guide for pharmacists on responsible antibiotic dispensing, patient counseling, and maintaining quality wholesale stock.',
    slug: 'antibiotics-stewardship-retail-pharmacy',
    image: '/blog/post-2.svg',
    date: '2026-06-28',
  },
  {
    id: 'blog-3',
    title: 'Cold Chain Essentials for Sensitive Medicines',
    excerpt:
      'Understand temperature control, packaging, and delivery practices that protect vaccine and cold-chain pharmaceutical products.',
    slug: 'cold-chain-essentials-medicines',
    image: '/blog/post-3.svg',
    date: '2026-06-10',
  },
];
