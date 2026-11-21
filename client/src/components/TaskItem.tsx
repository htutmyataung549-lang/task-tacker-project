import type { Task } from "../types/task";

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({
  task,
  onToggle,
  onDelete
}: Props) {

  return (
    <div className="task-item">

      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
      />

      <div className="task-info">

        <span
          className={
            task.completed
              ? "task-title completed"
              : "task-title"
          }
        >
          {task.title}
        </span>

        <span className={`priority ${task.priority}`}>
          {task.priority}
        </span>

      </div>

      <span className="task-date">
        {new Date(task.createdAt).toLocaleDateString()}
      </span>

      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
      >
        Delete
      </button>

    </div>
  );
}