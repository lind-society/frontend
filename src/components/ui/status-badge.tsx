interface StatusBadgeProps {
  status: string;
  colors?: Record<string, string>;
}

const STATUS_COLORS: Record<string, string> = {
  requested: "bg-blue-300 text-blue-700",
  negotiation: "bg-orange-300 text-orange-700",
  "waiting for payment": "bg-yellow-300 text-yellow-700",
  booked: "bg-purple-300 text-purple-700",
  done: "bg-green-300 text-green-700",
  canceled: "bg-red-300 text-red-700",
};

export const StatusBadge = ({ status, colors = STATUS_COLORS }: StatusBadgeProps) => {
  const colorClass = colors[status.toLowerCase()] || "bg-gray-300 text-gray-700";

  return <span className={`px-4 py-2 text-sm rounded-full ${colorClass}`}>{status}</span>;
};
