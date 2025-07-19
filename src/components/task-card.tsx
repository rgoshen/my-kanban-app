"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./kanban-board";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isBeingDragged,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isDone = task.status === 'done';

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700 ${
        isBeingDragged || isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm font-medium text-gray-900 dark:text-white ${
          isDone ? 'line-through opacity-60' : ''
        }`}>
          {task.title}
        </CardTitle>
      </CardHeader>
      {task.description && (
        <CardContent className="pt-0">
          <p className={`text-sm text-gray-600 dark:text-gray-400 ${
            isDone ? 'line-through opacity-60' : ''
          }`}>
            {task.description}
          </p>
        </CardContent>
      )}
    </Card>
  );
} 