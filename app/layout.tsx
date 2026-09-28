import type { Metadata } from "next";
import { Geist, Merriweather } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Sousas Ward | Sacrament Meeting Planner",
    template: "%s | Sousas Ward",
  },
  description: "View and print current and past sacrament meeting programs.",
  openGraph: {
    title: "Sousas Ward | Sacrament Meeting Planner",
    description: "View and print current and past sacrament meeting programs.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${merriweather.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
