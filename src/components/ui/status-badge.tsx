interface StatusBadgeProps {
  status: string;
  colors?: Record<string, string>;
}

/**
 * Keyed by the raw status the API returns, not by its display label.
 *
 * These used to be keyed on labels ("Waiting for Payment", "Done") while
 * `booking.status` carries the enum (`waiting_for_payment`, `done`), so every
 * lookup missed: each badge fell back to grey and printed the raw enum at the
 * admin. Both villa and activity vocabularies live here because the two booking
 * types share this component.
 */
const STATUS_COLORS: Record<string, string> = {
  // Villa bookings
  requested: "bg-blue-300 text-blue-700",
  negotiation: "bg-orange-300 text-orange-700",
  waiting_for_payment: "bg-yellow-300 text-yellow-700",
  booked: "bg-purple-300 text-purple-700",
  checked_in: "bg-teal-300 text-teal-700",
  done: "bg-green-300 text-green-700",
  // Activity bookings
  pending: "bg-yellow-300 text-yellow-700",
  confirmed: "bg-purple-300 text-purple-700",
  completed: "bg-green-300 text-green-700",
  // Shared
  canceled: "bg-red-300 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  requested: "Requested",
  negotiation: "Negotiation",
  waiting_for_payment: "Waiting for Payment",
  booked: "Booked",
  checked_in: "Checked In",
  done: "Done",
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  canceled: "Canceled",
};

/** `waiting_for_payment` -> `Waiting For Payment`, for anything unmapped. */
const humanise = (status: string) =>
  status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const StatusBadge = ({ status, colors = STATUS_COLORS }: StatusBadgeProps) => {
  const colorClass = colors[status] || "bg-gray-300 text-gray-700";
  const label = STATUS_LABELS[status] || humanise(status || "");

  return <span className={`px-4 py-2 text-sm rounded-full ${colorClass}`}>{label}</span>;
};
