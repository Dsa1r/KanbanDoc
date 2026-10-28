do $$ begin
    if exists (select 1 from information_schema.tables
               where table_schema = 'public' and table_name = 'tasks')
       and not exists (select 1 from information_schema.columns
               where table_schema = 'public' and table_name = 'tasks' and column_name = 'project_id') then
        alter table tasks rename to task_catalog;
        alter index if exists tasks_pkey rename to task_catalog_pkey;
    end if;
end $$;

do $$ begin
    create type project_stage as enum ('DATABASE', 'BACKEND', 'FRONTEND');
exception when duplicate_object then null; end $$;

do $$ begin
    create type task_status as enum ('TO_DO', 'IN_PROGRESS', 'TESTING_REVIEW', 'DONE');
exception when duplicate_object then null; end $$;

create table if not exists team_members (
    id uuid primary key default gen_random_uuid(),
    team_id uuid not null references teams(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    is_owner boolean not null default false,
    joined_at timestamp with time zone default current_timestamp,
    unique (team_id, user_id)
);

create table if not exists tasks (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references projects(id) on delete cascade,
    title varchar(255) not null,
    stage project_stage not null,
    current_status task_status not null default 'TO_DO',
    note text,
    description text,
    resources jsonb not null default '[]'::jsonb,
    position integer not null default 0,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp
);

alter table team_members add column if not exists is_owner boolean not null default false;
alter table projects add column if not exists is_completed boolean not null default false;

create index if not exists tasks_project_idx on tasks (project_id);
create index if not exists tasks_project_stage_idx on tasks (project_id, stage);
create index if not exists team_members_user_idx on team_members (user_id);

-- Copy existing project tasks into the new table (only when the old tables exist and tasks is empty)
do $$ begin
    if to_regclass('public.project_tasks') is not null
       and to_regclass('public.task_catalog') is not null
       and not exists (select 1 from tasks) then
        insert into tasks (project_id, title, stage, current_status, position, created_at)
        select pt.project_id,
               coalesce(pt.name, c.name),
               c.stage::text::project_stage,
               pt.current_status::text::task_status,
               row_number() over (partition by pt.project_id order by pt.task_id),
               pt.created_at
        from project_tasks pt
        join task_catalog c on c.id = pt.task_id;
    end if;
end $$;

notify pgrst, 'reload schema';