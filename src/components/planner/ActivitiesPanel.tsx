"use client";

import { useState } from "react";
import { useActivities } from "@/context/ActivitiesContext";
import { AddActivityForm } from "./AddActivityForm";
import { generateTripDays } from "@/lib/dates";
import type { TimeBlock } from "@/types/activity";
import { DropZone } from "./DropZone";
import { ActivityCard } from "./ActivityCard"

type ActivitiesPanelProps = {
    tripId: string;
    startDate: string;
    endDate: string;
};

export function ActivitiesPanel({
    tripId,
    startDate,
    endDate,
}: ActivitiesPanelProps) {
    const { activities, isLoaded, updateActivity } = useActivities();
    const [isAdding, setIsAdding] = useState(false);
    const [schedulingId, setSchedulingId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(startDate);
    const [selectedBlock, setSelectedBlock] = useState<TimeBlock>("morning");

    const days = generateTripDays(startDate, endDate);

    function handleSchedule(activityId: string) {
        if (selectedDate < startDate || selectedDate > endDate) {
            return;
        }

        updateActivity(activityId, {
            date: selectedDate,
            timeBlock: selectedBlock,
        });

        setSchedulingId(null);
    }

    const tripActivities = activities
        .filter((activity) => activity.tripId === tripId && activity.date === null)
        .sort((a, b) => a.position - b.position);

    return (
        <aside className="rounded-2xl border border-border bg-surface p-5">
            <DropZone id="unscheduled">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Activities</h2>
                        <p className="mt-1 text-sm text-muted">
                            Your unscheduled ideas
                        </p>
                    </div>

                    {!isAdding && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                        >
                            + Add
                        </button>
                    )}
                </div>

                {isAdding && (
                    <div className="mb-5">
                        <AddActivityForm
                            tripId={tripId}
                            onCancel={() => setIsAdding(false)}
                        />
                    </div>
                )}

                {!isLoaded ? (
                    <p className="text-sm text-muted">Loading activities...</p>
                ) : tripActivities.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-muted">
                        No activities yet. Add your first idea!
                    </p>
                ) : (
                    <div className="space-y-3">
                        {tripActivities.map((activity) => (
                            <ActivityCard key={activity.id} activity={activity}>

                                {schedulingId === activity.id ? (
                                    <div className="mt-4 space-y-3 border-t border-border pt-4">
                                        <div>
                                            <label className="mb-1 block text-xs text-muted">
                                                Select day
                                            </label>

                                            <select
                                                value={selectedDate}
                                                onChange={(event) =>
                                                    setSelectedDate(event.target.value)
                                                }
                                                className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                                            >
                                                {days.map((day) => (
                                                    <option key={day.date} value={day.date}>
                                                        Day {day.dayNumber} — {day.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs text-muted">
                                                Time of day
                                            </label>

                                            <select
                                                value={selectedBlock}
                                                onChange={(event) =>
                                                    setSelectedBlock(event.target.value as TimeBlock)
                                                }
                                                className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                                            >
                                                <option value="morning">Morning</option>
                                                <option value="afternoon">Afternoon</option>
                                                <option value="evening">Evening</option>
                                            </select>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleSchedule(activity.id)}
                                                className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                                            >
                                                Save
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setSchedulingId(null)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-foreground-secondary"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedDate(startDate);
                                            setSelectedBlock("morning");
                                            setSchedulingId(activity.id);
                                        }}
                                        className="mt-3 text-sm font-medium text-primary hover:underline"
                                    >
                                        + Schedule
                                    </button>
                                )}

                            </ActivityCard>
                        ))}
                    </div>
                )}
            </DropZone>
        </aside>
    );
}
