import * as React from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { FaBan, FaChevronLeft, FaChevronRight, FaMoon, FaTag } from "react-icons/fa";

import { Button } from "../../../../../components";

import { API } from "../../../../../utils/api";

/** Mirrors VillaCalendarDayDto on the backend. */
export interface CalendarDay {
  date: string;
  price: number;
  source: "override" | "season" | "base";
  season: string;
  priceRuleName: string | null;
  minStay: number | null;
  isBlocked: boolean;
  note: string | null;
  isBooked: boolean;
}

const SEASON_LABEL: Record<string, string> = {
  regular_season: "Regular",
  low_season: "Low",
  high_season: "High",
  peak_season: "Peak",
};

const DAY_HEADS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const pad = (n: number) => String(n).padStart(2, "0");
const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Monday-first offset, so the grid matches how Indonesian calendars read. */
const mondayOffset = (date: Date) => (date.getDay() + 6) % 7;

const monthLabel = (year: number, month: number) =>
  new Date(year, month, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

const formatPrice = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}jt`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}rb`;
  return String(value);
};

/**
 * Month grid for one villa's nightly rates.
 *
 * Every cell shows the price actually in force after the
 * override -> season -> base resolution the API performs, so the admin reads
 * the same number a guest would be charged rather than re-deriving the rules.
 */
