"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/consumer" },
  { label: "My Messes", href: "/consumer/my-messes" },
  { label: "My Request", href: "/consumer/my-requests" },
];

export default function ConsumerNavbar() {
  const pathname = usePathname();

  return (
    <header className="relative z-10 border-b border-[#102a4315] bg-[#fdf8efc9] backdrop-blur-sm">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link href="/" className="flex cursor-pointer items-center gap-3">
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
            <p className="text-xs text-[var(--color-muted)]">Hostel Meal Management</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)] md:gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`cursor-pointer rounded-full border px-3 py-1.5 transition ${
                  isActive
                    ? "border-[#0a4f49] bg-[#0b5e57] text-[#f1fffd]"
                    : "border-[#102a4325] bg-white hover:border-[var(--color-brand)] hover:text-[var(--color-brand-strong)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
