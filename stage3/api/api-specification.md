# External and Internal API Documentation

## 1. Overview

DevCompass is a web application designed to guide junior developers through their software development workflow. The application helps users understand what they should work on next, track their tasks through a simplified development workflow, and understand their current stage in the software development process.

The API provides communication between the frontend and backend of DevCompass. The frontend sends requests to the API when users perform actions such as creating projects, viewing tasks, updating task status, or requesting the next recommended task. The backend processes these requests and returns responses in JSON format.

---

# 2. External APIs

For the initial MVP, DevCompass does not require a mandatory external API for its core functionality.

The main features of DevCompass, including project management, task management, workflow tracking, and the "Next Up" feature, can be handled by the application's own internal API.

External APIs may be integrated in future versions of the project.

### Possible Future Integration: GitHub API

**API:** GitHub REST API

**Purpose:**  
The GitHub API could be used in a future version of DevCompass to connect a user's software project with its GitHub repository.

**Why it may be used:**  
GitHub is widely used by software developers for source code management. Integrating GitHub could allow DevCompass to connect development guidance and project tasks with the user's actual development repository.

**MVP Status:**  
Not required for the initial MVP.

---

# 3. Internal API

The DevCompass internal API follows RESTful principles and uses JSON for exchanging data between the frontend and backend.

Base URL:

`/api`

---

## Authentication

### Register User

**URL:**  
`/api/auth/register`

**Method:**  
`POST`

**Purpose:**  
Create a new DevCompass user account.

**Input Format:** JSON

```json
{
  "name": "Noura",
  "email": "noura@example.com",
  "password": "password123"
}
```

**Output Format:** JSON

```json
{
  "id": 1,
  "name": "Noura",
  "email": "noura@example.com"
}
```

---

### Login User

**URL:**  
`/api/auth/login`

**Method:**  
`POST`

**Purpose:**  
Authenticate an existing user.

**Input Format:** JSON

```json
{
  "email": "noura@example.com",
  "password": "password123"
}
```

**Output Format:** JSON

```json
{
  "message": "Login successful",
  "user_id": 1
}
```

---

# Project Endpoints

### Create Project

**URL:**  
`/api/projects`

**Method:**  
`POST`

**Purpose:**  
Create a new software project in DevCompass.

**Input Format:** JSON

```json
{
  "name": "Portfolio Website",
  "description": "Personal portfolio web application",
  "project_type": "Web Application"
}
```

**Output Format:** JSON

```json
{
  "id": 1,
  "name": "Portfolio Website",
  "description": "Personal portfolio web application",
  "project_type": "Web Application"
}
```

---

### Get Projects

**URL:**  
`/api/projects`

**Method:**  
`GET`

**Purpose:**  
Retrieve the user's projects.

**Input Format:**  
No request body is required.

**Output Format:** JSON

```json
[
  {
    "id": 1,
    "name": "Portfolio Website",
    "project_type": "Web Application"
  }
]
```

---

### Get a Specific Project

**URL:**  
`/api/projects/{project_id}`

**Method:**  
`GET`

**Purpose:**  
Retrieve the information for one specific project.

**Input Format:**  
The project ID is provided in the URL.

Example:

`/api/projects/1`

**Output Format:** JSON

```json
{
  "id": 1,
  "name": "Portfolio Website",
  "description": "Personal portfolio web application",
  "project_type": "Web Application",
  "progress": 40
}
```

---

# Task Endpoints

### Get Project Tasks

**URL:**  
`/api/projects/{project_id}/tasks`

**Method:**  
`GET`

**Purpose:**  
Retrieve all tasks belonging to a specific project so they can be displayed on the Kanban board.

**Input Format:**  
The project ID is provided in the URL.

**Output Format:** JSON

```json
[
  {
    "id": 1,
    "title": "Design database schema",
    "status": "to_do",
    "priority": "high"
  },
  {
    "id": 2,
    "title": "Build user model",
    "status": "in_local_coding",
    "priority": "medium"
  }
]
```

---

### Create Task

**URL:**  
`/api/projects/{project_id}/tasks`

**Method:**  
`POST`

**Purpose:**  
Create a new task inside a project.

**Input Format:** JSON

