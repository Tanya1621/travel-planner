
"use client";

import { RotateCcw } from "lucide-react";
import { useActivities } from "@/context/ActivitiesContext";

export function UndoToast() {
    const { lastDeletedActivity, undoDelete } =
        useActivities();

    if (!lastDeletedActivity) return null;

    return (
        <div
            role="status"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-xl bg-slate-900 px-5 py-4 text-white shadow-lg"
        >
            <span className="text-sm">
                Activity deleted
            </span>

            <button
                type="button"
                onClick={undoDelete}
                className="flex items-center gap-1 text-sm font-semibold text-blue-300 hover:text-blue-200"
            >
                <RotateCcw size={15} />
                Undo
            </button>
        </div>
    );
}
