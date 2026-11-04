"use client";

import { useDroppable } from "@dnd-kit/react";
import type { ReactNode } from "react";

type DropZoneProps = {
  id: string;
  children: ReactNode;
};

export function DropZone({ id, children }: DropZoneProps) {
  const { ref, isDropTarget } = useDroppable({ id });

  return (
    <div
      ref={ref}
      className={`min-h-24 rounded-xl transition-colors ${
        isDropTarget ? "bg-blue-100 ring-2 ring-blue-400" : ""
      }`}
    >
      {children}
    </div>
  );
}
