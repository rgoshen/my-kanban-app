import { Task } from "@/types/task";
import { DroppableColumn } from "./droppable-column";
import { useMemo, memo } from "react";

interface KanbanColumnsProps {
  tasks: Task[];
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
}

const KanbanColumns = memo(function KanbanColumns({ tasks, onUpdateTask }: KanbanColumnsProps) {
  const todoTasks = useMemo(() => tasks.filter((t) => t.status === "todo"), [tasks]);
  const inProgressTasks = useMemo(() => tasks.filter((t) => t.status === "inprogress"), [tasks]);
  const doneTasks = useMemo(() => tasks.filter((t) => t.status === "done"), [tasks]);

  // Guard against undefined onUpdateTask
  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    if (onUpdateTask) {
      onUpdateTask(taskId, updates);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <DroppableColumn id="todo" title="To Do" tasks={todoTasks} onUpdateTask={handleUpdateTask} />
      <DroppableColumn
        id="inprogress"
        title="In Progress"
        tasks={inProgressTasks}
        onUpdateTask={handleUpdateTask}
      />
      <DroppableColumn id="done" title="Done" tasks={doneTasks} onUpdateTask={handleUpdateTask} />
    </div>
  );
});

export { KanbanColumns };
