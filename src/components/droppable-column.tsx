"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

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
    <div className={`space-y-4 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h2>
        <span className={`rounded-full px-2 py-1 text-sm font-medium ${getBadgeColor(id)}`}>
          {tasks.length}
        </span>
      </div>
      <div ref={setNodeRef} className="space-y-3 min-h-[200px]">
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onUpdateTask={onUpdateTask} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400">
            No tasks yet
          </div>
        )}
      </div>
    </div>
  );
}
