export const STATUS_OPTIONS = [
  { value: 'all', label: 'All projects' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'not-started', label: 'Not started' },
];

export const DAYS_OPTIONS = [
  { value: 'any', label: 'Any time' },
  { value: 'today', label: 'Today' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: 'older', label: 'Older than 30 days' },
];

const DAY_MS = 24 * 60 * 60 * 1000;

// completed: every task is done · in-progress: at least one task done · not-started: nothing done yet
export function getProjectStatus({ completedTasks, totalTasks }) {
  if (totalTasks > 0 && completedTasks >= totalTasks) return 'completed';
  if (completedTasks > 0) return 'in-progress';
  return 'not-started';
}

function matchesDays(updatedAtDate, days) {
  if (days === 'any') return true;
  if (!updatedAtDate) return false; // no date: it cannot match a day filter

  const updated = new Date(updatedAtDate);
  if (Number.isNaN(updated.getTime())) return false;

  const ageInDays = (Date.now() - updated.getTime()) / DAY_MS;

  if (days === 'today') return updated.toDateString() === new Date().toDateString();
  if (days === 'older') return ageInDays > 30;
  return ageInDays <= Number(days);
}

export function filterProjects(projects, { query = '', status = 'all', days = 'any' }) {
  const text = query.trim().toLowerCase();

  return projects.filter((project) => {
    if (text && !project.title.toLowerCase().includes(text)) return false;
    if (status !== 'all' && getProjectStatus(project) !== status) return false;
    return matchesDays(project.updatedAtDate, days);
  });
}

// How many projects each status has (shown next to the options in the sidebar)
export function countByStatus(projects) {
  const counts = { all: projects.length, 'in-progress': 0, completed: 0, 'not-started': 0 };
  projects.forEach((project) => {
    counts[getProjectStatus(project)] += 1;
  });
  return counts;
}