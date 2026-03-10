"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLandingLanguage } from "@/hooks/useLandingLanguage";
import { fetchManagerMonthlyMeals } from "@/store/slices/monthlyMealSlice";

function getMonthDayCount(month, year) {
  if (!month || !year) {
    return 31;
  }

  return new Date(year, month, 0).getDate();
}

function getWeekdayShort(day, month, year) {
  if (!day || !month || !year) {
    return "-";
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
}

function groupSheetsByMonthYear(sheets) {
  return sheets.reduce((acc, sheet) => {
    const month = Number(sheet?.month || 0);
    const year = Number(sheet?.year || 0);

    if (!month || !year) {
      return acc;
    }

    const key = `${year}-${month}`;

    if (!acc[key]) {
      acc[key] = {
        month,
        year,
        sheets: [],
      };
    }

    acc[key].sheets.push(sheet);

    return acc;
  }, {});
}

const CONSUMER_ROW_COLORS = [
  "#ffedd5",
  "#dbeafe",
  "#dcfce7",
  "#fce7f3",
  "#e9d5ff",
  "#cffafe",
  "#ffe4e6",
  "#fef3c7",
  "#e2e8f0",
  "#dbeafe",
];

export default function ManagerPage() {
  const dispatch = useDispatch();
  const { language, t } = useLandingLanguage();
  const [consumerSearchQuery, setConsumerSearchQuery] = useState("");
  const { monthlyMeals, isLoading, error } = useSelector((state) => state.monthlyMeal);
  const grouped = groupSheetsByMonthYear(monthlyMeals);
  const groupKeys = Object.keys(grouped);

  useEffect(() => {
    dispatch(fetchManagerMonthlyMeals());
  }, [dispatch]);

  return (
    <main className={`mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8 ${language === "bn" ? "font-bn" : ""}`}>
      <h1 className="text-2xl font-bold text-[var(--color-ink)]">{t.managerMonthlyMealsTitle}</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{t.managerMonthlyMealsSubtitle}</p>

      {isLoading ? (
        <div className="mt-6 rounded-2xl border border-[#102a4322] bg-white p-6 text-sm text-[var(--color-muted)]">
          {t.managerMonthlyMealsLoading}
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && monthlyMeals.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[#102a4322] bg-white p-6 text-sm text-[var(--color-muted)]">
          {t.managerMonthlyMealsEmpty}
        </div>
      ) : null}

      {!isLoading && !error && monthlyMeals.length > 0 ? (
        <section className="mt-6 space-y-5">
          {groupKeys.map((groupKey) => {
            const currentGroup = grouped[groupKey];
            const month = currentGroup?.month;
            const year = currentGroup?.year;
            const totalDays = getMonthDayCount(month, year);
            const days = Array.from({ length: totalDays }, (_, dayIndex) => dayIndex + 1);
            const sheets = currentGroup?.sheets || [];
            const normalizedQuery = consumerSearchQuery.trim().toLowerCase();
            const filteredSheets = sheets.filter((sheet) => {
              if (!normalizedQuery) {
                return true;
              }

              const consumer = sheet?.consumer || {};
              const name = String(consumer?.name || "").toLowerCase();
              const email = String(consumer?.email || "").toLowerCase();
              const phone = String(consumer?.phnNumber || "").toLowerCase();

              return (
                name.includes(normalizedQuery) ||
                email.includes(normalizedQuery) ||
                phone.includes(normalizedQuery)
              );
            });

            return (
              <article key={groupKey} className="overflow-hidden rounded-2xl border border-[#102a4322] bg-white shadow-sm">
                <div className="border-b border-[#102a4315] bg-[#f8fbfd] px-4 py-4 md:px-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm font-semibold text-[var(--color-ink)]">{t.managerMonthlyMealsTitle}</p>

                    <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
                      <input
                        type="text"
                        value={consumerSearchQuery}
                        onChange={(event) => setConsumerSearchQuery(event.target.value)}
                        placeholder={t.managerMonthlyMealsSearchPlaceholder}
                        className="w-full rounded-lg border border-[#6f879d] bg-white px-3 py-2 text-xs text-[var(--color-ink)] outline-none transition focus:border-[var(--color-brand)] md:w-[280px]"
                      />

                      <p className="text-xs font-semibold text-[var(--color-brand-strong)]">
                        {t.managerMonthlyMealsConsumersCountLabel}: {filteredSheets.length}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-muted)]">
                    <span>{t.managerMonthlyMealsMonthLabel}: {month || "-"}</span>
                    <span>{t.managerMonthlyMealsYearLabel}: {year || "-"}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-[#6f879d] text-xs md:text-sm">
                    <thead>
                      <tr className="bg-[#eaf2f8] text-left text-[var(--color-ink)]">
                        <th className="whitespace-nowrap border-b border-r border-[#6f879d] px-3 py-2">{t.managerMonthlyMealsConsumerColumn}</th>
                        {days.map((dayNumber) => {
                          const weekday = getWeekdayShort(dayNumber, month, year);

                          return (
                            <th
                              key={`${groupKey}-date-${dayNumber}`}
                              className="whitespace-nowrap border-b border-r border-[#6f879d] px-3 py-2"
                            >
                              <div className="font-semibold">{dayNumber}</div>
                              <div className="mt-0.5 font-normal text-[10px] text-[var(--color-muted)]">{weekday}</div>
                            </th>
                          );
                        })}
                        <th className="whitespace-nowrap border-b border-r border-[#6f879d] px-3 py-2">
                          {t.managerMonthlyMealsTotalLabel}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSheets.map((sheet, index) => {
                        const rowId = sheet?.id || index;
                        const consumer = sheet?.consumer || {};
                        const rowColor = CONSUMER_ROW_COLORS[index % CONSUMER_ROW_COLORS.length];

                        return (
                          <tr key={`${groupKey}-consumer-${rowId}`} style={{ backgroundColor: rowColor }}>
                            <td className="border-b border-r border-[#8ea4b8] px-3 py-2 font-medium text-[var(--color-ink)]">
                              <div className="font-semibold">{consumer?.name || t.managerUnknownConsumer}</div>
                              <div className="mt-0.5 text-[10px] font-normal text-[var(--color-muted)]">
                                {consumer?.phnNumber || consumer?.email || "-"}
                              </div>
                            </td>

                            {days.map((dayNumber) => {
                              const meal = sheet?.meals?.[String(dayNumber)] || {};

                              return (
                                <td
                                  key={`${rowId}-day-${dayNumber}`}
                                  className="border-b border-r border-[#8ea4b8] px-3 py-2 text-center font-semibold text-[var(--color-brand-strong)]"
                                >
                                  {meal?.totalMeal ?? 0}
                                </td>
                              );
                            })}

                            <td className="border-b border-r border-[#8ea4b8] px-3 py-2 text-center font-bold text-[var(--color-brand-strong)]">
                              {sheet?.totalsMela ?? 0}
                            </td>
                          </tr>
                        );
                      })}

                      {filteredSheets.length === 0 ? (
                        <tr>
                          <td
                            colSpan={days.length + 2}
                            className="border-b border-r border-[#8ea4b8] px-3 py-4 text-center text-xs text-[var(--color-muted)]"
                          >
                            {t.managerMonthlyMealsSearchEmpty}
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}
    </main>
  );
}
