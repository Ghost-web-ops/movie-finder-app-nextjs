import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
   metadataBase: new URL('https://movie-finder-app-nextjs.vercel.app'),
  title: "MovieFinder - Discover & Search Your Favorite Films",
  description: "Explore a vast library of films with MovieFinder. Get details on the most popular movies, search for any title, and discover hidden gems. Your ultimate guide to the world of cinema, built with Next.js and the TMDB API.",
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
    <html lang="en">
      <body
      >
            <Navbar /> 
        {children}
        <Footer />
      </body>
    </html>
  );
}
