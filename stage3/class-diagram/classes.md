# DevCompass - System Architecture & Class Diagram

```mermaid
classDiagram
    class Kanban {
        +move_task_status(task_id, new_status)
        +filter_by_stage(stage_enum)
        +get_next_task(project_id)
        +calculate_progress_percentage(project_id)
    }

    class User {
        +uuid id
        +string name
        +string email
        +string phone
        -string password_hash
        +sign_up(email, password, phone, name)
        +login(email, password)
        +request_password_reset(email)
        +reset_password(token, new_password)
    }

    class Team {
        +uuid id
        +string team_name
        +add_member(user_id)
        +remove_member(user_id)
        +get_team_members()
    }

    class TeamMember {
        +uuid id
        +uuid team_id
        +uuid user_id
        +datetime joined_at
    }

    class TemplateType {
        <<enumeration>>
        FIXED
        EMPTY
    }

    class ProjectTemplate {
        +uuid id
        +json default_tasks
        +generate_project(name, description, template_type, is_team_project)$ Project
        +view_historical_projects(): List<Project>
    }

    class Project {
        +uuid id
        +uuid team_id
        +uuid template_id
        +string project_name
        +string description
        +calculate_progress_percentage()
        +get_roadmap()
        +audit_project_status()
    }

    class Task {
        +uuid id
        +uuid project_id
        +ProjectStage stage
        +string name
        +TaskStatus current_status
        +get_all_tasks()
    }

    class TaskPhase {
        +uuid task_id
        +TaskStatus status
        +string description
        +string why_it_matters
        +json resources
        +json checklist
    }

    class ProjectStage {
        <<enumeration>>
        DATABASE
        BACKEND
        FRONTEND
    }

    class TaskStatus {
        <<enumeration>>
        TO_DO
        IN_PROGRESS
        TESTING_REVIEW
        DONE
    }

    User "1" -- "0..*" TeamMember : membership
    Team "1" -- "0..*" TeamMember : includes
    ProjectTemplate "1" ..> "0..*" Project : instantiates / manages
    Team "0..1" -- "0..*" Project : manages
    Project "1" -- "0..*" Task : contains
    User "0..1" -- "0..*" Task : assigned to
    Task "1" *-- "1..4" TaskPhase : has

    ProjectTemplate --> TemplateType
    Task ..> ProjectStage : uses
    Task ..> TaskStatus : uses
    TaskPhase ..> TaskStatus : uses
    Kanban ..> Task : updates / filters
    Kanban ..> Project : reads progress / roadmap

```
---

## Overview & Description

This document outlines the core object-oriented architecture and domain model for **DevCompass**, a web application designed to guide junior developers through building full-stack software projects.

### Core Modules & Entities:
1. **User & Authentication (`User`):** 
   - Manages user accounts, secure authentication state (`sign_up`, `login`), and password recovery (`request_password_reset`, `reset_password`).
2. **Teams & Collaboration (`Team`, `TeamMember`):** 
   - Handles group project structures, team membership tracking, and member management (`add_member`, `remove_member`).
3. **Project Management (`Project`, `ProjectTemplate`):** 
   - Projects can be initialized from templates (`ProjectTemplate` using `TemplateType`: FIXED or EMPTY). A project tracks overall progression, roadmaps, and audits.
4. **Task Breakdown (`Task`, `TaskPhase`, `ProjectStage`, `TaskStatus`):** 
   - Every project is divided into stages (`DATABASE`, `BACKEND`, `FRONTEND`) and specific tasks. Each task has detailed execution phases (`TaskPhase`) containing guidance, resources, checklists, and workflow statuses (`TO_DO`, `IN_PROGRESS`, `TESTING_REVIEW`, `DONE`).
5. **Kanban Board & Tracking (`Kanban`):** 
   - Provides business logic for moving tasks across columns, filtering by stage, fetching upcoming tasks, and calculating real-time project progress percentages.


