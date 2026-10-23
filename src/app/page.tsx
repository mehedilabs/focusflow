import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export default function HomePage() {
  return (
    <AppShell>
      <section className="mx-auto flex min-h-[65vh] max-w-3xl flex-col justify-center">
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)]">
          <Sparkles size={25} />
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
          Your personal workspace
        </p>

        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Make space for
          <br />
          <span className="text-[var(--primary)]">what matters.</span>
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          FocusFlow brings your tasks, projects, planning, and focus sessions
          together in one thoughtful workspace.
        </p>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <CheckCircle2 size={21} className="shrink-0 text-[var(--success)]" />
          <div>
            <p className="text-sm font-medium">Your workspace foundation</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Design system and responsive application layout are in place.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-[var(--muted)]">
          <ArrowRight size={15} />
          <span>Next in sequence: Dashboard</span>
        </div>
      </section>
    </AppShell>
  );
}
