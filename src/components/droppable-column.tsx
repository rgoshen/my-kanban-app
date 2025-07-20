"use client";

import { useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

import { Task } from "./kanban-board";
import { TaskCard } from "./task-card";

interface DroppableColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  className?: string;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
}

export function DroppableColumn({
  id,
  title,
  tasks,
  className = "",
  onUpdateTask,
}: DroppableColumnProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { setNodeRef } = useDroppable({ id });

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      case "in-progress":
        return "bg-blue-200 text-blue-700 dark:bg-blue-800 dark:text-blue-300";
      case "done":
        return "bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-300";
      default:
        return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div
      ref={isClient ? setNodeRef : undefined}
      className={`flex flex-col space-y-4 rounded-lg p-4 flex-1 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h2>
        <span className={`rounded-full px-2 py-1 text-sm font-medium ${getBadgeColor(id)}`}>
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto min-h-[100px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onUpdateTask={onUpdateTask} />
        ))}
        {tasks.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400 flex-1 flex items-center justify-center">
            No tasks yet
          </div>
        )}
      </div>
    </div>
  );
}
