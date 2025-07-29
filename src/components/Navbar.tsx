import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          MovieFinder
        </Link>
        
        {/* يمكننا إضافة روابط أخرى هنا في المستقبل */}
        <nav className="flex items-center gap-4 md:gap-6">{/* Example: <Link href="/favorites">My Favorites</Link> */}
            <Link href="/favorites" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            My Favorites
          </Link>
            <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
