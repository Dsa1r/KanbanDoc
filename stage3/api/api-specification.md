# External and Internal API Documentation

## 1. Overview

DevCompass is a web application designed to guide junior developers through their software development workflow. The application helps users track their tasks through a simplified Kanban workflow, understand which stage of the development process they are in (Database, Backend, Frontend), and follow a learning roadmap that updates as they complete tasks.

The API provides communication between the frontend and backend of DevCompass. The frontend sends requests to the API when users perform actions such as signing up, creating projects, viewing the Kanban board, moving tasks between columns, or viewing the learning roadmap. The backend processes these requests and returns responses in JSON format.

---

# 2. External APIs

For the initial MVP, DevCompass does not require a mandatory external API for its core functionality. The main features of DevCompass, including project management, the Kanban board, and the learning roadmap, are handled by the application's own internal API. External APIs may be integrated in future versions of the project.

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

**Base URL:**

`/api/v1`

### General Conventions

- All field names use snake_case.
- Authentication: every endpoint requires the header Authorization: Bearer <access_token>, except the ones marked (Public).
- A user can only access projects they are a member of. Otherwise the API returns 403.
- Adding members and completing a project are allowed for the project owner only.
- Completed projects are read-only. Any change returns 409 PROJECT_COMPLETED.
- 
Task statuses: TO_DO, IN_PROGRESS, TESTING_REVIEW, DONE

Stages: DATABASE, BACKEND, FRONTEND

Roadmap node states: not_started, in_progress, completed. The state is calculated from the status of the node's tasks. A node is completed only when all of its tasks are DONE.

**Success response format:**

```json
{ "data": { } }
```
**Error response format:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "status must be one of TO_DO, IN_PROGRESS, TESTING_REVIEW, DONE",
    "details": { "field": "status" }
  }
}
```

### Error Codes

| HTTP Code | Error Code | Meaning |
|-----------|------------|---------|
| 400 | VALIDATION_ERROR | Invalid or missing input |
| 401 | UNAUTHORIZED | Missing, invalid, or expired token |
| 403 | NOT_PROJECT_MEMBER / NOT_PROJECT_OWNER | User has no access to this project or action |
| 404 | NOT_FOUND | Resource does not exist |
| 409 | EMAIL_ALREADY_REGISTERED / ALREADY_MEMBER / PROJECT_COMPLETED / PROJECT_NOT_COMPLETED | Conflict with current state |


## Public Endpoints
### Get Website Overview (Public)

**URL:** 
`/api/v1/public/overview`

**Method:**
`GET`

**Purpose:**
 Retrieve the website description shown on the sign up page.

**Input Format:** No request body is required.

**Output Format:** JSON

```json 
{
  "data": {
    "title": "DevCompass",
    "value_proposition": "A clean workspace that guides junior developers through building a full-stack website.",
    "features": [
      { "title": "Kanban Board", "description": "Track your tasks through clear workflow columns." },
      { "title": "Learning Roadmap", "description": "Visualize your learning journey from setup to deployment." }
    ]
  }
}
```
---

## Authentication

### Sign Up (Public)

**URL:**  
` /api/v1/auth/signup`

**Method:**  
`POST`

**Purpose:**  
Create a new DevCompass user account.

**Input Format:** JSON

```json
{
  "email": "noura@example.com",
  "password": "password123",
  "phone": "+966500000000",
  "persona": "junior_developer"
}
```

**Output Format:** JSON (201)

```json
{
  "data": {
    "user": {
      "id": "b3f1c2a4-1111-2222-3333-444455556666",
      "email": "noura@example.com",
      "phone": "+966500000000",
      "persona": "junior_developer"
    },
    "access_token": "eyJhbGciOi...",
    "refresh_token": "eyJhbGciOi...",
    "expires_in": 3600
  }
}
```

**Error (409):**
```json
{
  "error": {
    "code": "EMAIL_ALREADY_REGISTERED",
    "message": "Email address already registered"
  }
}
``` 
---

### Login (Public)

**URL:**  
`/api/v1/auth/login`

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
  "data": {
    "user": {
      "id": "b3f1c2a4-1111-2222-3333-444455556666",
      "email": "noura@example.com",
      "phone": "+966500000000",
      "persona": "junior_developer"
    },
    "access_token": "eyJhbGciOi...",
    "refresh_token": "eyJhbGciOi...",
    "expires_in": 3600
  }
} 
```

