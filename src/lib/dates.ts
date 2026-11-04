export function getTripDays(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  return Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
}

export function formatTripDates(startDate: string, endDate: string): string {
  const format = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return `${format.format(new Date(`${startDate}T00:00:00Z`))} – ${format.format(
    new Date(`${endDate}T00:00:00Z`),
  )}`;
}

export type TripDay = {
  date: string;
  dayNumber: number;
  label: string;
};

export function generateTripDays(
  startDate: string,
  endDate: string,
): TripDay[] {
  const days: TripDay[] = [];

  const current = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  let dayNumber = 1;

  while (current <= end) {
    days.push({
      date: current.toISOString().split("T")[0],
      dayNumber,
      label: new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }).format(current),
    });

    current.setUTCDate(current.getUTCDate() + 1);
    dayNumber++;
  }

  return days;
}
