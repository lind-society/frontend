import { Activity } from "./activity";
import { Currency } from "./currency";
import { Review } from "./review";
import { Villa } from "./villa";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  paymentMethod: string;
  paymentChannel: string;
  amount: string;
  status: string;
}

export interface Booking {
  id: string;
  /** Which vocabulary `status` uses — villa transitions differ from activity ones. */
  type: "villa" | "activity";
  totalGuest: number;
  totalAmount: number;
  // Villa bookings carry check-in/out; activity bookings carry bookingDate.
  // The API sends whichever doesn't apply as null rather than omitting it.
  checkInDate: string | null;
  checkOutDate: string | null;
  bookingDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  currency: Currency;
  // Never both populated: villa bookings get `villa`, activity bookings get
  // `activity`, and the other relation comes back null — not a flat *Id field
  // either way (the API never sends currencyId/customerId/activityId/villaId).
  villa: Villa | null;
  activity: Activity | null;
  review: Review | null;
  payments: Payment[];
}
