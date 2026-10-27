export const BOARD_COLUMNS = [
  { id: 'todo', title: 'To Do', subtitle: '未着手', color: 'gray' },
  { id: 'in_progress', title: 'In Progress', subtitle: '作業中', color: 'blue' },
  { id: 'review', title: 'Testing/Review', subtitle: '確認中', color: 'amber' },
  { id: 'done', title: 'Done', subtitle: '完了', color: 'green' },
];

export const STAGES = [
  { id: 'db', label: 'DB' },
  { id: 'backend', label: 'Backend' },
  { id: 'frontend', label: 'Frontend' },
];

export const mockBoard = {
  project: {
    id: 'demo',
    name: 'Project workspace',
    description: 'Product release workflow · Q2 cycle',
  },
  tasks: [
    { id: 1, title: 'Define account permission schema', stage: 'db', status: 'todo', note: 'Ready to start' },
    { id: 2, title: 'Create notification preferences UI', stage: 'frontend', status: 'todo', note: 'Brief complete' },
    { id: 3, title: 'Plan webhook retry strategy', stage: 'backend', status: 'todo', note: 'Needs estimation' },
    { id: 4, title: 'Build workspace activity feed', stage: 'frontend', status: 'in_progress', note: 'Development' },
    { id: 5, title: 'Add team invitation endpoints', stage: 'backend', status: 'in_progress', note: 'API implementation' },
    { id: 6, title: 'Index project search fields', stage: 'db', status: 'in_progress', note: 'Migration running' },
    { id: 7, title: 'Validate bulk task actions', stage: 'frontend', status: 'review', note: 'QA review' },
    { id: 8, title: 'Audit session refresh flow', stage: 'backend', status: 'review', note: 'Security review' },
    { id: 9, title: 'Ship project archive workflow', stage: 'frontend', status: 'done', note: 'Released' },
    { id: 10, title: 'Normalize audit log events', stage: 'db', status: 'done', note: 'Deployed' },
  ],
};