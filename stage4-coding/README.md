# Stage 4: Coding & Implementation

Welcome to DevCompass for Stage 4 (Coding & Implementation). This phase marks the transition from design and requirements documentation into the actual functional, cloud-deployed web application.

---

## 💻 Folder Structure

The project follows a **Monorepo Architecture**, separating the user interface from the server logic into two distinct, high-level directories:

```text
stage-4-coding/
│
├── 📁 supabase/          # Centralized Database Schemas & Migrations (Shared by Frontend & Backend)
├── 📁 frontend/          # User Interface (React)
└── 📁 backend/           # Server Logic & Custom APIs (Flask)
```



## 💻 Tech Stack & Architecture

### 1. Database & Backend-as-a-Service 📁 `supabase/`
* **Technologies:** Supabase.
* **Core Function:** Acts as the centralized, single source of truth for all application data. It hosts relational tables, handles data integrity constraints (Foreign Keys), and manages automated timestamps.
* **SQL Schemas (`database.sql`):** Holds the raw SQL migration scripts required to regenerate the entire database infrastructure, tables, and relationships upon deployment.

### 2. Frontend 📁 `frontend/`
* **Technologies:** React.js.
* **Supabase Integration:** User authentication and live data synchronization are handled through the **Supabase Client SDK** configured inside `src/services/supabaseClient.js`.
* **API Communication:** HTTP requests are routed to the cloud-deployed Flask server for business logic and data processing.

### 3. Backend 📁 `backend/`
* **Technologies:** Python, Flask.
* **Core Function:** Powers the RESTful APIs responsible for secure business logic, data validation, and heavy computations. It communicates directly with the centralized **Supabase Cloud Database** using `supabase-py` to process backend-driven data requests.



## 💻 Team Members & Task Distribution

Since all team members are **Full-Stack Developers**, the workload was distributed using a **Feature-Driven Approach**. Each developer took full ownership of specific modules, handling the Database design (Supabase), Backend logic (Flask), and Frontend UI (React) for their respective features:

| Developer | Core Ownership | Key Responsibilities & Tasks |
| :--- | :--- | :--- |
| **Reema** | Project creation, templates & seed content, team members | • ... |
| **Areej** |  Authentication & JWT, project list (Dashboard), archive & audit, CI/QA, deployment | • ... |
| **Noura** | Kanban: task list, stage filter, status change (drag and drop), progress | • ... |
| **Dana** | Task card (details & checklist), task CRUD, Roadmap and its synchronization | • ... |


