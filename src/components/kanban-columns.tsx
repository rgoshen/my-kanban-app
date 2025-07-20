import { Task } from "@/types/task";
import { DroppableColumn } from "./droppable-column";

interface KanbanColumnsProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export function KanbanColumns({ tasks, onUpdateTask }: KanbanColumnsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <DroppableColumn
        id="todo"
        title="To Do"
        tasks={tasks.filter((t) => t.status === "todo")}
        onUpdateTask={onUpdateTask}
      />
      <DroppableColumn
        id="inprogress"
        title="In Progress"
        tasks={tasks.filter((t) => t.status === "inprogress")}
        onUpdateTask={onUpdateTask}
      />
      <DroppableColumn
        id="done"
        title="Done"
        tasks={tasks.filter((t) => t.status === "done")}
        onUpdateTask={onUpdateTask}
      />
    </div>
  );
}
