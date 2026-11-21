import {
  useEffect,
  useState
} from "react";

import type {
  Task,
  Filter,
  Priority
} from "./types/task";

import { taskApi } from "./services/taskApi";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilter from "./components/TaskFilter";

function App() {

  const [tasks, setTasks] = useState<Task[]>([]);

  const [remainingCount, setRemainingCount] =
    useState(0);

  const [filter, setFilter] =
    useState<Filter>("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // Fetch filtered tasks and total active task count.
  async function fetchTasks(
    selectedFilter: Filter = filter
  ) {

    try {
      setLoading(true);
      setError("");

      const [listResponse, activeResponse] =
        await Promise.all([
          taskApi.getTasks(selectedFilter),
          taskApi.getTasks("active")
        ]);

      setTasks(listResponse.data ?? []);

      setRemainingCount(
        activeResponse.data?.length ?? 0
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load tasks."
      );

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchTasks(filter);
  }, [filter]);

  // Create Task
  async function handleAdd(
    title: string,
    priority: Priority
  ) {

    try {
      setError("");

      await taskApi.createTask(
        title,
        priority
      );

      await fetchTasks(filter);

    } catch (err) {

      const message =
        err instanceof Error
          ? err.message
          : "Failed to create task.";

      setError(message);

      throw err;
    }
  }

  // Toggle Complete
  async function handleToggle(task: Task) {

    try {
      setError("");

      await taskApi.updateTask(
        task.id,
        {
          completed: !task.completed
        }
      );

      await fetchTasks(filter);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update task."
      );
    }
  }

  // Delete Task
  async function handleDelete(id: string) {

    try {
      setError("");

      await taskApi.deleteTask(id);

      await fetchTasks(filter);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete task."
      );
    }
  }

  return (
    <main className="container">

      <div className="app-card">

        <header>
          <h1>Task Tracker</h1>

          <p>
            Organize your daily tasks
          </p>
        </header>

        <TaskForm onAdd={handleAdd} />

        <div className="task-header">

          <div>
            <h2>My Tasks</h2>

            <p>
              {remainingCount} tasks left
            </p>
          </div>

          <TaskFilter
            filter={filter}
            onChange={setFilter}
          />

        </div>

        {error && (
          <div className="error">
            {error}

            <button
              onClick={() => void fetchTasks(filter)}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (

          <div className="loading">
            Loading tasks...
          </div>

        ) : (

          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />

        )}

      </div>

    </main>
  );
}

export default App;