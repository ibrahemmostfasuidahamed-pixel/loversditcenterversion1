'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductsSection from '@/components/sections/ProductsSection';

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col pt-16 md:pt-24 bg-[var(--bg)]">
        {/* We can reuse the ProductsSection component here. 
            It handles its own fetching and filtering. */}
        <div className="flex-1">
          <ProductsSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
