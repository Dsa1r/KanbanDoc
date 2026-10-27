import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import CreateProjectButton from '../components/CreateProjectButton.jsx';
import CreateProjectModal from '../components/CreateProjectModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { createProject, getDashboard } from '../services/projectsService.js';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [summaryText, setSummaryText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasProjects = projects.length > 0;

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

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function handleCreateProject({ title, templateId }) {
    await createProject({ title, templateId });

    const dashboard = await getDashboard();
    setProjects(dashboard.projects);
    setSummaryText(dashboard.summaryText);
    closeModal();
  }

  function renderContent() {
    if (isLoading) {
      return <p className="dashboard__status">Loading projects…</p>;
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

    return (
      <>
        <section className="dashboard__grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              completedTasks={project.completedTasks}
              totalTasks={project.totalTasks}
              updatedAt={project.updatedAt}
            />
          ))}
        </section>

        <p className="dashboard__count">
          Showing {projects.length} project workspaces
        </p>
      </>
    );
  }

  return (
    <div className="dashboard-page">
      <Header userName={user?.name} onLogout={handleLogout} />

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

      {isModalOpen && (
        <CreateProjectModal onClose={closeModal} onSubmit={handleCreateProject} />
      )}
    </div>
  );
}