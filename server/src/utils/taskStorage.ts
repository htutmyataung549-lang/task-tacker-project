import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Task } from "../types/task.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.resolve(__dirname, "../../data/tasks.json");

export async function getTasks(): Promise<Task[]> {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(data) as Task[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await saveTasks([]);
      return [];
    }

    throw error;
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await fs.mkdir(path.dirname(dataPath), {
    recursive: true,
  });

  await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2), "utf-8");
}