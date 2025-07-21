export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  assignees: string[]; // Required field - always an array (can be empty)
  status: "todo" | "inprogress" | "done";
  dueDate?: string; // ISO date string
  startDate?: string; // ISO date string
};
