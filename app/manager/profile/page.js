"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import ApiErrorAlert from "@/components/common/ApiErrorAlert";
import { getManagerProfileApi } from "@/services/managerService";

export default function ManagerProfilePage() {
  const { user, token } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const managerId = user?.id || user?._id || extractManagerIdFromToken(token);

        if (!managerId) {
          throw new Error("Manager ID not found. Please login again.");
        }

        const response = await getManagerProfileApi(managerId);
        const manager = response?.data?.manager || null;

        if (!manager) {
          throw new Error("Manager profile data not found.");
        }

        if (mounted) {
          setProfile(manager);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.response?.data || err?.message || "Failed to load manager profile.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    if (token) {
      loadProfile();
    }

    return () => {
      mounted = false;
    };
  }, [token, user?.id, user?._id]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 md:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">Manager Profile</h1>
        <Link
          href="/"
          className="rounded-full border border-[#102a4325] px-4 py-2 text-sm font-semibold text-[var(--color-brand-strong)] transition hover:bg-white"
        >
          Back To Landing
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-[#102a4322] bg-white p-6 text-sm text-[var(--color-muted)]">
          Loading manager profile...
        </div>
      ) : null}

      {!isLoading && error ? (
        <ApiErrorAlert error={error} fallbackMessage="Failed to load manager profile." />
      ) : null}

      {!isLoading && !error && profile ? (
        <section className="rounded-2xl border border-[#102a4322] bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <ProfileItem label="Manager ID" value={profile.id} />
            <ProfileItem label="Mess Name" value={profile.nameOfMess} />
            <ProfileItem label="Phone" value={profile.phnNumber} />
            <ProfileItem label="Email" value={profile.email} />
            <ProfileItem label="Language" value={profile.language} />
            <ProfileItem
              label="Full Control"
              value={profile.fullControl ? "Enabled" : "Disabled"}
            />
            <ProfileItem
              label="Subscription Start"
              value={formatDate(profile.subscriptionStartDate)}
            />
            <ProfileItem
              label="Subscription End"
              value={formatDate(profile.subscriptionEndDate)}
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="rounded-xl border border-[#102a431f] bg-[#fffdf9] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[var(--color-ink)]">{value || "-"}</p>
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function extractManagerIdFromToken(token) {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized));

    return decoded?.id || decoded?._id || decoded?.managerId || decoded?.sub || null;
  } catch {
    return null;
  }
}
