import "dotenv/config";
import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { getTasks, saveTasks } from "./utils/taskStorage.js";
const app = express();
const PORT = Number(process.env.PORT) || 5000;
const allowedPriorities = [
    "low",
    "medium",
    "high"
];
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());
// Validation
function isValidTitle(title) {
    return (typeof title === "string" &&
        title.trim().length > 0 &&
        title.trim().length <= 100);
}
function isValidPriority(priority) {
    return allowedPriorities.includes(priority);
}
function errorResponse(res, status, message) {
    return res.status(status).json({
        success: false,
        error: message
    });
}
// GET ALL TASKS
app.get("/api/tasks", async (req, res, next) => {
    try {
        let tasks = await getTasks();
        const status = req.query.status;
        if (status !== undefined) {
            if (status !== "active" &&
                status !== "completed") {
                return errorResponse(res, 400, "Status must be active or completed.");
            }
            tasks = tasks.filter((task) => status === "completed"
                ? task.completed
                : !task.completed);
        }
        return res.status(200).json({
            success: true,
            data: tasks
        });
    }
    catch (error) {
        next(error);
    }
});
// GET TASK BY ID
app.get("/api/tasks/:id", async (req, res, next) => {
    try {
        const tasks = await getTasks();
        const task = tasks.find((item) => item.id === req.params.id);
        if (!task) {
            return errorResponse(res, 404, "Task not found.");
        }
        return res.status(200).json({
            success: true,
            data: task
        });
    }
    catch (error) {
        next(error);
    }
});
// CREATE TASK
app.post("/api/tasks", async (req, res, next) => {
    try {
        const { title, priority } = req.body ?? {};
        if (!isValidTitle(title)) {
            return errorResponse(res, 400, "Title is required and must be between 1 and 100 characters.");
        }
        if (priority !== undefined &&
            !isValidPriority(priority)) {
            return errorResponse(res, 400, "Priority must be low, medium or high.");
        }
        const tasks = await getTasks();
        const newTask = {
            id: randomUUID(),
            title: title.trim(),
            completed: false,
            priority: priority ?? "medium",
            createdAt: new Date().toISOString()
        };
        tasks.unshift(newTask);
        await saveTasks(tasks);
        return res.status(201).json({
            success: true,
            data: newTask
        });
    }
    catch (error) {
        next(error);
    }
});
// UPDATE TASK
app.patch("/api/tasks/:id", async (req, res, next) => {
    try {
        const { title, completed, priority } = req.body ?? {};
        const hasTitle = Object.hasOwn(req.body ?? {}, "title");
        const hasCompleted = Object.hasOwn(req.body ?? {}, "completed");
        const hasPriority = Object.hasOwn(req.body ?? {}, "priority");
        if (!hasTitle && !hasCompleted && !hasPriority) {
            return errorResponse(res, 400, "Provide at least one field to update.");
        }
        if (hasTitle && !isValidTitle(title)) {
            return errorResponse(res, 400, "Title must be between 1 and 100 characters.");
        }
        if (hasCompleted &&
            typeof completed !== "boolean") {
            return errorResponse(res, 400, "Completed must be a boolean.");
        }
        if (hasPriority &&
            !isValidPriority(priority)) {
            return errorResponse(res, 400, "Invalid priority.");
        }
        const tasks = await getTasks();
        const index = tasks.findIndex((task) => task.id === req.params.id);
        if (index === -1) {
            return errorResponse(res, 404, "Task not found.");
        }
        const updatedTask = {
            ...tasks[index],
            ...(hasTitle ? { title: title.trim() } : {}),
            ...(hasCompleted ? { completed } : {}),
            ...(hasPriority ? { priority } : {})
        };
        tasks[index] = updatedTask;
        await saveTasks(tasks);
        return res.status(200).json({
            success: true,
            data: updatedTask
        });
    }
    catch (error) {
        next(error);
    }
});
// DELETE TASK
app.delete("/api/tasks/:id", async (req, res, next) => {
    try {
        const tasks = await getTasks();
        const index = tasks.findIndex((task) => task.id === req.params.id);
        if (index === -1) {
            return errorResponse(res, 404, "Task not found.");
        }
        tasks.splice(index, 1);
        await saveTasks(tasks);
        return res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
// ERROR HANDLER
app.use((error, _req, res, _next) => {
    if (error instanceof SyntaxError &&
        "status" in error &&
        error.status === 400) {
        return errorResponse(res, 400, "Invalid JSON request body.");
    }
    console.error(error);
    return errorResponse(res, 500, "Internal server error.");
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
