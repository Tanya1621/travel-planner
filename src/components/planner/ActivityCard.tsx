"use client";

import type { ReactNode } from "react";
import type { Activity } from "@/types/activity";
import { ActivityActions } from "./ActivityActions";
import { DraggableActivity } from "./DraggableActivity";

type ActivityCardProps = {
  activity: Activity;
  children?: ReactNode;
};

export function ActivityCard({
  activity,
  children,
}: ActivityCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
      <DraggableActivity id={activity.id}>
        <article className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 wrap-break-word text-sm font-medium text-foreground">
              {activity.title}
            </h3>

            <ActivityActions activityId={activity.id} />
          </div>

          {activity.description && (
            <p className="mt-2 text-sm text-muted">
              {activity.description}
            </p>
          )}

          {activity.url && (
            <a
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              Open link
            </a>
          )}

          {children && (
            <div className="mt-3">{children}</div>
          )}
        </article>
      </DraggableActivity>
    </div>
  );
}
