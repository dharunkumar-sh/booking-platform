import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "VibePass - Book Every Vibe with AI",
  description: "Discover and book movies, concerts, comedy nights, travel experiences, and local events.",
  icons: {
    icon: "/logo.svg",
    apple: { url: "/logo.svg", type: "image/svg+xml", sizes: "180x180" }
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-neutral-950 text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

