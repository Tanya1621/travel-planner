"use client";

import { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useActivities } from "@/context/ActivitiesContext";
import type { TimeBlock } from "@/types/activity";
import { ActivitiesPanel } from "./ActivitiesPanel";
import { DayPlanner } from "./DayPlanner";

type Props = {
  tripId: string;
  startDate: string;
  endDate: string;
};

const TIME_BLOCKS: TimeBlock[] = ["morning", "afternoon", "evening"];

export function TripPlanningBoard({ tripId, startDate, endDate }: Props) {
  const { activities, updateActivity } = useActivities();
  const [selectedDate, setSelectedDate] = useState(startDate);

  function handleDrop(activityId: string, targetId: string) {
    const activity = activities.find(
      (item) => item.id === activityId && item.tripId === tripId,
    );

    if (!activity) return;

    if (targetId === "unscheduled") {
      updateActivity(activityId, {
        date: null,
        timeBlock: null,
      });
      return;
    }

    if (!targetId.startsWith("slot:")) return;

    const timeBlock = targetId.slice(5);

    if (!TIME_BLOCKS.includes(timeBlock as TimeBlock)) {
      return;
    }

    const block = timeBlock as TimeBlock;

    const targetActivities = activities.filter(
      (item) =>
        item.tripId === tripId &&
        item.date === selectedDate &&
        item.timeBlock === block &&
        item.id !== activityId,
    );

    const nextPosition =
      targetActivities.length === 0
        ? 0
        : Math.max(...targetActivities.map((item) => item.position)) + 1;

    updateActivity(activityId, {
      date: selectedDate,
      timeBlock: block,
      position: nextPosition,
    });
  }

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const sourceId = String(event.operation.source?.id ?? "");
        const targetId = String(event.operation.target?.id ?? "");

        if (!sourceId.startsWith("activity:")) {
          return;
        }

        if (!targetId) return;

        const activityId = sourceId.slice(9);

        handleDrop(activityId, targetId);
      }}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <ActivitiesPanel
          tripId={tripId}
          startDate={startDate}
          endDate={endDate}
        />

        <DayPlanner
          tripId={tripId}
          startDate={startDate}
          endDate={endDate}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
    </DragDropProvider>
  );
}
