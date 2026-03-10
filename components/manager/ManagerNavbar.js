"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiUser } from "react-icons/fi";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";

export default function ManagerNavbar() {
  const { language, t, handleLanguage } = useLandingLanguage();
  const pathname = usePathname();

  const navLinks = [
    { label: t.managerNavDashboard, href: "/manager" },
    { label: t.managerNavMembers, href: "/manager/consumers" },
    { label: t.managerNavMemberRequest, href: "/manager/consumer-request" },
    { label: t.managerNavMeals, href: "#" },
  ];

  const isActiveLink = (href) => {
    if (!href || href === "#") {
      return false;
    }

    if (href === "/manager") {
      return pathname === "/manager";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="relative z-20 border-b border-[#102a4315] bg-[#fdf8efcf] backdrop-blur-sm">
      <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
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
            <p className="text-xs text-[var(--color-muted)]">{t.managerPanelLabel}</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)] sm:gap-3">
          <div className="chip flex items-center rounded-full p-1 text-xs">
            <button
              type="button"
              onClick={() => handleLanguage("bn")}
              className={`rounded-full px-3 py-1.5 transition ${
                language === "bn"
                  ? "cursor-pointer bg-[var(--color-brand)] text-white"
                  : "cursor-pointer text-[var(--color-muted)] hover:text-[var(--color-brand-strong)]"
              }`}
            >
              বাংলা
            </button>
            <button
              type="button"
              onClick={() => handleLanguage("en")}
              className={`rounded-full px-3 py-1.5 transition ${
                language === "en"
                  ? "cursor-pointer bg-[var(--color-brand)] text-white"
                  : "cursor-pointer text-[var(--color-muted)] hover:text-[var(--color-brand-strong)]"
              }`}
            >
              English
            </button>
          </div>

          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`inline-flex min-w-[96px] justify-center rounded-full border px-3 py-1.5 text-center transition ${
                isActiveLink(item.href)
                  ? "border-[#083f3a] bg-[#0b5e57] text-[#f1fffd]"
                  : "border-[#102a4325] bg-white hover:border-[var(--color-brand)] hover:text-[var(--color-brand-strong)]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/manager/profile"
            className={`grid h-10 w-10 place-items-center rounded-full border transition ${
              isActiveLink("/manager/profile")
                ? "border-[#083f3a] bg-[#0b5e57] text-[#f1fffd]"
                : "border-[#102a4325] bg-white text-[var(--color-brand-strong)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
            }`}
            aria-label={t.managerNavProfile}
          >
            <FiUser size={18} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
