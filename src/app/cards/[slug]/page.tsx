import { notFound } from 'next/navigation';
import { GIFT_CARDS } from '@/data/giftCards';
import { ProductCustomizer } from './ProductCustomizer';

export async function generateStaticParams() {
  return GIFT_CARDS.map((card) => ({
    slug: card.slug,
  }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const card = GIFT_CARDS.find((c) => c.slug === slug);

  if (!card) {
    notFound();
  }

  return <ProductCustomizer card={card} />;
}
