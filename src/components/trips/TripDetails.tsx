"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTrips } from "@/context/TripsContext";
import { formatTripDates, getTripDays } from "@/lib/dates";
import { TripPlanningBoard } from "@/components/planner/TripPlanningBoard";

export function TripDetails() {
  const { tripId } = useParams<{ tripId: string }>();
  const { getTripById, isLoaded } = useTrips();

  if (!isLoaded) {
    return <p className="p-8">Loading trip...</p>;
  }

  const trip = getTripById(tripId);

  if (!trip) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Trip not found</h1>
        <Link href="/" className="text-blue-600">
          Back to My Trips
        </Link>
      </main>
    );
  }

  const daysCount = getTripDays(trip.startDate, trip.endDate);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to My Trips
        </Link>

        <header className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">{trip.title}</h1>

          <p className="mt-2 text-slate-500">
            {trip.destination} · {formatTripDates(trip.startDate, trip.endDate)}
          </p>

          <p className="mt-1 text-sm text-slate-400">{daysCount} days</p>
        </header>

        <TripPlanningBoard
          tripId={trip.id}
          startDate={trip.startDate}
          endDate={trip.endDate}
        />
      </div>
    </main>
  );
}
