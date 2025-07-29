export default function Footer() {
  return (
    <footer className="w-full border-t bg-card mt-12">
      <div className="container mx-auto py-6 text-center text-sm text-muted-foreground">
        <p>
          MovieFinder © {new Date().getFullYear()} | All data provided by{' '}
          <a 
            href="https://www.themoviedb.org/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-semibold text-foreground hover:underline"
          >
            TMDB
          </a>.
        </p>
      </div>
    </footer>
  );
}