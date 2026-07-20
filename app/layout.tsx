import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Footer } from "@/components/Layout/Footer";
import { WhatsAppFloat } from "@/components/Layout/WhatsAppFloat";
import { MobileCartBar } from "@/components/Layout/MobileCartBar";
import { AuthProvider } from "@/context/AuthContext";
import { GlobalHeader } from "@/components/Layout/GlobalHeader";
import { getUserFromSession } from "@/lib/auth/getUserFromSession";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://goglossy.co.ke"),
  title: {
    default: "Glossy | Premium Beauty & Cosmetics",
    template: "%s | Glossy",
  },
  description:
    "Discover premium beauty and cosmetics products at Glossy. Shop for high-quality skincare, makeup, and more in Kenya.",
  keywords: [
    "beauty",
    "cosmetics",
    "skincare",
    "makeup",
    "Glossy Kenya",
    "premium beauty",
  ],
  authors: [{ name: "Glossy" }],
  creator: "Glossy",
  publisher: "Glossy",
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://goglossy.co.ke",
    title: "Glossy | Premium Beauty & Cosmetics",
    description:
      "Discover premium beauty and cosmetics products at Glossy. Shop for high-quality skincare, makeup, and more in Kenya.",
    siteName: "Glossy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glossy | Premium Beauty & Cosmetics",
    description:
      "Discover premium beauty and cosmetics products at Glossy. Shop for high-quality skincare, makeup, and more in Kenya.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromSession();

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <AuthProvider user={user}>
            <div className="flex min-h-screen flex-col bg-soft-pink">
              <GlobalHeader user={user} />
              <main className="flex-1">{children}</main>
              <Footer />
              <WhatsAppFloat />
              <MobileCartBar />
            </div>
          </AuthProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
