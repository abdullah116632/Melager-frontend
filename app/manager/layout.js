"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import ManagerNavbar from "@/components/manager/ManagerNavbar";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";

export default function ManagerLayout({ children }) {
  const token = useSelector((state) => state.auth.token);
  const { language } = useLandingLanguage();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !token) {
      router.replace("/");
    }
  }, [hasMounted, token, router]);

  if (!hasMounted || !token) {
    return null;
  }

  return (
    <div className={language === "bn" ? "font-bn" : ""}>
      <ManagerNavbar />
      {children}
    </div>
  );
}