### Logout
**URL:**
`/api/v1/auth/logout`

**Method:**
`POST`

**Purpose:**
End the current user session.

**Input Format:** No request body is required.

**Output Format:** No content (204).


### Get Current User
**URL:**
`/api/v1/auth/me`

**Method:**
`GET`

**Purpose:**
Retrieve the information of the logged-in user.

**Input Format:** No request body is required.

**Output Format:** JSON
```json
{
  "data": {
    "id": "b3f1c2a4-1111-2222-3333-444455556666",
    "email": "noura@example.com",
    "phone": "+966500000000",
    "persona": "junior_developer"
  }
}
```

### Forgot Password (Public)
**URL:**
`/api/v1/auth/forgot-password`

**Method:**
`POST`

**Purpose:** 
Request a password recovery token. The response is always successful, even if the email does not exist, to prevent revealing which emails are registered.

**Input Format:** JSON
```json
{
  "email": "noura@example.com"
}
```

**Output Format:** JSON
```json
{
  "data": {
    "message": "If the email exists, a reset link has been sent"
  }
}
```

### Reset Password (Public)
**URL:**
`/api/v1/auth/reset-password`

**Method:** 
`POST`

**Purpose:**
Set a new password using the recovery token.

**Input Format:** JSON
```json
{
  "token": "recovery-token-from-email",
  "new_password": "newPassword123"
}
```

**Output Format:** JSON 
```json
{
  "data": {
    "message": "Password updated"
  }
}
```

---
## Dashboard

### Get Dashboard

**URL:**
`/api/v1/dashboard`

**Method:**
`GET`

**Purpose:**
Retrieve the application overview and active project summary shown after login.

**Input Format:** No request body is required.

**Output Format:** JSON
```json
{
  "data": {
    "summary_text": "Welcome back! Continue building your project step by step.",
    "active_projects": [
      {
        "project_id": 1,
        "name": "Portfolio Website",
        "progress": { "done": 8, "total": 24, "percent": 33 },
        "board_url": "/projects/1/board"
      }
    ]
  }
}
```
---

# Project Endpoints

### Get Project Templates
**URL:** \\ ماهو ايند بيونت
`/api/v1/project-templates`

**Method:**
`GET`

**Purpose:**
Retrieve the available project templates used when creating a project.

**Input Format:** No request body is required.

**Output Format:** JSON
```json
{
  "data": [
    {
      "template_type": "fullstack_web", \\يتغير, يحذف  
      "name": "Full-Stack Web Application", \\يتغيرو يحذف  
      "description": "Build a website from database to frontend.", \\
      "stages": ["DATABASE", "BACKEND", "FRONTEND"]
    }
  ]
}
```

### Create Project
**URL:** 
`/api/v1/projects`

**Method:** 
`POST`

**Purpose:**
Create a new project from a template. The backend automatically generates the project's team, stages, tasks, and roadmap nodes.

**Input Format:**
JSON

```json
{
  "name": "Portfolio Website",
  "description": "Personal portfolio web application",
  "template_type": "fullstack_web" \\ هنا اي دي 
}
```

**Output Format:** JSON (201)

```json
{
  "data": {
    "id": 1,
    "name": "Portfolio Website",
    "description": "Personal portfolio web application",
    "template_type": "fullstack_web", \\ اي دي 
    "owner_id": "b3f1c2a4-1111-2222-3333-444455556666", \\ تيم ممبر اي دي 
    "team_id": 1,
    "is_completed": false, \\ نشيل الاتربيوت من الكلاس دياقرام 
    "completed_at": null, 
    "created_at": "2026-10-11T10:00:00Z"
  }
}
```

---

### Get Projects

**URL:**  
`URL: /api/v1/projects`

**Method:**  
`GET`

**Purpose:**  
Retrieve the user's projects. Use ?is_completed=true for the Project Archive, or ?is_completed=false for active projects.

**Input Format:**  
No request body is required.

Example: /api/v1/projects?is_completed=false \\ قيت ال بروجكت, مع اليوزر اي دي 

**Output Format:** JSON

```json
{
  "data": [
    {
      "id": 1,
      "name": "Portfolio Website",
      "template_type": "fullstack_web", \\ ينشال 
      "is_completed": false \\   ينشال وينحط البرقرس كنمبر, في الكلاس دياقرام بعد
    }
  ]
}
```

---

### Get a Specific Project

