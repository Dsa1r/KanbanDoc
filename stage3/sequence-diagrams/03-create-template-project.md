# Sequence Diagrams

## Use Case 1: User Log in

This sequence diagram illustrates the user login authentication process, including database checks and password verification.

---

```mermaid
sequenceDiagram
title Use Case 3 - Create Fixed Project and Assign Members
    actor U as User
    participant FE as Frontend (React)
    participant BE as Backend (Flask API)
    participant DB as Database (PostgreSQL)
 
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
        alt built-in tasks selected
        BE->>+DB: CreatTasks(projectId)
        DB-->>-BE: Tasks Linked to the project
        else empty tasks selected
         BE->>+DB: insert tasks to the kanban by time priority
        DB-->>-BE: Tasks saved and Linked to the project
end
    
        BE-->>FE: 201 Created (project)
        FE-->>U: Open the project Kanban board
    else Data is invalid (e.g. name missing)
        BE-->>FE: 400 Bad Request
        FE-->>U: Show form errors
    end

   
    deactivate BE
    deactivate FE
