import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { Inter, Tajawal } from 'next/font/google';
import CustomCursor from '@/components/ui/CustomCursor';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const tajawal = Tajawal({ weight: ['300', '400', '500', '700', '800', '900'], subsets: ['arabic'], variable: '--font-tajawal' });

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${tajawal.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0f0a" />
        <link rel="manifest" href="/manifest.json" />
        <title>Lovers Diet Center - Premium Health & Nutrition</title>
        <meta name="description" content="Specialized nutrition programs and balanced healthy meals to achieve your health and fitness goals" />
      </head>
      <body className="bg-[var(--bg)] text-[var(--text)] overflow-x-hidden pt-[env(safe-area-inset-top)]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteSettingsProvider>
            <CustomCursor />
            {children}
            <WhatsAppButton />
          </SiteSettingsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}