export const VillaPricingCalendar = ({ villaId, currency = "IDR" }: { villaId: string; currency?: string }) => {
  const queryClient = useQueryClient();
  const today = new Date();

  const [cursor, setCursor] = React.useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [anchor, setAnchor] = React.useState<string | null>(null);

  // Form state for the side panel.
  const [price, setPrice] = React.useState("");
  const [minStay, setMinStay] = React.useState("");
  const [note, setNote] = React.useState("");

  const first = new Date(cursor.year, cursor.month, 1);
  const last = new Date(cursor.year, cursor.month + 1, 0);
  const from = toKey(first);
  const to = toKey(last);

  const { data, isLoading } = useQuery<CalendarDay[]>({
    queryKey: ["villa-calendar", villaId, from, to],
    queryFn: async () => {
      const { data } = await API.get(`/villas/${villaId}/calendar`, { params: { from, to } });
      return data.data.days;
    },
    enabled: Boolean(villaId),
    staleTime: 0,
  });

  const byDate = React.useMemo(() => new Map((data ?? []).map((d) => [d.date, d])), [data]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["villa-calendar", villaId] });

  const apply = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const { data } = await API.put(`/villas/${villaId}/calendar`, { dates: [...selected], ...body });
      return data;
    },
    onSuccess: () => {
      toast.success(`${selected.size} tanggal diperbarui`);
      invalidate();
      setSelected(new Set());
      setPrice("");
      setMinStay("");
      setNote("");
    },
    onError: () => toast.error("Gagal menyimpan"),
  });

  const clear = useMutation({
    mutationFn: async () => {
      const { data } = await API.delete(`/villas/${villaId}/calendar`, { data: { dates: [...selected] } });
      return data;
    },
    onSuccess: () => {
      toast.success("Override dihapus, kembali ke harga musim");
      invalidate();
      setSelected(new Set());
    },
    onError: () => toast.error("Gagal menghapus"),
  });

  /** Click toggles a day; shift-click extends from the last clicked day. */
  const toggle = (date: string, shift: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);

      if (shift && anchor) {
        const [a, b] = [anchor, date].sort();
        const cursorDate = new Date(`${a}T00:00:00`);
        const end = new Date(`${b}T00:00:00`);
        while (cursorDate <= end) {
          next.add(toKey(cursorDate));
          cursorDate.setDate(cursorDate.getDate() + 1);
        }
        return next;
      }

      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
    setAnchor(date);
  };

  const move = (delta: number) => {
    const d = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
    setSelected(new Set());
  };

  const cells: (CalendarDay | null)[] = [
    ...Array.from({ length: mondayOffset(first) }, () => null),
    ...Array.from({ length: last.getDate() }, (_, i) => byDate.get(toKey(new Date(cursor.year, cursor.month, i + 1))) ?? null),
  ];

  const hasSelection = selected.size > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar */}
      <div className="p-4 bg-light rounded card-shadow lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 rounded hover:bg-gray" onClick={() => move(-1)} aria-label="Bulan sebelumnya">
            <FaChevronLeft />
          </button>
          <h2 className="heading">{monthLabel(cursor.year, cursor.month)}</h2>
          <button className="p-2 rounded hover:bg-gray" onClick={() => move(1)} aria-label="Bulan berikutnya">
            <FaChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_HEADS.map((d) => (
            <div key={d} className="py-1 text-xs font-semibold text-center text-dark/50">
              {d}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <div className="loader size-10 after:size-10"></div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, index) => {
              if (!day) return <div key={`pad-${index}`} />;

              const isSelected = selected.has(day.date);
              const dayNumber = Number(day.date.slice(8));

              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={(e) => !day.isBooked && toggle(day.date, e.shiftKey)}
                  disabled={day.isBooked}
                  title={day.note ?? undefined}
                  className={[
                    "flex flex-col items-start gap-0.5 p-1.5 h-20 border rounded text-left transition-colors",
                    day.isBooked
                      ? "bg-gray/60 border-gray cursor-not-allowed opacity-70"
                      : isSelected
                        ? "bg-primary/15 border-primary"
                        : "bg-light border-dark/10 hover:border-primary/60",
                  ].join(" ")}
                >
                  <span className="text-xs font-semibold text-dark">{dayNumber}</span>

                  <span className={`text-xs ${day.source === "override" ? "font-bold text-primary" : "text-dark/70"}`}>
                    {day.isBlocked ? "—" : formatPrice(day.price)}
                  </span>

                  <span className="flex items-center gap-1 mt-auto">
                    {day.isBlocked && <FaBan className="text-xs text-red-600" title="Diblokir" />}
                    {day.minStay ? (
                      <span className="flex items-center gap-0.5 text-[10px] text-dark/60">
                        <FaMoon className="text-[8px]" />
                        {day.minStay}
                      </span>
                    ) : null}
                    {day.season !== "regular_season" && !day.isBlocked && (
                      <span className="text-[10px] text-primary/80">{SEASON_LABEL[day.season]}</span>
                    )}
                    {day.isBooked && <span className="text-[10px] text-dark/50">Terisi</span>}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap gap-4 pt-3 mt-3 text-xs border-t text-dark/60 border-dark/10">
          <span className="flex items-center gap-1">
            <FaTag className="text-primary" /> Harga tebal = override
          </span>
          <span className="flex items-center gap-1">
            <FaMoon /> Minimum malam
          </span>
          <span className="flex items-center gap-1">
            <FaBan className="text-red-600" /> Diblokir
          </span>
          <span>Klik untuk pilih, Shift+klik untuk rentang</span>
        </div>
      </div>

      {/* Side panel */}
      <div className="p-4 space-y-4 bg-light rounded card-shadow h-fit">
        <div>
          <h3 className="heading">Atur Tanggal</h3>
          <p className="mt-1 text-sm text-dark/60">
            {hasSelection ? `${selected.size} tanggal dipilih` : "Pilih tanggal di kalender dulu"}
          </p>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-dark">Harga per malam ({currency})</label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Kosongkan = tidak diubah"
            className="input-text"
            disabled={!hasSelection}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-dark">Minimum malam</label>
          <input
            type="number"
            min={1}
            value={minStay}
            onChange={(e) => setMinStay(e.target.value)}
            placeholder="Kosongkan = tidak diubah"
            className="input-text"
            disabled={!hasSelection}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-dark">Catatan (internal)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="mis. Peak Natal"
            className="input-text"
            disabled={!hasSelection}
          />
        </div>

        <div className="space-y-2">
          <Button
            className="w-full btn-primary"
            disabled={!hasSelection || apply.isPending}
            onClick={() => {
              const body: Record<string, unknown> = {};
              if (price !== "") body.price = Number(price);
              if (minStay !== "") body.minStay = Number(minStay);
              if (note !== "") body.note = note;

              if (!Object.keys(body).length) {
                toast.error("Isi minimal satu kolom");
                return;
              }
              apply.mutate(body);
            }}
          >
            Simpan
          </Button>

          <Button className="w-full btn-outline" disabled={!hasSelection || apply.isPending} onClick={() => apply.mutate({ isBlocked: true })}>
            Blokir Tanggal
          </Button>

          <Button className="w-full btn-outline" disabled={!hasSelection || apply.isPending} onClick={() => apply.mutate({ isBlocked: false })}>
            Buka Blokir
          </Button>

          <Button
            className="w-full btn-red"
            disabled={!hasSelection || clear.isPending}
            onClick={() => {
              if (window.confirm("Hapus semua pengaturan khusus di tanggal terpilih? Harga kembali mengikuti musim.")) {
                clear.mutate();
              }
            }}
          >
            Reset ke Harga Musim
          </Button>
        </div>
      </div>
    </div>
  );
};
