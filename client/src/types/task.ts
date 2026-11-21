export type Priority =
  | "low"
  | "medium"
  | "high";

export type Filter =
  | "all"
  | "active"
  | "completed";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}