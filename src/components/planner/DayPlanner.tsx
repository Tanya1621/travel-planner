"use client";

import { generateTripDays } from "@/lib/dates";
import { useActivities } from "@/context/ActivitiesContext";
import { DropZone } from "./DropZone";
import { ActivityCard } from "./ActivityCard";

type DayPlannerProps = {
    tripId: string;
    startDate: string;
    endDate: string;
    selectedDate: string;
    onDateChange: (date: string) => void;
};

const timeBlocks = [
    { id: "morning", label: "Morning", time: "08:00 – 12:00" },
    { id: "afternoon", label: "Afternoon", time: "12:00 – 17:00" },
    { id: "evening", label: "Evening", time: "17:00 – 22:00" },
];

export function DayPlanner({
    tripId,
    startDate,
    endDate,
    selectedDate,
    onDateChange,
}: DayPlannerProps) {
    const { activities, updateActivity } = useActivities();
    const days = generateTripDays(startDate, endDate);

    const selectedDay = days.find((day) => day.date === selectedDate);

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Your itinerary
            </h2>

            <div className="mb-8 flex gap-3 overflow-x-auto pb-3">
                {days.map((day) => (
                    <button
                        key={day.date}
                        onClick={() => onDateChange(day.date)}
                        className={`min-w-24 rounded-xl border p-3 text-center transition-colors ${selectedDate === day.date
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                    >
                        <span className="block text-xs opacity-70">
                            Day {day.dayNumber}
                        </span>
                        <span className="mt-1 block font-medium">{day.label}</span>
                    </button>
                ))}
            </div>

            {selectedDay && (
                <div>
                    <h3 className="mb-5 text-xl font-semibold text-slate-900">
                        Day {selectedDay.dayNumber} · {selectedDay.label}
                    </h3>

                    <div className="space-y-4">
                        {timeBlocks.map((block) => (
                            <div
                                key={block.id}
                                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <h4 className="font-semibold text-slate-900">
                                        {block.label}
                                    </h4>
                                    <span className="text-sm text-slate-400">{block.time}</span>
                                </div>

                                <DropZone id={`slot:${block.id}`}>
                                    <div className="space-y-2">
                                        {activities
                                            .filter(
                                                (activity) =>
                                                    activity.tripId === tripId &&
                                                    activity.date === selectedDate &&
                                                    activity.timeBlock === block.id,
                                            )
                                            .sort((a, b) => a.position - b.position)
                                            .map((activity) => (
                                                <ActivityCard key={activity.id} activity={activity}>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateActivity(activity.id, {
                                                                date: null,
                                                                timeBlock: null,
                                                            })
                                                        }
                                                        className="mt-3 text-sm text-slate-500 hover:text-slate-900"
                                                    >
                                                        Unschedule
                                                    </button>
                                                </ActivityCard>
                                            ))}

                                        {!activities.some(
                                            (activity) =>
                                                activity.tripId === tripId &&
                                                activity.date === selectedDate &&
                                                activity.timeBlock === block.id,
                                        ) && (
                                                <p className="text-sm text-slate-400">
                                                    No activities yet
                                                </p>
                                            )}
                                    </div>
                                </DropZone>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
