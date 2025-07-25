import { Task } from "@/types/task";
import { DroppableColumn } from "./droppable-column";
import { useMemo, memo } from "react";

interface KanbanColumnsProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

const KanbanColumns = memo(function KanbanColumns({ tasks, onUpdateTask }: KanbanColumnsProps) {
  const todoTasks = useMemo(() => tasks.filter((t) => t.status === "todo"), [tasks]);
  const inProgressTasks = useMemo(() => tasks.filter((t) => t.status === "inprogress"), [tasks]);
  const doneTasks = useMemo(() => tasks.filter((t) => t.status === "done"), [tasks]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <DroppableColumn id="todo" title="To Do" tasks={todoTasks} onUpdateTask={onUpdateTask} />
      <DroppableColumn
        id="inprogress"
        title="In Progress"
        tasks={inProgressTasks}
        onUpdateTask={onUpdateTask}
      />
      <DroppableColumn id="done" title="Done" tasks={doneTasks} onUpdateTask={onUpdateTask} />
    </div>
  );
});

export { KanbanColumns };
