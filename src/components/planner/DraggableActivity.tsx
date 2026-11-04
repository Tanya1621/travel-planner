"use client";

import { useDraggable } from "@dnd-kit/react";
import type { ReactNode } from "react";

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
      className={`relative rounded-xl ${isDragging ? "opacity-40" : ""}`}
    >
      <button
        ref={handleRef}
        type="button"
        aria-label="Drag activity"
        className="absolute top-3 right-3 z-10 cursor-grab rounded p-1 text-slate-400 hover:bg-slate-200 active:cursor-grabbing"
      >
        ⠿
      </button>

      {children}
    </div>
  );
}
