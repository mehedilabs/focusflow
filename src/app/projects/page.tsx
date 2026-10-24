"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Circle,
  FolderKanban,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type BoardStatus = "To do" | "In progress" | "Done";

type BoardTask = {
  id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  status: BoardStatus;
};

type Project = {
  id: string;
  name: string;
  description: string;
  color: string;
  deadline: string;
  tasks: BoardTask[];
};

const initialProjects: Project[] = [
  {
    id: "p1",
    name: "FocusFlow",
    description: "A calm, focused space to organize meaningful work.",
    color: "#A78BFA",
    deadline: "",
    tasks: [
      {
        id: "b1",
        title: "Plan application structure",
        priority: "High",
        status: "Done",
      },
      {
        id: "b2",
        title: "Build dashboard UI",
        priority: "High",
        status: "In progress",
      },
      {
        id: "b3",
        title: "Implement task management",
        priority: "High",
        status: "In progress",
      },
      {
        id: "b4",
        title: "Add project board",
        priority: "Medium",
        status: "To do",
      },
      {
        id: "b5",
        title: "Build insights page",
        priority: "Low",
        status: "To do",
      },
    ],
  },
  {
    id: "p2",
    name: "Portfolio Website",
    description: "Present selected work, skills, and developer projects.",
    color: "#60A5FA",
    deadline: "",
    tasks: [
      {
        id: "b6",
        title: "Review portfolio content",
        priority: "Medium",
        status: "Done",
      },
      {
        id: "b7",
        title: "Improve mobile layout",
        priority: "High",
        status: "To do",
      },
    ],
  },
  {
    id: "p3",
    name: "Personal Learning",
    description: "Build a consistent habit of learning and practice.",
    color: "#6EE7B7",
    deadline: "",
    tasks: [
      {
        id: "b8",
        title: "Practice TypeScript",
        priority: "High",
        status: "In progress",
      },
      {
        id: "b9",
        title: "Review weekly progress",
        priority: "Low",
        status: "To do",
      },
      {
        id: "b10",
        title: "Read documentation",
        priority: "Medium",
        status: "Done",
      },
    ],
  },
];

const boardStatuses: BoardStatus[] = ["To do", "In progress", "Done"];

const priorityClass = {
  Low: "text-emerald-300 bg-emerald-400/10",
  Medium: "text-amber-200 bg-amber-300/10",
  High: "text-rose-300 bg-rose-400/10",
};

