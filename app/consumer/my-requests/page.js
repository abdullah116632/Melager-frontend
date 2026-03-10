"use client";

import { useEffect, useState } from "react";
import { getMyConsumerRequestsApi } from "@/services/consumerService";

export default function ConsumerMyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadRequests = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getMyConsumerRequestsApi();
        const items = response?.data?.requests || response?.requests || [];

        if (mounted) {
          setRequests(Array.isArray(items) ? items : []);
        }
      } catch (err) {
        if (mounted) {
          setRequests([]);
          setError(
            err?.response?.data?.message ||
              err?.response?.data?.error ||
              err?.message ||
              "Failed to load requests."
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadRequests();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 md:px-8">
      <h1 className="text-2xl font-bold text-[var(--color-ink)]">My Request</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        All your join requests with live status.
      </p>

      {isLoading ? (
        <div className="mt-6 rounded-2xl border border-[#0b5e5730] bg-[#edf8f7] p-5 text-sm text-[var(--color-muted)]">
          Loading requests...
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && requests.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[#0b5e5730] bg-[#edf8f7] p-5 text-sm text-[var(--color-muted)]">
          No requests found.
        </div>
      ) : null}

      {!isLoading && !error && requests.length > 0 ? (
        <section className="mt-6 space-y-3">
          {requests.map((request, index) => {
            const id = request?.id || request?._id || index;
            const status = (request?.status || "pending").toLowerCase();
            const manager = request?.manager || {};

            return (
              <article key={id} className="rounded-2xl border border-[#0b5e5735] bg-[#f2faf9] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {manager?.nameOfMess || "Unknown Mess"}
                  </p>
                  <StatusBadge status={status} />
                </div>

                <p className="mt-2 text-xs text-[var(--color-muted)]">Email: {manager?.email || "-"}</p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  Phone: {manager?.phnNumber || "-"}
                </p>
              </article>
            );
          })}
        </section>
      ) : null}
    </main>
  );
}

function StatusBadge({ status }) {
  const styleMap = {
    pending: "border-[#d69e2e] bg-[#fff8e1] text-[#8a5d00]",
    accepted: "border-[#0a7a4c] bg-[#e8f8ef] text-[#0a5a39]",
    rejected: "border-[#c53030] bg-[#ffecec] text-[#8f1d1d]",
  };

  const className = styleMap[status] || styleMap.pending;

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${className}`}>
      {status}
    </span>
  );
}
