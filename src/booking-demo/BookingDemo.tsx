import { FormEvent, useState } from "react";
import { AVAILABLE_TIMES } from "./bookingRules";
import type { BookingRequest } from "./bookingTypes";
import { useBooking } from "./useBooking";

const initialBooking: BookingRequest = {
  name: "",
  email: "",
  date: "",
  time: AVAILABLE_TIMES[0],
  topic: "",
};

const BookingDemo = () => {
  const [booking, setBooking] = useState(initialBooking);
  const { confirmation, error, isSubmitting, resetBooking, submitBooking } = useBooking();

  const updateField = (field: keyof BookingRequest, value: string) => {
    setBooking((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitBooking(booking);
  };

  if (confirmation) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <section className="rounded-2xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-green-600">Booking confirmed</p>
          <h1 className="mt-2 text-3xl font-bold">You are all set, {confirmation.name}.</h1>
          <p className="mt-4 text-gray-600">
            Your call is booked for {confirmation.date} at {confirmation.time}.
          </p>
          <p className="mt-2 text-sm text-gray-500">Reference: {confirmation.id}</p>
          <button
            className="mt-6 rounded-lg bg-black px-4 py-2 text-white"
            onClick={() => {
              resetBooking();
              setBooking(initialBooking);
            }}
          >
            Book another call
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">Demo feature</p>
        <h1 className="mt-2 text-4xl font-bold">Book a strategy call</h1>
        <p className="mt-3 text-gray-600">Choose a date and tell us what you want to discuss.</p>
      </div>

      <form className="space-y-5 rounded-2xl border bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input className="mt-1 w-full rounded-lg border p-3" value={booking.name} onChange={(e) => updateField("name", e.target.value)} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input className="mt-1 w-full rounded-lg border p-3" type="email" value={booking.email} onChange={(e) => updateField("email", e.target.value)} />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Date</span>
            <input className="mt-1 w-full rounded-lg border p-3" type="date" value={booking.date} onChange={(e) => updateField("date", e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Time</span>
            <select className="mt-1 w-full rounded-lg border p-3" value={booking.time} onChange={(e) => updateField("time", e.target.value)}>
              {AVAILABLE_TIMES.map((time) => <option key={time} value={time}>{time}</option>)}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Discussion topic</span>
          <textarea className="mt-1 min-h-28 w-full rounded-lg border p-3" value={booking.topic} onChange={(e) => updateField("topic", e.target.value)} />
        </label>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <button className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white disabled:opacity-60" disabled={isSubmitting}>
          {isSubmitting ? "Confirming..." : "Confirm booking"}
        </button>
      </form>
    </main>
  );
};

export default BookingDemo;

