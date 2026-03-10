"use client";

import { useEffect, useMemo, useState } from "react";
import { copy, LANGUAGE_KEY } from "@/page/landingCopy";

const LANGUAGE_EVENT = "melager-language-change";

export function useLandingLanguage() {
  const [hasMounted, setHasMounted] = useState(false);
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

  useEffect(() => {
    setHasMounted(true);

    const syncLanguageFromStorage = () => {
      const storedLanguage = localStorage.getItem(LANGUAGE_KEY);

      if (storedLanguage === "bn" || storedLanguage === "en") {
        setLanguage(storedLanguage);
      }
    };

    window.addEventListener("storage", syncLanguageFromStorage);
    window.addEventListener(LANGUAGE_EVENT, syncLanguageFromStorage);

    return () => {
      window.removeEventListener("storage", syncLanguageFromStorage);
      window.removeEventListener(LANGUAGE_EVENT, syncLanguageFromStorage);
    };
  }, []);

  const t = useMemo(() => copy[language], [language]); // Here t stands for “translate” or “translation”

  const handleLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    window.dispatchEvent(new Event(LANGUAGE_EVENT));
  };

  return {
    hasMounted,
    language,
    t,
    handleLanguage,
  };
}
