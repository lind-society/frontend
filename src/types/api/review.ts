import { Activity } from "./activity";
import { Booking } from "./booking";
import { Villa } from "./villa";

export interface Review {
  id: string;
  rating: number;
  message: string;
  // The API returns a single shared `booking` relation (one review can be
  // tied to a villa booking or an activity booking, never both) plus
  // `activityId`/`villaId` — it never sends `activityBooking`/`villaBooking`
  // or their `*Id` counterparts, despite this type previously claiming it did.
  bookingId: string | null;
  activityId: string | null;
  villaId: string | null;
  booking: Booking | null;
  activity: Activity | null;
  villa: Villa | null;
  createdAt: string;
  updatedAt: string;
}
