"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

import type { Trip } from "@/types/trip";
import { useTrips } from "@/context/TripsContext";
import { useActivities } from "@/context/ActivitiesContext";
import { formatTripDates, getTripDays } from "@/lib/dates";


type TripCardProps = {
  trip: Trip;
};

export function TripCard({ trip }: TripCardProps) {

  const { deleteTrip } = useTrips();
  const { deleteActivitiesByTripId } = useActivities();

  const formattedDates = formatTripDates(trip.startDate, trip.endDate);
  const daysCount = getTripDays(trip.startDate, trip.endDate);
  const statusLabel =
    trip.status.charAt(0).toUpperCase() + trip.status.slice(1);

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${trip.title}" and all its activities?`
    );

    if (!confirmed) return;

    deleteActivitiesByTripId(trip.id);
    deleteTrip(trip.id);
  }

  return (
    <article className="relative rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/trips/${trip.id}`}
        className="block rounded-2xl p-6 pr-14"
      >
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
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        aria-label={`Delete ${trip.title}`}
        title="Delete trip"
        className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={18} />
      </button>
    </article>

  );
}
