"use client";

import { useState, type FormEvent } from "react";
import type { Trip } from "@/types/trip";

type CreateTripFormProps = {
  onCreate: (trip: Trip) => void;
  onCancel: () => void;
};

export function CreateTripForm({ onCreate, onCancel }: CreateTripFormProps) {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isValid =
    title.trim() !== "" &&
    destination.trim() !== "" &&
    startDate !== "" &&
    endDate !== "" &&
    endDate >= startDate;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValid) return;

    const newTrip: Trip = {
      id: crypto.randomUUID(),
      title: title.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      status: "planning",
    };

    onCreate(newTrip);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Create a new trip
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Start planning your next adventure.
        </p>
      </div>

      <div>
        <label htmlFor="title" className="mb-1 block text-sm text-slate-700">
          Trip name
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Japan Adventure"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          required
        />
      </div>

      <div>
        <label
          htmlFor="destination"
          className="mb-1 block text-sm text-slate-700"
        >
          Destination
        </label>
        <input
          id="destination"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          placeholder="Japan"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="startDate"
            className="mb-1 block text-sm text-slate-700"
          >
            Start date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            required
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="mb-1 block text-sm text-slate-700"
          >
            End date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(event) => setEndDate(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Create Trip
        </button>
      </div>
    </form>
  );
}
