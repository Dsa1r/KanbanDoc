# Sequence Diagrams

## Use Case 1: User Log in

This sequence diagram illustrates the user login authentication process, including database checks and password verification.

---

```mermaid
sequenceDiagram
title Use Case 4 - Create Empty Project and Assign Members
    actor U as User
    participant FE as Frontend (React)
    participant BE as Backend (Flask API)
    participant DB as Database (PostgreSQL)
 
    U->>+FE: Enter project name, description, select team members (opt), select (empty Kanbn), press Create
    FE->>+BE: POST /projects {name, description, member_ids} + token
    BE->>BE: Verify token and validate data
    alt Data is valid
        BE->>+DB: INSERT project ()
        DB-->>-BE: ProjectId
        loop For each selected member 
            BE->>+DB: INSERT project member (projectId, userId)
            DB-->>-BE: Member saved
        end
        
        BE-->>FE: 201 Created (project)
        FE-->>U: Open the project Kanban board

        U->>+FE: insert tasks to the kanban by time priority
        loop For each stage
        FE->>-BE: POST /Tasks {name, description, resources, phase} + token
        BE->>+DB: CreatTask(projectId)
        DB-->>-BE: TaskId
        BE-->>FE: 201 Created (Task)
        FE-->>U: Task Added to the To-Do in kanban
end
    else Data is invalid (e.g. name missing)
        BE-->>FE: 400 Bad Request
        FE-->>U: Show form errors
    end

   
    deactivate BE
    deactivate FE
