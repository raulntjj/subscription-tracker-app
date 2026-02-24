import type { Metadata } from "next";

import "@/app/globals.css";
import { I18nProvider } from "@/modules/shared/components/providers/i18n-provider";
import { Providers } from "@/modules/shared/components/providers/providers";
import type { Locale } from "@/modules/shared/store/i18n-store";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";

import { Toaster } from "@/components/ui/sonner";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SubTracker - Subscription Manager",
  description:
    "Track and manage all your recurring subscriptions in one place.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

const SUPPORTED_LOCALES: Locale[] = ["en", "pt-BR"];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  const locale: Locale = SUPPORTED_LOCALES.includes(raw as Locale)
    ? (raw as Locale)
    : "en";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <I18nProvider initialLocale={locale}>
            {children}
            <Toaster richColors position="top-right" />
          </I18nProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
