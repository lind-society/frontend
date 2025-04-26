import { Booking } from "./booking";
import { Villa } from "./villa";

export interface Review {
  id: string;
  rating: string;
  message: string;
  bookingId: string;
  villaId: string;
  villa: Villa;
  booking: Booking;
  createdAt: string;
  updatedAt: string;
}
