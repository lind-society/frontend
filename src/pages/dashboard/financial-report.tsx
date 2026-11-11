import * as React from "react";

import { useGetApi } from "../../hooks";

import { Layout } from "../../components/ui";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Payload, yearlyData } from "../../types";

const idr = (value: number) => `IDR ${new Intl.NumberFormat("id-ID").format(Math.round(value))}`;

/** Revenue by month for one year, from the same statistics the main dashboard chart uses. */
export const FinancialReportPage = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = React.useState<number>(currentYear);

  const { data, isPending, error } = useGetApi<Payload<yearlyData>>({
    key: ["financial-report", year],
    url: "bookings/statistics/yearly",
    params: { year: String(year) },
  });

  const months = data?.data.totalPerMonth ?? [];
  const total = data?.data.totalPerYear ?? 0;
  const best = months.reduce((top, month) => (month.total > (top?.total ?? 0) ? month : top), months[0]);
  const monthsWithRevenue = months.filter((month) => month.total > 0).length;
  const average = monthsWithRevenue ? total / monthsWithRevenue : 0;

  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

  return (
    <Layout>
      <header className="flex items-center justify-between pb-4 mb-6 border-b border-dark/30">
        <h1 className="head-title">Financial Report</h1>
        <label className="flex items-center gap-3">
          <span className="text-dark/70">Year</span>
          <select className="input-text w-32" value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </header>

      {error ? (
        <p className="p-6 text-red-600 rounded bg-light">Could not load the report. Please try again.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
            <div className="p-4 rounded-lg shadow bg-light">
              <h5 className="text-lg text-dark/70">Total revenue {year}</h5>
              <span className="block mt-2 text-3xl font-bold">{isPending ? "…" : idr(total)}</span>
            </div>
            <div className="p-4 rounded-lg shadow bg-light">
              <h5 className="text-lg text-dark/70">Average per active month</h5>
              <span className="block mt-2 text-3xl font-bold">{isPending ? "…" : idr(average)}</span>
            </div>
            <div className="p-4 rounded-lg shadow bg-light">
              <h5 className="text-lg text-dark/70">Best month</h5>
              <span className="block mt-2 text-3xl font-bold">
                {isPending || !best || best.total === 0 ? "-" : best.monthName}
              </span>
              {best && best.total > 0 && <span className="text-sm text-dark/70">{idr(best.total)}</span>}
            </div>
          </div>

          <div className="p-4 mb-6 rounded-lg shadow bg-light">
            <h5 className="mb-4 text-lg">Revenue per month</h5>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={months.map((month) => ({ name: month.monthName.substring(0, 3), value: month.total }))}>
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value: number) => (value >= 1_000_000 ? `${value / 1_000_000}M` : String(value))}
                  />
                  <Tooltip formatter={(value) => idr(Number(value))} />
                  <Bar dataKey="value" fill="#a2754c" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg shadow bg-light">
            <table className="w-full text-left">
              <thead className="border-b border-dark/20">
                <tr>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {months.map((month) => (
                  <tr key={month.month} className="border-b border-dark/10 last:border-b-0">
                    <td className="px-4 py-3">{month.monthName}</td>
                    <td className="px-4 py-3 text-right">{idr(month.total)}</td>
                  </tr>
                ))}
                {!isPending && months.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-center text-dark/60">
                      No revenue recorded for {year} yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
};
