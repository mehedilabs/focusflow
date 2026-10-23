"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Circle,
  Clock3,
  Flame,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

const sampleTasks = [
  {
    title: "Review project requirements",
    category: "FocusFlow",
    time: "09:00 AM",
    priority: "High",
    color: "#A78BFA",
  },
  {
    title: "Complete dashboard UI",
    category: "Development",
    time: "11:30 AM",
    priority: "High",
    color: "#60A5FA",
  },
  {
    title: "Read 20 pages",
    category: "Personal",
    time: "02:00 PM",
    priority: "Medium",
    color: "#6EE7B7",
  },
  {
    title: "Plan tomorrow's work",
    category: "Planning",
    time: "05:00 PM",
    priority: "Low",
    color: "#FBBF77",
  },
];

const schedule = [
  {
    title: "Morning planning",
    detail: "Organize today's priorities",
    time: "09:00 AM",
    color: "#A78BFA",
  },
  {
    title: "Deep work session",
    detail: "Work on your main project",
    time: "11:30 AM",
    color: "#60A5FA",
  },
  {
    title: "Review progress",
    detail: "Reflect on what you achieved",
    time: "04:30 PM",
    color: "#6EE7B7",
  },
];

const weeklyData = [
  { day: "Mon", value: 44 },
  { day: "Tue", value: 68 },
  { day: "Wed", value: 52 },
  { day: "Thu", value: 82 },
  { day: "Fri", value: 62 },
  { day: "Sat", value: 92 },
  { day: "Sun", value: 72 },
];

function Greeting() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs text-[var(--muted)]">
          <CalendarDays size={14} />
          <span>{today}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {greeting}, <span className="text-[var(--primary)]">lets focus.</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
          Make today count. One task at a time, one step closer to your goals.
        </p>
      </div>

      <Link
        href="/tasks"
        className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)]"
      >
        <Plus size={17} />
        New task
      </Link>
    </section>
  );
}

