import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import ProjectCardSkeleton from '../components/ProjectCardSkeleton.jsx';
import ProjectFilters from '../components/ProjectFilters.jsx';
import CreateProjectButton from '../components/CreateProjectButton.jsx';
import CreateProjectModal from '../components/CreateProjectModal.jsx';
import EditProjectModal from '../components/EditProjectModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import {
  createProject,
  deleteProject,
  getDashboard,
  updateProject,
} from '../services/projectsService.js';
import { countByStatus, filterProjects } from '../utils/projectFilters.js';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [summaryText, setSummaryText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [daysFilter, setDaysFilter] = useState('any');
  const hasProjects = projects.length > 0;

  const statusCounts = useMemo(() => countByStatus(projects), [projects]);
  const visibleProjects = useMemo(
    () => filterProjects(projects, { query, status: statusFilter, days: daysFilter }),
    [projects, query, statusFilter, daysFilter],
  );
  const hasActiveFilters = query.trim() !== '' || statusFilter !== 'all' || daysFilter !== 'any';
  const showSidebar = !loadError && (isLoading || hasProjects);

  useEffect(() => {
    let ignore = false;

    getDashboard()
      .then((dashboard) => {
        if (ignore) return;
        setProjects(dashboard.projects);
        setSummaryText(dashboard.summaryText);
      })
      .catch((error) => {
        if (!ignore) setLoadError(error.message);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/auth');
  }

  function clearFilters() {
    setQuery('');
    setStatusFilter('all');
    setDaysFilter('any');
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleCreateProject(projectData) {
    const project = await createProject(projectData);

    if (project?.boardUrl) {
      closeModal();
      navigate(project.boardUrl);
      return;
    }

    const dashboard = await getDashboard();
    setProjects(dashboard.projects);
    setSummaryText(dashboard.summaryText);
    closeModal();
  }

  async function handleConfirmDelete() {
    await deleteProject(projectToDelete.id);
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== projectToDelete.id),
    );
    setProjectToDelete(null);
  }

  async function handleSaveProject(projectData) {
    await updateProject(projectToEdit.id, projectData);
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectToEdit.id
          ? { ...project, title: projectData.title, description: projectData.description }
          : project,
      ),
    );
    setProjectToEdit(null);
  }

  function renderContent() {
    if (isLoading) {
      return (
        <section className="dashboard__grid" aria-busy="true" aria-label="Loading projects">
          {Array.from({ length: 4 }, (_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </section>
      );
    }

    if (loadError) {
      return (
        <div className="dashboard__status dashboard__status--error" role="alert">
          <p>Couldn’t load your projects: {loadError}</p>
          <button
            type="button"
            className="dashboard__retry"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      );
    }

    if (!hasProjects) {
      return <EmptyState onCreate={openModal} />;
    }

    if (visibleProjects.length === 0) {
      return (
        <div className="dashboard__status">
          <p>No projects match your filters.</p>
          <button type="button" className="dashboard__retry" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      );
    }

    return (
      <>
        <section className="dashboard__grid">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              completedTasks={project.completedTasks}
              totalTasks={project.totalTasks}
              updatedAt={project.updatedAt}
              boardUrl={project.boardUrl}
              isOwner={project.isOwner}
              onEdit={() => setProjectToEdit(project)}
              onDelete={() => setProjectToDelete(project)}
            />
          ))}
        </section>

        <p className="dashboard__count">
          Showing {visibleProjects.length} of {projects.length} project workspaces
        </p>
      </>
    );
  }

  return (
    <div className="dashboard-page">
      <Header
        userName={user?.name}
        username={user?.username}
        onSettings={() => navigate('/settings')}
        onLogout={handleLogout}
      />

      <div className={`dashboard-layout ${showSidebar ? 'dashboard-layout--with-sidebar' : ''}`}>
      {showSidebar && (
        <ProjectFilters
          query={query}
          onQueryChange={setQuery}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          days={daysFilter}
          onDaysChange={setDaysFilter}
          counts={statusCounts}
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
          disabled={isLoading}
        />
      )}

      <main className="dashboard">
        <header className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">Your workspace</p>
            <h1 className="dashboard__title">My Project Workspaces</h1>
            <p className="dashboard__subtitle">
              {summaryText || 'Manage ongoing projects and create new spaces for your work.'}
            </p>
          </div>

          {hasProjects && <CreateProjectButton onClick={openModal} />}
        </header>

        {renderContent()}
      </main>
      </div>

      {isModalOpen && (
        <CreateProjectModal onClose={closeModal} onSubmit={handleCreateProject} />
      )}

      {projectToEdit && (
        <EditProjectModal
          projectId={projectToEdit.id}
          onClose={() => setProjectToEdit(null)}
          onSave={handleSaveProject}
        />
      )}

      {projectToDelete && (
        <ConfirmDialog
          title={`Delete "${projectToDelete.title}"?`}
          message="This will permanently delete the project, its tasks and its members. This can't be undone."
          confirmLabel="Delete"
          pendingLabel="Deleting…"
          onConfirm={handleConfirmDelete}
          onCancel={() => setProjectToDelete(null)}
        />
      )}
    </div>
  );
}