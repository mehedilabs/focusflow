"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useLocalStorage } from "@/hooks/use-local-storage";

type PlannerEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  color: string;
};

const colors = ["#A78BFA", "#60A5FA", "#6EE7B7", "#FBBF77", "#FB7185"];

const emptyForm = {
  title: "",
  time: "09:00",
  category: "Focus",
};

function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getWeekStart(date: Date): Date {
  const start = new Date(date);
  const day = start.getDay();

  start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
  start.setHours(0, 0, 0, 0);

  return start;
}

function shiftDate(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);

  return next;
}

function createInitialEvents(): PlannerEvent[] {
  const today = new Date();

  return [
    {
      id: "e1",
      title: "Morning planning",
      date: dateKey(today),
      time: "09:00",
      category: "Planning",
      color: colors[0],
    },
    {
      id: "e2",
      title: "Deep work session",
      date: dateKey(today),
      time: "11:00",
      category: "Focus",
      color: colors[1],
    },
    {
      id: "e3",
      title: "Review weekly goals",
      date: dateKey(shiftDate(today, 1)),
      time: "14:00",
      category: "Personal",
      color: colors[2],
    },
  ];
}

export default function PlannerPage() {
  const [weekStart, setWeekStart] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [todayKey, setTodayKey] = useState("");

  const [events, setEvents, storageReady] = useLocalStorage<PlannerEvent[]>(
    "focusflow.planner.events",
    [],
  );

  const eventsInitialized = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const today = new Date();
      const currentDateKey = dateKey(today);

      setWeekStart(getWeekStart(today));
      setSelectedDate(currentDateKey);
      setTodayKey(currentDateKey);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!storageReady || eventsInitialized.current) return;

    const timer = window.setTimeout(() => {
      eventsInitialized.current = true;

      if (events.length === 0) {
        setEvents(createInitialEvents());
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [storageReady, events.length, setEvents]);

  const weekDays = useMemo(() => {
    if (!weekStart) return [];

    return Array.from({ length: 7 }, (_, index) => shiftDate(weekStart, index));
  }, [weekStart]);

  const selectedEvents = useMemo(
    () =>
      events
        .filter((event: PlannerEvent) => event.date === selectedDate)
        .sort((a: PlannerEvent, b: PlannerEvent) =>
          a.time.localeCompare(b.time),
        ),
    [events, selectedDate],
  );

  const monthLabel = weekStart
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(weekStart)
    : "Loading calendar…";

  const selectedDateLabel = selectedDate
    ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "Loading schedule…";

  function changeWeek(amount: number) {
    if (!weekStart) return;

    const next = shiftDate(weekStart, amount * 7);

    setWeekStart(next);
    setSelectedDate(dateKey(next));
  }

  function goToToday() {
    const today = new Date();
    const currentDateKey = dateKey(today);

    setWeekStart(getWeekStart(today));
    setSelectedDate(currentDateKey);
    setTodayKey(currentDateKey);
  }

  function openCreateEvent() {
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setError("Enter a title for this plan.");
      return;
    }

    if (!selectedDate) {
      setError("Please wait for the planner to finish loading.");
      return;
    }

    const newEvent: PlannerEvent = {
      id: crypto.randomUUID(),
      title,
      date: selectedDate,
      time: form.time,
      category: form.category,
      color: colors[events.length % colors.length],
    };

    setEvents((current: PlannerEvent[]) => [...current, newEvent]);

    setModalOpen(false);
    setForm(emptyForm);
    setError("");
  }

  function deleteEvent(id: string) {
    setEvents((current: PlannerEvent[]) =>
      current.filter((event: PlannerEvent) => event.id !== id),
    );
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setModalOpen(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs text-[var(--muted)]">
              Workspace / Planner
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Weekly planner
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Give your priorities a place in your week.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateEvent}
            disabled={!selectedDate}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={17} />
            Add plan
          </button>
        </header>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{monthLabel}</h2>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Select a day to view and manage its schedule.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToToday}
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs hover:bg-white/[0.04]"
              >
                Today
              </button>
              <button
                type="button"
                aria-label="Previous week"
                onClick={() => changeWeek(-1)}
                disabled={!weekStart}
                className="rounded-lg border border-[var(--border)] p-2 hover:bg-white/[0.04] disabled:opacity-50"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next week"
                onClick={() => changeWeek(1)}
                disabled={!weekStart}
                className="rounded-lg border border-[var(--border)] p-2 hover:bg-white/[0.04] disabled:opacity-50"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {weekDays.map((day: Date) => {
              const key = dateKey(day);
              const selected = key === selectedDate;
              const isToday = key === todayKey;
              const count = events.filter(
                (event: PlannerEvent) => event.date === key,
              ).length;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(key)}
                  aria-pressed={selected}
                  className={`rounded-xl border p-3 text-left transition-colors sm:p-4 ${
                    selected
                      ? "border-[var(--primary)]/50 bg-[var(--primary)]/10"
                      : "border-[var(--border)] bg-black/[0.05] hover:bg-white/[0.035]"
                  }`}
                >
                  <span className="block text-xs text-[var(--muted)]">
                    {new Intl.DateTimeFormat("en-US", {
                      weekday: "short",
                    }).format(day)}
                  </span>

                  <span
                    className={`mt-2 block text-xl font-semibold ${
                      selected ? "text-[var(--primary)]" : ""
                    }`}
                  >
                    {day.getDate()}
                  </span>

                  <span className="mt-3 flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
                    <span
                      className={`size-1.5 rounded-full ${
                        count ? "bg-[var(--primary)]" : "bg-white/15"
                      }`}
                    />
                    {count} {count === 1 ? "plan" : "plans"}
                  </span>

                  {isToday && (
                    <span className="mt-2 inline-block rounded-md bg-[var(--primary)]/10 px-1.5 py-0.5 text-[9px] text-[var(--primary)]">
                      TODAY
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">{selectedDateLabel}</h2>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {selectedEvents.length} scheduled{" "}
                {selectedEvents.length === 1 ? "item" : "items"}
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateEvent}
              disabled={!selectedDate}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2.5 text-xs font-medium hover:bg-white/[0.04] disabled:opacity-50"
            >
              <Plus size={14} />
              Add to this day
            </button>
          </div>

          {selectedEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedEvents.map((event: PlannerEvent) => (
                <article
                  key={event.id}
                  className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-black/[0.05] p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex shrink-0 items-center gap-2 text-xs text-[var(--muted)] sm:w-24">
                    <Clock3 size={14} />
                    {event.time}
                  </div>

                  <div
                    className="h-1 self-stretch rounded-full sm:h-10 sm:w-1"
                    style={{ backgroundColor: event.color }}
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium">{event.title}</h3>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {event.category}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteEvent(event.id)}
                    aria-label={`Delete ${event.title}`}
                    className="self-end rounded-lg p-2 text-[var(--muted)] hover:bg-rose-400/10 hover:text-rose-300 sm:self-center"
                  >
                    <Trash2 size={15} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-[var(--border)] px-5 py-12 text-center">
              <CalendarDays size={26} className="text-[var(--muted)]" />
              <h3 className="mt-3 text-sm font-medium">Nothing planned yet</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Add a plan and make room for what matters.
              </p>
              <button
                type="button"
                onClick={openCreateEvent}
                disabled={!selectedDate}
                className="mt-4 text-xs font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] disabled:opacity-50"
              >
                Add your first plan
              </button>
            </div>
          )}
        </section>

        {modalOpen && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={handleBackdropClick}
          >
            <form
              onSubmit={saveEvent}
              className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[#191a25] p-5 shadow-2xl sm:p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Add a plan</h2>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {selectedDateLabel}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-2 text-[var(--muted)] hover:bg-white/[0.05]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium">
                    Plan title *
                  </span>
                  <input
                    required
                    autoFocus
                    maxLength={100}
                    value={form.title}
                    onChange={(event) =>
                      setForm({ ...form, title: event.target.value })
                    }
                    placeholder="What do you want to work on?"
                    className="w-full rounded-xl border border-[var(--border)] bg-black/10 px-3 py-3 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-medium">Time</span>
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={(event) =>
                      setForm({ ...form, time: event.target.value })
                    }
                    className="w-full rounded-xl border border-[var(--border)] bg-black/10 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-medium">
                    Category
                  </span>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    className="w-full rounded-xl border border-[var(--border)] bg-[#191a25] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  >
                    <option>Focus</option>
                    <option>Planning</option>
                    <option>Work</option>
                    <option>Personal</option>
                    <option>Learning</option>
                    <option>Break</option>
                  </select>
                </label>

                {error && (
                  <p role="alert" className="text-xs text-rose-300">
                    {error}
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)]"
                >
                  Save plan
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