```json
{
  "title": "Build login page",
  "description": "Create the login interface",
  "priority": "high",
  "status": "to_do"
}
```

**Output Format:** JSON

```json
{
  "id": 3,
  "title": "Build login page",
  "description": "Create the login interface",
  "priority": "high",
  "status": "to_do"
}
```

---

### Get Task Details

**URL:**  
`/api/tasks/{task_id}`

**Method:**  
`GET`

**Purpose:**  
Retrieve detailed information and guidance for a specific task.

**Input Format:**  
The task ID is provided in the URL.

**Output Format:** JSON

```json
{
  "id": 3,
  "title": "Build login page",
  "description": "Create the login interface",
  "status": "to_do",
  "priority": "high",
  "why_it_matters": "The login page allows registered users to access their projects.",
  "helpful_tip": "Validate the user's input before submitting the form."
}
```

---

### Update Task

**URL:**  
`/api/tasks/{task_id}`

**Method:**  
`PUT`

**Purpose:**  
Update information about an existing task.

**Input Format:** JSON

```json
{
  "title": "Build login interface",
  "priority": "medium"
}
```

**Output Format:** JSON

```json
{
  "id": 3,
  "title": "Build login interface",
  "priority": "medium",
  "status": "to_do"
}
```

---

### Update Task Status

**URL:**  
`/api/tasks/{task_id}/status`

**Method:**  
`PATCH`

**Purpose:**  
Move a task through the DevCompass workflow.

The supported workflow statuses are:

- `to_do`
- `in_local_coding`
- `code_review`

**Input Format:** JSON

```json
{
  "status": "in_local_coding"
}
```

**Output Format:** JSON

```json
{
  "id": 3,
  "status": "in_local_coding",
  "message": "Task status updated successfully"
}
```

---

### Delete Task

**URL:**  
`/api/tasks/{task_id}`

**Method:**  
`DELETE`

**Purpose:**  
Delete a task from a project.

**Input Format:**  
The task ID is provided in the URL.

**Output Format:** JSON

```json
{
  "message": "Task deleted successfully"
}
```

---

# Next Up Endpoint

### Get Next Recommended Task

**URL:**  
`/api/projects/{project_id}/next-up`

**Method:**  
`GET`

**Purpose:**  
Retrieve the next recommended task for the developer.

This endpoint supports one of the main features of DevCompass: helping junior developers understand what they should work on next.

**Input Format:**  
The project ID is provided in the URL.

**Output Format:** JSON

```json
{
  "task_id": 3,
  "title": "Build login page",
  "priority": "high",
  "phase": "Development",
  "reason": "This is the next recommended task in your current development workflow."
}
```

---

# Project Guide Endpoint

### Get Project Development Guide

**URL:**  
`/api/projects/{project_id}/guide`

**Method:**  
`GET`

**Purpose:**  
Retrieve the project's current software development phase and the development phases that come before and after it.

**Input Format:**  
The project ID is provided in the URL.

**Output Format:** JSON

```json
{
  "current_phase": "Development",
  "phases": [
    {
      "name": "Planning",
      "status": "completed"
    },
    {
      "name": "Design",
      "status": "completed"
    },
    {
      "name": "Development",
      "status": "current"
    },
    {
      "name": "Testing",
      "status": "upcoming"
    },
    {
      "name": "Deployment",
      "status": "upcoming"
    }
  ]
}
```

---

# API Endpoint Summary

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in a user |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects` | Retrieve projects |
| GET | `/api/projects/{project_id}` | Retrieve a specific project |
| GET | `/api/projects/{project_id}/tasks` | Retrieve project tasks |
| POST | `/api/projects/{project_id}/tasks` | Create a task |
| GET | `/api/tasks/{task_id}` | Retrieve task details and guidance |
| PUT | `/api/tasks/{task_id}` | Update a task |
| PATCH | `/api/tasks/{task_id}/status` | Update the workflow status of a task |
| DELETE | `/api/tasks/{task_id}` | Delete a task |
| GET | `/api/projects/{project_id}/next-up` | Retrieve the next recommended task |
| GET | `/api/projects/{project_id}/guide` | Retrieve the project's development guide |

All API responses use JSON to provide a consistent data format between the DevCompass frontend and backend.

