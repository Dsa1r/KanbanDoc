# User Stories Prioritization Strategy (MoSCoW Split) , Technical Requirements & Acceptance Criteria 

# Domain Terminology
  To ensure clarity across project scope and user stories, the board architecture distinguishes between Stages and Phases:

- Stages (Domain Modules): Broad project areas — Database, Backend, and Frontend (Three stages).

- Phases / Columns (Workflow Status): Progress status columns — To-Do, In Progress, Review/Test and Done (Four Phases/ Column).

## Requirements Prioritization Strategy (MoSCoW Split)
To manage tight project timelines and ensure core delivery (execution tiers) within our curriculum deadlines, we utilize the MoSCoW prioritization method. This framework clearly defines what is mandatory for our **Minimum Viable Product (MVP)** versus what is intentionally deferred to future iterations.<br>

- **Must Have (M):** Fundamental MVP architecture and core execution paths required for the system to function end-to-end.
- **Should Have (S):** Critical feature enhancements, team collaboration tools, filtering, and resource integrations that elevate application usability.
- **Could Have (C):** Requirements that stakeholders and developers explicitly agree NOT to build in the current project phase or release cycle. 
- **Won't Have (W) (Out of Scope for current release):** Features that add polish, delight, or convenience, but are non-essential.


## Must Have:
1.1. Landing Page Value Proposition: As a potential new user, I want to see a clear website description on the signing up page so I understand the onboarding process.<br>
1.2. User Account Creation: As a user, I want to create a new account so I can access the milestone tracking system.<br>
1.3.Secure User Authentication: As a user, I want to securely log into my account so I can view my personalized roadmap.<br>
1.4. Password Recovery Workflow: As a user, I want to reset my password if I forget it so I can securely regain access to my account.<br>
1.5. Project Scope & Isolation Definition: As a user I want to define a new project (Working Solo) with a name and description so I can isolate my specific stage from other stages (Database, back end and front end).<br>
1.6. Team Collaboration & Invitations: As a user, I want to be able to add team members to my project so we can collaborate with a team in the project.<br>
1.7. Backlog Stage and Column phase Initialization: As a user, I want to see the main development phases organized into column in my Kanban backlog so my team and I can view tasks by stage..<br>
1.8. Workflow Column Layout: As a user, I want to see my task statuses organized into clear columns so I can instantly view our workflow layout.<br>
1.9. Stage-Based Board Filtering: As a user, I want to click on the main development stages (DB, Backend, or Frontend) so the Kanban board instantly filters to show only the tasks for that phases.<br>
1.10. Interactive Drag and Drop Status Transition: As a user, I want to drag and drop a task card from one column to another so that its active status updates automatically.<br>
1.11. Collective Progress Monitoring: As a team member, I want to see the overall project progress so I can understand how much work the team has completed.<br>
1.12. Macro Learning Roadmap Journey: As a user, I want to open a page that reveals my learning roadmap so I can visualize my macro learning journey from setup to frontend deployment, including the why, what, and brief alternative paths with suggested resources.<br>


## Should Have:
2.1 Explicit Guidance in Task Execution: As a user, I want to open a task and see its description, steps to follow, and why it matters so I understand the objective and execution plan.<br>
2.2. Dashboard Application Overview: As a returning user, I want to see a brief application overview when I log in so I can quickly orient myself before viewing my roadmap.<br>
2.3. Upcoming Task Preview Toggle: As a user, I want to click a "Show More / Show Less" button on a phase column so I can expand or collapse upcoming tasks without cluttering my board.<br>
2.4. Task-Specific Learning Resources: As a user, I want to see learning resources directly within a task's details so I can quickly access the documentation and guides needed to complete that specific objective.<br>
2.5. Kanban-to-Roadmap Progress Sync: As a user, I want moving a task to Done on the Kanban board to light up its corresponding roadmap node so that I can visually track my overall learning progress.<br>
2.6. Clickable Roadmap & Task Resource Links: As a user, I want to see clickable resource links in both my roadmap nodes and individual task descriptions so I can instantly access recommended learning tools and documentation.<br>
2.7. Project History & Status Audit: As a user, I want to access my previous and active projects so I can review my learning history, track completed tasks, and resume or audit my progress at any time.<br>


## Could Have:
3.1. Dark Mode & Light Mode Theme Toggle: As a user, I want to toggle between dark mode and light mode themes so that I can comfortably view my Kanban board in low-light environments.<br>
3.2. Task Completion Confetti Animation: As a user, I want to see a celebratory confetti micro-animation when I drag a task to Done so that I get rewarding visual feedback on my progress.<br>


## Won’t Have:
4.1. AI-Powered Task Generation: As a user, I want an AI assistant to automatically generate step-by-step task descriptions from a single title so that I don't have to write them manually.<br>
4.2. Arabic Language & RTL Localization: As an Arabic-speaking user, I want to switch the application UI language to Arabic so that I can navigate the roadmap in my native language.<br>

---

