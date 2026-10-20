export type BookingStatus = "confirmed" | "pending";

export interface BookingRequest {
  name: string;
  email: string;
  date: string;
  time: string;
  topic: string;
}

export interface BookingConfirmation extends BookingRequest {
  id: string;
  status: BookingStatus;
  createdAt: string;
}

