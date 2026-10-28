import { Currency } from "./currency";

export type BookingPaymentStatus =
  | "requires_action"
  | "active"
  | "pending"
  | "paid"
  | "expired"
  | "authorized"
  | "waiting_for_refund"
  | "refunded"
  | "cancelled"
  | "failed";

export type BookingPaymentRefundStatus = "succeeded" | "failed" | "pending" | "cancelled";

export type PaymentChannelType =
  | "card"
  | "debit_card"
  | "credit_card"
  | "e_wallet"
  | "qr_code"
  | "qris"
  | "direct_debit"
  | "virtual_account"
  | "over_the_counter";

// payment channels
export interface PaymentChannel {
  id: string;
  name: string;
  code: string;
  type: PaymentChannelType | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentChannelPayload {
  name?: string;
  code: string;
  type?: PaymentChannelType;
  description?: string;
}

// booking payments
export interface BookingPayment {
  id: string;
  bookingId: string;
  paymentMethod: string | null;
  paymentChannel: string | null;
  amount: number | null;
  status: BookingPaymentStatus | null;
  paidAt: string | null;
  refundedAt: string | null;
  cancelledAt: string | null;
  failureReason: string | null;
  refundedAmount: number | null;
  refundedReason: string | null;
  cancelledReason: string | null;
  paymentReferenceId: string | null;
  paymentRequestReferenceId: string | null;
  paymentSessionReferenceId: string | null;
  paymentTokenReferenceId: string | null;
  paymentRefundReferenceId: string | null;
  currencyId: string;
  currency?: Currency;
  createdAt: string;
  updatedAt: string;
}

// booking payment refunds
export interface BookingPaymentRefund {
  id: string;
  amount: number | null;
  refundedReason: string;
  status: BookingPaymentRefundStatus;
  failureReason: string | null;
  currencyId: string;
  bookingPaymentId: string;
  paymentRefundRequestReferenceId: string;
  currency?: Currency;
  createdAt: string;
  updatedAt: string;
}

export interface BookingPaymentRefundPayload {
  reason: string;
  amount: number;
  status?: BookingPaymentRefundStatus;
  failureReason?: string;
  currencyId: string;
  bookingPaymentId: string;
}

// booking customers
export interface BookingCustomer {
  id: string;
  name: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingCustomerPayload {
  name: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
}

// currency converters
export interface CurrencyConverter {
  id: string;
  baseCurrencyId: string;
  targetCurrencyId: string;
  exchangeRate: number;
  description: string | null;
  baseCurrency?: Currency;
  targetCurrency?: Currency;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyConverterPayload {
  baseCurrencyId: string;
  targetCurrencyId: string;
  exchangeRate?: number;
  description?: string;
}
