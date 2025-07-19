import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
}

interface KanbanBoardProps {
  tasks?: Task[];
}

export function KanbanBoard({ tasks = [] }: KanbanBoardProps) {
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Kanban Board</h1>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* To Do Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">To Do</h2>
              <span className="rounded-full bg-gray-200 px-2 py-1 text-sm font-medium text-gray-700">
                {todoTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {todoTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {todoTasks.length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-gray-500">
                  No tasks yet
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">In Progress</h2>
              <span className="rounded-full bg-blue-200 px-2 py-1 text-sm font-medium text-blue-700">
                {inProgressTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {inProgressTasks.length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-gray-500">
                  No tasks yet
                </div>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Done</h2>
              <span className="rounded-full bg-green-200 px-2 py-1 text-sm font-medium text-green-700">
                {doneTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {doneTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {doneTasks.length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-gray-500">
                  No tasks yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-900">
          {task.title}
        </CardTitle>
      </CardHeader>
      {task.description && (
        <CardContent className="pt-0">
          <p className="text-sm text-gray-600">{task.description}</p>
        </CardContent>
      )}
    </Card>
  );
} 