-- Migration: Projects and Templates Feature
-- Description: Creates teams, project templates (with jsonb), and projects tables.


-- Teams Table (Manages groups/teams)
create table if not exists teams (
    id uuid primary key default gen_random_uuid(),
    team_name varchar(255) not null,
    created_at timestamp with time zone default current_timestamp
);

-- Project Templates Table (Stores reusable templates with default tasks in JSONB)
create table if not exists project_templates (
    id uuid primary key default gen_random_uuid(),
    template_name varchar(255) not null,
    default_tasks jsonb not null,
    created_at timestamp with time zone default current_timestamp
);

-- Projects Table (Core table for projects linked to teams)
create table if not exists projects (
    id uuid primary key default gen_random_uuid(),
    team_id uuid references teams(id) on delete set null,
    project_name varchar(255) not null,
    description text,
    is_completed boolean default false,
    created_at timestamp with time zone default current_timestamp
);