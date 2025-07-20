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
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TaskFormDialog, TaskFormData } from "./task-form-dialog";
import { KanbanColumns } from "./kanban-columns";
import { TaskCard } from "./task-card";
import { Task } from "@/types/task";
import { sampleTasks } from "@/data/sample-tasks";
import { useState } from "react";
import { useIsClient } from "@/hooks/use-is-client";

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

  const handleAddTask = (data: TaskFormData) => {
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        priority: data.priority,
        assignee: data.assignee,
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
        <h1 className="mb-8 text-3xl font-bold text-foreground">My Kanban Board</h1>

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
