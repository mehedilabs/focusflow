"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Coffee,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Sparkles,
  Target,
  Timer,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

const modes = [
  { id: "focus", label: "Focus", minutes: 25, icon: Target },
  { id: "short", label: "Short break", minutes: 5, icon: Coffee },
  { id: "long", label: "Long break", minutes: 15, icon: Sparkles },
] as const;

type Mode = (typeof modes)[number]["id"];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function FocusPage() {
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [completedSeconds, setCompletedSeconds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [taskName, setTaskName] = useState("Work on your most important task");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("25");

  const selectedMode = modes.find((item) => item.id === mode) ?? modes[0];
  const totalSeconds = selectedMode.minutes * 60;
  const progress =
    totalSeconds > 0 ? (totalSeconds - remaining) / totalSeconds : 0;

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setRunning(false);

          if (mode === "focus") {
            setSessions((count) => count + 1);
            setCompletedSeconds((seconds) => seconds + totalSeconds);
          }

          if (
            soundEnabled &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification(`${selectedMode.label} session complete`, {
              body:
                mode === "focus"
                  ? "Nice work. Take a short break before the next session."
                  : "Your break is over. Ready to focus again?",
            });
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running, mode, totalSeconds, soundEnabled, selectedMode.label]);

  function selectMode(nextMode: Mode) {
    const next = modes.find((item) => item.id === nextMode);
    if (!next) return;
    setMode(nextMode);
    setRemaining(next.minutes * 60);
    setRunning(false);
  }

  function resetTimer() {
    setRunning(false);
    setRemaining(selectedMode.minutes * 60);
  }

  function applyCustomDuration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const minutes = Number(customMinutes);

    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 120) return;

    setRunning(false);
    setMode("focus");
    setRemaining(Math.round(minutes) * 60);
    setSettingsOpen(false);
  }

  async function requestNotifications() {
    if (!("Notification" in window)) {
      setSoundEnabled(false);
      return;
    }

    if (Notification.permission === "granted") {
      setSoundEnabled((value) => !value);
      return;
    }

    const permission = await Notification.requestPermission();
    setSoundEnabled(permission === "granted");
  }

  const focusedMinutes = Math.floor(completedSeconds / 60);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1200px] space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs text-[var(--muted)]">
              Productivity / Focus timer
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Time to focus
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              One thing at a time. Give your attention room to work.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2.5 text-xs text-[var(--muted)] hover:bg-white/[0.04] hover:text-[var(--foreground)]"
          >
            <Settings2 size={15} /> Timer settings
          </button>
        </header>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
          <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8">
            <div className="pointer-events-none absolute left-1/2 top-16 size-72 -translate-x-1/2 rounded-full bg-[var(--primary)]/[0.06] blur-3xl" />

            <div className="relative mx-auto max-w-lg">
              <div className="mb-8 flex justify-center gap-1 rounded-xl border border-[var(--border)] bg-black/[0.08] p-1">
                {modes.map((item) => {
                  const Icon = item.icon;
                  const active = mode === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectMode(item.id)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs transition-colors sm:gap-2 sm:px-3 ${
                        active
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <Icon size={15} />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative mx-auto flex aspect-square w-full max-w-[330px] items-center justify-center">
                <svg
                  viewBox="0 0 340 340"
                  className="absolute inset-0 size-full -rotate-90"
                >
                  <circle
                    cx="170"
                    cy="170"
                    r="151"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity=".055"
                    strokeWidth="1"
                    strokeDasharray="3 8"
                  />
                  <circle
                    cx="170"
                    cy="170"
                    r="133"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity=".08"
                    strokeWidth="9"
                  />
                  <circle
                    cx="170"
                    cy="170"
                    r="133"
                    fill="none"
                    stroke="#A78BFA"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 133 * progress} ${2 * Math.PI * 133}`}
                    className="transition-all duration-500"
                  />
                </svg>

                <div className="relative text-center">
                  <div className="mb-3 flex items-center justify-center gap-2 text-xs text-[var(--muted)]">
                    <span
                      className={`size-1.5 rounded-full ${running ? "animate-pulse bg-emerald-400" : "bg-[var(--primary)]"}`}
                    />
                    {remaining === 0
                      ? "Session complete"
                      : running
                        ? "Session in progress"
                        : "Ready when you are"}
                  </div>
                  <p className="font-mono text-5xl font-semibold tracking-tight sm:text-6xl">
                    {formatTime(remaining)}
                  </p>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    {mode === "focus"
                      ? "Stay present. Do one thing well."
                      : "Step away and recharge."}
                  </p>
                </div>
              </div>

              <div className="mt-7 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetTimer}
                  aria-label="Reset timer"
                  className="rounded-xl border border-[var(--border)] p-3.5 text-[var(--muted)] transition-colors hover:bg-white/[0.05] hover:text-[var(--foreground)]"
                >
                  <RotateCcw size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (remaining === 0) setRemaining(totalSeconds);
                    setRunning((value) => !value);
                  }}
                  className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-7 py-3.5 text-sm font-semibold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)]"
                >
                  {running ? (
                    <Pause size={18} />
                  ) : (
                    <Play size={18} fill="currentColor" />
                  )}
                  {running
                    ? "Pause session"
                    : remaining === 0
                      ? "Start again"
                      : "Start focus"}
                </button>

                <button
                  type="button"
                  onClick={() => void requestNotifications()}
                  aria-label={
                    soundEnabled
                      ? "Disable notifications"
                      : "Enable notifications"
                  }
                  className={`rounded-xl border border-[var(--border)] p-3.5 transition-colors hover:bg-white/[0.05] ${
                    soundEnabled
                      ? "text-[var(--primary)]"
                      : "text-[var(--muted)]"
                  }`}
                >
                  {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
              </div>

              <p className="mt-4 text-center text-[10px] text-[var(--muted)]">
                Browser notifications require permission. Keep this tab open
                while the timer runs.
              </p>
            </div>
          </section>

          <div className="space-y-5">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Target size={19} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">Current intention</h2>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Keep your attention on one thing.
                  </p>
                </div>
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block text-xs text-[var(--muted)]">
                  What are you focusing on?
                </span>
                <textarea
                  rows={3}
                  maxLength={180}
                  value={taskName}
                  onChange={(event) => setTaskName(event.target.value)}
                  className="w-full resize-y rounded-xl border border-[var(--border)] bg-black/[0.08] px-3 py-3 text-sm outline-none focus:border-[var(--primary)]"
                />
              </label>

              <div className="mt-3 flex items-start gap-2 rounded-xl bg-black/[0.08] p-3 text-xs leading-relaxed text-[var(--muted)]">
                <Sparkles
                  size={15}
                  className="mt-0.5 shrink-0 text-[var(--primary)]"
                />
                Close distractions, work on this intention, and take your break
                when the timer ends.
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
              <h2 className="text-sm font-semibold">Todays focus summary</h2>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Progress from this timer session
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-black/[0.08] p-4">
                  <Clock3 size={17} className="text-[var(--primary)]" />
                  <p className="mt-3 text-2xl font-semibold">
                    {focusedMinutes}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Focus minutes
                  </p>
                </div>
                <div className="rounded-xl bg-black/[0.08] p-4">
                  <CheckCircle2 size={17} className="text-emerald-300" />
                  <p className="mt-3 text-2xl font-semibold">{sessions}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Sessions completed
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--border)] p-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200">
                  <Zap size={17} />
                </div>
                <div>
                  <p className="text-xs font-medium">
                    Consistency beats intensity
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--muted)]">
                    A short focused session is still progress.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {settingsOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <form
              onSubmit={applyCustomDuration}
              className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[#191a25] p-5 shadow-2xl sm:p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Timer settings</h2>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Choose your focus session length.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close settings"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-lg p-2 text-[var(--muted)] hover:bg-white/[0.05]"
                >
                  <X size={18} />
                </button>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-medium">
                  Focus duration (minutes)
                </span>
                <input
                  type="number"
                  min="1"
                  max="120"
                  required
                  value={customMinutes}
                  onChange={(event) => setCustomMinutes(event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-black/10 px-3 py-3 text-sm outline-none focus:border-[var(--primary)]"
                />
              </label>

              <div className="mt-3 flex flex-wrap gap-2">
                {[15, 25, 30, 45, 60].map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    onClick={() => setCustomMinutes(String(minutes))}
                    className={`rounded-lg border px-3 py-2 text-xs ${
                      customMinutes === String(minutes)
                        ? "border-[var(--primary)]/50 bg-[var(--primary)]/10 text-[var(--primary)]"
                        : "border-[var(--border)] text-[var(--muted)] hover:bg-white/[0.04]"
                    }`}
                  >
                    {minutes} min
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="mt-5 w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
              >
                Apply duration
              </button>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
