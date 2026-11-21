import type {
  Task,
  Filter,
  Priority,
  ApiResponse
} from "../types/task";

// const API_URL = "http://localhost:5000/api";
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    }
  );

  if (!response.ok) {
    let message = `Error: ${response.status}`;

    try {
      const result = await response.json();

      if (result.error) {
        message = result.error;
      }
    } catch {
      // Keep the default HTTP error message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const taskApi = {

  getTasks(filter: Filter) {
    const query =
      filter === "all"
        ? ""
        : `?status=${filter}`;

    return request<ApiResponse<Task[]>>(
      `/tasks${query}`
    );
  },

  createTask(
    title: string,
    priority: Priority
  ) {
    return request<ApiResponse<Task>>(
      "/tasks",
      {
        method: "POST",
        body: JSON.stringify({
          title,
          priority
        })
      }
    );
  },

  updateTask(
    id: string,
    data: Partial<
      Pick<Task, "title" | "completed" | "priority">
    >
  ) {
    return request<ApiResponse<Task>>(
      `/tasks/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data)
      }
    );
  },

  deleteTask(id: string) {
    return request<void>(
      `/tasks/${id}`,
      {
        method: "DELETE"
      }
    );
  }
};