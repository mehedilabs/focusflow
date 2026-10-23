"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  CircleHelp,
  Command,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Timer,
  X,
  FolderKanban,
  PanelLeftClose,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "My Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Planner", href: "/planner", icon: CalendarDays },
];

const tools = [
  { label: "Focus Timer", href: "/focus", icon: Timer },
  { label: "Insights", href: "/insights", icon: BarChart3 },
];

function NavigationLink({
  item,
  active,
  onNavigate,
}: {
  item: (typeof navigation)[number] | (typeof tools)[number];
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors ${
        active
          ? "bg-[var(--primary)]/10 font-medium text-[var(--primary)]"
          : "text-[var(--muted)] hover:bg-white/[0.04] hover:text-[var(--foreground)]"
      }`}
    >
      <Icon size={17} strokeWidth={1.8} />
      <span className="flex-1">{item.label}</span>
      {active && <span className="size-1.5 rounded-full bg-[var(--primary)]" />}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex h-[76px] items-center gap-3 border-b border-[var(--border)] px-6"
      >
        <div className="flex size-9 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]">
          <Command size={20} strokeWidth={2.3} />
        </div>
        <div>
          <p className="text-[15px] font-semibold tracking-tight">FocusFlow</p>
          <p className="text-[10px] tracking-[0.14em] text-[var(--muted)]">
            YOUR SPACE TO FOCUS
          </p>
        </div>
      </Link>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Workspace
        </p>

        <nav aria-label="Workspace navigation" className="space-y-1">
          {navigation.map((item) => (
            <NavigationLink
              key={item.href}
              item={item}
              active={pathname === item.href}
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Productivity
        </p>

        <nav aria-label="Productivity navigation" className="space-y-1">
          {tools.map((item) => (
            <NavigationLink
              key={item.href}
              item={item}
              active={pathname === item.href}
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <Sparkles size={18} />
          </div>
          <p className="text-sm font-medium">Make time for focus</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
            Small, consistent steps lead to meaningful progress.
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--border)] p-4">
        <Link
          href="/settings"
          onClick={onNavigate}
          className={`mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors hover:bg-white/[0.04] ${
            pathname === "/settings"
              ? "text-[var(--primary)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <Settings2 size={17} />
          Settings
        </Link>

        <div className="flex items-center gap-3 rounded-xl bg-white/[0.025] p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#37304d] text-sm font-semibold text-[#d9ccff]">
            M
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">My Workspace</p>
            <p className="mt-0.5 truncate text-[10px] text-[var(--muted)]">
              Personal account
            </p>
          </div>
          <ChevronDown size={15} className="text-[var(--muted)]" />
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const currentPage = [...navigation, ...tools].find(
    (item) => item.href === pathname,
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] border-r border-[var(--border)] bg-[#14151e] lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] border-r border-[var(--border)] bg-[#14151e] shadow-2xl">
            <div className="absolute right-3 top-5 z-10">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-[var(--muted)] hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="min-h-screen lg:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between gap-4 border-b border-[var(--border)] bg-[rgba(17,18,26,0.88)] px-4 backdrop-blur-xl sm:px-7 xl:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-[var(--muted)] hover:bg-white/5 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {currentPage?.label ?? "Settings"}
              </p>
              <p className="hidden text-[11px] text-[var(--muted)] sm:block">
                Your personal productivity space
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 md:flex">
              <Search size={15} className="text-[var(--muted)]" />
              <span className="text-xs text-[var(--muted)]">Search</span>
              <kbd className="ml-5 rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]">
                Ctrl K
              </kbd>
            </div>

            <button
              type="button"
              aria-label="Search"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("focusflow:search"));
              }}
              className="rounded-xl border border-[var(--border)] p-2.5 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)] md:hidden"
            >
              <Search size={17} />
            </button>

            <Link
              href="/tasks"
              aria-label="Create a task"
              className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-3 py-2.5 text-xs font-semibold text-[var(--primary-foreground)] transition-colors hover:bg-[var(--primary-hover)] sm:px-4"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New task</span>
            </Link>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-7 sm:py-8 xl:px-9">{children}</main>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-5 text-[11px] text-[var(--muted)] sm:px-7 xl:px-9">
          <span>FocusFlow · Make space for what matters.</span>
          <Link
            href="/settings"
            className="inline-flex items-center gap-1.5 hover:text-[var(--foreground)]"
          >
            <CircleHelp size={13} />
            Workspace settings
          </Link>
        </footer>
      </div>
    </div>
  );
}
