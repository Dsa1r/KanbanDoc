import { useState } from 'react';
import Header from '../components/Header.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import CreateProjectButton from '../components/CreateProjectButton.jsx';
import CreateProjectModal from '../components/CreateProjectModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import './Home.css';

function Home() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasProjects = projects.length > 0;

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleCreateProject({ title, templateId }) {
    // TODO (backend): send POST request to the API here,
    // then use the project returned by the server instead of newProject.
    const newProject = {
      id: crypto.randomUUID(),
      title,
      templateId,
      completedTasks: 0,
      totalTasks: 0,
      updatedAt: 'just now',
    };

    setProjects((prevProjects) => [newProject, ...prevProjects]);
    closeModal();
  }

  return (
    <>
      <Header />

      <main className="dashboard">
        <header className="dashboard__header">
          <div>
            <p className="dashboard__eyebrow">Your workspace</p>
            <h1 className="dashboard__title">My Project Workspaces</h1>
            <p className="dashboard__subtitle">
              Manage ongoing projects and create new spaces for your work.
            </p>
          </div>

          {hasProjects && <CreateProjectButton onClick={openModal} />}
        </header>

        {hasProjects ? (
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
        ) : (
          <EmptyState onCreate={openModal} />
        )}
      </main>

      {isModalOpen && (
        <CreateProjectModal onClose={closeModal} onSubmit={handleCreateProject} />
      )}
    </>
  );
}

export default Home;