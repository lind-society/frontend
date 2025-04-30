interface StatusBadgeProps {
  status: string;
  colors?: Record<string, string>;
}

const STATUS_COLORS: Record<string, string> = {
  Requested: "bg-blue-300 text-blue-700",
  Negotiation: "bg-orange-300 text-orange-700",
  "Waiting for Payment": "bg-yellow-300 text-yellow-700",
  Booked: "bg-purple-300 text-purple-700",
  Done: "bg-green-300 text-green-700",
  Canceled: "bg-red-300 text-red-700",
};

export const StatusBadge = ({ status, colors = STATUS_COLORS }: StatusBadgeProps) => {
  const colorClass = colors[status] || "bg-gray-300 text-gray-700";

  return <span className={`px-4 py-2 text-sm rounded-full ${colorClass}`}>{status}</span>;
};
