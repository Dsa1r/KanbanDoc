# Database Design & Entity-Relationship (ER) Model

This section documents the database schema, relational entities, attributes, cardinalities, and structural design for the **DevCompass** platform using a persistent Supabase / PostgreSQL architecture.

---

## Entity-Relationship (ER) Diagram

```mermaid
flowchart TD
    USER["USER"]
    TEAM["TEAM"]
    PROJECT_TEMPLATE["PROJECT_TEMPLATE"]
    PROJECT["PROJECT"]
    TASK["TASK"]
    TASK_PHASE[["TASK_PHASE (weak)"]]

    R_TEAM_USER{"Includes"}
    R_TEAM_PROJECT{"Manages"}
    R_TEMPLATE_PROJECT{"Generates"}
    R_PROJECT_TASK{"Contains"}
    R_USER_TASK{"Assigned_To"}
    R_TASK_PHASE{"Has"}

    U_id(["<u>id</u>"])
    U_name(["name"])
    U_email(["email"])
    U_pass(["pass"])
    U_phone(["phone"])
    U_persona(["persona"])

    USER --- U_id
    USER --- U_name
    USER --- U_email
    USER --- U_pass
    USER --- U_phone
    USER --- U_persona

    T_id(["<u>id</u>"])
    T_name(["team_name"])

    TEAM --- T_id
    TEAM --- T_name

    PT_id(["<u>id</u>"])
    PT_name(["template_name"])
    PT_tasks(["default_tasks"])

    PROJECT_TEMPLATE --- PT_id
    PROJECT_TEMPLATE --- PT_name
    PROJECT_TEMPLATE --- PT_tasks

    P_id(["<u>id</u>"])
    P_name(["project_name"])
    P_desc(["description"])
    P_done(["is_completed<br/>BOOLEAN"])

    PROJECT --- P_id
    PROJECT --- P_name
    PROJECT --- P_desc
    PROJECT --- P_done

    TK_id(["<u>id</u>"])
    TK_name(["name"])
    TK_stage(["stage"])
    TK_status(["current_status<br/>ENUM('TO_DO', 'IN_PROGRESS', 'TESTING_REVIEW', 'DONE')"])

    TASK --- TK_id
    TASK --- TK_name
    TASK --- TK_stage
    TASK --- TK_status

    PH_status(["<u>status</u><br/>ENUM('TO_DO', 'IN_PROGRESS', 'TESTING_REVIEW', 'DONE')"])
    PH_desc(["description"])
    PH_why(["why_it_matters"])
    PH_res(["resources"])
    PH_check(["checklist"])

    TASK_PHASE --- PH_status
    TASK_PHASE --- PH_desc
    TASK_PHASE --- PH_why
    TASK_PHASE --- PH_res
    TASK_PHASE --- PH_check

    TEAM ---|"(0,N)"| R_TEAM_USER
    R_TEAM_USER ---|"(1,N)"| USER

    TEAM ---|"(0,1)"| R_TEAM_PROJECT
    R_TEAM_PROJECT ---|"(0,N)"| PROJECT

    PROJECT_TEMPLATE ---|"(1,1)"| R_TEMPLATE_PROJECT
    R_TEMPLATE_PROJECT ---|"(0,N)"| PROJECT

    PROJECT ---|"(1,1)"| R_PROJECT_TASK
    R_PROJECT_TASK ---|"(1,N)"| TASK

    USER ---|"(0,1)"| R_USER_TASK
    R_USER_TASK ---|"(0,N)"| TASK

    TASK ---|"(1,1)"| R_TASK_PHASE
    R_TASK_PHASE ---|"(1,4)"| TASK_PHASE
