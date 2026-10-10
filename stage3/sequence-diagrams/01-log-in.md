# Sequence Diagrams

## Use Case 1: User Log in

This sequence diagram illustrates the user login authentication process, including database checks and password verification.

---

```mermaid
sequenceDiagram

title Use Case 1 - User Log in
    actor U as User
    participant FE as Frontend (React)
    participant BE as Backend (Flask API)
    participant DB as Database (PostgreSQL)
 
    U->>+FE: Enter username and password, press Login
    FE->>+BE: POST /auth/login {identifier, password}
    BE->>+DB: findUserByUsername(username)
    alt Existed Username
        DB-->>-BE: User Record (Hashed Password)
        BE->>BE: verifyPassword(inputPassword, storedHash)
    alt Valid credentials
        BE-->>FE: 200 OK + token
        FE-->>U: Redirect to My Projects
    else Invalid credentials
        BE-->>FE: 401 Unauthorized
        FE-->>U: Show "Wrong username or password"
    end
    else Not Existed Username
        DB-->>BE: null (User Not Found)
        BE-->>FE: 401 Unauthorized
        FE-->>U: Show "Wrong username or password"
    end
    deactivate BE
    deactivate FE
