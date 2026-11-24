
# Sprint Planning

## Purpose
To divide the development phase into short, manageable iterations, 
prioritize tasks, identify dependencies, and assign responsibilities.

## Sprint Duration
4 Sprints — 1 week per sprint.

Priorities are assigned based on the original task order. 
The earlier tasks are considered higher priority, while later tasks 
are considered medium priority.

---

## Sprint 1 — Database & Authentication

**Duration:** 1 Week  
**Deadline:** Week 1  
**Sprint Goal:** Establish the database foundation and implement the core authentication functionality.

| ID | Task | Priority | Dependencies | Responsible |
|---|---|---|---|---|
| S1-01 | Database Migrations | High (Must Have) | None | Dana |
| S1-02 | Sign Up (Frontend & Backend) | High (Must Have) | Database Migrations | Reema, Dana|
| S1-03 | Log In (Frontend & Backend) | High (Must Have) | Database Migrations | Reema, Dana |
| S1-04 | Forget Password (Frontend & Backend) | High (Must Have) | Authentication Setup | Reema, Dana |

---

## Sprint 2 — Dashboard & Core Project Management

**Duration:** 1 Week  
**Deadline:** Week 2  
**Sprint Goal:** Implement project management functionality and the core Kanban workflow.

| ID | Task | Priority | Dependencies | Responsible |
|---|---|---|---|---|
| S2-01 | Dashboard: Create Project (Fixed Structure) | High (Must Have) | Authentication, Database | __________ |
| S2-02 | Dashboard: Delete Project | High (Must Have) | Project Creation | Norah |
| S2-03 | Dashboard: Show Projects | High (Must Have) | Project Creation | Dana, Norah |
| S2-04 | Kanban: Columns | High (Must Have) | Project Creation | Reema, Norah|
| S2-05 | Kanban: Task Phases & Progress | High (Must Have) | Kanban Columns | Reema, Norah |
| S2-06 | Kanban: Next Step | High (Must Have) | Task Phases | Reema, Norah |

---

## Sprint 3 — Additional Features

**Duration:** 1 Week  
**Deadline:** Week 3  
**Sprint Goal:** Implement additional project, task, and roadmap features.

| ID | Task | Priority | Dependencies | Responsible |
|---|---|---|---|---|
| S3-01 | Roadmap (Frontend) | Medium (Should Have) | Project Structure | Reema |
| S3-02 | Add Fixed Tasks | Medium (Should Have) | Project Creation, Kanban | Dana |
| S3-03 | AI Tasks | Medium (Should Have) | Project Structure | Dana |
| S3-04 | Dashboard: Edit Project | Medium (Should Have) | Project Creation | Norah |
| S3-05 | Authentication: User Settings | Medium (Should Have) | Authentication | Reema |

---

## Sprint 4 — Integration & Remaining Features

**Duration:** 2 Week  
**Deadline:** Week 5 
**Sprint Goal:** Complete remaining dashboard features, improve user experience, and integrate the system.

| ID | Task | Priority | Dependencies | Responsible |
|---|---|---|---|---|
| S4-01 | Loading States | Medium (Should Have) | Frontend Components | Norah, Dana |
| S4-02 | Dashboard: Add Roles in Generate | Medium (Should Have) | Project Generation | Norah |
| S4-03 | Dashboard: Filter Projects | Medium (Should Have) | Projects Display | Reema |
| S4-04 | Dashboard Header | Medium (Should Have) | Dashboard | Reema |
| S4-05 | Frontend & Backend Integration Testing | Medium (Should Have) | Core Features | Dana, Reema |
| S4-06 | Bug Fixes & Validation | Medium (Should Have) | Testing | All Team |
| S4-07 | Task Phase Caching | Medium (Should Have) | Task Phases | Dana |
---

## Priority Legend

| Priority | Meaning |
|---|---|
| High (Must Have) | Essential tasks required for the core functionality. |
| Medium (Should Have) | Important tasks that enhance the system but are less critical than core functionality. |
| Low (Could Have) | Optional enhancements that can be implemented if time allows. |
| Won't Have | Features excluded from the current development scope. |

---

## Sprint Schedule

| Sprint | Duration | Deadline | Main Focus |
|---|---|---|---|
| Sprint 1 | 1 Week | Week 1 | Database & Authentication |
| Sprint 2 | 1 Week | Week 2 | Dashboard & Core Kanban |
| Sprint 3 | 1 Week | Week 3 | Additional Features |
| Sprint 4 | 2 Week | Week 5 | Integration & Remaining Features |

---

## Planning Notes

- Sprint durations and deadlines are estimated and can be updated later.
- Task priorities are based on the original task order provided by the team.
- Responsibilities should be assigned to the relevant team members.
- Dependencies indicate tasks that rely on the completion of other tasks.
- The sprint plan can be adjusted according to team progress and available time.

