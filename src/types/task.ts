export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  assignee?: string;
  status: "todo" | "inprogress" | "done";
  dueDate?: string; // ISO date string
  startDate?: string; // ISO date string
};
