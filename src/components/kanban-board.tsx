"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TaskFormDialog, TaskFormData } from "./task-form-dialog";
import { KanbanColumn } from "./kanban-column";
import { Task } from "@/types/task";
import { sampleTasks } from "@/data/sample-tasks";
import { useState } from "react";

export default function KanbanBoard() {
  // Initialize with sample data from separate file
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);

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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <KanbanColumn title="To Do" tasks={tasks.filter((t) => t.status === "todo")} />
          <KanbanColumn
            title="In Progress"
            tasks={tasks.filter((t) => t.status === "inprogress")}
          />
          <KanbanColumn title="Done" tasks={tasks.filter((t) => t.status === "done")} />
        </div>
      </div>
    </div>
  );
}
