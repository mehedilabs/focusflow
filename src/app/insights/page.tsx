"use client";

import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

const weeklyStats = [
  { day: "Mon", completed: 5, focus: 2.5 },
  { day: "Tue", completed: 8, focus: 3.8 },
  { day: "Wed", completed: 4, focus: 2.1 },
  { day: "Thu", completed: 9, focus: 4.4 },
  { day: "Fri", completed: 7, focus: 3.5 },
  { day: "Sat", completed: 10, focus: 5.2 },
  { day: "Sun", completed: 6, focus: 3.1 },
];

const distribution = [
  { label: "Work", percent: 42, color: "#A78BFA", time: "8h 24m" },
  { label: "Learning", percent: 28, color: "#60A5FA", time: "5h 36m" },
  { label: "Personal", percent: 18, color: "#6EE7B7", time: "3h 36m" },
  { label: "Planning", percent: 12, color: "#FBBF77", time: "2h 24m" },
];

export default function InsightsPage() {
  const [period, setPeriod] = useState<"7 days" | "30 days">("7 days");
  const scale = period === "7 days" ? 1 : 4;
  const completedTotal = weeklyStats.reduce(
    (sum, day) => sum + day.completed,
    0,
  );
  const focusTotal = weeklyStats.reduce((sum, day) => sum + day.focus, 0);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs text-[var(--muted)]">
              Productivity / Insights
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Insights
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Understand your habits and celebrate your progress.
            </p>
          </div>

          <label className="flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5">
            <CalendarDays size={15} className="text-[var(--muted)]" />
            <span className="sr-only">Analytics period</span>
            <select
              value={period}
              onChange={(event) =>
                setPeriod(event.target.value as "7 days" | "30 days")
              }
              className="bg-transparent text-xs outline-none"
            >
              <option className="bg-[#191a25]" value="7 days">
                Last 7 days
              </option>
              <option className="bg-[#191a25]" value="30 days">
                Last 30 days
              </option>
            </select>
          </label>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Tasks completed",
              value: String(completedTotal * scale),
              detail: "+14.8% from previous period",
              icon: CheckCircle2,
              color: "#6EE7B7",
              positive: true,
            },
            {
              label: "Focus hours",
              value: (focusTotal * scale).toFixed(1),
              detail: "+9.2% from previous period",
              icon: Clock3,
              color: "#A78BFA",
              positive: true,
            },
            {
              label: "Average focus",
              value: "78%",
              detail: "+5.6% from previous period",
              icon: Target,
              color: "#60A5FA",
              positive: true,
            },
            {
              label: "Best streak",
              value: `${7 * (period === "7 days" ? 1 : 2)} days`,
              detail: "Keep showing up",
              icon: Flame,
              color: "#FBBF77",
              positive: true,
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[var(--muted)]">
                    {stat.label}
                  </span>
                  <span
                    className="flex size-9 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${stat.color}18`,
                      color: stat.color,
                    }}
                  >
                    <Icon size={18} />
                  </span>
                </div>
                <p className="mt-5 text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-300">
                  <ArrowUpRight size={13} />
                  {stat.detail}
                </p>
              </article>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,1fr)]">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Task completion</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Completed tasks by day
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--primary)]">
                <span className="size-2 rounded-sm bg-[var(--primary)]" />
                Tasks
              </div>
            </div>

            <div className="mt-7 grid grid-cols-7 gap-2 sm:gap-4">
              {weeklyStats.map((item) => {
                const value = Math.min((item.completed / 10) * 100, 100);

                return (
                  <div
                    key={item.day}
                    className="flex flex-col items-center gap-3"
                  >
                    <span className="text-[10px] text-[var(--muted)]">
                      {item.completed * scale}
                    </span>
                    <div className="flex h-48 w-full items-end justify-center rounded-lg bg-white/[0.025] p-1.5">
                      <div
                        className="w-full max-w-8 rounded-t-md bg-[var(--primary)] transition-all"
                        style={{
                          height: `${Math.max(value, 5)}%`,
                          opacity: 0.45 + value / 200,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-[var(--muted)] sm:text-xs">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <h2 className="text-base font-semibold">Focus distribution</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Where your time goes
            </p>

            <div className="mt-7 flex items-center justify-center">
              <div
                className="relative size-48 rounded-full"
                style={{
                  background: `conic-gradient(${distribution
                    .map((item, index) => {
                      const start = distribution
                        .slice(0, index)
                        .reduce((sum, current) => sum + current.percent, 0);
                      return `${item.color} ${start}% ${start + item.percent}%`;
                    })
                    .join(", ")})`,
                }}
              >
                <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-[var(--surface)]">
                  <Clock3 size={19} className="text-[var(--primary)]" />
                  <span className="mt-2 text-2xl font-semibold">20h</span>
                  <span className="mt-1 text-xs text-[var(--muted)]">
                    total focus
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              {distribution.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.label}
                    </span>
                    <span className="text-[var(--muted)]">{item.time}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <TrendingUp size={19} />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Your strongest day</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Saturday · 10 tasks completed
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
              You made the most progress on Saturday. Look at what helped you
              stay focused and see whether that routine works on other days too.
            </p>
          </article>

          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <BarChart3 size={19} />
              </div>
              <div>
                <h2 className="text-sm font-semibold">A useful next step</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Build on your current rhythm
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
              Choose one high-priority task at the beginning of your day.
              Protect a focus block for it before moving on to smaller tasks.
            </p>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
