# TaskManager Frontend

## Summary

This PR adds the **TaskManager** Next.js frontend for the full-stack coding assessment. It replaces the default Create Next App scaffold with a task management UI that connects to a REST API backend.

The app supports creating, listing, editing, updating status, and deleting tasks. State and API logic are separated from the UI so the backend contract can be updated in one place.

## Changes

### App shell
- Updated `layout.tsx` with TaskManager metadata and a clean base layout
- Replaced the default home page with the task board in `page.tsx`
- Simplified `globals.css` to use Tailwind with a light, readable theme

### Task management UI
- **TaskBoard** — main screen; loads tasks, handles errors, and connects form, filters, and list
- **TaskForm** — add new tasks with title and optional description
- **TaskList** / **TaskItem** — display tasks with inline edit, status change, and delete
- **FilterBar** — filter by All, Pending, In Progress, or Completed with counts
- **EmptyState** — shown when no tasks match the active filter

### Data layer
- **useTasks** hook — owns task list state, loading/error handling, and CRUD actions
- **api.ts** — centralized HTTP client for backend task endpoints
- **config.ts** — reads `NEXT_PUBLIC_API_URL` from environment
- **task.ts** — shared TypeScript types for tasks and API payloads

### Project setup
- Added `.env.example` for local configuration
- Updated `.gitignore` to exclude `.env` while keeping `.env.example` committable
- Added `INITIAL_SETUP.README` with setup steps, file overview, and expected API contract
- Removed the default Create Next App `README.md`

## API contract

The frontend expects the backend at `NEXT_PUBLIC_API_URL` (default: `http://localhost:5000`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Fetch all tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

Task statuses: `pending`, `in_progress`, `completed`.

## Test plan

- [ ] Copy `.env.example` to `.env` and set `NEXT_PUBLIC_API_URL` to the running backend
- [ ] Run `npm install` and `npm run dev`
- [ ] Confirm the app loads at `http://localhost:3000`
- [ ] Create a task with title and description
- [ ] Change task status using the dropdown
- [ ] Edit a task title and description
- [ ] Delete a task
- [ ] Verify each filter (All, Pending, In Progress, Completed) shows the correct tasks
- [ ] Click Refresh and confirm the list reloads from the API
- [ ] Stop the backend and confirm a clear error message is shown
- [ ] Run `npm run build` and `npm run lint` with no errors

## Notes

- Client components are used only where browser state and events are required
- `.env` is not committed; use `.env.example` as the template for local setup
- See `INITIAL_SETUP.README` for full project structure and setup instructions
