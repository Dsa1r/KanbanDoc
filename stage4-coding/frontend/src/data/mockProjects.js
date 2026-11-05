const hoursAgo = (hours) => new Date(Date.now() - hours * 3600 * 1000).toISOString();

export const mockDashboard = {
  summary_text: 'Welcome back! You have 4 active projects.',
  projects: [
    {
      project_id: 'p1',
      is_owner: true,
      name: 'Website Redesign',
      description: 'Q2 digital experience refresh',
      progress: { done: 18, total: 25, percent: 72 },
      updated_at: hoursAgo(2),
    },
    {
      project_id: 'p2',
      is_owner: true,
      name: 'Mobile App Launch',
      description: 'iOS and Android release plan',
      progress: { done: 11, total: 25, percent: 44 },
      updated_at: hoursAgo(24),
    },
    {
      project_id: 'p3',
      is_owner: true,
      name: 'Growth Campaign',
      description: 'Product-led acquisition sprint',
      progress: { done: 22, total: 25, percent: 88 },
      updated_at: hoursAgo(72),
    },
    {
      project_id: 'p4',
      is_owner: false,
      name: 'Customer Portal',
      description: 'Self-serve support experience',
      progress: { done: 5, total: 25, percent: 20 },
      updated_at: hoursAgo(120),
    },
  ],
};

export const mockMembers = {
  p1: [
    { user_id: 'u1', email: 'noura@gmail.com', is_owner: true },
    { user_id: 'u2', email: 'reema@gmail.com', is_owner: false },
  ],
  p2: [
    { user_id: 'u1', email: 'noura@gmail.com', is_owner: true },
  ],
  p3: [
    { user_id: 'u1', email: 'noura@gmail.com', is_owner: true },
    { user_id: 'u3', email: 'dana@gmail.com', is_owner: false },
    { user_id: 'u4', email: 'areej@gmail.com', is_owner: false },
  ],
};