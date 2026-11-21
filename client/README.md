Task Tracker App

A full-stack Task Tracker application built as part of the Junior Developer Code Test.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Node.js
- Express.js
- TypeScript
- JSON File Storage

## Features

- Create a task with title and priority
- View all tasks
- View a single task by ID
- Update task title, completion status, and priority
- Delete tasks
- Filter tasks by All, Active, and Completed
- Display remaining active task count
- Validate task input
- Loading and error states
- Persistent JSON file storage

## Project Structure

```text
task-tracker/
├── server/
├── client/
├── README.md
└── .gitignore
```

## Installation

### Backend

```bash
cd server
npm install
npm run dev
```

Backend URL: http://localhost:5000

### Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend URL: http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get task by ID |
| POST | /api/tasks | Create task |
| PATCH | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

### Filtering

```text
GET /api/tasks?status=active
GET /api/tasks?status=completed
```

## Validation Rules

- Title is required.
- Title must be a non-empty string.
- Title must not exceed 100 characters.
- Priority must be low, medium, or high.
- Default priority is medium.
- Completed must be a boolean.

## HTTP Status Codes

- 200: Successful request
- 201: Task created
- 204: Task deleted
- 400: Invalid input
- 404: Task not found

## Assumptions and Trade-offs

- JSON file storage is used instead of a database.
- UUID is used for unique task IDs.
- Task data persists between server restarts.
- The API performs filtering to keep frontend behavior consistent.
- This implementation is intended for a small coding test, not concurrent production workloads.

## Future Improvements

- Add automated API tests.
- Add frontend component tests.
- Add task editing UI.
- Add pagination and search.