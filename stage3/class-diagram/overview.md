# System Architecture: Class Diagram Overview

This Class Diagram models the core domain entities, relationships, and business logic supporting the multi-user milestone tracker, Kanban board workflow, and learning roadmap system.

---

## 1. Core Entities & Authentication
* **`User`**: Manages user profiles and security credentials. It handles core authentication actions (`sign_up`, `login`, password reset workflows) without leaking account existence states.
* **`Team`** & **`TeamMember`**: Manages collaborative project spaces. A `User` can belong to multiple teams via the associative `TeamMember` entity, allowing multi-user project contribution.

---

## 2. Project Templates & Lifecycle
* **`ProjectTemplate`**: Acts as the factory model (`generate_project`) that provisions new solo or team projects with standardized milestone structures, default tasks, and stage configurations. It also supports historical project archiving and status auditing.
* **`Project`**: Represents an active or historical project instance. It tracks overall completion states (`is_completed`), aggregates project progress metrics, links to roadmap views, and contains multiple tasks.

---

## 3. Tasks & Phase Execution
* **`Task`**: The core unit of work belonging to a specific `Project`. It maps to a primary development stage (`ProjectStage`) and a current workflow state (`TaskStatus`).
* **`TaskPhase`**: A composite or detailed extension of a task that stores execution guidelines (`description`, `why_it_matters`), step-by-step checklists, and curated documentation links (`resources`).

---

## 4. System Enumerations
* **`ProjectStage`**: Defines the macro learning and development modules: `DATABASE`, `BACKEND`, and `FRONTEND`.
* **`TaskStatus`**: Defines the granular Kanban board columns: `TO_DO`, `IN_PROGRESS`, `TESTING_REVIEW`, and `DONE`.

---

## 5. Controller & Service Logic
* **`Kanban`**: Encapsulates board operations such as updating card states (`move_task_status`), filtering cards by development module (`filter_by_stage`), and calculating real-time aggregated completion percentages (`calculate_progress_percentage`).
