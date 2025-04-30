import { Activity } from "./activity";
import { Booking } from "./booking";
import { Villa } from "./villa";

export interface Review {
  id: string;
  rating: number;
  message: string;
  bookingId: string;
  villaId: string;
  villa: Villa;
  activity: Activity;
  villaBooking: Booking;
  activityBooking: Booking;
  createdAt: string;
  updatedAt: string;
}
