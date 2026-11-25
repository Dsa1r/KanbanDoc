# Bug Tracking

> **Documentation note:** This log was prepared retrospectively from the team's Git history, the sprint reviews and the team's recollection of development work. Each fixed bug links to the commit that fixed it. Screenshots should be added to [`evidence/bug-evidence/`](./evidence/bug-evidence/) where available.

## Severity Levels

| Severity | Meaning |
|---|---|
| Critical | A page or the whole app stops working. |
| High | A core feature does not work, or there is a security risk. |
| Medium | A feature works, but in a wrong or slow way. |
| Low | A visual or minor issue that does not block the user. |

## Status Values

| Status | Meaning |
|---|---|
| Fixed | The bug was fixed and the fix is in the repository. |
| In Progress | A fix has been written but is not merged yet. |
| Open | The bug is known and not fixed yet. |
| Accepted | The team decided to keep the current behavior. |

## Summary

| Total | Fixed | In Progress | Open | Accepted |
|---|---|---|---|---|
| 15 | 11 | 1 | 2 | 1 |

## Bug Log

| ID | Bug | Area | Severity | Sprint | Status | Fix |
|---|---|---|---|---|---|---|
| BUG-01 | The early backend folder tracked a `.env` file and `__pycache__` files in Git. | Backend / Security | High | 1 | Fixed | [195b0af](https://github.com/Dsa1r/KanbanDoc/commit/195b0af) |
| BUG-02 | The frontend used the wrong default API port, so requests failed when `VITE_API_BASE_URL` was not set. | Frontend | Medium | 1 | Fixed | [838cd2e](https://github.com/Dsa1r/KanbanDoc/commit/838cd2e) |
| BUG-03 | The backend could not start because `Config` was imported from the wrong path in `auth.py` and `extensions.py`. | Backend | Critical | 1 | Fixed | [8142538](https://github.com/Dsa1r/KanbanDoc/commit/8142538), [f5c1712](https://github.com/Dsa1r/KanbanDoc/commit/f5c1712) |
| BUG-04 | The dashboard heading lost its spacing after a style change. | Frontend / UI | Low | 2 | Fixed | [93f8efe](https://github.com/Dsa1r/KanbanDoc/commit/93f8efe) |
| BUG-05 | Creating a project did not create the starter tasks or redirect to the Kanban board, and the `tasks` and `team_members` tables needed a migration. | Full stack | High | 2 | Fixed | [0b25435](https://github.com/Dsa1r/KanbanDoc/commit/0b25435) |
| BUG-06 | A `.env` file was committed to the repository. | Security | High | 2 | Fixed (key rotation pending) | [d691318](https://github.com/Dsa1r/KanbanDoc/commit/d691318) |
| BUG-07 | The login page crashed because `STAGES` was not defined in `AuthShowcase`. | Frontend | Critical | 2 | Fixed | [fac0ea5](https://github.com/Dsa1r/KanbanDoc/commit/fac0ea5) |
| BUG-08 | Task phases loaded slowly because they were handled dynamically on every request. | Full stack / Performance | Medium | 3 | Fixed | Task-phase caching (S4-07) |
| BUG-09 | The dashboard header disappeared while scrolling. | Frontend / UI | Medium | 2 | Fixed | [39e52a2](https://github.com/Dsa1r/KanbanDoc/commit/39e52a2) |
| BUG-10 | The previous AI provider had frequent outages under high load and free-tier usage limits. | Backend / AI | High | 4 | Fixed | Moved to Groq with four models |
| BUG-11 | The phase panel showed an overall progress footer that did not belong there. | Frontend / UI | Low | 4 | Fixed | [afffa20](https://github.com/Dsa1r/KanbanDoc/commit/afffa20) |
| BUG-12 | A member could move a task to **Done** without a QA review. | Backend / Permissions | High | 4 | In Progress | Backend check: only QA or the owner can move a task to Done |
| BUG-13 | AI task generation still has some loading issues. | Frontend / AI | Medium | 4 | Open | — |
| BUG-14 | The **Log in** link on the landing page opens the **Sign Up** tab instead of **Log In**. | Frontend | Low | 4 | Open | — |
| BUG-15 | Older records have no value for a database attribute that was added later. | Database | Low | 1 | Accepted | Kept as `NULL` |

## Bug Details

### BUG-03 — Backend could not start
- **Steps to reproduce:** Start the Flask server.
- **Expected:** The server starts.
- **Actual:** The server failed with an import error for `Config`.
- **Cause:** `auth.py` and `extensions.py` imported `Config` from the wrong path.
- **Fix:** The import path was corrected in both files.

### BUG-05 — Project creation did not set up the board
- **Steps to reproduce:** Create a new project from the dashboard.
- **Expected:** The project opens on its Kanban board with the starter tasks.
- **Actual:** The starter tasks were not created and the user was not taken to the board.
- **Cause:** The starter tasks were not generated on creation, and the `tasks` and `team_members` tables were missing.
- **Fix:** Starter-task creation and the Kanban redirect were added, with a new migration for both tables.

### BUG-06 — `.env` file committed to the repository
- **Steps to reproduce:** Open the commit history of `stage4-coding/.env`.
- **Expected:** Secret files are never committed.
- **Actual:** The file was committed and later removed.
- **Fix:** The file was removed and `.gitignore` was updated.
- **Follow-up:** The file is still visible in the Git history of a public repository, so the keys it contained should be rotated.

### BUG-07 — Login page crash
- **Steps to reproduce:** Open the login page.
- **Expected:** The page loads.
- **Actual:** The page crashed with a reference error.
- **Cause:** `AuthShowcase` used a `STAGES` constant that was not defined.
- **Fix:** `STAGES` was defined in `AuthShowcase.jsx`.

### BUG-08 — Slow task-phase loading
- **Steps to reproduce:** Open a task and switch between its phases.
- **Expected:** Phases load quickly.
- **Actual:** Each phase took a noticeable time to load.
- **Fix:** Task-phase handling was optimized and caching was added. Loading was tested in the app and was faster.

### BUG-12 — Members could move tasks to Done
- **Steps to reproduce:** Log in as a **Member** of a team project and drag a task from **Testing/Review** to **Done**.
- **Expected:** Only QA or the project owner can move a task to Done.
- **Actual:** The task moved to Done.
- **Cause:** The status endpoint checked that the user belongs to the project, but not the user's role.
- **Fix:** `task_service.update_status` now checks `is_owner` and `is_qa` in `team_members` and returns `403` for other members. The frontend moves the task back and shows the error message.
