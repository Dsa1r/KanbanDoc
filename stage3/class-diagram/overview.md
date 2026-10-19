# System Architecture: Class Diagram Overview

This Class Diagram models the core domain entities, relationships, and business logic supporting the multi-user milestone tracker, Kanban board workflow, and learning roadmap system.

---

## 1. Core Entities & Authentication
- **`User`**: Manages user profiles (`id`, `name`, `email`, `phone`) and private security credentials (`password_hash`). Handles user account creation (`sign_up`), credential verification (`login`), and password recovery workflows (`request_password_reset`, `reset_password`).
- **`Team`**: Represents collaborative project groups (`id`, `team_name`) and provides member administration methods (`add_member`, `remove_member`, `get_team_members`).
- **`TeamMember`**: Associative entity (`id`, `team_id`, `user_id`, `joined_at`) representing a user's membership within a specific team.

---

## 2. Project Templates & Lifecycle
- **`ProjectTemplate`**: Acts as a factory model (`generate_project` as a static method `$`) that provisions new projects with default task structures (`default_tasks` JSON) based on the `TemplateType` (`FIXED` or `EMPTY`). It also provides historical project lookup (`view_historical_projects() List~Project~`).
- **`Project`**: Represents an active or historical project instance (`id`, `team_id`, `template_id`, `project_name`, `description`). Every project is strictly owned by a team (`Team "1" -- "0..*" Project`). It provides methods to compute progress (`calculate_progress_percentage`), access learning roadmaps (`get_roadmap`), and audit completion status (`audit_project_status`).

---

## 3. Tasks & Phase Execution
- **`Task`**: The primary unit of work contained within a project (`id`, `project_id`, `stage`, `name`, `current_status`). A task can optionally be assigned to a `User` (`User "0..1" -- "0..*" Task`).
- **`TaskPhase`**: Granular execution details compositionally linked to a task (`task_id`, `status`, `description`, `why_it_matters`, `resources` JSON, `checklist` JSON). Each task contains between 1 to 4 phases.

---

## 4. System Enumerations
- **`TemplateType`**: Specifies the starting template format: `FIXED` (pre-populated default tasks) or `EMPTY` (blank project canvas).
- **`ProjectStage`**: Defines the macro full-stack development phases: `DATABASE`, `BACKEND`, and `FRONTEND`.
- **`TaskStatus`**: Defines the workflow states for task columns: `TO_DO`, `IN_PROGRESS`, `TESTING_REVIEW`, and `DONE`.

---

## 5. Controller & Service Logic
- **`Kanban`**: Encapsulates board management logic, including updating card workflow states (`move_task_status`), filtering tasks by development stage (`filter_by_stage`), retrieving upcoming tasks (`get_next_task`), and calculating real-time completion percentages (`calculate_progress_percentage`).
