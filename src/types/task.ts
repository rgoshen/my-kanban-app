export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  assignees?: string[]; // Optional - can be undefined for unassigned tasks
  status: "todo" | "inprogress" | "done";
  dueDate?: string; // ISO date string
  startDate?: string; // ISO date string
};
