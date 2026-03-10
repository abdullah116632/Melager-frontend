"use client";

import { useEffect, useMemo, useState } from "react";
import { getMyConsumerRequestsToMessApi } from "@/services/consumerService";

export default function MessesPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptedOnly, setAcceptedOnly] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadRequests = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getMyConsumerRequestsToMessApi();
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
              "Failed to load messes."
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

  const filteredRequests = useMemo(() => {
    if (!acceptedOnly) {
      return requests;
    }

    return requests.filter((request) => (request?.status || "").toLowerCase() === "accepted");
  }, [acceptedOnly, requests]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-ink)]">Messes</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            All messes where you have requested to join.
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-[#102a4325] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-muted)]">
          <input
            type="checkbox"
            checked={acceptedOnly}
            onChange={(event) => setAcceptedOnly(event.target.checked)}
            className="h-4 w-4"
          />
          Accepted only
        </label>
      </div>

      {isLoading ? (
        <div className="mt-6 rounded-2xl border border-[#0b5e5730] bg-[#edf8f7] p-5 text-sm text-[var(--color-muted)]">
          Loading messes...
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && filteredRequests.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[#0b5e5730] bg-[#edf8f7] p-5 text-sm text-[var(--color-muted)]">
          {acceptedOnly ? "No accepted mess found." : "No requested mess found."}
        </div>
      ) : null}

      {!isLoading && !error && filteredRequests.length > 0 ? (
        <section className="mt-6 space-y-3">
          {filteredRequests.map((request, index) => {
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
