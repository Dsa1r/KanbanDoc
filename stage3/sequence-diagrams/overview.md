# Sequence Diagrams Overview

This document provides a high-level overview of the core system workflows and interactions visualized through the sequence diagrams for **DevCompass**. These diagrams map out the communication between the User, the React Frontend, the Flask Backend API, and the PostgreSQL Database.

---

## Summary of Sequence Diagrams

### 1. Use Case 1: User Log in (`User Authentication`)
* **Objective:** Authenticate users securely against the system database.
* **Flow:** 
  - The user enters credentials on the React frontend.
  - A `POST /auth/login` request is sent to the Flask backend.
  - The backend queries the PostgreSQL database for the user record, verifies the hashed password, and issues an authentication token upon success (or returns a `401 Unauthorized` error if validation fails).

### 2. Use Case 2: View Tasks by Phase and Overall Track (`Project Progress Tracking`)
* **Objective:** Retrieve and aggregate project tasks to calculate and display progress metrics.
* **Flow:**
  - The user opens the project progress view.
  - The frontend fetches data via `GET /projects/{id}/progress` with authorization tokens.
  - The backend retrieves all kanban tasks, groups them by status (`Todo`, `In Progress`, `Review`, `Done`), computes completion percentages per stage and overall, and returns the compiled JSON payload for frontend rendering.

### 3. Use Case 3: Create Fixed Project and Assign Members (`Template-based Project Setup`)
* **Objective:** Streamline project creation with automatic initialization of members and built-in task templates.
* **Flow:**
  - The user submits project details, member selections, and chooses a built-in Kanban template.
  - The backend creates the project record, links the selected team members, and automatically populates predefined tasks categorized by time priority and project phase.

### 4. Use Case 4: Create Empty Project and Assign Members (`Custom Project Setup`)
* **Objective:** Allow users to create a clean, empty project framework and manually populate tasks stage by stage.
* **Flow:**
  - The user creates a blank project and assigns initial team members.
  - Once the project board is initialized, the user loops through custom task insertions (`POST /Tasks`), allowing individual task creation, resource allocation, and direct placement into the project's Kanban stages.

---

