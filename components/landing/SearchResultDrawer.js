"use client";

import { useDispatch, useSelector } from "react-redux";
import ApiErrorAlert from "@/components/common/ApiErrorAlert";
import { clearSearchResult } from "@/store/slices/managerSearchSlice";
import { openAccessDrawer, openRequestDrawer } from "@/store/slices/drawerSlice";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";

export default function SearchResultDrawer() {
  const dispatch = useDispatch();
  const { t } = useLandingLanguage();
  const { hasSearched, isSearching, searchError, searchResults } = useSelector(
    (state) => state.managerSearch
  );

  const handleClose = () => {
    dispatch(clearSearchResult());
  };

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-30 bg-[#102a435e] transition ${
          hasSearched ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 h-full w-full max-w-xl border-r border-[#102a431f] bg-[var(--color-paper)] shadow-2xl transition-transform duration-300 ease-out ${
          hasSearched ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#102a4315] px-5 py-4">
            <p className="text-sm font-semibold text-[var(--color-ink)]">{t.searchResultsTitle}</p>
            <button
              type="button"
              onClick={handleClose}
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-[#0a4f49] bg-[#0b5e57] text-xs font-bold text-[#f1fffd] transition hover:border-[#083f3a] hover:bg-[#094f49]"
              aria-label={t.searchClose}
            >
              X
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            <ApiErrorAlert error={searchError} fallbackMessage={t.searchFailed} />

            {isSearching ? (
              <div className="rounded-2xl border border-[#102a4322] bg-white p-4 text-sm text-[var(--color-muted)]">
                {t.searchLoading}
              </div>
            ) : null}

            {!isSearching && !searchError && searchResults.length === 0 ? (
              <div className="rounded-2xl border border-[#102a4322] bg-white p-4 text-sm text-[var(--color-muted)]">
                {t.searchNoResults}
              </div>
            ) : null}

            {!isSearching && searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((manager, index) => {
                  const id = manager?.id || manager?._id || manager?.email || index;
                  const managerId = manager?.id || manager?._id || "";

                  return (
                    <article
                      key={id}
                      className="rounded-2xl border border-[#0a4f49] bg-[#0b5e57] p-4 shadow-[0_10px_24px_rgba(11,94,87,0.35)]"
                    >
                      <p className="text-sm font-semibold text-[#f7f3ea]">
                        {manager?.nameOfMess || manager?.messName || "-"}
                      </p>
                      <p className="mt-1 text-xs text-[#d5ece9]">
                        {t.searchResultEmail}: {manager?.email || "-"}
                      </p>
                      <p className="mt-1 text-xs text-[#d5ece9]">
                        {t.searchResultPhone}: {manager?.phnNumber || manager?.phone || "-"}
                      </p>
                      <button
                        type="button"
                        onClick={() => dispatch(openRequestDrawer(manager))}
                        className="mt-3 w-full cursor-pointer rounded-xl border border-[#d5ece9] bg-[#f7f3ea] px-3 py-2 text-xs font-semibold text-[#0b5e57] transition hover:bg-white"
                      >
                        {t.requestToAdd}
                      </button>

                      <button
                        type="button"
                        onClick={() => dispatch(openAccessDrawer(manager))}
                        className="mt-2 block w-full cursor-pointer rounded-xl border border-[#f7f3ea5e] bg-[#094f49] px-3 py-2 text-center text-xs font-semibold text-[#f7f3ea] transition hover:bg-[#083f3a]"
                      >
                        {t.enterDashboard}
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  );
}
