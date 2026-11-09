"use client";

import { useDraggable } from "@dnd-kit/react";
import type { ReactNode } from "react";
import { GripVertical } from "lucide-react";


type DraggableActivityProps = {
  id: string;
  children: ReactNode;
};

export function DraggableActivity({ id, children }: DraggableActivityProps) {
  const { ref, handleRef, isDragging } = useDraggable({
    id: `activity:${id}`,
  });

  return (
    <div
      ref={ref}
      className={isDragging ? "opacity-40" : ""}
    >
      <div className="flex items-start gap-2">
        <button
          ref={handleRef}
          type="button"
          aria-label="Drag activity"
          className="mt-0.5 shrink-0 cursor-grab rounded p-1 text-muted hover:bg-surface-secondary active:cursor-grabbing"
        >
          <GripVertical size={18} />
        </button>

        <div className="min-w-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
