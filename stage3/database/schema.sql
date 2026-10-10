-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enumerations for project stages and task statuses
create type project_stage as enum ('DATABASE', 'BACKEND', 'FRONTEND');
create type task_status as enum ('TO_DO', 'IN_PROGRESS', 'TESTING_REVIEW', 'DONE');

-- Users Table
create table users (
    id uuid primary key default uuid_generate_v4(),
    name varchar(255) not null,
    email varchar(255) unique not null,
    pass varchar(255) not null,
    phone varchar(50),
    persona varchar(100),
    created_at timestamp with time zone default current_timestamp
);

-- Teams Table
create table teams (
    id uuid primary key default uuid_generate_v4(),
    team_name varchar(255) not null,
    created_at timestamp with time zone default current_timestamp
);

-- Team Members Table
create table team_members (
    id uuid primary key default uuid_generate_v4(),
    team_id uuid references teams(id) on delete cascade,
    user_id uuid references users(id) on delete cascade
);

-- Project Templates Table
create table project_templates (
    id uuid primary key default uuid_generate_v4(),
    template_name varchar(255) not null,
    default_tasks jsonb not null
);

-- Projects Table
create table projects (
    id uuid primary key default uuid_generate_v4(),
    team_id uuid references teams(id) on delete set null,
    project_name varchar(255) not null,
    description text,
    is_completed boolean default false,
    created_at timestamp with time zone default current_timestamp
);

-- Tasks Table
create table tasks (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references projects(id) on delete cascade,
    assigned_to uuid references users(id) on delete set null,
    name varchar(255) not null,
    stage project_stage not null,
    current_status task_status default 'TO_DO',
    created_at timestamp with time zone default current_timestamp
);

-- Task Phases Table (Weak Entity)
create table task_phases (
    task_id uuid references tasks(id) on delete cascade,
    status task_status not null,
    description text,
    why_it_matters text,
    resources jsonb,
    checklist jsonb,
    primary key (task_id, status)
);
