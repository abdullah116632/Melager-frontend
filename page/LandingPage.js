"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import HeroSection from "@/components/landing/HeroSection";
import AdvantagesSection from "@/components/landing/AdvantagesSection";
import ForgotPasswordDrawer from "@/components/landing/ForgotPasswordDrawer";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LoginDrawer from "@/components/landing/LoginDrawer";
import SearchPanel from "@/components/landing/SearchPanel";
import ConsumerDashboardAccessRequestDrawer from "@/components/landing/ConsumerDashboardAccessRequestDrawer";
import RequestJoinDrawer from "@/components/landing/RequestJoinDrawer";
import SearchResultDrawer from "@/components/landing/SearchResultDrawer";
import SignupDrawer from "@/components/landing/SignupDrawer";
import VerifyOtpDrawer from "@/components/landing/VerifyOtpDrawer";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";
import {
  syncConsumerSessionFromStorage,
} from "@/store/slices/consumerSlice";

export default function LandingPage() {
  const dispatch = useDispatch();

  const { language } = useLandingLanguage();

  useEffect(() => {
    dispatch(syncConsumerSessionFromStorage());
  }, [dispatch]);

  return (
    <div className={`shell min-h-screen ${language === "bn" ? "font-bn" : ""}`}>
      <LandingNavbar />

      <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-7 px-4 pb-14 pt-10 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:pt-14">
        <HeroSection />
        <SearchPanel />
      </main>

      <SearchResultDrawer />

      <ConsumerDashboardAccessRequestDrawer />

      <RequestJoinDrawer />

      <AdvantagesSection />

      <LandingFooter />

      <SignupDrawer />

      <VerifyOtpDrawer />

      <LoginDrawer />

      <ForgotPasswordDrawer />
    </div>
  );
}
