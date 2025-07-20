import { Task } from "@/types/task";
import { TaskCard } from "./task-card";

export function KanbanColumn({ title, tasks }: { title: string; tasks: Task[] }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
