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

export interface Booking {
  id: string;
  totalGuest: number;
  totalAmount: number;
  checkInDate: string;
  checkOutDate: string;
  bookingDate: string;
  status: string;
  currencyId: string;
  customerId: string;
  activityId: string;
  villaId: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  currency: Currency;
  villa: Villa;
  activity: Activity;
  review: Review;
}
