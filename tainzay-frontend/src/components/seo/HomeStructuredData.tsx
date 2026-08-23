import JsonLd from '@/components/seo/JsonLd';
import { buildHomeStructuredData } from '@/lib/site-seo';

export default function HomeStructuredData() {
  return <JsonLd data={buildHomeStructuredData()} />;
}
