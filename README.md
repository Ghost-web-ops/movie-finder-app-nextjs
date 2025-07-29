# MovieFinder - A Modern Movie Discovery Web App

This is a responsive, high-performance movie discovery application built from scratch using Next.js and the TMDB API. It allows users to browse popular movies, search for any title, and view detailed information in a clean, modern interface.

**➡️ Live Demo:** [Add Your Vercel Link Here After Deployment]

---

## ✨ Features

- **Server-Side Rendering (SSR):** Built with Next.js App Router for fast initial page loads and excellent SEO performance.
- **Dynamic Routing:** Individual, dynamically generated pages for each movie's details.
- **Live API Integration:** Fetches all data in real-time from the official TMDB (The Movie Database) API.
- **Advanced Search & Pagination:** Allows users to search for any movie and navigate through multiple pages of results.
- **Responsive Design:** A fully responsive, mobile-first design built with Tailwind CSS that looks great on all devices.
- **Error Handling:** Gracefully handles cases like empty search results or failed image loads.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **API Communication:** Axios

---

## 🚀 Getting Started

To run this project locally:

1. Clone this repository.
2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Create a `.env.local` file in the root directory and add your TMDB API key:

    ```env
    NEXT_PUBLIC_TMDB_API_KEY=YOUR_API_KEY_HERE
    ```

4. Run the development server:

    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.
