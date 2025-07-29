import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { FavoritesProvider } from "@/hooks/useFavorites"; 
import { ScrollToTop } from "@/components/ScrollToTop";



export const metadata: Metadata = {
  // --- Basic Info ---
  title: "MovieFinder - Discover & Search Your Favorite Films",
  description: "Discover and search thousands of films with MovieFinder. Get details, ratings, and trailers for popular movies. Built with Next.js and the TMDB API.",
  
  // --- Keywords (to satisfy the tool) ---
  keywords: "movies, film search, TMDB, Next.js, React, movie discovery, popular movies",

  // --- Publisher Info ---
  publisher: "Omar Yasser",
  
  // --- Robots Tag (The Fix) ---
  robots: {
    index: true,    // Allow indexing of this page
    follow: true,   // Allow following links on this page
    googleBot: {
      index: true,
      follow: true,
    },
  },
  
  // --- Canonical URL (from before) ---
  metadataBase: new URL('https://movie-finder-app-nextjs.vercel.app'), // استبدل هذا برابطك
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <body className={` flex flex-col min-h-screen`}> 
        
        <FavoritesProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          
            <Navbar /> 
            <ScrollToTop />
        <main className="flex-grow">{children}</main>
        
        <Footer />
        </ThemeProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
