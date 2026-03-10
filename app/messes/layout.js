"use client";

import { useEffect, useMemo, useState } from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import { copy, LANGUAGE_KEY } from "@/page/landingCopy";

const CONSUMER_SESSION_STORAGE_KEY = "consumerSessionData";

export default function MessesLayout({ children }) {
  const [language, setLanguage] = useState("bn");
  const [hasConsumerSession, setHasConsumerSession] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem(LANGUAGE_KEY);

    if (storedLanguage === "bn" || storedLanguage === "en") {
      setLanguage(storedLanguage);
    }

    const storedSession = localStorage.getItem(CONSUMER_SESSION_STORAGE_KEY);
    setHasConsumerSession(Boolean(storedSession));
  }, []);

  const t = useMemo(() => copy[language], [language]);

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
  };

  return (
    <>
      <LandingNavbar
        t={t}
        language={language}
        isAuthenticated={false}
        hasConsumerSession={hasConsumerSession}
        onLanguageChange={handleLanguageChange}
        onOpenLogin={() => {}}
        onOpenSignup={() => {}}
      />
      {children}
      <LandingFooter t={t} />
    </>
  );
}