# User Stories with Given-When-Then Criteria as a Scenario. 
## 1. Must Have Requirements (Core MVP Engine)
The following scenarios define how each feature behaves under specific conditions and serve as the acceptance criteria for testing.

### 1.1. Landing Page Value Proposition
* **User Story:** As a potential new user, I want to see a clear website description on the signing up page so I understand the onboarding process.
* **Scenario: Onboarding Content Display**
  * **Given** an unauthenticated visitor navigates to the registration page,
  * **When** the page loads completely,
  * **Then** the system displays a value proposition explaining the milestone tracking methodology, learning roadmap features, and Kanban workflow steps.
    
### 1.2. User Account Creation
* **User Story:** As a user, I want to create a new account so I can access the milestone tracking system.
* **Scenario: Successful Registration**
  * **Given** a user is on the signup page with valid credentials (email, password, phone, persona),
  * **When** they submit the registration form,
  * **Then** the system invokes `User.sign_up()`, creates a record in the `User` table, and redirects to the dashboard.
* **Scenario: Duplicate Registration Handling**
   * **Given** a user submits an email already present in the database,
   * **When** `User.sign_up()` is executed,
   * **Then** the system returns a validation error stating "An account with this email may already exist. Please try signing in".

### 1.3. Secure User Authentication
* **User Story:** As a user, I want to securely log into my account so I can view my personalized roadmap.
* **Scenario: Successful Authentication**
  * **Given** a registered user enters valid email and password credentials,
  * **When** they click the "Login" button,
  * **Then** the system executes `User.login()`, authenticates session tokens, and presents the active roadmap view.
* **Scenario: Secure Login Failure Handling**
  * **Given** a user inputs an unregistered email or an incorrect password,
  * **When** When the login request is submitted,
  * **Then** Then the system returns a generic error message stating "Invalid email or password" without revealing whether the email address exists in the database.

### 1.4. Password Recovery Workflow
* **User Story:** As a user, I want to reset my password if I forget it so I can securely regain access to my account.
* **Scenario: Password Reset Link Request**
  * **Given** a user triggers the "Forgot Password" modal with a valid email,
  * **When** they submit the form,
  * **Then** the system calls `User.request_password_reset(email)` and dispatches a password recovery token.
* **Scenario: Password Update Completion**
  * **Given** a user navigates to the reset URL with a valid token,
  * **When** they submit a new password,
  * **Then** the system executes `User.reset_password(token, new_password)` and updates the credentials in the database.

### 1.5. Project Scope & Isolation Definition
* **User Story:** As a user, I want to define a new project with a name and description so I can isolate my specific stage from other stages (Database, Backend, Frontend).
* **Scenario: Project Instantiation from Template**
  * **Given** an authenticated user initiates project creation,
  * **When** they enter a project name, description, and template type,
  * **Then** the system calls `ProjectTemplate.generate_project()`, creates a `Project` record, and builds isolated stage workflows.

### 1.6. Team Collaboration & Invitations
* **User Story:** As a user, I want to be able to add team members to my project so we can collaborate with a team in the project.
* **Scenario: Adding a Team Member**
  * **Given** a project owner is on the Team Management settings page,
  * **When** they select an existing user by ID or email to invite to a project,
  * **Then** the system creates a new entry in `TeamMember` linking `user_id` and `team_id`.

### 1.7. Backlog Stage and Column Layout 
* **User Story:** As a user, I want to see the main development phases organized into columns in my Kanban backlog so my team and I can view tasks by stage.
* **Scenario: Backlog Main Phase Display**
  * **Given** a user opens the Kanban board view,
  * **When** the layout initializes,
  * **Then** the backlog column displays tasks grouped by fixed stage phases (DATABASE, BACKEND, FRONTEND).
  
### 1.8. Workflow Column Layout
* **User Story:** As a user, I want to see my task statuses organized into clear columns so I can instantly view our workflow layout.
* **Scenario: Status Column Alignment**
  * **Given** a project Kanban board is active,
  * **When** tasks load from the database,
  * **Then** tasks map strictly into four standard columns driven by `TaskStatus`: `TO_DO`, `IN_PROGRESS`, `TESTING_REVIEW`, and `DONE`.

### 1.9. Stage-Based Board Filtering
* **User Story:** As a user, I want to click on the main development stages (DB, Backend, or Frontend) so the Kanban board instantly filters to show only the tasks for that stage.
* **Scenario: Filtering Board View by Stage**
  * **Given** the Kanban board shows tasks across all stages,
  * **When** the user clicks on the "BACKEND" stage filter button,
  * **Then** the system executes `TaskPhase.filter_by_stage(BACKEND)` and renders only tasks associated with `stage_id = BACKEND`.

### 1.10. Interactive Drag and Drop Status Transition
* **User Story:** As a user, I want to drag and drop a task card from one column to another so that its active status updates automatically.
* **Scenario: Drag-and-Drop Execution**
  * **Given** a task card resides in the `TO_DO` column,
  * **When** the user drags the card to the `IN_PROGRESS` column,
  * **Then** the system executes `TaskPhase.move_task_status(task_id, 'IN_PROGRESS')`, updates `current_status` in `Task`, and persists state without a page refresh.

