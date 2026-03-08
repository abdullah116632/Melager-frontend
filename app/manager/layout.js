"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function ManagerLayout({ children }) {
  const token = useSelector((state) => state.auth.token);
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

  return children;
}
