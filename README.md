**Website**: [simple-task-mgmt.netlify.app](https://simple-task-mgmt.netlify.app/)

# Backend Documentation

## Folder Structure

- **config/**
  - `db.js`: Handles MongoDB connection using Mongoose.

- **controllers/**
  - `auth.js`: Middleware for JWT authentication.
  - `isAdmin.js`: Middleware to check if the user is an admin.

- **models/**
  - `User.js`: Mongoose schema for users (fields: username, password, role).
  - `Task.js`: Mongoose schema for tasks (fields: title, description, dueDate, status, priority, assignedTo).

- **routes/**
  - `auth.js`: Endpoints for user registration and login.
  - `tasks.js`: Endpoints for users to manage their own tasks.
  - `admin.js`: Endpoints for admins to manage users and tasks.

- **server.js**: Main Express server setup and route mounting.

## Endpoints

### Auth Endpoints (`/api/auth`)
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login for users and admins (returns JWT).

### User Task Endpoints (`/api/tasks`)
- `POST /api/tasks/add-task`: Add a task for the logged-in user.
- `GET /api/tasks/task`: View all tasks for the logged-in user.
- `PUT /api/tasks/update-task/:id`: Update a task for the logged-in user.
- `DELETE /api/tasks/delete-task/:id`: Delete a task for the logged-in user.

### Admin Endpoints (`/api/admin`)
- `GET /api/admin/users`: View all users except admins.
- `POST /api/admin/add-user`: Add a new user.
- `PUT /api/admin/update-user/:id`: Update a user.
- `DELETE /api/admin/delete-user/:id`: Delete a user.
- `GET /api/admin/user/:id/tasks`: View all tasks for a specific user.
- `POST /api/admin/user/:id/tasks`: Add a task for a specific user.
- `PUT /api/admin/user/:id/tasks/:taskId`: Update a specific user's task.
- `DELETE /api/admin/user/:id/tasks/:taskId`: Delete a specific user's task.

## Middleware

- **auth**: Checks for JWT token and sets `req.user`.
- **isAdmin**: Checks if the authenticated user has admin role.

## Usage

- Start the server with `node server.js` (ensure `.env` is configured).
- Use the endpoints above with proper authentication (JWT in `Authorization` header).

---

# Frontend: How It Works

## Overview
The frontend is a React app (built with Vite) that talks to the backend REST API. It handles authentication (JWT), role-based access (user vs admin), and task management (CRUD) through a small service layer that wraps `axios`.

## Routing & Layout
- `Layout.jsx`: Shared shell (e.g., navbar) wrapping all pages.
- `HomePage.jsx`: Landing page with links to login/register.
- `LoginPage.jsx` / `RegisterPage.jsx`: Auth forms; on success a JWT is stored in `localStorage` and the user is redirected to their dashboard.
- `ProtectedRoutes.jsx`: Guards routes that require authentication. If there’s no token, the user is redirected to login.
- `Dashboard.jsx`: Decides which dashboard to render based on the authenticated user’s role.
  - `UserDashboard.jsx`: For regular users.
  - `AdminDashboard.jsx`: For admins.

## Authentication Flow
1. User submits credentials on `LoginPage.jsx`.
2. `frontend/src/services/api.js` calls `POST /api/auth/login`.
3. On success, the JWT is saved to `localStorage` and attached to subsequent requests via an axios request interceptor.
4. Protected routes check for a token; absence redirects to login.

## Data Layer (API Service)
- `frontend/src/services/api.js` centralizes HTTP calls via an `axios` instance:
  - Request interceptor: adds `Authorization: Bearer <token>` if present.
  - Response interceptor: logs errors and forwards them to the UI.
- Exposed functions map to backend endpoints, e.g., `signin`, `signup`, `getTasks`, `addTask`, `updateTask`, `deleteTask`.

## User Task Management
- `UserTaskManagement.jsx` (used by `UserDashboard.jsx`) fetches the user’s tasks and displays them.
- Users can create, update, and delete tasks; each action calls the corresponding API function and updates the UI.

## Admin Capabilities
- `AdminDashboard.jsx` provides management views:
  - View all non-admin users
  - Create/update/delete users
  - View and manage a specific user’s tasks

## State & Feedback
- Minimal global state; components fetch as needed.
- API calls surface errors in the console and to the UI (e.g., toasts/messages) where implemented.