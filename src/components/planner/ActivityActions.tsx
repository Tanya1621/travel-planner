
"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useActivities } from "@/context/ActivitiesContext";

type ActivityActionsProps = {
  activityId: string;
};

export function ActivityActions({
  activityId,
}: ActivityActionsProps) {
  const { deleteActivity } = useActivities();

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Edit activity"
        title="Edit activity"
        className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-secondary hover:text-foreground-secondary"
        onClick={() => {
          // Edit function 
        }}
      >
        <Pencil size={15} />
      </button>

      <button
        type="button"
        aria-label="Delete activity"
        title="Delete activity"
        className="rounded-md p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
        onClick={() => deleteActivity(activityId)}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