const emptyProject = {
  name: "",
  description: "",
  color: "#A78BFA",
  deadline: "",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [activeProjectId, setActiveProjectId] = useState("p1");
  const [search, setSearch] = useState("");
  const [projectModal, setProjectModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [taskModal, setTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] =
    useState<BoardTask["priority"]>("Medium");
  const [taskStatus, setTaskStatus] = useState<BoardStatus>("To do");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? projects[0];

  const visibleProjects = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return projects;
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(normalized) ||
        project.description.toLowerCase().includes(normalized),
    );
  }, [projects, search]);

  function openNewProject() {
    setEditingProjectId(null);
    setProjectForm(emptyProject);
    setFormError("");
    setProjectModal(true);
  }

  function openEditProject(project: Project) {
    setEditingProjectId(project.id);
    setProjectForm({
      name: project.name,
      description: project.description,
      color: project.color,
      deadline: project.deadline,
    });
    setFormError("");
    setProjectModal(true);
  }

  function saveProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = projectForm.name.trim();

    if (!name) {
      setFormError("Enter a project name.");
      return;
    }

    if (editingProjectId) {
      setProjects((current) =>
        current.map((project) =>
          project.id === editingProjectId
            ? { ...project, ...projectForm, name }
            : project,
        ),
      );
    } else {
      const id = crypto.randomUUID();
      setProjects((current) => [
        ...current,
        { ...projectForm, name, id, tasks: [] },
      ]);
      setActiveProjectId(id);
    }

    setProjectModal(false);
    setFormError("");
  }

  function deleteProject(id: string) {
    const remaining = projects.filter((project) => project.id !== id);
    setProjects(remaining);
    if (activeProjectId === id) {
      setActiveProjectId(remaining[0]?.id ?? "");
    }
    setDeleteProjectId(null);
  }

  function openNewTask(status: BoardStatus = "To do") {
    setEditingTaskId(null);
    setTaskTitle("");
    setTaskPriority("Medium");
    setTaskStatus(status);
    setFormError("");
    setTaskModal(true);
  }

  function openEditTask(task: BoardTask) {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskPriority(task.priority);
    setTaskStatus(task.status);
    setFormError("");
    setTaskModal(true);
  }

  function saveBoardTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = taskTitle.trim();

    if (!title || !activeProject) {
      setFormError("Enter a task title.");
      return;
    }

    setProjects((current) =>
      current.map((project) => {
        if (project.id !== activeProject.id) return project;

        if (editingTaskId) {
          return {
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === editingTaskId
                ? { ...task, title, priority: taskPriority, status: taskStatus }
                : task,
            ),
          };
        }

        return {
          ...project,
          tasks: [
            ...project.tasks,
            {
              id: crypto.randomUUID(),
              title,
              priority: taskPriority,
              status: taskStatus,
            },
          ],
        };
      }),
    );

    setTaskModal(false);
    setFormError("");
  }

  function moveTask(taskId: string, status: BoardStatus) {
    if (!activeProject) return;

    setProjects((current) =>
      current.map((project) =>
        project.id !== activeProject.id
          ? project
          : {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, status } : task,
              ),
            },
      ),
    );
  }

  function deleteBoardTask(taskId: string) {
    if (!activeProject) return;

    setProjects((current) =>
      current.map((project) =>
        project.id !== activeProject.id
          ? project
          : {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            },
      ),
    );
    setDeleteTaskId(null);
  }

  const totalTasks = projects.reduce(
    (sum, project) => sum + project.tasks.length,
    0,
  );
  const completedTasks = projects.reduce(
    (sum, project) =>
      sum + project.tasks.filter((task) => task.status === "Done").length,
    0,
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-[1500px] space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs text-[var(--muted)]">
              Workspace / Projects
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Projects
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Bring related tasks together and make progress visible.
            </p>
          </div>
          <button
            type="button"
            onClick={openNewProject}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
          >
            <Plus size={17} /> New project
          </button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total projects",
              value: projects.length,
              color: "#A78BFA",
            },
            { label: "Total board tasks", value: totalTasks, color: "#60A5FA" },
            {
              label: "Tasks completed",
              value: completedTasks,
              color: "#6EE7B7",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <p className="text-sm text-[var(--muted)]">{stat.label}</p>
              <p
                className="mt-3 text-3xl font-semibold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Your projects</h2>
              <span className="text-xs text-[var(--muted)]">
                {projects.length}
              </span>
            </div>

            <label className="mb-4 flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2.5">
              <Search size={15} className="text-[var(--muted)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find a project"
                aria-label="Search projects"
                className="w-full min-w-0 bg-transparent text-xs outline-none placeholder:text-[var(--muted)]"
              />
            </label>

            <div className="space-y-1">
              {visibleProjects.map((project) => {
                const isActive = project.id === activeProjectId;
                const done = project.tasks.filter(
                  (task) => task.status === "Done",
                ).length;
                const progress = project.tasks.length
                  ? Math.round((done / project.tasks.length) * 100)
                  : 0;

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setActiveProjectId(project.id)}
                    className={`w-full rounded-xl p-3 text-left transition-colors ${
                      isActive
                        ? "bg-[var(--surface-hover)]"
                        : "hover:bg-white/[0.025]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${project.color}18`,
                          color: project.color,
                        }}
                      >
                        <FolderKanban size={17} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {project.name}
                        </p>
                        <p className="mt-1 text-[11px] text-[var(--muted)]">
                          {project.tasks.length} tasks
                        </p>
                      </div>
                      {isActive && (
                        <span className="mt-2 size-1.5 rounded-full bg-[var(--primary)]" />
                      )}
                    </div>
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: project.color,
                        }}
                      />
                    </div>
                    <p className="mt-1.5 text-right text-[10px] text-[var(--muted)]">
                      {progress}% complete
                    </p>
                  </button>
                );
              })}

              {visibleProjects.length === 0 && (
                <p className="px-3 py-6 text-center text-xs text-[var(--muted)]">
                  No matching projects.
                </p>
              )}
            </div>
          </aside>

          {activeProject ? (
            <div className="min-w-0 space-y-5">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${activeProject.color}18`,
                        color: activeProject.color,
                      }}
                    >
                      <FolderKanban size={20} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="break-words text-lg font-semibold">
                        {activeProject.name}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                        {activeProject.description ||
                          "No description added yet."}
                      </p>
                      {activeProject.deadline && (
                        <p className="mt-3 flex items-center gap-2 text-xs text-[var(--muted)]">
                          <CalendarDays size={14} /> Due{" "}
                          {activeProject.deadline}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => openEditProject(activeProject)}
                      aria-label="Edit project"
                      className="rounded-xl border border-[var(--border)] p-2.5 text-[var(--muted)] hover:bg-white/[0.04] hover:text-[var(--foreground)]"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteProjectId(activeProject.id)}
                      aria-label="Delete project"
                      className="rounded-xl border border-[var(--border)] p-2.5 text-[var(--muted)] hover:bg-rose-400/10 hover:text-rose-300"
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openNewTask()}
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-3 py-2.5 text-xs font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
                    >
                      <Plus size={15} /> Add task
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {boardStatuses.map((status) => {
                  const columnTasks = activeProject.tasks.filter(
                    (task) => task.status === status,
                  );

                  return (
                    <section
                      key={status}
                      className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3"
                    >
                      <div className="mb-3 flex items-center justify-between gap-2 px-1 pt-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={`size-2 rounded-full ${
                              status === "Done"
                                ? "bg-emerald-400"
                                : status === "In progress"
                                  ? "bg-blue-400"
                                  : "bg-[var(--muted)]"
                            }`}
                          />
                          <h3 className="truncate text-xs font-semibold">
                            {status}
                          </h3>
                          <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-[var(--muted)]">
                            {columnTasks.length}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => openNewTask(status)}
                          aria-label={`Add task to ${status}`}
                          className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-white/[0.05] hover:text-[var(--foreground)]"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {columnTasks.map((task) => (
                          <article
                            key={task.id}
                            className="rounded-xl border border-[var(--border)] bg-[#1d1e2a] p-3.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium leading-relaxed">
                                {task.title}
                              </p>
                              <button
                                type="button"
                                aria-label={`Edit ${task.title}`}
                                onClick={() => openEditTask(task)}
                                className="shrink-0 rounded-md p-1 text-[var(--muted)] hover:bg-white/[0.06] hover:text-[var(--foreground)]"
                              >
                                <MoreHorizontal size={16} />
                              </button>
                            </div>

                            <span
                              className={`mt-3 inline-flex rounded-md px-2 py-1 text-[10px] ${priorityClass[task.priority]}`}
                            >
                              {task.priority} priority
                            </span>

                            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-3">
                              <button
                                type="button"
                                onClick={() => openEditTask(task)}
                                className="flex items-center gap-1 text-[10px] text-[var(--muted)] hover:text-[var(--foreground)]"
                              >
                                <Pencil size={12} /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTaskId(task.id)}
                                className="flex items-center gap-1 text-[10px] text-[var(--muted)] hover:text-rose-300"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                              <label className="ml-auto flex max-w-full items-center gap-1">
                                <span className="sr-only">Move task</span>
                                <select
                                  aria-label={`Move ${task.title}`}
                                  value={task.status}
                                  onChange={(event) =>
                                    moveTask(
                                      task.id,
                                      event.target.value as BoardStatus,
                                    )
                                  }
                                  className="max-w-[105px] rounded-md border border-[var(--border)] bg-[#191a25] px-1.5 py-1 text-[10px] text-[var(--muted)] outline-none focus:border-[var(--primary)]"
                                >
                                  {boardStatuses.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>
                          </article>
                        ))}

                        {columnTasks.length === 0 && (
                          <div className="rounded-xl border border-dashed border-[var(--border)] px-3 py-8 text-center">
                            <Circle
                              size={17}
                              className="mx-auto text-[var(--muted)]"
                            />
                            <p className="mt-2 text-[11px] text-[var(--muted)]">
                              No tasks here yet
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => openNewTask(status)}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs text-[var(--muted)] hover:bg-white/[0.035] hover:text-[var(--foreground)]"
                      >
                        <Plus size={14} /> Add task
                      </button>
                    </section>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] p-6 text-center">
              <FolderKanban size={28} className="text-[var(--muted)]" />
              <h2 className="mt-4 font-semibold">Create your first project</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Keep related tasks together in one workspace.
              </p>
              <button
                type="button"
                onClick={openNewProject}
                className="mt-4 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)]"
              >
                New project
              </button>
            </div>
          )}
        </section>

        {projectModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
            <form
              onSubmit={saveProject}
              className="my-auto w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[#191a25] p-5 shadow-2xl sm:p-6"
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {editingProjectId ? "Edit project" : "Create project"}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Give this project a clear name and purpose.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setProjectModal(false)}
                  className="rounded-lg p-2 text-[var(--muted)] hover:bg-white/[0.05]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium">
                    Project name *
                  </span>
                  <input
                    required
                    maxLength={80}
                    autoFocus
                    value={projectForm.name}
                    onChange={(event) =>
                      setProjectForm({
                        ...projectForm,
                        name: event.target.value,
                      })
                    }
                    placeholder="e.g. Portfolio redesign"
                    className="w-full rounded-xl border border-[var(--border)] bg-black/10 px-3 py-3 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-medium">
                    Description
                  </span>
                  <textarea
                    rows={3}
                    maxLength={300}
                    value={projectForm.description}
                    onChange={(event) =>
                      setProjectForm({
                        ...projectForm,
                        description: event.target.value,
                      })
                    }
                    placeholder="What is this project about?"
                    className="w-full resize-y rounded-xl border border-[var(--border)] bg-black/10 px-3 py-3 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-medium">
                      Project color
                    </span>
                    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-black/10 px-3 py-2">
                      <input
                        type="color"
                        value={projectForm.color}
                        onChange={(event) =>
                          setProjectForm({
                            ...projectForm,
                            color: event.target.value,
                          })
                        }
                        aria-label="Project color"
                        className="size-8 cursor-pointer rounded-md border-0 bg-transparent"
                      />
                      <span className="text-xs text-[var(--muted)]">
                        {projectForm.color}
                      </span>
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-medium">
                      Deadline
                    </span>
                    <input
                      type="date"
                      value={projectForm.deadline}
                      onChange={(event) =>
                        setProjectForm({
                          ...projectForm,
                          deadline: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-[var(--border)] bg-black/10 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                    />
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
                  onClick={() => setProjectModal(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)]"
                >
                  {editingProjectId ? "Save changes" : "Create project"}
                </button>
              </div>
            </form>
          </div>
        )}

        {taskModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <form
              onSubmit={saveBoardTask}
              className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[#191a25] p-5 shadow-2xl sm:p-6"
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {editingTaskId ? "Edit board task" : "Add board task"}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {activeProject?.name}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setTaskModal(false)}
                  className="rounded-lg p-2 text-[var(--muted)] hover:bg-white/[0.05]"
                >
                  <X size={18} />
                </button>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-medium">
                  Task title *
                </span>
                <input
                  required
                  autoFocus
                  maxLength={120}
                  value={taskTitle}
                  onChange={(event) => setTaskTitle(event.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full rounded-xl border border-[var(--border)] bg-black/10 px-3 py-3 text-sm outline-none focus:border-[var(--primary)]"
                />
              </label>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium">
                    Priority
                  </span>
                  <select
                    value={taskPriority}
                    onChange={(event) =>
                      setTaskPriority(
                        event.target.value as BoardTask["priority"],
                      )
                    }
                    className="w-full rounded-xl border border-[var(--border)] bg-[#191a25] px-3 py-2.5 text-sm outline-none"
                  >
                    {(["Low", "Medium", "High"] as const).map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-medium">Status</span>
                  <select
                    value={taskStatus}
                    onChange={(event) =>
                      setTaskStatus(event.target.value as BoardStatus)
                    }
                    className="w-full rounded-xl border border-[var(--border)] bg-[#191a25] px-3 py-2.5 text-sm outline-none"
                  >
                    {boardStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {formError && (
                <p role="alert" className="mt-3 text-xs text-rose-300">
                  {formError}
                </p>
              )}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTaskModal(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)]"
                >
                  {editingTaskId ? "Save changes" : "Add task"}
                </button>
              </div>
            </form>
          </div>
        )}

        {(deleteProjectId || deleteTaskId) && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div
              role="alertdialog"
              aria-modal="true"
              className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[#191a25] p-5 shadow-2xl"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-rose-400/10 text-rose-300">
                <Trash2 size={19} />
              </div>
              <h2 className="mt-4 font-semibold">
                Delete this {deleteProjectId ? "project" : "task"}?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteProjectId(null);
                    setDeleteTaskId(null);
                  }}
                  className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    deleteProjectId
                      ? deleteProject(deleteProjectId)
                      : deleteBoardTask(deleteTaskId!)
                  }
                  className="rounded-xl bg-rose-400 px-4 py-2.5 text-sm font-semibold text-[#201018]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
