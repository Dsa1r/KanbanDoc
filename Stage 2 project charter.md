Stage 2: The Project Charter The final document
---

### The purpose of DevCompass

To bridge the gap between complex enterprise project management tools and junior developers. By stripping away traditional administrative clutter and introducing automation, DevCompass provides junior developers with a clean, low-friction workspace that reduces cognitive overload, speeds up onboarding, and minimizes the time senior engineers spend answering repetitive workflow questions.


### Project Objectives: 


# Objective 1:  
Develop a functional MVP of DevCompass within the project timeframe, featuring a simplified columns Kanban workflow.
# Objective 2: 
Implement a dynamic “Next Up” banner that automatically identifies and displays the user's highest-priority next task, reducing uncertainty about what to work on next.
# Objective 3: 
Optimize the workflow application to achieve a task-creation time under at most 5 seconds for a new user supported by contextual tooltips to explain concepts to junior developers.
# Objective 4:
Attracting 20 users (student/trainee) to try the platform in the launch week.


### Stakeholders and Roles: A list of all stakeholders and a description of team roles.

## Stakeholders:
Junior Developers: Bootcamp Students (End Users): The primary consumers who utilize the interface to track tasks without project management fatigue.
Course Instructors: Evaluators: the primary stakeholders, who evaluate the charter,and grade the DevCompass application. 
Development Team: The team who are  responsible for design, construction and testing DevCompass.

## Team Roles:
Full Stack (User & Dashboard Domain)
Full Stack ((Curriculum & Provisioning Domain)
Full Stack (Kanban Frame & Movement)
Full Stack (Rich Card & QA Domain)

• Scope: In-scope and out-of-scope items.

## In Scope:
Simplified Kanban Interface: specific columns could include the next but not limited: Triage and design/ active coding/ Testing/ Review and Merge strictly tracking immediate engineering tasks.
The "Next Up" Banner: A dedicated UI anchor showing the single most critical task a developer should focus on next.
A login system for each student that saves his team progress and the status of the cards in the database.
task cards with (job description, checklist for self-check, and Postman/cURL codes for the experiment).

## Out Scope: 
Full Enterprise Customizations: Custom workflows, or complex sprint velocity charting (leave this to Jira).
Native Billing Code Processing: Building a fully integrated credit card processing engine.
Multi-Language Support: Localizing the platform interface into languages other than English for the initial launch.
Senior software developer adding the tasks.
AI Blocking Assistant: A text-based assistant to help developers resolve code blockers natively inside their task cards.


### Risks: Potential risks with mitigation strategies.

# Risk 1: Drag-and-Drop Technical Complexity: Building a system for moving cards from scratch can be difficult and time-consuming.
Mitigation: Using a documented and ready-to-drag and-drop React library instead of building the entire system from scratch.

# Risk 2: Limited Development Time: The team may spend too much time improving the design or adding advanced features.
Mitigation: Set clear milestones for each stage and move on to the next stage once the basic MVP requirements are met.

# Risk 3: junior development failure: Integration Disconnect. If you skip the UML step and start coding immediately, this is what typically happens to a team of 4:Developer A writes frontend code expecting a variable named “task_title” .Developer B writes backend code naming the exact same field “title_name” . When you try to merge your code in Week 5 for example, the application breaks completely, and you lose days rewriting code.
Mitigation: By creating and locking in the Database UML right now in Week 1, all 4 team members have an identical reference point. The frontend developers know exactly what variables to request, and the backend developers know exactly what data schema to build.


### High-Level Plan: Timeline or phases of the project.

Stage 1 — Team Formation and Idea Development (Duration: 1 Week)
• Form the core team and establish collaborative workflows.
• Brainstorm, evaluate at least 3 project ideas, and align on learning goals.
• Finalize and lock in the selected MVP concept (DevCompass).

Stage 2 — Project Charter Development (Duration: 1 Week)
• Define project purpose and establish 2-3 SMART objectives.
• Outline stakeholders, team roles, and full-stack ownership.
• Establish project scope (In-Scope and Out-of-Scope items).
• Identify potential risks and document mitigation strategies.
• Outline the high-level project timeline and phases.

Stage 3 — Technical Documentation (Duration: 2 Weeks)
• Create prioritized User Stories and UI mockups in Figma.
• Design the high-level system architecture and database schema / ER diagrams.
• Map out sequence diagrams and internal/external API specifications.
• Document Source Control Management (SCM) and Quality Assurance (QA) plans, along with technical justifications.

Stage 4 — MVP Development and Execution (Duration: 6 Weeks)
• Project Setup: Initialize Frontend, Backend, and DB repositories, configure Git/GitHub, deploy systems, and set up project management tracking tools with individual tasks.
• Core Authentication: Implement end-to-end authentication (Login, Sign up, Logout) across Frontend, API, and DB, alongside the Home page.
• Feature Development - Milestone 1: Reach 50% completion of the main core features (Kanban columns and 'Next Up' Action Banner).
• Feature Development - Milestone 2: Reach 100% completion of the main core features.
• Integrations & Secondary Features: Complete secondary features and any required third-party integrations.
• Testing & Polish: Execute unit and integration testing, resolve bugs, and polish optional features.

Stage 5 — Project Closure (Duration: 2 Weeks)
• Finalize project deliverables including the project poster, presentation, and landing page.
• Perform a final review across the entire project to ensure complete readiness.




