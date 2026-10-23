"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownWideNarrow,
  CalendarDays,
  Check,
  CheckCheck,
  Circle,
  Clock3,
  ListFilter,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type Priority = "Low" | "Medium" | "High";
type TaskStatus = "Todo" | "In Progress" | "Completed";

type Task = {
  id: string;
  title: string;
  description: string;
  project: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
};

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Review project requirements",
    description: "Go through the project scope and identify key deliverables.",
    project: "FocusFlow",
    priority: "High",
    status: "Completed",
    dueDate: "",
  },
  {
    id: "task-2",
    title: "Build dashboard layout",
    description: "Create the main dashboard and responsive summary cards.",
    project: "FocusFlow",
    priority: "High",
    status: "In Progress",
    dueDate: "",
  },
  {
    id: "task-3",
    title: "Design task management UI",
    description: "Implement task creation, editing, and filtering.",
    project: "FocusFlow",
    priority: "High",
    status: "Todo",
    dueDate: "",
  },
  {
    id: "task-4",
    title: "Read for 20 minutes",
    description: "Make time for personal learning.",
    project: "Personal",
    priority: "Medium",
    status: "Todo",
    dueDate: "",
  },
  {
    id: "task-5",
    title: "Plan the week",
    description: "Review priorities and decide what matters most.",
    project: "Personal",
    priority: "Low",
    status: "Todo",
    dueDate: "",
  },
];

const priorities: Priority[] = ["Low", "Medium", "High"];
const statuses: TaskStatus[] = ["Todo", "In Progress", "Completed"];

const emptyForm = {
  title: "",
  description: "",
  project: "FocusFlow",
  priority: "Medium" as Priority,
  status: "Todo" as TaskStatus,
  dueDate: "",
};

const priorityStyles: Record<Priority, string> = {
  Low: "bg-emerald-400/10 text-emerald-300",
  Medium: "bg-amber-300/10 text-amber-200",
  High: "bg-rose-400/10 text-rose-300",
};

