import type { BookingConfirmation, BookingRequest } from "./bookingTypes";
import { validateBooking } from "./bookingRules";

export const createBooking = async (
  booking: BookingRequest,
): Promise<BookingConfirmation> => {
  const errors = validateBooking(booking);

  if (errors.length > 0) {
    throw new Error(errors[0]);
  }

  await new Promise((resolve) => setTimeout(resolve, 650));

  return {
    ...booking,
    id: `booking-${Date.now()}`,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
};

