import type { Trip } from "@/types/trip";
import { formatTripDates, getTripDays } from "@/lib/dates";
import Link from "next/link";

type TripCardProps = {
  trip: Trip;
};

export function TripCard({ trip }: TripCardProps) {
  const formattedDates = formatTripDates(trip.startDate, trip.endDate);
  const daysCount = getTripDays(trip.startDate, trip.endDate);
  const statusLabel =
    trip.status.charAt(0).toUpperCase() + trip.status.slice(1);

  return (
    <Link href={`/trips/${trip.id}`}>
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex justify-between">
          <span className="text-sm text-slate-500">{trip.destination}</span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {statusLabel}
          </span>
        </div>

        <h2 className="mb-2 text-2xl font-semibold text-slate-900">
          {trip.title}
        </h2>

        <p className="text-sm text-slate-500">{formattedDates}</p>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600">{daysCount} days</p>
        </div>
      </article>
    </Link>
  );
}