### 1.11. Collective Progress Monitoring
* **User Story:** As a team member, I want to see the overall project progress so I can understand how much work the team has completed.
* **Scenario: Aggregated Completion Metric Calculation**
  * **Given** a project contains multiple tasks across stages,
  * **When** a team member views the header bar,
  * **Then** the system calculates the ratio of `DONE` tasks against total tasks and displays an updated percentage bar.

### 1.12. Macro Learning Roadmap Journey
* **User Story:** As a user, I want to open a page that reveals my learning roadmap so I can visualize my macro learning journey from setup to frontend deployment, including the why, what, and brief alternative paths with suggested resources.
* **Scenario: Rendering Macro Journey Visualization**
  * **Given** the user navigates to the `/roadmap` route,
  * **When** the page loads,
  * **Then** the system parses the project's entire `Task` and `Stage` hierarchy and renders a sequential macro path line (snake line UI).

---

## 2. Should Have Requirements (Feature & Experience Polish)

### 2.1. Explicit Guidance in Task Execution
* **User Story:** As a user, I want to open a task and see its description, steps to follow, and why it matters so I understand the objective and execution plan.
* **Scenario: Inspecting Task Details**
  * **Given** a user clicks on a task card on the Kanban board,
  * **When** the modal expands,
  * **Then** the system displays the description attribute from `TaskPhase`, including step-by-step instructions and contextual importance.
    
### 2.2. Dashboard Application Overview  
* **User Story:** As a returning user, I want to see a brief application overview when I log in so I can quickly orient myself before selecting or viewing my active projects. 
* **Scenario: Dashboard Context Presentation**
  * **Given** an authenticated user completes login,
  * **When** the dashboard renders,
  * **Then** the system presents a summary card highlighting active project metrics, completion percentages, and a direct entrance link to the Kanban board.

### 2.3. Upcoming Task Preview Toggle
* **User Story:** As a user, I want to click a "Show More / Show Less" button on a phase column so I can expand or collapse upcoming tasks without cluttering my board.
* **Scenario: Toggling Upcoming Task Preview**
  * **Given** a tage column contains additional hidden tasks,
  * **When** the user clicks the "Show More" toggle button on that column,
  * **Then** the column expands to display the additional upcoming tasks, changing the button label to "Show Less".

### 2.4. Task-Specific Learning Resources
* **User Story:** As a user, I want to see learning resources directly within a task's details so I can quickly access the documentation and guides needed to complete that specific objective.
* **Scenario: Accessing Task Learning Resources
  * **Given** a user opens a task detail panel,
  * **When** the resources section populates,
  * **Then** the system displays curated documentation and external guides attached to that specific task.

### 2.5. Kanban-to-Roadmap Progress Sync
* **User Story:** As a user, I want moving a task to Done on the Kanban board to light up its corresponding roadmap node so that I can visually track my overall learning progress.
* **Scenario: Synchronized Node Completion
  * **Given** a task is linked to a macro node on the roadmap,
  * **When** the user drags that task to DONE on the Kanban board,
  * **Then** the system updates `Task.current_status` to DONE, and the corresponding roadmap UI node updates its status state to illuminated/completed.

### 2.6. Clickable Roadmap & Task Resource Links
* **User Story:** As a user, I want to see clickable resource links in both my roadmap nodes and individual task descriptions so I can instantly access recommended learning tools and documentation.
* **Scenario: Opening Clickable Resource Links
  * **Given** a user is inspecting a task modal or a roadmap node card,
  * **When** they click an external resource URL stored in `TaskPhase.resources`,
  * **Then** the link opens in a secure new browser tab (`target="_blank"`).

### 2.7. Project History & Status Audit
* **User Story:** As a user, I want to access my previous and active projects so I can review my learning history, track completed tasks, and resume or audit my progress at any time.
* **Scenario: Accessing Project History and Status Audit
  * **Given** a user navigates to their project history dashboard,
  * **When** they select a project (regardless of whether its status is `IN_PROGRESS`, `ARCHIVED`, or `COMPLETED`),
  * **Then** the system loads the historical roadmap and Kanban board state as read-only or editable history for auditing.

---

## 3. Could Have Requirements

* **3.1. Dark/Light Mode Theme Toggle:** As a user, I want to toggle between dark mode and light mode themes so that I can comfortably view my Kanban board in low-light environments.
* **3.2. Confetti Micro-Animation:** As a user, I want to see a celebratory confetti micro-animation when I drag a task to Done so that I get rewarding visual feedback on my progress.

---

## 4. Won't Have Requirements (Out of Scope for Current Release)

* **4.1. AI-Generated Task Descriptions:** As a user, I want an AI assistant to automatically generate step-by-step task descriptions from a single title so that I don't have to write them manually.
* **4.2. Multi-language Localization (Arabic UI):** As an Arabic-speaking user, I want to switch the application UI language to Arabic so that I can navigate the roadmap in my native language.

---

[⬅ Back to Master Index](../README.md)
