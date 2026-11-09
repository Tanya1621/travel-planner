"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTrips } from "@/context/TripsContext";
import { formatTripDates, getTripDays } from "@/lib/dates";
import { TripPlanningBoard } from "@/components/planner/TripPlanningBoard";
import { Download } from "lucide-react";
import { useActivities } from "@/context/ActivitiesContext";
import { exportTrip } from "@/lib/exportTrip";

export function TripDetails() {
  const { tripId } = useParams<{ tripId: string }>();
  const { getTripById, isLoaded } = useTrips();
  const { activities } = useActivities();

  if (!isLoaded) {
    return <p className="p-8">Loading trip...</p>;
  }

  const trip = getTripById(tripId);

  if (!trip) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Trip not found</h1>
        <Link href="/" className="text-primary">
          Back to My Trips
        </Link>
      </main>
    );
  }

  const daysCount = getTripDays(trip.startDate, trip.endDate);

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-muted hover:text-foreground"
        >
          ← Back to My Trips
        </Link>

        <header className="mb-10">
          <h1 className="text-4xl font-bold text-foreground">{trip.title}</h1>
          <button
            type="button"
            onClick={() => exportTrip(trip, activities)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-surface px-4 py-2 text-sm font-medium text-foreground-secondary hover:bg-background"
          >
            <Download size={16} />
            Export JSON
          </button>

          <p className="mt-2 text-muted">
            {trip.destination} · {formatTripDates(trip.startDate, trip.endDate)}
          </p>

          <p className="mt-1 text-sm text-muted">{daysCount} days</p>
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
