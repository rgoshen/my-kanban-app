"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, Clock, User, AlertTriangle, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import { useIsClient } from "@/hooks/use-is-client";

import { EnhancedAvatar } from "@/components/ui/enhanced-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskCard({ task, onUpdateTask }: TaskCardProps) {
  const [isEditingAssignee, setIsEditingAssignee] = useState(false);
  const [assigneeInput, setAssigneeInput] = useState(task.assignee || "");
  const isClient = useIsClient();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isBeingDragged,
  } = useDraggable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  const isDone = task.status === "done";

  const priorityColors: Record<Task["priority"], string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const priorityBorderColors: Record<Task["priority"], string> = {
    low: "border-green-200 dark:border-green-700",
    medium: "border-yellow-200 dark:border-yellow-700",
    high: "border-red-200 dark:border-red-700",
  };

  const priorityIcons: Record<Task["priority"], string> = {
    low: "🟢",
    medium: "🟡",
    high: "🔴",
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleAssigneeSave = () => {
    if (onUpdateTask) {
      onUpdateTask(task.id, { assignee: assigneeInput });
    }
    setIsEditingAssignee(false);
  };

  const handleAssigneeCancel = () => {
    setAssigneeInput(task.assignee || "");
    setIsEditingAssignee(false);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Card
      ref={isClient ? setNodeRef : undefined}
      style={isClient ? style : undefined}
      {...(isClient ? attributes : { role: "button", tabIndex: 0 })}
      {...(isClient ? listeners : {})}
      className={`group cursor-grab transition-all shadow-md hover:shadow-lg dark:bg-gray-800 border ${
        isClient && isBeingDragged ? "opacity-0" : ""
      } ${isOverdue ? "border-2 border-red-300 dark:border-red-600" : priorityBorderColors[task.priority]}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className={`text-sm font-medium text-gray-900 dark:text-white line-clamp-2 ${
              isDone ? "line-through opacity-60" : ""
            }`}
          >
            {task.title}
          </CardTitle>
          <Badge
            variant="secondary"
            className={`text-xs ${priorityColors[task.priority]} border-0`}
          >
            <span className="mr-1">{priorityIcons[task.priority]}</span>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Description */}
        {task.description && (
          <p
            className={`text-xs text-gray-600 dark:text-gray-400 line-clamp-2 ${
              isDone ? "line-through opacity-60" : ""
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Assignee */}
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-gray-500" />
          {isEditingAssignee ? (
            <div className="flex items-center gap-1 flex-1">
              <Input
                value={assigneeInput}
                onChange={(e) => setAssigneeInput(e.target.value)}
                className="h-6 text-xs"
                placeholder="Enter assignee name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAssigneeSave();
                  if (e.key === "Escape") handleAssigneeCancel();
                }}
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={handleAssigneeSave}
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={handleAssigneeCancel}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              {task.assignee ? (
                <>
                  <EnhancedAvatar assigneeName={task.assignee} size="sm" className="h-5 w-5" />
                  <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                    {task.assignee}
                  </span>
                </>
              ) : (
                <span className="text-xs text-gray-500 italic">Unassigned</span>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditingAssignee(true)}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {task.startDate ? (
              <span>Started {formatDate(task.startDate)}</span>
            ) : (
              <span className="italic">No start date</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {task.dueDate ? (
              <span className={isOverdue ? "text-red-600 dark:text-red-400 font-medium" : ""}>
                Due {formatDate(task.dueDate)}
                {isOverdue && <AlertTriangle className="h-3 w-3 ml-1 inline" />}
              </span>
            ) : (
              <span className="italic">No due date</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
