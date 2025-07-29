import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        <Link href="/" className="text-xl font-bold text-primary">
          MovieFinder
        </Link>

        {/* يمكننا إضافة روابط أخرى هنا في المستقبل */}
        <nav>
          {/* Example: <Link href="/favorites">My Favorites</Link> */}
        </nav>

      </div>
    </header>
  );
}