# Software Configuration Management (SCM) Plan

## 1. Overview
This SCM plan defines how we manage version control, branch updates, commit messages, and code reviews for the **DevCompass** project to keep our repository organized and prevent conflicts.

---

## 2. Repository & Branching Model
- **Platform:** GitHub
- **Structure:** Folder-based layout separating API docs, database schemas, system architecture, and QA/SCM plans.
- **Branches:**
  - `main`: Stores final, stable submissions for each project stage.
  - `dev`: Active integration branch where we merge daily updates.
  - `feature/*`: Short-lived branches created for specific tasks or documentation updates (e.g., `feature/api-specs`).

---

## 3. Commit Message Format (Conventional Commits)
All commit messages must strictly follow Conventional Commits to keep our Git history readable:
- `feat(scope): add new feature` (e.g., `feat(kanban): add drag-and-drop state update`)
- `fix(scope): resolve bug` (e.g., `fix(auth): resolve jwt token expiration issue`)
- `docs(scope): update documentation` (e.g., `docs(api): update REST API specifications`)
- `refactor(scope): code cleanup or restructuring`

---

## 4. Workflow & Review Process
1. **Create Branch:** Branch off from `dev` whenever working on a task or document.
2. **Open PR to `dev`:** Once ready, open a Pull Request targeting `dev`. At least one team member must review and approve the PR before merging to ensure everything integrates without breaking existing files.
3. **Stage Approval & Merge to `main`:** When a full project stage is completed and verified in `dev`, open a final PR from `dev` to `main` for final approval and milestone submission.

---
