# Retrospectives

> **Documentation note:** These retrospectives were prepared retrospectively, based on the sprint reviews, the Git history and the team's recollection of development work. They do not imply that formal retrospective meetings were held at the end of each sprint.

Each sprint is reviewed with three questions:
- **What went well?**
- **What could be improved?**
- **What will we do differently?**

## Sprint 1 — Database & Authentication

### What went well
- The database structure and the core authentication features were delivered: sign up, log in, password recovery and user settings.
- Using Supabase's built-in password recovery saved time compared with building a custom flow.
- The team finished the remaining work after a teammate left for personal reasons.

### What could be improved
- A database attribute was added during development, so older records were left without a value.
- Early setup problems slowed the team down: a `.env` file was tracked in Git, the frontend used the wrong default API port, and the backend could not start because of a wrong import path.
- Password-strength feedback was not implemented.

### What we will do differently
- Agree on the database schema before building features on top of it.
- Add `.env` and generated files to `.gitignore` from the first commit, and share an `.env.example` file instead.
- Run the backend and frontend locally after every pull, before pushing new work.

## Sprint 2 — Dashboard & Project Management

### What went well
- All the planned project operations were delivered: create, show, edit, delete and filter projects.
- The team improved the project filter beyond the original Figma design.
- Role selection (Member or QA) was added to project creation.

### What could be improved
- Creating a project did not create the starter tasks or open the Kanban board at first, and two tables needed a new migration.
- The login page crashed because of an undefined constant.
- A `.env` file was committed to the repository again.

### What we will do differently
- Test the full user flow, from creating a project to opening its board, before marking a feature as done.
- Check the list of changed files with `git status` before every commit, and add files one by one instead of `git add .`.

## Sprint 3 — Kanban & Task Management

### What went well
- The Kanban columns, task phases, task progress and the Next Step feature were delivered.
- The team found the slow task-phase loading and fixed it with caching, then confirmed in the app that loading was faster.

### What could be improved
- Task creation, editing and deletion were not part of the original requirements, so they were deferred even though the team saw their value.
- The Empty project type was postponed.
- The project type changed from an enum to a number during development, which meant updating code that already used it.

### What we will do differently
- Review the requirements for missing basic features (such as CRUD) at sprint planning, not during development.
- Measure performance early on screens that load a lot of data.

## Sprint 4 — AI Tasks, Roadmap & Final Integration

### What went well
- AI task generation works, after moving to Groq with four models to spread the load.
- The team integrated all the features without major integration problems, helped by recurring meetings and a clear split of code files.
- End-to-end tests were written with Playwright for the main flows: authentication, dashboard, Kanban, task details, roadmap, navigation, settings and AI generation.
- The app was deployed to Render, and a landing page was added.

### What could be improved
- The previous AI provider had outages and free-tier limits, which cost time before the team switched.
- Some loading issues in AI generation remain.
- The Roadmap stayed frontend-only, and its improved Figma design was not implemented.
- The QA review rule (only QA or the owner can move a task to Done) was not enforced at first.
- Pulling teammates' changes late created extra merge commits.

### What we will do differently
- Check an external service's limits and reliability before building on it.
- Enforce permissions in the backend, not only in the interface.
- Pull before starting new work and before every commit, to keep the history clean and avoid conflicts.

## Overall Lessons

| Lesson | Why it matters |
|---|---|
| Keep secrets out of Git from day one | A secret that reaches a public repository stays in its history. |
| Test the whole flow, not one screen | Several bugs appeared only when features were used together. |
| Put permission checks in the backend | The interface can be bypassed by calling the API directly. |
| Plan basic features at sprint planning | Missing CRUD operations were found too late to build. |
| Communicate file ownership | Clear ownership of code files made integration smooth. |
