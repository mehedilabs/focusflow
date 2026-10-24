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

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-7">
        <header>
          <p className="mb-2 text-xs text-[var(--muted)]">
            Workspace / Settings
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Settings
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Make FocusFlow work the way you do.
          </p>
        </header>

        <form onSubmit={savePreferences} className="space-y-5">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <UserRound size={19} />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Workspace profile</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Personalize your productivity space.
                </p>
              </div>
            </div>

            <label className="block max-w-lg">
              <span className="mb-2 block text-xs font-medium">
                Workspace name
              </span>
              <input
                value={displayName}
                maxLength={60}
                onChange={(event) => setDisplayName(event.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-black/[0.08] px-3 py-3 text-sm outline-none focus:border-[var(--primary)]"
              />
            </label>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
                <Clock3 size={19} />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Focus timer</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Set the length of your focus and break sessions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Focus session (min)",
                  value: focusMinutes,
                  set: setFocusMinutes,
                  min: 1,
                  max: 120,
                },
                {
                  label: "Short break (min)",
                  value: shortBreak,
                  set: setShortBreak,
                  min: 1,
                  max: 60,
                },
                {
                  label: "Long break (min)",
                  value: longBreak,
                  set: setLongBreak,
                  min: 1,
                  max: 90,
                },
              ].map((field) => (
                <label key={field.label} className="block">
                  <span className="mb-2 block text-xs font-medium">
                    {field.label}
                  </span>
                  <input
                    type="number"
                    min={field.min}
                    max={field.max}
                    required
                    value={field.value}
                    onChange={(event) => field.set(event.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-black/[0.08] px-3 py-3 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </label>
              ))}
            </div>

            <label className="mt-4 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[var(--border)] p-4">
              <div>
                <p className="text-xs font-medium">Auto-start breaks</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Automatically begin the next break after focus ends.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoStartBreaks}
                onChange={(event) => setAutoStartBreaks(event.target.checked)}
                className="size-4 accent-[#A78BFA]"
              />
            </label>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <Target size={19} />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Goals & planning</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Set realistic goals for your time and workload.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-xs font-medium">
                  Daily focus goal (hours)
                </span>
                <input
                  type="number"
                  min="1"
                  max="16"
                  required
                  value={dailyGoal}
                  onChange={(event) => setDailyGoal(event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-black/[0.08] px-3 py-3 text-sm outline-none focus:border-[var(--primary)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium">
                  Weekly focus goal (hours)
                </span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={weeklyGoal}
                  onChange={(event) => setWeeklyGoal(event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-black/[0.08] px-3 py-3 text-sm outline-none focus:border-[var(--primary)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium">
                  Week starts on
                </span>
                <select
                  value={weekStart}
                  onChange={(event) => setWeekStart(event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[#191a25] px-3 py-3 text-sm outline-none"
                >
                  <option>Monday</option>
                  <option>Sunday</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-300/10 text-amber-200">
                <Bell size={19} />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Notifications</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Choose whether FocusFlow should request reminders.
                </p>
              </div>
            </div>

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[var(--border)] p-4">
              <div>
                <p className="text-xs font-medium">
                  Enable reminders preference
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Save your preference for future reminder functionality.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(event) => setNotifications(event.target.checked)}
                className="size-4 accent-[#A78BFA]"
              />
            </label>
          </section>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={exportPreferences}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-3 text-xs font-medium text-[var(--muted)] hover:bg-white/[0.04] hover:text-[var(--foreground)]"
            >
              <Download size={15} /> Export preferences
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              {saved ? "Preferences updated" : "Save preferences"}
            </button>
          </div>
        </form>

        <section className="rounded-2xl border border-rose-400/15 bg-[var(--surface)] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-400/10 text-rose-300">
              <Database size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold">Workspace data</h2>
              <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                Reset the preferences on this page to their defaults. This does
                not delete your tasks or projects.
              </p>
              <button
                type="button"
                onClick={() => setResetOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-400/20 px-3 py-2.5 text-xs font-medium text-rose-300 hover:bg-rose-400/10"
              >
                <RotateCcw size={14} /> Reset preferences
              </button>
            </div>
          </div>
        </section>

        {resetOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="reset-title"
              className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[#191a25] p-5 shadow-2xl"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-rose-400/10 text-rose-300">
                <RotateCcw size={18} />
              </div>
              <h2 id="reset-title" className="mt-4 font-semibold">
                Reset your preferences?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Your settings on this page will return to their default values.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setResetOpen(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={resetPreferences}
                  className="rounded-xl bg-rose-400 px-4 py-2.5 text-sm font-semibold text-[#201018]"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
