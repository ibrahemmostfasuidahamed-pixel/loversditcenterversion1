import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import CustomCursor from '@/components/ui/CustomCursor';
import OnboardingProvider from './OnboardingProvider';
import arMessages from '@/messages/ar.json';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={inter.variable}>
      <body className="bg-white text-gray-900 antialiased min-h-screen">
        <NextIntlClientProvider locale="ar" messages={arMessages as any}>
          <CustomCursor />
          <OnboardingProvider>
            {children}
          </OnboardingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
