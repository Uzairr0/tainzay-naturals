import { buildAboutStructuredData } from '@/lib/about-seo';

export default function AboutStructuredData() {
  const data = buildAboutStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
