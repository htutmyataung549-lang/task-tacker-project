import type { Task } from "../types/task";

import TaskItem from "./TaskItem";

interface Props {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({
  tasks,
  onToggle,
  onDelete
}: Props) {

  if (tasks.length === 0) {
    return (
      <p className="empty">
        No tasks found.
      </p>
    );
  }

  return (
    <div className="task-list">

      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}

    </div>
  );
}