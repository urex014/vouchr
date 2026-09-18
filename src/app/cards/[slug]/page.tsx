import { notFound } from 'next/navigation';
import { getReloadlyGiftCardById } from '@/lib/reloadly/giftcards';
import { ProductCustomizer } from './ProductCustomizer';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const card = await getReloadlyGiftCardById(slug);

  if (!card || !card.isAvailable) {
    notFound();
  }

  return <ProductCustomizer card={card} />;
}

