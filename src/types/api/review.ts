import { Activity } from "./activity";
import { Booking } from "./booking";
import { Villa } from "./villa";

export interface Review {
  id: string;
  rating: number;
  message: string;
  activityBookingId: string;
  villaBookingId: string;
  activityId: string;
  villaId: string;
  activityBooking: Booking;
  villaBooking: Booking;
  activity: Activity;
  villa: Villa;
  createdAt: string;
  updatedAt: string;
}
