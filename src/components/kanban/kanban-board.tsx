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
import { Button } from "@/components/ui/button";
import { Plus, Kanban } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import { TaskFormDialog, TaskFormData } from "./task-form-dialog";
import { KanbanColumns } from "./kanban-columns";
import { TaskCard } from "./task-card";
import { Task } from "@/types/task";
import { sampleTasks } from "@/data/sample-tasks";
import { useState } from "react";
import { useIsClient } from "@/hooks/use-is-client";
import { ThemeToggle } from "../layout/theme-toggle";
import { parseAssignees } from "@/lib/utils";

interface TaskFormSubmitData extends Omit<TaskFormData, "assignees"> {
  assignees: string[];
}

export default function KanbanBoard() {
  // Initialize with sample data from separate file
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const isClient = useIsClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleAddTask = (data: TaskFormSubmitData) => {
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        priority: data.priority,
        assignees: data.assignees || [], // Provide empty array as default
        status: "todo",
        dueDate: data.dueDate,
        startDate: new Date().toISOString().split("T")[0], // Set start date to today
      },
    ]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as "todo" | "inprogress" | "done";

    if (newStatus === "todo" || newStatus === "inprogress" || newStatus === "done") {
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)),
      );
    }
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)));
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/byte-bridge-logo.svg"
              alt="Kanban Board"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <h1 className="text-3xl font-bold text-foreground">My Kanban Board</h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Add Task Button */}
        <div className="mb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TaskFormDialog onSubmit={handleAddTask} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {isClient ? (
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <KanbanColumns tasks={tasks} onUpdateTask={handleUpdateTask} />
            <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
          </DndContext>
        ) : (
          <KanbanColumns tasks={tasks} onUpdateTask={handleUpdateTask} />
        )}
      </div>
    </div>
  );
}
