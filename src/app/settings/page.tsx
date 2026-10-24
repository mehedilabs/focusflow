"use client";

import { useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  Clock3,
  Database,
  Download,
  RotateCcw,
  Save,
  Settings2,
  Target,
  UserRound,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("My Workspace");
  const [focusMinutes, setFocusMinutes] = useState("25");
  const [shortBreak, setShortBreak] = useState("5");
  const [longBreak, setLongBreak] = useState("15");
  const [dailyGoal, setDailyGoal] = useState("4");
  const [weeklyGoal, setWeeklyGoal] = useState("20");
  const [weekStart, setWeekStart] = useState("Monday");
  const [notifications, setNotifications] = useState(false);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  function savePreferences(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  function resetPreferences() {
    setDisplayName("My Workspace");
    setFocusMinutes("25");
    setShortBreak("5");
    setLongBreak("15");
    setDailyGoal("4");
    setWeeklyGoal("20");
    setWeekStart("Monday");
    setNotifications(false);
    setAutoStartBreaks(false);
    setResetOpen(false);
  }

  function exportPreferences() {
    const data = {
      displayName,
      focusMinutes: Number(focusMinutes),
      shortBreak: Number(shortBreak),
      longBreak: Number(longBreak),
      dailyGoal: Number(dailyGoal),
      weeklyGoal: Number(weeklyGoal),
      weekStart,
      notifications,
      autoStartBreaks,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "focusflow-preferences.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const inputStyles =
    "w-full rounded-xl border border-[var(--border)] bg-[#12131c]/80 px-4 py-3.5 text-sm text-[var(--foreground)] outline-none transition duration-200 placeholder:text-[var(--muted)] hover:border-white/15 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10";

  const sectionStyles =
    "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-200 sm:p-6 lg:p-7";

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-7 pb-8 sm:space-y-8">
        <header className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-20 size-56 rounded-full bg-violet-500/[0.09] blur-3xl" />
          <div className="relative">
            <div className="mb-5 flex items-center gap-2 text-xs text-[var(--muted)]">
              <span>Workspace</span>
              <span className="text-white/20">/</span>
              <span className="text-[var(--primary)]">Settings</span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Settings
                </h1>
                <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">
                  Customize your workspace, focus sessions, and productivity
                  goals to build a workflow that works for you.
                </p>
              </div>

              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
                <Settings2 size={25} strokeWidth={1.7} />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs text-[var(--muted)]">
                <span className="size-1.5 rounded-full bg-violet-400" />
                Workspace preferences
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs text-[var(--muted)]">
                <Database size={12} />
                Local workspace
              </span>
            </div>
          </div>
        </header>

        <form onSubmit={savePreferences} className="space-y-5">
          <section className={sectionStyles}>
            <div className="mb-6 flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/10 text-violet-300">
                <UserRound size={20} strokeWidth={1.8} />
              </div>
              <div className="min-w-0 pt-0.5">
                <h2 className="text-base font-semibold tracking-tight">
                  Workspace profile
                </h2>
                <p className="mt-1.5 text-sm leading-5 text-[var(--muted)]">
                  Give your productivity space a name.
                </p>
              </div>
            </div>

            <div className="max-w-xl">
              <label className="block">
                <span className="mb-2.5 block text-xs font-medium text-[var(--muted)]">
                  Workspace name
                </span>
                <input
                  value={displayName}
                  maxLength={60}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className={inputStyles}
                />
              </label>
              <p className="mt-2 text-right text-[11px] text-[var(--muted)]">
                {displayName.length}/60 characters
              </p>
            </div>
          </section>

          <section className={sectionStyles}>
            <div className="mb-6 flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-400/10 text-blue-300">
                <Clock3 size={20} strokeWidth={1.8} />
              </div>
              <div className="min-w-0 pt-0.5">
                <h2 className="text-base font-semibold tracking-tight">
                  Focus timer
                </h2>
                <p className="mt-1.5 text-sm leading-5 text-[var(--muted)]">
                  Find the right balance between deep work and rest.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Focus session",
                  description: "Time for deep work",
                  value: focusMinutes,
                  set: setFocusMinutes,
                  min: 1,
                  max: 120,
                  suffix: "min",
                },
                {
                  label: "Short break",
                  description: "Quick mental reset",
                  value: shortBreak,
                  set: setShortBreak,
                  min: 1,
                  max: 60,
                  suffix: "min",
                },
                {
                  label: "Long break",
                  description: "Recharge properly",
                  value: longBreak,
                  set: setLongBreak,
                  min: 1,
                  max: 90,
                  suffix: "min",
                },
              ].map((field) => (
                <label
                  key={field.label}
                  className="group rounded-xl border border-[var(--border)] bg-black/[0.08] p-4 transition-colors hover:border-white/15"
                >
                  <span className="block text-sm font-medium">
                    {field.label}
                  </span>
                  <span className="mt-1 block text-xs text-[var(--muted)]">
                    {field.description}
                  </span>
                  <div className="relative mt-4">
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      required
                      value={field.value}
                      onChange={(event) => field.set(event.target.value)}
                      className={`${inputStyles} pr-12 text-base font-semibold tabular-nums`}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">
                      {field.suffix}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-black/[0.06] p-4 transition-colors hover:border-violet-400/25 hover:bg-violet-400/[0.03] sm:p-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300">
                  <RotateCcw size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">Auto-start breaks</p>
                  <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
                    Automatically begin the next break after focus ends.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoStartBreaks}
                onChange={(event) => setAutoStartBreaks(event.target.checked)}
                className="size-4 shrink-0 cursor-pointer accent-[#A78BFA]"
              />
            </label>
          </section>

          <section className={sectionStyles}>
            <div className="mb-6 flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                <Target size={20} strokeWidth={1.8} />
              </div>
              <div className="min-w-0 pt-0.5">
                <h2 className="text-base font-semibold tracking-tight">
                  Goals & planning
                </h2>
                <p className="mt-1.5 text-sm leading-5 text-[var(--muted)]">
                  Set clear targets for your daily and weekly progress.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block rounded-xl border border-[var(--border)] bg-black/[0.08] p-4 transition-colors hover:border-white/15">
                <span className="block text-sm font-medium">
                  Daily focus goal
                </span>
                <span className="mt-1 block text-xs text-[var(--muted)]">
                  Your target each day
                </span>
                <div className="relative mt-4">
                  <input
                    type="number"
                    min="1"
                    max="16"
                    required
                    value={dailyGoal}
                    onChange={(event) => setDailyGoal(event.target.value)}
                    className={`${inputStyles} pr-14 text-base font-semibold tabular-nums`}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">
                    hours
                  </span>
                </div>
              </label>

              <label className="block rounded-xl border border-[var(--border)] bg-black/[0.08] p-4 transition-colors hover:border-white/15">
                <span className="block text-sm font-medium">
                  Weekly focus goal
                </span>
                <span className="mt-1 block text-xs text-[var(--muted)]">
                  Your target each week
                </span>
                <div className="relative mt-4">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={weeklyGoal}
                    onChange={(event) => setWeeklyGoal(event.target.value)}
                    className={`${inputStyles} pr-14 text-base font-semibold tabular-nums`}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">
                    hours
                  </span>
                </div>
              </label>

              <label className="block rounded-xl border border-[var(--border)] bg-black/[0.08] p-4 transition-colors hover:border-white/15 sm:col-span-2 lg:col-span-1">
                <span className="block text-sm font-medium">
                  Week starts on
                </span>
                <span className="mt-1 block text-xs text-[var(--muted)]">
                  Choose your calendar layout
                </span>
                <select
                  value={weekStart}
                  onChange={(event) => setWeekStart(event.target.value)}
                  className={`${inputStyles} mt-4 cursor-pointer`}
                >
                  <option>Monday</option>
                  <option>Sunday</option>
                </select>
              </label>
            </div>
          </section>

          <section className={sectionStyles}>
            <div className="mb-6 flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-300/10 text-amber-200">
                <Bell size={20} strokeWidth={1.8} />
              </div>
              <div className="min-w-0 pt-0.5">
                <h2 className="text-base font-semibold tracking-tight">
                  Notifications
                </h2>
                <p className="mt-1.5 text-sm leading-5 text-[var(--muted)]">
                  Manage your preference for future reminders.
                </p>
              </div>
            </div>

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-black/[0.06] p-4 transition-colors hover:border-amber-300/20 sm:p-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200">
                  <Bell size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Enable reminders preference
                  </p>
                  <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
                    Save your preference for future reminder functionality.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(event) => setNotifications(event.target.checked)}
                className="size-4 shrink-0 cursor-pointer accent-[#A78BFA]"
              />
            </label>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={exportPreferences}
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--muted)] transition-all duration-200 hover:border-white/15 hover:bg-white/[0.04] hover:text-[var(--foreground)] active:scale-[0.98]"
            >
              <Download size={16} />
              Export preferences
            </button>

            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] shadow-lg shadow-violet-500/[0.08] transition-all duration-200 hover:bg-[var(--primary-hover)] active:scale-[0.98]"
            >
              {saved ? <Check size={17} /> : <Save size={17} />}
              {saved ? "Preferences updated" : "Save preferences"}
            </button>
          </div>
        </form>

        <section className="overflow-hidden rounded-2xl border border-rose-400/20 bg-[var(--surface)]">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-rose-400/15 bg-rose-400/10 text-rose-300">
                <Database size={20} strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold tracking-tight">
                  Workspace data
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">
                  Reset the preferences on this page to their default values.
                  Your tasks and projects will not be deleted.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setResetOpen(true)}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.04] px-4 py-2.5 text-sm font-medium text-rose-300 transition-all duration-200 hover:border-rose-400/35 hover:bg-rose-400/10 active:scale-[0.98]"
            >
              <RotateCcw size={15} />
              Reset preferences
            </button>
          </div>
        </section>

        {resetOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="reset-title"
              className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[#191a25] p-6 shadow-2xl shadow-black/30"
            >
              <div className="flex size-12 items-center justify-center rounded-xl border border-rose-400/15 bg-rose-400/10 text-rose-300">
                <RotateCcw size={20} />
              </div>

              <h2 id="reset-title" className="mt-5 text-lg font-semibold">
                Reset your preferences?
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Your settings on this page will return to their default values.
                This action will not delete your tasks or projects.
              </p>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setResetOpen(false)}
                  className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-medium transition-colors hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={resetPreferences}
                  className="rounded-xl bg-rose-400 px-5 py-3 text-sm font-semibold text-[#201018] transition-colors hover:bg-rose-300"
                >
                  Reset preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
