# Quality Assurance (QA) Plan

## 1. Overview
The Quality Assurance (QA) plan for **DevCompass** ensures system reliability, code correctness, and robust security. Because the platform is tailored for junior developers, maintaining strict code quality, accurate input validation, and a frictionless Kanban workflow is essential.

---

## 2. Testing Levels & Scope

### A. Unit Testing
* **Target Components:** Python/Flask backend logic, data models, progress calculation functions, and helper utilities.
* **Tools:** `pytest` framework.
* **Objective:** Verify that individual functions (such as progress percentage calculations and task status updates) operate correctly and independently.

### B. Integration Testing
* **Target Components:** API endpoints and database operations (Supabase / PostgreSQL).
* **Tools:** `pytest` with Flask Client and mock database sessions.
* **Objective:** Ensure that REST API endpoints (such as authentication, project creation, and task management) read and write data accurately, returning JSON structures matching the database schema.

### C. UI Testing
* **Target Components:** React user interface components and Kanban board views.
* **Tools:** React Testing Library.
* **Objective:** Verify that user interactions (such as dragging and dropping tasks or switching filters) update the user interface smoothly and without rendering errors.

---

## 3. Defect Tracking & Bug Management

1. **Issue Reporting:** Any software bug or UI glitch is logged as an issue with appropriate labels (e.g., `bug`, `enhancement`).
2. **Code Reviews:** Code is thoroughly reviewed, and quality/security checks are met before final integration.
3. **Automated Verification:** Build checks and syntax validations are executed to ensure the system remains error-free.

---

## 4. QA Summary Matrix

| Test Type | Scope / Target | Tools | Responsibility |
| :--- | :--- | :--- | :--- |
| **Unit Tests** | Backend models and logic | `pytest` | Backend Developer |
| **Integration Tests** | API routes and database queries | `pytest`, Flask Client | Backend / Full-Stack Developer |
| **UI Tests** | React components and Kanban board | React Testing Library | Frontend Developer |

---

[⬅ Back to Master Index](../README.md)
