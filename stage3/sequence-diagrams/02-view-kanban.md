# Sequence Diagrams

## Use Case 1: User Log in

This sequence diagram illustrates the user login authentication process, including database checks and password verification.

---

```mermaid
sequenceDiagram
title Use Case 2 - View Tasks by Phase and Overall Track
    actor U as User
    participant FE as Frontend (React)
    participant BE as Backend (Flask API)
    participant DB as Database (PostgreSQL)
 
    U->>+FE: Open project progress page
    FE->>+BE: GET /projects/{id}/progress + token
    BE->>BE: VerifyToken(token)

        BE->>+DB: GetKanban(Database, Backend, Frontend)
        DB-->>-BE: Tasks list by the stages
        BE->>BE: GroupByStatus (Todo, In Progress, Review, Done)
        BE->>BE: Compute progress per Stage and overall (done / total)
        BE-->>FE: 200 OK (tasks per Stage + Stage Status + overall progress)
        loop For each Stage (Database, Backend, Frontend, Overall)
            FE-->>U: Show each Stage tasks/ or overall , with their status
        end
        
   

  
    deactivate BE
    deactivate FE
