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
