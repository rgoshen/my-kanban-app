"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

import { DroppableColumn } from "./droppable-column";
import { TaskCard } from "./task-card";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  assignee?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  startDate?: string;
}

interface KanbanBoardProps {
  tasks?: Task[];
}

export function KanbanBoard({ tasks: initialTasks = [] }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(
    initialTasks.length > 0
      ? initialTasks
      : [
          {
            id: "1",
            title: "Design new landing page",
            description: "Create wireframes and mockups for the new landing page design",
            status: "todo",
            assignee: "Sarah Johnson",
            dueDate: "2024-02-15",
            priority: "high",
            startDate: "2024-02-01",
          },
          {
            id: "2",
            title: "Implement user authentication",
            description: "Add login and registration functionality with JWT tokens",
            status: "in-progress",
            assignee: "Mike Chen",
            dueDate: "2024-02-20",
            priority: "medium",
            startDate: "2024-02-05",
          },
          {
            id: "3",
            title: "Write API documentation",
            description: "Create comprehensive API documentation with examples",
            status: "done",
            assignee: "Emily Davis",
            dueDate: "2024-02-10",
            priority: "low",
            startDate: "2024-01-25",
          },
          {
            id: "4",
            title: "Fix mobile responsiveness",
            description: "Ensure the app works properly on all mobile devices",
            status: "todo",
            priority: "medium",
            dueDate: "2024-02-25",
          },
          {
            id: "5",
            title: "Database optimization",
            description: "Optimize database queries and add proper indexing",
            status: "in-progress",
            assignee: "Alex Thompson",
            priority: "high",
            dueDate: "2024-02-18",
            startDate: "2024-02-08",
          },
        ],
  );
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as "todo" | "in-progress" | "done";

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)),
    );
  }

  function handleUpdateTask(taskId: string, updates: Partial<Task>) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
          <ThemeToggle />
        </div>

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <DroppableColumn
              id="todo"
              title="To Do"
              tasks={todoTasks}
              className="bg-gray-100 dark:bg-gray-800"
              onUpdateTask={handleUpdateTask}
            />
            <DroppableColumn
              id="in-progress"
              title="In Progress"
              tasks={inProgressTasks}
              className="bg-blue-50 dark:bg-blue-900/20"
              onUpdateTask={handleUpdateTask}
            />
            <DroppableColumn
              id="done"
              title="Done"
              tasks={doneTasks}
              className="bg-green-50 dark:bg-green-900/20"
              onUpdateTask={handleUpdateTask}
            />
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} isDragging onUpdateTask={handleUpdateTask} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
