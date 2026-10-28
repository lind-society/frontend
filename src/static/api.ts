export const baseCurrency = "b5baec27-5155-4c91-95ac-2184a4cc8d24";

/**
 * Villa policy types, identified by name rather than by id.
 *
 * These used to be hardcoded UUIDs copied from another database. Against this
 * one they matched nothing, so `POST /villa-policies` failed the `type_id`
 * foreign key with "type not found" — meaning a villa could never be created
 * from the dashboard. Names are stable across environments; ids are not, so
 * they are resolved at runtime through `useVillaPolicyTypes`.
 */
export const POLICY_TYPE_NAMES = {
  houseRules: "House Rules",
  paymentTerms: "Payment Terms",
  cancellationTerms: "Cancellation Terms",
} as const;

/**
 * Booking statuses as value/label pairs.
 *
 * This used to be a list of display labels used as the `<option value>` too, so
 * the dropdown submitted "Waiting for Payment" where the API expects
 * `waiting_for_payment` — every status change was rejected with a 400. It also
 * never matched the current status coming back from the API, so the select
 * always displayed "Requested" no matter what the booking really was.
 *
 * `checked_in` was missing entirely, which made a booking impossible to
 * complete: `done` is only reachable from `checked_in`.
 */
export const villaBookingStatuses: { value: string; label: string }[] = [
  { value: "requested", label: "Requested" },
  { value: "negotiation", label: "Negotiation" },
  { value: "waiting_for_payment", label: "Waiting for Payment" },
  { value: "booked", label: "Booked" },
  { value: "checked_in", label: "Checked In" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
];

/** Activity bookings use a different vocabulary from villa bookings. */
export const activityBookingStatuses: { value: string; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "canceled", label: "Canceled" },
];

/**
 * What the green approve tick should move a booking to, given where it is now.
 *
 * The lists used to send a flat `status: "done"` for every booking of either
 * type, which the API rejected outright: `done` is not an activity status at
 * all, and for a villa it is only reachable from `checked_in`. Mirrors the
 * transition map the backend enforces.
 *
 * Returns null when there is nothing sensible to approve — the caller should
 * refuse rather than send a transition that will come back 400. `booked` is
 * deliberately absent: that is the payment gateway's to award, not an admin's.
 */
export const nextApprovedStatus = (bookingType: string, currentStatus: string): string | null => {
  if (bookingType === "activity") {
    return currentStatus === "pending" ? "confirmed" : currentStatus === "confirmed" ? "completed" : null;
  }

  switch (currentStatus) {
    case "requested":
    case "negotiation":
      return "waiting_for_payment";
    case "booked":
      return "checked_in";
    case "checked_in":
      return "done";
    default:
      return null;
  }
};
