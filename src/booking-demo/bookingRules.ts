import type { BookingRequest } from "./bookingTypes";

export const AVAILABLE_TIMES = ["09:00", "11:00", "14:00", "16:00"];

export const validateBooking = (booking: BookingRequest): string[] => {
  const errors: string[] = [];

  if (booking.name.trim().length < 2) errors.push("Enter your full name.");
  if (!booking.email.includes("@")) errors.push("Enter a valid email address.");
  if (!booking.topic.trim()) errors.push("Tell us what the call is about.");
  if (!AVAILABLE_TIMES.includes(booking.time)) errors.push("Choose an available time.");

  const selectedTime = new Date(`${booking.date}T${booking.time}:00`);
  if (Number.isNaN(selectedTime.getTime()) || selectedTime <= new Date()) {
    errors.push("Choose a future date and time.");
  }

  return errors;
};

