import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/common/CartDrawer';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { PopularCardsSection } from '@/components/home/PopularCardsSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { DealsSection } from '@/components/home/DealsSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaBanner } from '@/components/home/CtaBanner';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900 selection:bg-purple-200 selection:text-purple-900">
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <HeroSection />
        <CategorySection />
        <PopularCardsSection />
        <HowItWorksSection />
        <DealsSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
