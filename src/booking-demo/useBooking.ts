import { useState } from "react";
import { createBooking } from "./bookingService";
import type { BookingConfirmation, BookingRequest } from "./bookingTypes";

export const useBooking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  const submitBooking = async (booking: BookingRequest) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createBooking(booking);
      setConfirmation(result);
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : "Booking failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBooking = () => {
    setConfirmation(null);
    setError(null);
  };

  return { confirmation, error, isSubmitting, resetBooking, submitBooking };
};

