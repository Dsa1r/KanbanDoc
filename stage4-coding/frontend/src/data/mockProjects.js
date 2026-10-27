const hoursAgo = (hours) => new Date(Date.now() - hours * 3600 * 1000).toISOString();

export const mockDashboard = {
  summary_text: 'Welcome back! You have 4 active projects.',
  projects: [
    {
      project_id: 'p1',
      name: 'Website Redesign',
      description: 'Q2 digital experience refresh',
      progress: { done: 18, total: 25, percent: 72 },
      updated_at: hoursAgo(2),
    },
    {
      project_id: 'p2',
      name: 'Mobile App Launch',
      description: 'iOS and Android release plan',
      progress: { done: 11, total: 25, percent: 44 },
      updated_at: hoursAgo(24),
    },
    {
      project_id: 'p3',
      name: 'Growth Campaign',
      description: 'Product-led acquisition sprint',
      progress: { done: 22, total: 25, percent: 88 },
      updated_at: hoursAgo(72),
    },
    {
      project_id: 'p4',
      name: 'Customer Portal',
      description: 'Self-serve support experience',
      progress: { done: 5, total: 25, percent: 20 },
      updated_at: hoursAgo(120),
    },
  ],
};