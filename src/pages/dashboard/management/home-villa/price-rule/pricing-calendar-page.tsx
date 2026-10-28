import * as React from "react";

import { useQuery } from "@tanstack/react-query";

import { Layout } from "../../../../../components/ui";

import { VillaPricingCalendar } from "./calendar";

import { API } from "../../../../../utils/api";

interface VillaOption {
  id: string;
  name: string;
  currency?: { code?: string } | null;
}

/**
 * Per-date pricing for one villa.
 *
 * The season price rules stay where they are — they still describe "these weeks
 * are high season". This page is the layer above them, for the dates that need
 * a hand-set rate, a longer minimum stay, or to be closed off entirely.
 */
export const PricingCalendarPage = () => {
  const [villaId, setVillaId] = React.useState<string>("");

  const { data: villas, isLoading } = useQuery<VillaOption[]>({
    queryKey: ["villas-for-calendar"],
    queryFn: async () => {
      const { data } = await API.get("/villas", { params: { page: 1, limit: 100 } });
      return data.data.data;
    },
  });

  React.useEffect(() => {
    if (!villaId && villas?.length) setVillaId(villas[0].id);
  }, [villas, villaId]);

  const selected = villas?.find((v) => v.id === villaId);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="head-title">Kalender Harga</h1>
            <p className="mt-1 text-sm text-dark/60">
              Atur harga per tanggal, minimum malam, dan tanggal yang ditutup. Menimpa harga musim.
            </p>
          </div>

          <div className="min-w-64">
            <label className="block mb-1 text-sm font-medium text-dark">Villa</label>
            <select className="input-select w-full" value={villaId} onChange={(e) => setVillaId(e.target.value)} disabled={isLoading}>
              {isLoading && <option>Memuat...</option>}
              {villas?.map((villa) => (
                <option key={villa.id} value={villa.id}>
                  {villa.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {villaId ? (
          <VillaPricingCalendar villaId={villaId} currency={selected?.currency?.code ?? "IDR"} />
        ) : (
          !isLoading && <p className="p-8 text-center text-dark/60 bg-light rounded card-shadow">Belum ada villa.</p>
        )}
      </div>
    </Layout>
  );
};