**URL:**  
`/api/v1/projects/{project_id}`

**Method:**  
`GET`

**Purpose:**  
Retrieve the information for one specific project.

**Input Format:**  
The project ID is provided in the URL.

Example:
`/api/v1/projects/1`

**Output Format:** JSON

```json
{
  "data": {
    "id": 1,
    "name": "Portfolio Website",
    "description": "Personal portfolio web application",
    "template_type": "fullstack_web", \\ تابملت اي دي 
    "owner_id": "b3f1c2a4-1111-2222-3333-444455556666", \\ تيم ممبر اي دي, 
    "team_id": 1, \\ مالها داعي 
    "is_completed": false, \\ هنا برقرس 
    "completed_at": null,
    "created_at": "2026-10-11T10:00:00Z"
  }
}
```

### Get Project Progress 
**URL:** // تنشال كلها مالها داعي 
`/api/v1/projects/{project_id}/progress`

**Method:**
`GET`

**Purpose:**
Retrieve the overall project progress (ratio of DONE tasks to total tasks), overall and per stage.

**Input Format:** The project ID is provided in the URL.

**Output Format:** JSON

```json
{
  "data": {
    "overall": { "done": 8, "total": 24, "percent": 33 },
    "by_stage": [
      { "stage_id": "DATABASE", "progress": { "done": 8, "total": 8, "percent": 100 } },
      { "stage_id": "BACKEND", "progress": { "done": 0, "total": 8, "percent": 0 } },
      { "stage_id": "FRONTEND", "progress": { "done": 0, "total": 8, "percent": 0 } }
    ]
  }
}
```

### Complete Project (Owner only \\ تنشال 
**URL:**
`/api/v1/projects/{project_id}/complete`

**Method:**
`POST`

**Purpose:**
Mark a project as completed. The project becomes read-only and moves to the Project Archive.

**Input Format:** No request body is required.

**Output Format:** JSON

```json
{
  "data": {
    "id": 1,
    "name": "Portfolio Website",
    "is_completed": true,
    "completed_at": "2026-12-01T12:00:00Z"
  }
}
```

### Get Project Audit

**URL:**
`/api/v1/projects/{project_id}/audit` \\ تنشال 

**Method:**
`GET`

**Purpose:**
Retrieve a read-only completion log of a completed project, so the user can review the historical learning path and tasks. Returns 409 PROJECT_NOT_COMPLETED if the project is not completed.

**Input Format:** The project ID is provided in the URL.
 
**Output Format:**  JSON

```json
{
  "data": {
    "project": { "id": 1, "name": "Portfolio Website", "is_completed": true },
    "completed_at": "2026-12-01T12:00:00Z",
    "progress": { "done": 24, "total": 24, "percent": 100 },
    "stages": [
      { "stage_id": "DATABASE", "progress": { "done": 8, "total": 8, "percent": 100 } }
    ],
    "tasks": [
      {
        "id": 101,
        "title": "Design User Schema",
        "stage_id": "DATABASE",
        "final_status": "DONE",
        "completed_at": "2026-10-15T09:00:00Z"
      }
    ],
    "roadmap": [
      {
        "id": 1,
        "order": 1,
        "stage_id": "DATABASE",
        "title": "Set up the database",
        "task_ids": [101, 102],
        "state": "completed"
      }
    ]
  }
}
```

--- 
# Team Endpoints

### Get Project Members \\ تنحذف 

**URL:** 
`/api/v1/projects/{project_id}/members` 

**Method:**
`GET`

**Purpose:**
Retrieve the members of a project's team.

**Input Format:** The project ID is provided in the URL.

**Output Format:** JSON

```json
{
  "data": [
    {
      "user_id": "b3f1c2a4-1111-2222-3333-444455556666",
      "team_id": 1,
      "email": "noura@example.com",
      "role": "owner",
      "joined_at": "2026-10-11T10:00:00Z"
    }
  ]
}
```
### Add Team Member \\ نحتاج نضيف ديليت بعد 
**URL:**
`/api/v1/projects/{project_id}/members`

**Method:**
`POST`

**Purpose:**
Add an existing user to the project team. Send either email or user_id.

**Input Format:** JSON

