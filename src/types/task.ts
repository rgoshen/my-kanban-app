export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  assignees: string[]; // Changed from assignee?: string to assignees: string[]
  status: "todo" | "inprogress" | "done";
  dueDate?: string; // ISO date string
  startDate?: string; // ISO date string
};
