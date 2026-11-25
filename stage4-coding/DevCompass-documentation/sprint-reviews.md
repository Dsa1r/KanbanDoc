# Sprint Reviews

> **Documentation note:** These sprint reviews were prepared retrospectively based on the team's recollection of development work. They do not imply that formal sprint review meetings were held at the time. Evidence links and screenshots should be added where indicated.

## Sprint 1 — Database & Authentication

### Sprint Goal
Establish the database structure and implement the core authentication and account-management functionality.

### Completed Work
- Database migrations and initial database structure.
- User sign-up and login.
- Password recovery using Supabase's built-in password recovery functionality.
- User settings.
- Authentication validation and error handling.
- Authentication testing.
- Password visibility toggle (show/hide).
- The application displays selected user information.

### Changes & Improvements
- User Settings were updated later during development.
- Password show/hide functionality was added later and is working.
- Password recovery was integrated with Supabase rather than being implemented as a custom recovery flow.
- A database attribute was added during development.

### Challenges & Resolutions
- **Team change:** A teammate left for personal reasons after completing part of the work. The team completed the remaining work, and the feature was ultimately working.
- **Database change:** Older records did not have values for the newly added attribute. Those records were kept with `NULL` values instead of assigning unavailable information.

### Deferred / Incomplete Work
- Password-strength feedback (such as Weak/Strong indicators) was not implemented.

### Sprint Outcome
The core database and authentication features were implemented. Users can sign up, log in, recover their passwords, and use the account settings functionality. Password visibility is also supported.


## Sprint 2 — Dashboard & Project Management

### Sprint Goal
Implement the dashboard and the core project-management operations.

### Completed Work
- Create Project using the fixed project structure.
- Show Projects.
- Delete Project.
- Edit Project.
- Filter Projects.
- Role selection during project generation.
- Dashboard header.
- Dashboard integration and testing.

### Changes & Improvements
- The project filter was improved beyond the original Figma design.
- Role selection was added to the project-generation flow.
- The dashboard header was changed to remain visible while scrolling (sticky header), fixing its previous behavior of disappearing during scrolling.

### Challenges & Resolutions
- The dashboard header did not remain visible while scrolling. Its behavior was updated so it stays fixed/visible during scrolling.
- The filter design was adjusted and improved during development rather than following the original Figma design exactly.

### Deferred / Incomplete Work
- Role-based task generation using the selected project roles is not fully implemented yet. Role selection itself was added, while the follow-up functionality that uses those roles remains incomplete.

### Sprint Outcome
The dashboard and project-management features were implemented and working. The team also made UI and behavior improvements during development, including the project filter and sticky header. Role selection is available during project generation, but its full use in task generation remains pending.



## Sprint 3 — Kanban & Task Management

### Sprint Goal
Implement the Kanban board and task-phase functionality and connect the task workflow to the project structure.

### Completed Work
- Kanban columns.
- Task phases.
- Task progress.
- Next Step functionality.
- Fixed tasks.
- Task-phase caching.
- Task status updates and integration.
- Kanban testing.

### Changes & Improvements
- Task-phase loading was optimized, and caching was added to reduce the loading time. The improvement was tested in the application and loading was verified to be faster.
- The project-type representation in the database was changed from an enum to a numeric value:
  - `0` — Fixed
  - `1` — Empty

### Challenges & Resolutions
- **Task-phase loading performance:** Task phases were handled dynamically across task phases, making loading heavy and slow. The team optimized the handling and added caching. The change was tested in the application, and loading became faster.
- **Project type in the database:** The team changed the project-type representation from an enum to a numeric value (`0` for Fixed and `1` for Empty).

### Deferred / Incomplete Work
- Empty-project functionality was postponed, although both Fixed and Empty projects use the Kanban board.
- Task creation, updating, and deletion were not implemented in this sprint because they were not included in the original requirements. The team recognized their importance but deferred them.

### Sprint Outcome
The planned Kanban and task-phase functionality was working. Task-phase loading was improved through caching. The database project-type representation was updated, while Empty-project functionality and task CRUD operations were left for future work.



## Sprint 4 — AI Tasks, Roadmap & Final Integration

### Sprint Goal
Implement AI task generation, develop the Roadmap interface, integrate project features, and conduct final workflow testing and UI improvements.

### Completed Work
- AI task generation is working successfully.
- AI provider/model setup using Groq, with four models selected to distribute load.
- Cross-feature integration.
- Final workflow testing using a workflow-testing tool.
- UI adjustments to improve the application's appearance and attractiveness.

### Changes & Improvements
- The team moved to Groq after facing provider reliability issues and free-tier usage limitations with the previous provider.
- Four models were selected to distribute the load.
- The UI was adjusted during final development to improve its visual appeal.
- The team collaborated through repeated meetings and clear assignments of code files, supporting integration across features.

### Challenges & Resolutions
- **AI provider reliability and limits:** The previous provider experienced frequent outages under high load, and its free tier had usage limits. The team selected Groq and four models to distribute load.
- **AI generation loading:** AI generation works, but some loading-related issues remain. These issues did not cause the generation service to shut down.
- **Integration coordination:** No integration problems were recalled. The team coordinated through recurring meetings and clear division of coding files.

### Deferred / Incomplete Work
- The Roadmap remained frontend-only and was not fully implemented.
- The team wanted the Roadmap to provide more useful information to users. An improved design was created in Figma, but implementing the redesign was postponed.

### Sprint Outcome
AI task generation was functioning with the selected provider/model setup. The team completed integration and workflow testing and made UI improvements. The Roadmap redesign remained a future enhancement; its Figma design is not evidence of an implemented feature.


