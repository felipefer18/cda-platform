import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-v3a-gold px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-v3a.png" alt="V3A" width={36} height={36} priority />
          <span className="font-bold text-v3a-dark tracking-tight">CDA Platform</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold text-v3a-dark">
          <Link href="/" className="hover:opacity-70">
            Busca
          </Link>
          <Link href="/admin" className="hover:opacity-70">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