const statusStyles: Record<TaskStatus, string> = {
  Todo: "bg-white/[0.06] text-[var(--muted)]",
  "In Progress": "bg-blue-400/10 text-blue-300",
  Completed: "bg-emerald-400/10 text-emerald-300",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const completedCount = tasks.filter(
    (task) => task.status === "Completed",
  ).length;
  const activeCount = tasks.filter(
    (task) => task.status !== "Completed",
  ).length;
  const highPriorityCount = tasks.filter(
    (task) => task.priority === "High" && task.status !== "Completed",
  ).length;

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesQuery =
        !normalizedQuery ||
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.description.toLowerCase().includes(normalizedQuery) ||
        task.project.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [tasks, query, statusFilter, priorityFilter]);

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      project: task.project,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
    });
    setFormError("");
    setModalOpen(true);
  }

  function saveTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setFormError("Please enter a task title.");
      return;
    }

    if (editingId) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingId ? { ...task, ...form, title } : task,
        ),
      );
    } else {
      const newTask: Task = {
        ...form,
        title,
        id: crypto.randomUUID(),
      };
      setTasks((current) => [newTask, ...current]);
    }

    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  function toggleCompleted(task: Task) {
    setTasks((current) =>
      current.map((item) =>
        item.id === task.id
          ? {
              ...item,
              status: item.status === "Completed" ? "Todo" : "Completed",
            }
          : item,
      ),
    );
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
    setDeleteId(null);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs text-[var(--muted)]">
              Workspace / Tasks
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              My Tasks
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Turn your priorities into progress, one task at a time.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
          >
            <Plus size={17} /> Create task
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total tasks",
              value: tasks.length,
              icon: ListFilter,
              color: "#A78BFA",
            },
            {
              label: "In progress / to do",
              value: activeCount,
              icon: Clock3,
              color: "#60A5FA",
            },
            {
              label: "Completed",
              value: completedCount,
              icon: CheckCheck,
              color: "#6EE7B7",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-10 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${stat.color}18`,
                      color: stat.color,
                    }}
                  >
                    <Icon size={19} />
                  </div>
                  <p className="text-sm text-[var(--muted)]">{stat.label}</p>
                </div>
                <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
              </div>
            );
          })}
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">All tasks</h2>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {filteredTasks.length} task
                {filteredTasks.length === 1 ? "" : "s"} found
                {highPriorityCount > 0
                  ? ` · ${highPriorityCount} high priority remaining`
                  : ""}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <label className="flex min-w-0 items-center gap-2 rounded-xl border border-[var(--border)] bg-black/[0.08] px-3 py-2.5 sm:min-w-[210px]">
                <Search size={16} className="shrink-0 text-[var(--muted)]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search tasks..."
                  aria-label="Search tasks"
                  className="w-full min-w-0 bg-transparent text-xs outline-none placeholder:text-[var(--muted)]"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <X size={14} />
                  </button>
                )}
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2.5">
                <SlidersHorizontal size={15} className="text-[var(--muted)]" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter by status"
                  className="max-w-full bg-transparent text-xs outline-none"
                >
                  <option className="bg-[#191a25]" value="All">
                    All statuses
                  </option>
                  {statuses.map((status) => (
                    <option
                      className="bg-[#191a25]"
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2.5">
                <ArrowDownWideNarrow
                  size={15}
                  className="text-[var(--muted)]"
                />
                <select
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value)}
                  aria-label="Filter by priority"
                  className="max-w-full bg-transparent text-xs outline-none"
                >
                  <option className="bg-[#191a25]" value="All">
                    All priorities
                  </option>
                  {priorities.map((priority) => (
                    <option
                      className="bg-[#191a25]"
                      key={priority}
                      value={priority}
                    >
                      {priority}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {filteredTasks.map((task) => (
              <article
                key={task.id}
                className="flex flex-col gap-3 p-4 transition-colors hover:bg-white/[0.015] sm:flex-row sm:items-center sm:gap-4 sm:p-5"
              >
                <button
                  type="button"
                  onClick={() => toggleCompleted(task)}
                  aria-label={
                    task.status === "Completed"
                      ? `Reopen ${task.title}`
                      : `Complete ${task.title}`
                  }
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    task.status === "Completed"
                      ? "border-emerald-400 bg-emerald-400 text-[#11121a]"
                      : "border-white/20 text-transparent hover:border-[var(--primary)]"
                  }`}
                >
                  {task.status === "Completed" ? (
                    <Check size={14} />
                  ) : (
                    <Circle size={16} />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      task.status === "Completed"
                        ? "text-[var(--muted)] line-through"
                        : "text-[var(--foreground)]"
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">
                      {task.description}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-white/[0.05] px-2 py-1 text-[10px] text-[var(--muted)]">
                      {task.project}
                    </span>
                    <span
                      className={`rounded-md px-2 py-1 text-[10px] ${priorityStyles[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`rounded-md px-2 py-1 text-[10px] ${statusStyles[task.status]}`}
                    >
                      {task.status}
                    </span>
                    {task.dueDate && (
                      <span className="flex items-center gap-1 text-[10px] text-[var(--muted)]">
                        <CalendarDays size={12} /> {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => openEditModal(task)}
                    aria-label={`Edit ${task.title}`}
                    className="rounded-lg p-2 text-[var(--muted)] hover:bg-white/[0.06] hover:text-[var(--foreground)]"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(task.id)}
                    aria-label={`Delete ${task.title}`}
                    className="rounded-lg p-2 text-[var(--muted)] hover:bg-rose-400/10 hover:text-rose-300"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}

            {filteredTasks.length === 0 && (
              <div className="flex flex-col items-center px-5 py-16 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--surface-elevated)] text-[var(--muted)]">
                  <Search size={21} />
                </div>
                <h3 className="mt-4 text-sm font-semibold">No tasks found</h3>
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-[var(--muted)]">
                  Try another search or change your filters to find a task.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setStatusFilter("All");
                    setPriorityFilter("All");
                  }}
                  className="mt-4 text-xs font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {modalOpen && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setModalOpen(false);
            }}
          >
            <form
              onSubmit={saveTask}
              className="my-auto w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[#191a25] p-5 shadow-2xl sm:p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">
                    {editingId ? "Edit task" : "Create a task"}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Keep it clear, specific, and actionable.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close form"
                  className="rounded-lg p-2 text-[var(--muted)] hover:bg-white/[0.06]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium">
                    Task title *
                  </span>
                  <input
                    autoFocus
                    required
                    maxLength={120}
                    value={form.title}
                    onChange={(event) =>
                      setForm({ ...form, title: event.target.value })
                    }
                    placeholder="What needs to be done?"
                    className="w-full rounded-xl border border-[var(--border)] bg-black/10 px-3 py-3 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-medium">
                    Description
                  </span>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={form.description}
                    onChange={(event) =>
                      setForm({ ...form, description: event.target.value })
                    }
                    placeholder="Add a few details..."
                    className="w-full resize-y rounded-xl border border-[var(--border)] bg-black/10 px-3 py-3 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-medium">
                      Project
                    </span>
                    <input
                      value={form.project}
                      maxLength={60}
                      onChange={(event) =>
                        setForm({ ...form, project: event.target.value })
                      }
                      placeholder="Project name"
                      className="w-full rounded-xl border border-[var(--border)] bg-black/10 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-medium">
                      Due date
                    </span>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(event) =>
                        setForm({ ...form, dueDate: event.target.value })
                      }
                      className="w-full rounded-xl border border-[var(--border)] bg-black/10 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-medium">
                      Priority
                    </span>
                    <select
                      value={form.priority}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          priority: event.target.value as Priority,
                        })
                      }
                      className="w-full rounded-xl border border-[var(--border)] bg-[#191a25] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-medium">
                      Status
                    </span>
                    <select
                      value={form.status}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          status: event.target.value as TaskStatus,
                        })
                      }
                      className="w-full rounded-xl border border-[var(--border)] bg-[#191a25] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {formError && (
                  <p role="alert" className="text-xs text-rose-300">
                    {formError}
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--muted)] hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
                >
                  {editingId ? "Save changes" : "Create task"}
                </button>
              </div>
            </form>
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-title"
              className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[#191a25] p-5 shadow-2xl"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-rose-400/10 text-rose-300">
                <Trash2 size={19} />
              </div>
              <h2 id="delete-title" className="mt-4 text-base font-semibold">
                Delete this task?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                This task will be removed from the current task list.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteTask(deleteId)}
                  className="rounded-xl bg-rose-400 px-4 py-2.5 text-sm font-semibold text-[#201018] hover:bg-rose-300"
                >
                  Delete task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
