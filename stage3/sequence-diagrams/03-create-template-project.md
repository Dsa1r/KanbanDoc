# Sequence Diagrams

## Use Case 3: create template project

This sequence diagram illustrates the workflow for creating a fixed project using a built-in Kanban template, associating selected team members, and generating default tasks upon project initialization.

---

```mermaid
sequenceDiagram
title Use Case 3 - Create Fixed Project and Assign Members
    actor U as User
    participant FE as Frontend (React)
    participant BE as Backend (Flask API)
    participant DB as Database (Supabase)
 
    U->>+FE: Enter project name, description, select team members (opt), select (built-in Kanban), press Create
    FE->>+BE: POST /projects {name, description, member_ids} + token
    BE->>BE: Verify token and validate data
    alt Data is valid
        BE->>+DB: INSERT project ()
        DB-->>-BE: ProjectId
        loop For each selected member 
            BE->>+DB: INSERT project member (projectId, userId)
            DB-->>-BE: Member saved
        end

        BE->>+DB: CreatTasks(projectId)
        DB-->>-BE: Tasks Linked to the project

    
        BE-->>FE: 201 Created (project)
        FE-->>U: Open the project Kanban board
    else Data is invalid (e.g. name missing)
        BE-->>FE: 400 Bad Request
        FE-->>U: Show form errors
    end

   
    deactivate BE
    deactivate FE
```
---
### Detailed Flow Breakdown

1. **Client Request:** The user fills out the project creation form (providing name, description, optional team members, and selecting the built-in Kanban template) and clicks Create via the React frontend.
2. **API Dispatch:** The frontend sends an HTTP `POST` request to `/projects` containing the JSON payload with `{ name, description, member_ids }` along with the authorization token in the request header.
3. **Validation & Authorization:** The Flask API verifies the user's JWT token and validates the incoming data (e.g., checking that the project name is provided).
4. **Data Persistence Flow:**
   - **Project Insertion:** Upon successful validation, the backend inserts the new project record into PostgreSQL and receives the generated `projectId`.
   - **Member Assignment:** The backend iterates over each selected team member in `member_ids` and inserts a project member record linking `projectId` and `userId`.
   - **Task Creation:** The backend calls `CreatTasks(projectId)` to populate the project with the built-in Kanban tasks in PostgreSQL.
5. **API Response & UI Redirection:**
   - **On Success (`201 Created`):** The API returns an HTTP `201 Created` status with the new project data, and the frontend redirects the user to the newly created project's Kanban board.
   - **On Validation Error (`400 Bad Request`):** If any required data is missing or invalid, the API responds with an HTTP `400 Bad Request`, prompting the frontend to display validation errors.
