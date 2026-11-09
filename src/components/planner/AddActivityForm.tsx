"use client";

import { useState, type FormEvent } from "react";
import { useActivities } from "@/context/ActivitiesContext";
import type { Activity } from "@/types/activity";

type AddActivityFormProps = {
  tripId: string;
  onCancel: () => void;
};

export function AddActivityForm({ tripId, onCancel }: AddActivityFormProps) {
  const { addActivity, activities } = useActivities();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) return;

    const newActivity: Activity = {
      id: crypto.randomUUID(),
      tripId,
      title: title.trim(),
      description: description.trim() || undefined,
      url: url.trim() || undefined,
      date: null,
      timeBlock: null,
      position: activities.filter((activity) => activity.tripId === tripId)
        .length,
    };

    addActivity(newActivity);
    onCancel();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-border bg-surface p-4"
    >
      <div>
        <label
          htmlFor="activity-title"
          className="mb-1 block text-sm font-medium text-foreground-secondary"
        >
          Activity name
        </label>
        <input
          id="activity-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Visit the Colosseum"
          required
          className="w-full rounded-lg border border-slate-300 p-2 text-foreground"
        />
      </div>

      <div>
        <label
          htmlFor="activity-description"
          className="mb-1 block text-sm font-medium text-foreground-secondary"
        >
          Description (optional)
        </label>
        <textarea
          id="activity-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          placeholder="Notes about this place..."
          className="w-full rounded-lg border border-slate-300 p-2 text-foreground"
        />
      </div>

      <div>
        <label
          htmlFor="activity-url"
          className="mb-1 block text-sm font-medium text-foreground-secondary"
        >
          Link (optional)
        </label>
        <input
          id="activity-url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://..."
          className="w-full rounded-lg border border-slate-300 p-2 text-foreground"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-foreground-secondary"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Add Activity
        </button>
      </div>
    </form>
  );
}
