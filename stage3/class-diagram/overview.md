# System Architecture: Class Diagram Overview

This Class Diagram models the core domain entities, relationships, and business logic supporting the multi-user milestone tracker, Kanban board workflow, and learning roadmap system.

---

## 1. Core Entities & Authentication
- **`User`**: Manages user profiles (`name`, `email`, `phone`) and security credentials (`password_hash`). Handles authentication workflows (`sign_up`, `login`, password reset) securely.
- **`Team` & `TeamMember`**: Manages collaborative project spaces. A `User` connects to projects through the associative `TeamMember` entity (`joined_at`), enabling multi-user project contribution and owner permissions.

---

## 2. Project Templates & Lifecycle
- **`ProjectTemplate`**: Acts as the factory model (`generate_project`) that provisions new projects with standardized task structures, default tasks, and stage configurations based on `TemplateType` (`FIXED` or `EMPTY`). It also provides historical project tracking (`view_historical_projects`).
- **`Project`**: Represents an active or historical project instance tied to a team and template. It aggregates real-time progress metrics (`calculate_progress_percentage`), links to roadmap views (`get_roadmap`), and performs project audits (`audit_project_status`).

---

## 3. Tasks & Phase Execution
- **`Task`**: The core unit of work belonging to a specific `Project`. It maps to a primary development stage (`ProjectStage`) and a current workflow state (`TaskStatus`).
- **`TaskPhase`**: A granular extension of a task that stores execution guidelines (`description`, `why_it_matters`), step-by-step checklists, and curated learning links (`resources`).

---

## 4. System Enumerations
- **`ProjectStage`**: Defines the macro development modules: `DATABASE`, `BACKEND`, and `FRONTEND`.
- **`TaskStatus`**: Defines the granular Kanban board columns: `TO_DO`, `IN_PROGRESS`, `TESTING_REVIEW`, and `DONE`.
- **`TemplateType`**: Specifies whether a project starts with a pre-configured task list (`FIXED`) or a custom blank canvas (`EMPTY`).

---

## 5. Controller & Service Logic
- **`Kanban`**: Encapsulates board management logic, including moving card workflow states (`move_task_status`), filtering tasks by development phase (`filter_by_stage`), fetching upcoming work (`get_next_task`), and calculating aggregated completion percentages (`calculate_progress_percentage`).
