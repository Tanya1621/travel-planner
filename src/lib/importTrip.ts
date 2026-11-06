
import type { Trip } from "@/types/trip";

function getUniqueTripTitle(
  title: string,
  existingTrips: Trip[],
): string {
  const existingTitles = new Set(
    existingTrips.map((trip) => trip.title.trim().toLowerCase()),
  );

  if (!existingTitles.has(title.trim().toLowerCase())) {
    return title;
  }

  let index = 1;
  let newTitle = `${title} (${index})`;

  while (existingTitles.has(newTitle.toLowerCase())) {
    index++;
    newTitle = `${title} (${index})`;
  }

  return newTitle;
}

import type { Activity, TimeBlock } from "@/types/activity";

type ImportedTripData = {
  trip: Trip;
  activities: Activity[];
};

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

const timeBlocks: TimeBlock[] = [
  "morning",
  "afternoon",
  "evening",
];

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string") return false;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

export function parseTripImport(
  json: string,
  existingTrips: Trip[],
): ImportedTripData {
  const data: unknown = JSON.parse(json);

  if (
    !isRecord(data) ||
    data.version !== 1 ||
    !isRecord(data.trip) ||
    !Array.isArray(data.activities)
  ) {
    throw new Error("Invalid or unsupported trip file.");
  }

  const trip = data.trip;

  if (
    typeof trip.id !== "string" ||
    typeof trip.title !== "string" ||
    !trip.title.trim() ||
    typeof trip.destination !== "string" ||
    !isValidDate(trip.startDate) ||
    !isValidDate(trip.endDate) ||
    trip.endDate < trip.startDate ||
    !["planning", "upcoming", "completed"].includes(
      String(trip.status),
    )
  ) {
    throw new Error("Invalid trip information.");
  }

  const activities: Activity[] = data.activities.map(
    (item: unknown) => {
      if (
        !isRecord(item) ||
        typeof item.id !== "string" ||
        item.tripId !== trip.id ||
        typeof item.title !== "string" ||
        !item.title.trim() ||
        !Number.isSafeInteger(item.position) ||
        (item.date !== null &&
          !isValidDate(item.date)) ||
        (item.timeBlock !== null &&
          !timeBlocks.includes(
            item.timeBlock as TimeBlock,
          ))
      ) {
        throw new Error("Invalid activity information.");
      }

      if (
        item.date !== null &&
        (item.date < trip.startDate ||
          item.date > trip.endDate)
      ) {
        throw new Error(
          "An activity is outside the trip dates.",
        );
      }

      if (
        item.date === null &&
        item.timeBlock !== null
      ) {
        throw new Error("Invalid activity schedule.");
      }

      for (const field of [
        "description",
        "location",
        "url",
        "startTime",
        "endTime",
      ]) {
        if (
          item[field] !== undefined &&
          typeof item[field] !== "string"
        ) {
          throw new Error(`Invalid activity ${field}.`);
        }
      }

      return {
        id: crypto.randomUUID(),
        tripId: "", // will be added when the trip is created
        title: item.title,
        description: item.description as string | undefined,
        location: item.location as string | undefined,
        url: item.url as string | undefined,
        date: item.date as string | null,
        timeBlock: item.timeBlock as TimeBlock | null,
        startTime: item.startTime as string | undefined,
        endTime: item.endTime as string | undefined,
        position: item.position as number,
      };
    },
  );

  const newTripId = crypto.randomUUID();

  const importedTrip: Trip = {
    id: newTripId,
    title: getUniqueTripTitle(
      trip.title.trim(),
      existingTrips,
    ),
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    status: trip.status as Trip["status"],
  };

  return {
    trip: importedTrip,
    activities: activities.map((activity) => ({
      ...activity,
      tripId: newTripId,
    })),
  };
}


const MAX_FILE_SIZE = 2 * 1024 * 1024;

export async function importTripFromFile(
  file: File,
  existingTrips: Trip[],
) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("The file is too large (max 2 MB).");
  }

  const json = await file.text();

  return parseTripImport(json, existingTrips);
}
