"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import HeroSection from "@/components/landing/HeroSection";
import AdvantagesSection from "@/components/landing/AdvantagesSection";
import ForgotPasswordDrawer from "@/components/landing/ForgotPasswordDrawer";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LoginDrawer from "@/components/landing/LoginDrawer";
import SearchPanel from "@/components/landing/SearchPanel";
import RequestJoinDrawer from "@/components/landing/RequestJoinDrawer";
import SearchResultDrawer from "@/components/landing/SearchResultDrawer";
import SignupDrawer from "@/components/landing/SignupDrawer";
import VerifyOtpDrawer from "@/components/landing/VerifyOtpDrawer";
import { searchManagersApi } from "@/services/authApi";
import { copy, LANGUAGE_KEY } from "@/page/landingCopy";

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
  const [isVerifyOtpDrawerOpen, setIsVerifyOtpDrawerOpen] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("nameOfMess");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isRequestDrawerOpen, setIsRequestDrawerOpen] = useState(false);
  const [selectedMessName, setSelectedMessName] = useState("");

  const t = useMemo(() => copy[language], [language]);

  const handleLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    const value = query.trim();

    if (!value) {
      setHasSearched(false);
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setHasSearched(true);

    const searchParam = { [searchBy]: value };

    try {
      setIsSearching(true);
      setSearchError(null);

      const response = await searchManagersApi(searchParam);
      const managers =
        response?.data?.managers ||
        response?.data?.results ||
        response?.data ||
        response?.managers ||
        response?.results ||
        [];

      setSearchResults(Array.isArray(managers) ? managers : []);
    } catch (error) {
      setSearchResults([]);
      setSearchError(error?.response?.data || error?.message || t.searchFailed);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQueryChange = (value) => {
    setQuery(value);

    if (searchError) {
      setSearchError(null);
    }
  };

  const handleSearchByChange = (value) => {
    setSearchBy(value);
  };

  const handleClearSearchResult = () => {
    setHasSearched(false);
    setSearchResults([]);
    setSearchError(null);
  };

  const handleOpenRequestDrawer = (manager) => {
    setSelectedMessName(manager?.nameOfMess || manager?.messName || "");
    setIsRequestDrawerOpen(true);
  };

  const handleCloseRequestDrawer = () => {
    setIsRequestDrawerOpen(false);
    setSelectedMessName("");
  };

  return (
    <div className={`shell min-h-screen ${language === "bn" ? "font-bn" : ""}`}>
      <LandingNavbar
        t={t}
        language={language}
        isAuthenticated={hasMounted && isAuthenticated}
        onLanguageChange={handleLanguage}
        onOpenLogin={() => {
          setIsSignupDrawerOpen(false);
          setIsForgotDrawerOpen(false);
          setIsVerifyOtpDrawerOpen(false);
          setIsLoginDrawerOpen(true);
        }}
        onOpenSignup={() => {
          setIsLoginDrawerOpen(false);
          setIsForgotDrawerOpen(false);
          setIsVerifyOtpDrawerOpen(false);
          setIsSignupDrawerOpen(true);
        }}
      />

      <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-7 px-4 pb-14 pt-10 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:pt-14">
        <HeroSection t={t} />
        <SearchPanel
          t={t}
          query={query}
          searchBy={searchBy}
          onQueryChange={handleQueryChange}
          onSearchByChange={handleSearchByChange}
          onSearch={handleSearch}
          isSearching={isSearching}
          hasSearched={hasSearched}
        />
      </main>

      <SearchResultDrawer
        isOpen={hasSearched}
        t={t}
        isSearching={isSearching}
        searchError={searchError}
        searchResults={searchResults}
        onClose={handleClearSearchResult}
        onOpenRequest={handleOpenRequestDrawer}
      />

      <RequestJoinDrawer
        isOpen={isRequestDrawerOpen}
        t={t}
        messName={selectedMessName}
        onClose={handleCloseRequestDrawer}
      />

      <AdvantagesSection t={t} />

      <LandingFooter t={t} />

      <SignupDrawer
        isOpen={isSignupDrawerOpen}
        t={t}
        onClose={() => setIsSignupDrawerOpen(false)}
        onOpenLogin={() => {
          setIsSignupDrawerOpen(false);
          setIsForgotDrawerOpen(false);
          setIsVerifyOtpDrawerOpen(false);
          setIsLoginDrawerOpen(true);
        }}
        onSignupSuccess={({ email, token }) => {
          if (token) {
            setIsSignupDrawerOpen(false);
            setIsVerifyOtpDrawerOpen(false);
            setIsLoginDrawerOpen(false);
            setIsForgotDrawerOpen(false);
            router.push("/manager");
            return;
          }

          setSignupEmail(email || "");
          setIsSignupDrawerOpen(false);
          setIsVerifyOtpDrawerOpen(true);
        }}
      />

      <VerifyOtpDrawer
        isOpen={isVerifyOtpDrawerOpen}
        t={t}
        defaultEmail={signupEmail}
        onClose={() => setIsVerifyOtpDrawerOpen(false)}
        onVerifySuccess={() => {
          setIsVerifyOtpDrawerOpen(false);
          setIsSignupDrawerOpen(false);
          setIsLoginDrawerOpen(false);
          setIsForgotDrawerOpen(false);
          router.push("/manager");
        }}
        onBackToSignup={() => {
          setIsVerifyOtpDrawerOpen(false);
          setIsSignupDrawerOpen(true);
        }}
      />

      <LoginDrawer
        isOpen={isLoginDrawerOpen}
        t={t}
        onClose={() => setIsLoginDrawerOpen(false)}
        onOpenSignup={() => {
          setIsLoginDrawerOpen(false);
          setIsForgotDrawerOpen(false);
          setIsVerifyOtpDrawerOpen(false);
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
