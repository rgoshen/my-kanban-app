import { KanbanBoard } from "@/components/kanban-board";

export default function Home() {
  // Sample tasks for demonstration
  const sampleTasks = [
    {
      id: "1",
      title: "Design user interface",
      description: "Create wireframes and mockups for the new feature",
      status: "todo" as const,
      priority: "high" as const,
      assignee: "Sarah Johnson",
      dueDate: "2024-02-15",
      startDate: "2024-02-01",
    },
    {
      id: "2",
      title: "Implement authentication",
      description: "Set up user login and registration system",
      status: "in-progress" as const,
      priority: "medium" as const,
      assignee: "Mike Chen",
      dueDate: "2024-02-20",
      startDate: "2024-02-05",
    },
    {
      id: "3",
      title: "Write documentation",
      description: "Create API documentation and user guides",
      status: "done" as const,
      priority: "low" as const,
      assignee: "Emily Davis",
      dueDate: "2024-02-10",
      startDate: "2024-01-25",
    },
    {
      id: "4",
      title: "Add unit tests",
      description: "Write comprehensive test coverage for core functionality",
      status: "todo" as const,
      priority: "medium" as const,
      dueDate: "2024-02-25",
    },
    {
      id: "5",
      title: "Deploy to staging",
      description: "Set up CI/CD pipeline and deploy to staging environment",
      status: "in-progress" as const,
      priority: "high" as const,
      assignee: "Alex Thompson",
      dueDate: "2024-02-18",
      startDate: "2024-02-08",
    },
  ];

  return <KanbanBoard tasks={sampleTasks} />;
}
