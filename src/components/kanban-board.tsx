"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { DroppableColumn } from "./droppable-column";
import { TaskCard } from "./task-card";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  assignee?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  startDate?: string;
}

interface KanbanBoardProps {
  tasks?: Task[];
}

// Form validation schema
const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  assignee: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

export function KanbanBoard({ tasks: initialTasks = [] }: KanbanBoardProps) {
  const [isClient, setIsClient] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(
    initialTasks.length > 0
      ? initialTasks
      : [
          {
            id: "1",
            title: "Design new landing page",
            description: "Create wireframes and mockups for the new landing page design",
            status: "todo",
            assignee: "Sarah Johnson",
            dueDate: "2024-02-15",
            priority: "high",
            startDate: "2024-02-01",
          },
          {
            id: "2",
            title: "Implement user authentication",
            description: "Add login and registration functionality with JWT tokens",
            status: "in-progress",
            assignee: "Mike Chen",
            dueDate: "2024-02-20",
            priority: "medium",
            startDate: "2024-02-05",
          },
          {
            id: "3",
            title: "Write API documentation",
            description: "Create comprehensive API documentation with examples",
            status: "done",
            assignee: "Emily Davis",
            dueDate: "2024-02-10",
            priority: "low",
            startDate: "2024-01-25",
          },
          {
            id: "4",
            title: "Fix mobile responsiveness",
            description: "Ensure the app works properly on all mobile devices",
            status: "todo",
            priority: "medium",
            dueDate: "2024-02-25",
          },
          {
            id: "5",
            title: "Database optimization",
            description: "Optimize database queries and add proper indexing",
            status: "in-progress",
            assignee: "Alex Thompson",
            priority: "high",
            dueDate: "2024-02-18",
            startDate: "2024-02-08",
          },
          {
            id: "6",
            title: "Add more test cases",
            description: "Expand test coverage for critical functionality",
            status: "todo",
            assignee: "Lisa Wang",
            priority: "medium",
            dueDate: "2024-02-28",
            startDate: "2024-02-15",
          },
          {
            id: "7",
            title: "Update documentation",
            description: "Refresh user guides and API documentation",
            status: "todo",
            assignee: "David Kim",
            priority: "low",
            dueDate: "2024-03-01",
          },
          {
            id: "8",
            title: "Performance testing",
            description: "Run load tests and optimize performance bottlenecks",
            status: "in-progress",
            assignee: "Maria Garcia",
            priority: "high",
            dueDate: "2024-02-22",
            startDate: "2024-02-10",
          },
          {
            id: "9",
            title: "Security audit",
            description: "Conduct comprehensive security review and fix vulnerabilities",
            status: "done",
            assignee: "James Wilson",
            priority: "high",
            dueDate: "2024-02-12",
            startDate: "2024-01-30",
          },
          {
            id: "10",
            title: "Code review",
            description: "Review pull requests and ensure code quality standards",
            status: "done",
            assignee: "Sarah Johnson",
            priority: "medium",
            dueDate: "2024-02-08",
            startDate: "2024-02-01",
          },
        ],
  );
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if we're dropping on a column (status change)
    if (["todo", "in-progress", "done"].includes(overId)) {
      const newStatus = overId as "todo" | "in-progress" | "done";

      // Find the current task
      const currentTask = tasks.find((task) => task.id === taskId);
      if (!currentTask) return;

      // Update the task status
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)),
      );
    }
  }

  function handleUpdateTask(taskId: string, updates: Partial<Task>) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
    );
  }

  const onSubmit = (data: TaskFormData) => {
    // Add new task to the end of the array with status "todo"
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        priority: data.priority,
        assignee: data.assignee,
        status: "todo",
      },
    ]);
    setIsDialogOpen(false);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl h-full">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
          <ThemeToggle />
        </div>

        {/* Add Task Button */}
        <div className="mb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="flex items-center justify-center p-3">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Task</DialogTitle>
                      <DialogDescription>
                        Add a new task to your kanban board. Fill in the details below.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter task title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter task description (optional)"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="assignee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Assignee</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter assignee name (optional)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Create Task</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {isClient ? (
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex flex-col gap-6 md:flex-row md:items-start h-full">
              <DroppableColumn
                id="todo"
                title="To Do"
                tasks={todoTasks}
                className="bg-gray-100 dark:bg-gray-800"
                onUpdateTask={handleUpdateTask}
              />
              <DroppableColumn
                id="in-progress"
                title="In Progress"
                tasks={inProgressTasks}
                className="bg-blue-50 dark:bg-blue-900/20"
                onUpdateTask={handleUpdateTask}
              />
              <DroppableColumn
                id="done"
                title="Done"
                tasks={doneTasks}
                className="bg-green-50 dark:bg-green-900/20"
                onUpdateTask={handleUpdateTask}
              />
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="transform rotate-2 scale-105">
                  <TaskCard task={activeTask} onUpdateTask={handleUpdateTask} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="flex flex-col gap-6 md:flex-row md:items-start h-full">
            <DroppableColumn
              id="todo"
              title="To Do"
              tasks={todoTasks}
              className="bg-gray-100 dark:bg-gray-800"
              onUpdateTask={handleUpdateTask}
            />
            <DroppableColumn
              id="in-progress"
              title="In Progress"
              tasks={inProgressTasks}
              className="bg-blue-50 dark:bg-blue-900/20"
              onUpdateTask={handleUpdateTask}
            />
            <DroppableColumn
              id="done"
              title="Done"
              tasks={doneTasks}
              className="bg-green-50 dark:bg-green-900/20"
              onUpdateTask={handleUpdateTask}
            />
          </div>
        )}
      </div>
    </div>
  );
}
