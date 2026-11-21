import { useState, type FormEvent } from "react";

import type { Priority } from "../types/task";

interface Props {
  onAdd: (title: string, priority: Priority) => Promise<void>;
}

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [saving, setSaving] = useState(false);

  const isTitleEmpty = title.trim().length === 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle || saving) return;

    setSaving(true);
    try {
      await onAdd(trimmedTitle, priority);
      setTitle("");
      setPriority("medium");
    } catch {
      // Parent component handles and displays the API error message
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Enter your task..."
        aria-label="Task title"
        value={title}
        maxLength={100}
        disabled={saving}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        aria-label="Task priority"
        value={priority}
        disabled={saving}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button type="submit" disabled={isTitleEmpty || saving}>
        {saving ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}