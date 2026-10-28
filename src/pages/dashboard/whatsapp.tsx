import * as React from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { FaCheckCircle, FaExclamationTriangle, FaQrcode, FaSignOutAlt, FaSyncAlt, FaTimesCircle } from "react-icons/fa";

import { Button } from "../../components";
import { Layout } from "../../components/ui";

import { API } from "../../utils/api";

/** Mirrors IWhatsappConnectionState in the backend. */
interface WhatsappConnection {
  status: "initializing" | "qr_required" | "authenticating" | "connected" | "disconnected" | "auth_failure" | "service_down";
  qrImage: string | null;
  qrIssuedAt: string | null;
  linkedNumber: string | null;
  linkedName: string | null;
  lastReadyAt: string | null;
  lastDisconnectedAt: string | null;
  lastDisconnectReason: string | null;
  retries: number;
  maxRetries: number;
}

type Tone = "ok" | "warn" | "danger" | "idle";

/**
 * Copy is deliberately non-technical: whoever links the handset is front-desk
 * staff, not an engineer. Each state says what is happening and what to do.
 */
const STATUS_COPY: Record<WhatsappConnection["status"], { label: string; detail: string; tone: Tone }> = {
  connected: {
    label: "Terhubung",
    detail: "Notifikasi WhatsApp ke customer dan owner sedang aktif.",
    tone: "ok",
  },
  qr_required: {
    label: "Menunggu Scan QR",
    detail: "Scan QR di bawah memakai WhatsApp di HP untuk menghubungkan.",
    tone: "warn",
  },
  authenticating: {
    label: "Menghubungkan",
    detail: "QR berhasil dipindai. Tunggu sebentar sampai sesi siap.",
    tone: "warn",
  },
  initializing: {
    label: "Menyiapkan",
    detail: "Layanan WhatsApp sedang dinyalakan. Tunggu beberapa detik.",
    tone: "idle",
  },
  disconnected: {
    label: "Terputus",
    detail: "Sambungan terputus. Sistem mencoba menyambung ulang otomatis.",
    tone: "danger",
  },
  auth_failure: {
    label: "Gagal Masuk",
    detail: "Sesi ditolak WhatsApp. Putuskan sambungan lalu scan ulang QR.",
    tone: "danger",
  },
  service_down: {
    label: "Layanan Tidak Aktif",
    detail: "Service WhatsApp tidak berjalan. Hubungi tim teknis untuk menyalakannya.",
    tone: "danger",
  },
};

const TONE_CLASS: Record<Tone, string> = {
  ok: "bg-green-100 text-green-800 border-green-200",
  warn: "bg-yellow-100 text-yellow-800 border-yellow-200",
  danger: "bg-red-100 text-red-800 border-red-200",
  idle: "bg-gray text-dark border-dark/10",
};

const TONE_ICON: Record<Tone, React.ReactNode> = {
  ok: <FaCheckCircle />,
  warn: <FaQrcode />,
  danger: <FaTimesCircle />,
  idle: <FaExclamationTriangle />,
};

const formatDateTime = (value: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
};

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between gap-4 py-2 border-b border-dark/10 last:border-b-0">
    <span className="text-sm text-dark/60">{label}</span>
    <span className="text-sm font-medium text-right text-dark">{value}</span>
  </div>
);

