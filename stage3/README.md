# DevCompass — Stage 3: Technical Documentation

Welcome to the central technical documentation repository for **DevCompass (Stage 3)**. This master hub outlines the system architecture, domain models, database schemas, sequence interaction flows, REST API contracts, version control workflows, and quality assurance strategies driving the DevCompass platform.

---

## Master Technical Documentation Index

| Phase / Component | Document Title | Technical Description & Scope | Documentation Link |
| :--- | :--- | :--- | :--- |
| **0. Requirements** | `user-stories.md` | Prioritized features using MoSCoW methodology with Given-When-Then acceptance scenarios | [View Stories ➔](https://github.com/Dsa1r/KanbanDoc/tree/3b47e0767eb01827aaf586773e629ed2ace633e9/stage3/user-stories) |
| **0. UI/UX Mockups** | `screens-overview.md` | Figma design system link, layout architecture, and complete UI screen breakdowns | [View Mockups ➔](https://github.com/Dsa1r/KanbanDoc/tree/3b47e0767eb01827aaf586773e629ed2ace633e9/stage3/mockups) |
| **1. System Architecture** | `system-architecture.md` | High-level system topology, three-tier data flow, and component interactions | [View Architecture ➔](https://github.com/Dsa1r/KanbanDoc/tree/3b47e0767eb01827aaf586773e629ed2ace633e9/stage3/architecture) |
| **2. Class Diagram** | `classes.md` | Domain models, class diagrams (Mermaid), controllers, Enums, and UI component structures | [View Classes ➔](https://github.com/Dsa1r/KanbanDoc/tree/3b47e0767eb01827aaf586773e629ed2ace633e9/stage3/class-diagram) |
| **2. Database Schema** | `er-diagram.md` | Relational ER Diagram, foreign key constraints, cardinalities, and PostgreSQL DDL scripts | [View Database ➔](https://github.com/Dsa1r/KanbanDoc/tree/3b47e0767eb01827aaf586773e629ed2ace633e9/stage3/database) |
| **3. Sequence Flows** | `overview.md` | Comprehensive index of core sequence diagrams covering key application use cases | [View Sequences ➔](https://github.com/Dsa1r/KanbanDoc/tree/3b47e0767eb01827aaf586773e629ed2ace633e9/stage3/sequence-diagrams) |
| **4. API Specs** | `api-specification.md` | RESTful API endpoints specification, payloads, status codes, and authentication contracts | [View API Specs ➔]([api/api-specification.md](https://github.com/Dsa1r/KanbanDoc/tree/3b47e0767eb01827aaf586773e629ed2ace633e9/stage3/api)) |
| **5. SCM Strategy** | `scm-plan.md` | Git-Flow branching strategy, Conventional Commits standards, and PR code review policies | [View SCM Plan ➔](https://github.com/Dsa1r/KanbanDoc/tree/3b47e0767eb01827aaf586773e629ed2ace633e9/stage3/scm) |
| **5. QA Strategy** | `qa-plan.md` | Multi-tier testing suite (Unit, Integration, E2E) and continuous integration guidelines | [View QA Plan ➔](https://github.com/Dsa1r/KanbanDoc/tree/3b47e0767eb01827aaf586773e629ed2ace633e9/stage3/qa) |

---

## Detailed Directory & File Structure

```text
stage3/
├── README.md                          ← Main Master Index & Documentation Hub
│
├── user-stories/
│   └── user-stories.md                ← MoSCoW Prioritized Requirements (1.1, 1.2...) + Acceptance Criteria
│
├── mockups/
│   ├── screens-overview.md            ← Figma File Link + Detailed Screen Breakdown Documentation
│   └── screens/                       ← Visual Mockup Screenshots & Wireframe Assets
│
├── architecture/
│   └── system-architecture.md         ← High-Level Architectural Diagrams & Client-Server Topology
│
├── class-diagram/
│   └── classes.md                     ← Object-Oriented Domain Classes (Mermaid) + Methods & Properties
│
├── database/
│   ├── er-diagram.md                  ← Entity-Relationship Diagram + Entity Descriptions & Rules
│   └── schema.sql                     ← Executable PostgreSQL Table Schema & Constraints Setup
│
├── sequence-diagrams/
│   ├── overview.md                    ← Sequence Diagrams Index & High-Level Flow Descriptions
│   ├── 01-login.md                    ← UC1: User Authentication & Token Generation Flow
│   ├── 02-view-kanban.md              ← UC2: Progress Retrieval, Task Grouping & Stage Filtering
│   ├── 03-create-template-project.md  ← UC3: Built-in Kanban Template Instantiation & Member Mapping
│   └── 04-create-custom-project.md    ← UC4: Empty Project Setup & Custom Task Insertion Loop
│
├── api/
│   └── api-specification.md           ← Complete REST API Endpoints, Payloads & Response Headers
│
├── scm/
│   └── scm-plan.md                    ← Version Control Strategy (main, dev, feature/*) & Branch Policies
│
└── qa/
    └── qa-plan.md                     ← Quality Assurance Scope, Testing Tools (pytest, RTL) & Pipeline
