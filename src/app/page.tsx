import { KanbanBoard } from "@/components/kanban-board";

export default function Home() {
  // Sample tasks for demonstration
  const sampleTasks = [
    {
      id: "1",
      title: "Design user interface",
      description: "Create wireframes and mockups for the new feature",
      status: "todo" as const,
    },
    {
      id: "2",
      title: "Implement authentication",
      description: "Set up user login and registration system",
      status: "in-progress" as const,
    },
    {
      id: "3",
      title: "Write documentation",
      description: "Create API documentation and user guides",
      status: "done" as const,
    },
    {
      id: "4",
      title: "Add unit tests",
      description: "Write comprehensive test coverage for core functionality",
      status: "todo" as const,
    },
    {
      id: "5",
      title: "Deploy to staging",
      description: "Set up CI/CD pipeline and deploy to staging environment",
      status: "in-progress" as const,
    },
  ];

  return <KanbanBoard tasks={sampleTasks} />;
}