function StatCard({
  label,
  value,
  unit,
  change,
  icon: Icon,
  color,
  progress,
}: {
  label: string;
  value: string;
  unit: string;
  change: string;
  icon: typeof Check;
  color: string;
  progress: number;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:bg-[var(--surface-elevated)]">
      <div className="flex items-center gap-2.5">
        <div
          className="flex size-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}18`, color }}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>
        <p className="text-sm text-[var(--muted)]">{label}</p>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight">{value}</span>
        <span className="text-xs text-[var(--muted)]">{unit}</span>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs">
        <ArrowUpRight size={14} className="text-emerald-400" />
        <span className="text-emerald-400">{change}</span>
        <span className="text-[var(--muted)]">vs. last week</span>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full"
          style={{ width: `${progress}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function ProductivityChart() {
  const [range, setRange] = useState<"Week" | "Month">("Week");
  const values =
    range === "Week"
      ? [44, 68, 52, 82, 62, 92, 72]
      : [36, 55, 48, 73, 60, 84, 69];
  const labels =
    range === "Week"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["W1", "W2", "W3", "W4", "W5", "W6", "W7"];

  const points = values
    .map((value, index) => `${36 + index * 70},${142 - value * 1.12}`)
    .join(" ");

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Productivity</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Your activity over time
          </p>
        </div>
        <div className="flex rounded-lg border border-[var(--border)] p-1">
          {(["Week", "Month"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={`rounded-md px-3 py-1.5 text-xs ${
                range === item
                  ? "bg-[var(--surface-hover)] text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-3xl font-semibold">78%</span>
        <span className="flex items-center gap-1 text-xs text-emerald-400">
          <TrendingUp size={14} /> +12.5%
        </span>
      </div>

      <p className="mb-3 text-xs text-[var(--muted)]">
        Average productivity score
      </p>

      <svg
        viewBox="0 0 492 170"
        role="img"
        aria-label={`${range} productivity chart`}
        className="h-auto w-full"
      >
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity=".3" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[30, 65, 100, 135].map((y) => (
          <line
            key={y}
            x1="30"
            y1={y}
            x2="468"
            y2={y}
            stroke="currentColor"
            strokeOpacity=".08"
            strokeDasharray="4 5"
          />
        ))}

        <polygon points={`36,142 ${points} 456,142`} fill="url(#chart-fill)" />
        <polyline
          points={points}
          fill="none"
          stroke="#A78BFA"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {values.map((value, index) => (
          <circle
            key={labels[index]}
            cx={36 + index * 70}
            cy={142 - value * 1.12}
            r="3.5"
            fill="#191a25"
            stroke="#A78BFA"
            strokeWidth="2"
          />
        ))}
      </svg>

      <div className="grid grid-cols-7">
        {labels.map((label) => (
          <span
            key={label}
            className="text-center text-[10px] text-[var(--muted)] sm:text-xs"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}

function DailyFocus() {
  const circumference = 2 * Math.PI * 72;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="text-base font-semibold">Daily focus</h2>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Your focus goal at a glance
      </p>

      <div className="flex flex-col items-center py-5">
        <div className="relative size-44">
          <svg viewBox="0 0 180 180" className="size-full -rotate-90">
            <circle
              cx="90"
              cy="90"
              r="72"
              fill="none"
              stroke="currentColor"
              strokeOpacity=".08"
              strokeWidth="12"
            />
            <circle
              cx="90"
              cy="90"
              r="72"
              fill="none"
              stroke="#A78BFA"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${circumference * 0.68} ${circumference}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Sparkles size={18} className="mb-2 text-[var(--primary)]" />
            <p className="text-3xl font-semibold">68%</p>
            <p className="mt-1 text-xs text-[var(--muted)]">of daily goal</p>
          </div>
        </div>

        <p className="mt-3 text-sm font-medium">You are building momentum</p>
        <p className="mt-1 max-w-[240px] text-center text-xs leading-relaxed text-[var(--muted)]">
          A little focused effort today adds up to meaningful progress.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-black/[0.08] p-3">
          <p className="text-xs text-[var(--muted)]">Focused today</p>
          <p className="mt-1 text-lg font-semibold">2h 43m</p>
        </div>
        <div className="rounded-xl bg-black/[0.08] p-3">
          <p className="text-xs text-[var(--muted)]">Daily target</p>
          <p className="mt-1 text-lg font-semibold">4 hours</p>
        </div>
      </div>

      <Link
        href="/focus"
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)]/10 px-4 py-3 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)]/15"
      >
        <Zap size={16} />
        Start a focus session
        <ArrowRight size={15} />
      </Link>
    </section>
  );
}

function TodayTasks() {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Todays tasks</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            A little progress goes a long way
          </p>
        </div>
        <Link
          href="/tasks"
          className="flex items-center gap-1 text-xs text-[var(--primary)] hover:text-[var(--primary-hover)]"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mb-4 rounded-xl border border-[var(--border)] bg-black/[0.08] p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 text-[var(--muted)]">
            <Target size={15} /> Daily progress
          </span>
          <span className="font-medium text-[var(--primary)]">2 of 6</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full w-1/3 rounded-full bg-[var(--primary)]" />
        </div>
      </div>

      <div className="space-y-1">
        {sampleTasks.map((task) => (
          <div
            key={task.title}
            className="flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-white/[0.025]"
          >
            <Circle
              size={18}
              className="shrink-0 text-[var(--muted)]"
              strokeWidth={1.6}
            />
            <div
              className="h-8 w-1 shrink-0 rounded-full"
              style={{ backgroundColor: task.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{task.title}</p>
              <p className="mt-1 truncate text-xs text-[var(--muted)]">
                {task.category} · {task.time}
              </p>
            </div>
            <span
              className={`hidden rounded-md px-2 py-1 text-[10px] sm:inline-flex ${
                task.priority === "High"
                  ? "bg-rose-400/10 text-rose-300"
                  : task.priority === "Medium"
                    ? "bg-amber-300/10 text-amber-200"
                    : "bg-emerald-300/10 text-emerald-300"
              }`}
            >
              {task.priority}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/tasks"
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-xs font-medium text-[var(--muted)] hover:border-[var(--primary)]/50 hover:text-[var(--foreground)]"
      >
        <Plus size={15} /> Add a task
      </Link>
    </section>
  );
}

function UpcomingSchedule() {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="text-base font-semibold">Coming up</h2>
      <p className="mt-1 text-xs text-[var(--muted)]">Keep your day moving</p>

      <div className="relative mt-6 space-y-6 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-px before:bg-[var(--border)]">
        {schedule.map((item) => (
          <div key={item.title} className="relative flex gap-3">
            <div
              className="relative z-10 flex size-[31px] shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]"
              style={{ color: item.color }}
            >
              <Clock3 size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                {item.detail}
              </p>
            </div>
            <span className="shrink-0 pt-1 text-[10px] text-[var(--muted)] sm:text-xs">
              {item.time}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/planner"
        className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-3 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
      >
        <CalendarDays size={15} /> Open planner
      </Link>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-[1500px] space-y-7 pb-8">
        <Greeting />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Tasks completed"
            value="12"
            unit="tasks"
            change="+18.2%"
            icon={Check}
            color="#6EE7B7"
            progress={72}
          />
          <StatCard
            label="Focus time"
            value="4.5"
            unit="hours"
            change="+8.4%"
            icon={Clock3}
            color="#A78BFA"
            progress={64}
          />
          <StatCard
            label="Current streak"
            value="7"
            unit="days"
            change="+2 days"
            icon={Flame}
            color="#FBBF77"
            progress={78}
          />
          <StatCard
            label="Goals achieved"
            value="8"
            unit="of 10"
            change="+1 this week"
            icon={Target}
            color="#60A5FA"
            progress={80}
          />
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
          <ProductivityChart />
          <DailyFocus />
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,1fr)]">
          <TodayTasks />
          <UpcomingSchedule />
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-[var(--primary)]/15 bg-gradient-to-br from-[#242036] via-[var(--surface)] to-[var(--surface)] p-5 sm:p-7">
          <div className="pointer-events-none absolute -right-12 -top-20 size-56 rounded-full bg-[var(--primary)]/[0.08] blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)]">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-base font-semibold">
                  Small steps. Meaningful progress.
                </h2>
                <p className="mt-1 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
                  Choose your most important task, give it your attention, and
                  let the rest of the day follow.
                </p>
              </div>
            </div>
            <Link
              href="/tasks"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]"
            >
              Plan your day <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
