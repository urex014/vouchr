import { notFound } from 'next/navigation';
import { MOCK_GIFT_CARDS } from '@/lib/giftcards/mock-provider';
import { ProductCustomizer } from './ProductCustomizer';

export async function generateStaticParams() {
  const paths: { slug: string }[] = [];
  for (const card of MOCK_GIFT_CARDS) {
    paths.push({ slug: card.id });
    // Also include brand slug if unique
    if (!paths.some((p) => p.slug === card.brandSlug)) {
      paths.push({ slug: card.brandSlug });
    }
  }
  return paths;
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const card = MOCK_GIFT_CARDS.find(
    (c) => c.id === slug || c.brandSlug.toLowerCase() === slug.toLowerCase()
  );

  if (!card) {
    notFound();
  }

  return <ProductCustomizer card={card} />;
}
