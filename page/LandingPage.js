"use client";

import { useMemo, useState } from "react";
import HeroSection from "@/components/landing/HeroSection";
import ForgotPasswordDrawer from "@/components/landing/ForgotPasswordDrawer";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LoginDrawer from "@/components/landing/LoginDrawer";
import SearchPanel from "@/components/landing/SearchPanel";
import SignupDrawer from "@/components/landing/SignupDrawer";
import { copy, LANGUAGE_KEY } from "@/page/landingCopy";

export default function LandingPage() {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") {
      return "bn";
    }

    const storedLanguage = localStorage.getItem(LANGUAGE_KEY);

    if (storedLanguage === "bn" || storedLanguage === "en") {
      return storedLanguage;
    }

    localStorage.setItem(LANGUAGE_KEY, "bn");
    return "bn";
  });

  const [isSignupDrawerOpen, setIsSignupDrawerOpen] = useState(false);
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
  const [isForgotDrawerOpen, setIsForgotDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");

  const t = useMemo(() => copy[language], [language]);

  const handleLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
  };

  const handleSearch = (event) => {
    event.preventDefault();
  };

  return (
    <div className={`shell min-h-screen ${language === "bn" ? "font-bn" : ""}`}>
      <LandingNavbar
        t={t}
        language={language}
        onLanguageChange={handleLanguage}
        onOpenLogin={() => {
          setIsSignupDrawerOpen(false);
          setIsForgotDrawerOpen(false);
          setIsLoginDrawerOpen(true);
        }}
        onOpenSignup={() => {
          setIsLoginDrawerOpen(false);
          setIsForgotDrawerOpen(false);
          setIsSignupDrawerOpen(true);
        }}
      />

      <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-7 px-4 pb-14 pt-10 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:pt-14">
        <HeroSection t={t} />
        <SearchPanel
          t={t}
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
        />
      </main>

      <LandingFooter t={t} />

      <SignupDrawer
        isOpen={isSignupDrawerOpen}
        t={t}
        onClose={() => setIsSignupDrawerOpen(false)}
        onOpenLogin={() => {
          setIsSignupDrawerOpen(false);
          setIsForgotDrawerOpen(false);
          setIsLoginDrawerOpen(true);
        }}
      />

      <LoginDrawer
        isOpen={isLoginDrawerOpen}
        t={t}
        onClose={() => setIsLoginDrawerOpen(false)}
        onOpenSignup={() => {
          setIsLoginDrawerOpen(false);
          setIsForgotDrawerOpen(false);
          setIsSignupDrawerOpen(true);
        }}
        onOpenForgotPassword={() => {
          setIsLoginDrawerOpen(false);
          setIsForgotDrawerOpen(true);
        }}
      />

      <ForgotPasswordDrawer
        isOpen={isForgotDrawerOpen}
        t={t}
        onClose={() => setIsForgotDrawerOpen(false)}
        onBackToLogin={() => {
          setIsForgotDrawerOpen(false);
          setIsLoginDrawerOpen(true);
        }}
      />
    </div>
  );
}