```json
{
  "email": "friend@example.com"
}
```
**Output Format:** JSON (201)
```json
{
  "data": {
    "user_id": "c4d2e3b5-7777-8888-9999-000011112222",
    "team_id": 1,
    "email": "friend@example.com",
    "role": "member", \\ تنشال حتى بالديليت 
    "joined_at": "2026-10-12T08:00:00Z" \\ تنضاف بالكلاس دياقرام تيم ممبر 
  }
}
```
Errors: 404 USER_NOT_FOUND, 409 ALREADY_MEMBER.
---
# Kanban Board Endpoints

### Get Project Board
**URL:**
`/api/v1/projects/{project_id}/board` 

**Method:**
`GET`

**Purpose:**
Retrieve the Kanban board of a project: the backlog stages and the tasks grouped into the four status columns. To filter by stage, add the optional stage query parameter (DATABASE, BACKEND, or FRONTEND).

**Input Format:** The project ID is provided in the URL.

**Output Format:** JSON
```json
{
  "data": {
    "project": { "id": 1, "name": "Portfolio Website", "is_completed": false },
    "progress": { "done": 8, "total": 24, "percent": 33 },
    "active_stage": "BACKEND", \\ تنشال 
    "stages": [
      { "stage_id": "DATABASE",  "name": "Database", "order": 1, "task_count": 8 },
      { "stage_id": "BACKEND", "name": "Backend", "order": 2, "task_count": 8 },
      { "stage_id": "FRONTEND", "name": "Frontend", "order": 3, "task_count": 8 }
    ],
    "columns": {
      "TO_DO": [
        {
          "id": 104, //  اول رقمين حسب ترتيب التاسك, ثاني رقمين خاص برقم الستيج (1201) 12 رقم التاسك و 01 رقم الستيج
          "title": "Create JWT Login Route",
          "stage_id": "BACKEND",
          "current_status": "TO_DO",
          "position": 0  // تنشال يوزشن 
        }
      ],
      "IN_PROGRESS": [],
      "TESTING_REVIEW": [],
      "DONE": []
    }
  }
}
```
Examples: /api/v1/projects/1/board and /api/v1/projects/1/board?stage=BACKEND. active_stage is null when no filter is applied.

### Get Upcoming Tasks of a Stage

**URL:**
`/api/v1/projects/{project_id}/stages/{stage_id}/upcoming` \\ تنشال 

**Method:**
`GET`

**Purpose:**
Retrieve the next few upcoming (not yet active) tasks of a stage, so the user can look ahead without overwhelming the active board. Optional query parameter: limit (default 5, maximum 20).

**Input Format:**
The project ID and stage ID are provided in the URL.

**Output Format:** JSON

```json
{
  "data": [
    {
      "id": 105,
      "title": "Validate Request Payload",
      "stage_id": "BACKEND",
      "current_status": "TO_DO",
      "position": 1
    }
  ]
}
```
Example: /api/v1/projects/1/stages/BACKEND/upcoming?limit=5  \\ لين هنا تنشال 

---
# Task Endpoints

### Get Task Details

**URL:**  
`/api/v1/tasks/{task_id}`

**Method:**  
`GET`

**Purpose:**  
Retrieve detailed information and guidance for a specific task: its description, steps to follow, why it matters, and recommended resources and tools.

**Input Format:**  
The task ID is provided in the URL.

**Output Format:** JSON

```json
{
  "data": {
    "id": 104,
    "project_id": 1,
    "title": "Create JWT Login Route",
    "stage_id": "BACKEND",
    "current_status": "IN_PROGRESS",
    "description": "Create the login endpoint that authenticates a user and returns a token.",
    "steps": [
      "Create a POST /auth/login route",
      "Validate the email and password",
      "Return a token and the user data"
    ],
    "why_it_matters": "The login route allows registered users to access their projects.",
    "resources": [
      { "title": "Flask Documentation", "url": "https://flask.palletsprojects.com", "type": "documentation" }
    ],
    "recommended_tools": [
      { "title": "Postman", "url": "https://www.postman.com", "type": "tool" }
    ],
    "roadmap_node_id": 3
  }
}
```
External links should be opened in a new browser tab (target="_blank").

---
### Update Task Status

**URL:**  
`/api/v1/tasks/{task_id}/status`

**Method:**  
`PATCH`

**Purpose:**  
Move a task to another Kanban column (drag and drop). The response also returns the affected roadmap node and the updated project progress, so the frontend can update the board and the roadmap from a single response.

The supported workflow statuses are:

- TO_DO
- IN_PROGRESS
- TESTING_REVIEW
- DONE

**Input Format:** JSON

```json
{
    "status": "DONE"
}
```

