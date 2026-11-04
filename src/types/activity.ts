export type TimeBlock = "morning" | "afternoon" | "evening";

export type Activity = {
  id: string;
  tripId: string;
  title: string;
  description?: string;
  location?: string;
  url?: string;
  date: string | null;
  timeBlock: TimeBlock | null;
  startTime?: string;
  endTime?: string;
  position: number;
};
