import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/context";
import { ThemeProvider } from "@/context/theme";
import Header from "@/components/site-header";
import Footer from "@/components/site-footer";
import WebVitalsReporter from "@/components/web-vitals-reporter";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Bookish Bliss",
  description: "E-commerce Website for Bookstore",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider>
          <CartProvider>
            <Header />
            <div className="relative px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem] min-h-[50vh]">
              <div className="relative">{children}</div>
            </div>
            <Footer />
            <WebVitalsReporter />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
