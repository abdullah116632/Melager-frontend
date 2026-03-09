import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Dashboard", href: "/manager" },
  { label: "Profile", href: "/manager/profile" },
  { label: "Members", href: "#" },
  { label: "Meals", href: "#" },
];

export default function ManagerNavbar() {
  return (
    <header className="relative z-20 border-b border-[#102a4315] bg-[#fdf8efcf] backdrop-blur-sm">
      <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
        <Link href="/manager" className="flex cursor-pointer items-center gap-3">
          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-white">
            <Image
              src="/logo/logo1.png"
              alt="Melager logo"
              width={40}
              height={40}
              className="h-10 w-10 scale-125 object-cover"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-[var(--color-brand-strong)]">Melager</p>
            <p className="text-xs text-[var(--color-muted)]">Manager Panel</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)] sm:gap-3">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full border border-[#102a4325] bg-white px-3 py-1.5 transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand-strong)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
