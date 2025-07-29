import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
   metadataBase: new URL('https://movie-finder-app-nextjs.vercel.app'),
  title: "MovieFinder - Discover & Search Your Favorite Films",
  description: "Discover and search thousands of films with MovieFinder. Get details, ratings, and trailers for popular movies. Built with Next.js and the TMDB API.",


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