**Output Format:** JSON

```json
{
  "data": {
    "task": {
      "id": 104,
      "title": "Create JWT Login Route",
      "stage_id": "BACKEND",
      "current_status": "DONE",
      "position": 0
    },
    "roadmap_node": { "id": 3, "state": "completed" },
    "progress": { "done": 9, "total": 24, "percent": 38 }
  }
}
```
Errors: 400 VALIDATION_ERROR (invalid status), 409 PROJECT_COMPLETED.


---
# Roadmap Endpoints

### Get Project Roadmap

**URL:**
`/api/v1/projects/{project_id}/roadmap`

**Method:**
`GET`

**Purpose:**
Retrieve the macro learning roadmap (snake line) of a project. Each node is linked to one or more tasks, and its state is calculated from those tasks.

**Input Format:** The project ID is provided in the URL.

**Output Format:** JSON

```json
{
  "data": {
    "project_id": 1,
    "nodes": [
      {
        "id": 1,
        "order": 1,
        "stage_id": "DATABASE",
        "title": "Set up the database",
        "task_ids": [101, 102],
        "state": "completed"
      },
      {
        "id": 2,
        "order": 2,
        "stage_id": "BACKEND",
        "title": "Build the API",
        "task_ids": [103, 104],
        "state": "in_progress"
      }
    ]
  }
}
```

### Get Roadmap Node Details
**URL:**
`/api/v1/projects/{project_id}/roadmap/nodes/{node_id}`

**Method:**
`GET`

**Purpose:**
Retrieve the details of one roadmap node: what it is, why it matters, alternative paths, and suggested resources.

**Input Format:** The project ID and node ID are provided in the URL.

**Output Format:** JSON

```json
{
  "data": {
    "id": 2,
    "order": 2,
    "stage_id": "BACKEND",
    "title": "Build the API",
    "task_ids": [103, 104],
    "state": "in_progress",
    "what": "Create the server endpoints that the frontend will call.",
    "why": "The backend connects the database to the user interface.",
    "alternative_paths": ["Use Node.js with Express instead of Flask"],
    "resources": [
      { "title": "Flask Documentation", "url": "https://flask.palletsprojects.com", "type": "documentation" }
    ]
  }
}
```
---

# API Endpoint Summary

| Method | Endpoint | Purpose |
|---|---|---|
| GET  | `/api/v1/public/overview` | Retrieve the website description (Public) |
| POST | `/api/v1/auth/signup` | Register a new user (Public) |
| POST | `/api/v1/auth/login` | Log in a user (Public) |
| POST | `/api/v1/auth/logout` | 	Log out a user |
| GET | `	/api/v1/auth/me` | Retrieve the current user |
| POST | `/api/v1/auth/forgot-password` | Request a password reset (Public) |
| POST | `	/api/v1/auth/reset-password` | Complete a password reset (Public) |
| GET | `/api/v1/dashboard` | Retrieve the dashboard overview |
| GET | `/api/v1/project-templates` | Retrieve project templates |
| POST | `/api/v1/projects` | Create a project from a template |
| GET | `/api/v1/projects` | Retrieve projects (active or archive) |
| GET | `/api/v1/projects/{project_id}` | Retrieve a specific project |
| GET | `/api/v1/projects/{project_id}/progress` | Retrieve project progress |
| POST | `/api/v1/projects/{project_id}/complete` | Complete a project (owner only)|
| GET | `/api/v1/projects/{project_id}/audit` | Retrieve the completed project audit |
| GET | `/api/v1/projects/{project_id}/members` | Retrieve project members |
| POST | `/api/v1/projects/{project_id}/members` | Add a team member (owner only) |
| GET | `/api/v1/projects/{project_id}/board` | Retrieve the Kanban board (optional stage filter) |
| GET | `/api/v1/projects/{project_id}/stages/{stage_id}/upcoming` | Retrieve upcoming tasks of a stage |
| GET | `/api/v1/tasks/{task_id}` | Retrieve task details and guidance |
| PATCH | `/api/v1/tasks/{task_id}/status` | Update the workflow status of a task |
| GET | `/api/v1/projects/{project_id}/roadmap` | Retrieve the learning roadmap |
| GET | `/api/v1/projects/{project_id}/roadmap/nodes/{node_id}` | Retrieve roadmap node details |




All API responses use JSON to provide a consistent data format between the DevCompass frontend and backend.

