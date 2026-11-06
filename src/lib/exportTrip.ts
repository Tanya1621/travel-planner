
import type { Trip } from "@/types/trip";
import type { Activity } from "@/types/activity";


type TripExport = {
  version: 1;
  exportedAt: string;
  trip: Trip;
  activities: Activity[];
};

export function exportTrip(
  trip: Trip,
  activities: Activity[],
) {
  const tripActivities = activities.filter(
    (activity) => activity.tripId === trip.id,
  );

  const data: TripExport = {
    version: 1,
    exportedAt: new Date().toISOString(),
    trip,
    activities: tripActivities,
  };

  const json = JSON.stringify(data, null, 2);

  const blob = new Blob([json], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${trip.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "trip"}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
