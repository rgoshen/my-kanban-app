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
import { DroppableColumn } from "./droppable-column";
import { TaskCard } from "./task-card";
import { Task } from "@/types/task";
import { sampleTasks } from "@/data/sample-tasks";
import { useState, useEffect } from "react";

export default function KanbanBoard() {
  // Initialize with sample data from separate file
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <DroppableColumn
                id="todo"
                title="To Do"
                tasks={tasks.filter((t) => t.status === "todo")}
                onUpdateTask={handleUpdateTask}
              />
              <DroppableColumn
                id="inprogress"
                title="In Progress"
                tasks={tasks.filter((t) => t.status === "inprogress")}
                onUpdateTask={handleUpdateTask}
              />
              <DroppableColumn
                id="done"
                title="Done"
                tasks={tasks.filter((t) => t.status === "done")}
                onUpdateTask={handleUpdateTask}
              />
            </div>

            <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
          </DndContext>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <DroppableColumn
              id="todo"
              title="To Do"
              tasks={tasks.filter((t) => t.status === "todo")}
              onUpdateTask={handleUpdateTask}
            />
            <DroppableColumn
              id="inprogress"
              title="In Progress"
              tasks={tasks.filter((t) => t.status === "inprogress")}
              onUpdateTask={handleUpdateTask}
            />
            <DroppableColumn
              id="done"
              title="Done"
              tasks={tasks.filter((t) => t.status === "done")}
              onUpdateTask={handleUpdateTask}
            />
          </div>
        )}
      </div>
    </div>
  );
}
