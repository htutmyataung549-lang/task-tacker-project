import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, "../../data/tasks.json");
export async function getTasks() {
    try {
        const data = await fs.readFile(dataPath, "utf-8");
        return JSON.parse(data);
    }
    catch (error) {
        if (error.code === "ENOENT") {
            await saveTasks([]);
            return [];
        }
        throw error;
    }
}
export async function saveTasks(tasks) {
    await fs.mkdir(path.dirname(dataPath), {
        recursive: true,
    });
    await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2), "utf-8");
}