export const WhatsappPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<WhatsappConnection>({
    queryKey: ["whatsapp-connection"],
    queryFn: async () => {
      const { data } = await API.get("/whatsapp/connection");
      return data.data;
    },
    // A QR expires after roughly a minute, so the page has to stay fresh on its
    // own — staff should never need to hit refresh while holding up a phone.
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["whatsapp-connection"] });

  const reconnect = useMutation({
    mutationFn: async () => {
      const { data } = await API.post("/whatsapp/reconnect");
      return data;
    },
    onSuccess: () => {
      toast.success("Mencoba menyambung ulang...");
      invalidate();
    },
    onError: () => toast.error("Gagal menyambung ulang"),
  });

  const logout = useMutation({
    mutationFn: async () => {
      const { data } = await API.post("/whatsapp/logout");
      return data;
    },
    onSuccess: () => {
      toast.success("Sambungan diputus. QR baru akan muncul sebentar lagi.");
      invalidate();
    },
    onError: () => toast.error("Gagal memutus sambungan"),
  });

  const status = data?.status ?? "initializing";
  const copy = STATUS_COPY[status] ?? STATUS_COPY.initializing;
  const busy = reconnect.isPending || logout.isPending;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="head-title">WhatsApp</h1>
            <p className="mt-1 text-sm text-dark/60">Hubungkan nomor WhatsApp yang dipakai mengirim notifikasi booking.</p>
          </div>

          <div className="flex gap-2">
            <Button className="flex items-center gap-2 btn-outline" onClick={() => reconnect.mutate()} disabled={busy}>
              <FaSyncAlt className={reconnect.isPending ? "animate-spin" : ""} />
              Sambung Ulang
            </Button>
            <Button
              className="flex items-center gap-2 btn-red"
              onClick={() => {
                if (window.confirm("Putuskan sambungan WhatsApp? Notifikasi berhenti sampai QR baru discan.")) {
                  logout.mutate();
                }
              }}
              disabled={busy}
            >
              <FaSignOutAlt />
              Putuskan
            </Button>
          </div>
        </div>

        {isError && <div className="p-4 text-sm text-red-700 border border-red-200 rounded bg-red-50">Tidak bisa membaca status WhatsApp. Pastikan Anda masih login.</div>}

        {isLoading ? (
          <div className="flex items-center justify-center p-16 bg-light rounded card-shadow">
            <div className="loader size-12 after:size-12"></div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Status */}
            <div className="p-6 space-y-4 bg-light rounded card-shadow">
              <div className={`flex items-center gap-3 px-4 py-3 border rounded ${TONE_CLASS[copy.tone]}`}>
                <span className="text-xl">{TONE_ICON[copy.tone]}</span>
                <div>
                  <p className="font-semibold">{copy.label}</p>
                  <p className="text-sm">{copy.detail}</p>
                </div>
              </div>

              <div>
                <InfoRow label="Nomor terhubung" value={data?.linkedNumber ? `+${data.linkedNumber}` : "-"} />
                <InfoRow label="Nama akun" value={data?.linkedName || "-"} />
                <InfoRow label="Terakhir aktif" value={formatDateTime(data?.lastReadyAt ?? null)} />
                <InfoRow label="Terakhir terputus" value={formatDateTime(data?.lastDisconnectedAt ?? null)} />
                {data?.lastDisconnectReason && <InfoRow label="Penyebab" value={<span className="text-red-700">{data.lastDisconnectReason}</span>} />}
                {data && data.retries > 0 && <InfoRow label="Percobaan sambung ulang" value={`${data.retries} dari ${data.maxRetries}`} />}
              </div>

              <p className="text-xs text-dark/50">Status diperbarui otomatis setiap 5 detik.</p>
            </div>

            {/* QR / guidance */}
            <div className="p-6 bg-light rounded card-shadow">
              {status === "qr_required" && data?.qrImage ? (
                <div className="space-y-4 text-center">
                  <h2 className="heading">Scan QR Ini</h2>
                  <img src={data.qrImage} alt="QR code WhatsApp" className="mx-auto border rounded border-dark/10" width={280} height={280} />
                  <ol className="space-y-1 text-sm text-left text-dark/80 list-decimal list-inside">
                    <li>Buka WhatsApp di HP yang akan dipakai.</li>
                    <li>
                      Ketuk <b>Titik tiga</b> (Android) atau <b>Pengaturan</b> (iPhone).
                    </li>
                    <li>
                      Pilih <b>Perangkat Tertaut</b> → <b>Tautkan Perangkat</b>.
                    </li>
                    <li>Arahkan kamera ke QR di atas.</li>
                  </ol>
                  <p className="text-xs text-dark/50">QR berganti otomatis setiap ±1 menit. Kalau gagal, tunggu QR berikutnya muncul.</p>
                </div>
              ) : status === "connected" ? (
                <div className="flex flex-col items-center justify-center h-full py-10 space-y-3 text-center">
                  <FaCheckCircle className="text-4xl text-green-600" />
                  <h2 className="heading">Sudah Terhubung</h2>
                  <p className="max-w-sm text-sm text-dark/60">
                    Nomor ini yang akan mengirim notifikasi ke customer dan owner. Tidak perlu scan ulang selama tidak diputus dari HP.
                  </p>
                </div>
              ) : status === "service_down" ? (
                <div className="flex flex-col items-center justify-center h-full py-10 space-y-3 text-center">
                  <FaTimesCircle className="text-4xl text-red-600" />
                  <h2 className="heading">Layanan Belum Jalan</h2>
                  <p className="max-w-sm text-sm text-dark/60">
                    Service WhatsApp dan antrean pesan (RabbitMQ) harus berjalan di server sebelum nomor bisa dihubungkan. Hubungi tim teknis.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-10 space-y-3 text-center">
                  <div className="loader size-10 after:size-10"></div>
                  <h2 className="heading">Menyiapkan Sambungan</h2>
                  <p className="max-w-sm text-sm text-dark/60">Tunggu sebentar. Kalau QR tidak muncul dalam 1 menit, tekan &quot;Sambung Ulang&quot;.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
