import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/apiClient";
import "./Projects.css";

const percentOf = (done, total) => (total > 0 ? Math.round((done / total) * 100) : 0);

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // GET
  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // أي كليك خارج القائمة يقفلها
  useEffect(() => {
    const close = () => setOpenMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const refresh = async () => setProjects(await getProjects());

  // POST
  const handleCreate = async () => {
    const name = prompt("Project name?");
    if (!name) return;
    await createProject({ name });
    refresh();
  };

  // PUT
  const handleRename = async (project) => {
    const name = prompt("New name?", project.name);
    if (!name) return;
    await updateProject(project.id, { name });
    refresh();
  };

  // DELETE
  const handleDelete = async (project) => {
    if (!confirm(`Delete "${project.name}"?`)) return;
    await deleteProject(project.id);
    refresh();
  };

  return (
    <div>
      <header className="topbar">
        <div className="brand serif">
          <div className="brand-logo">◎</div>
          DevCompass
        </div>
        <div className="topbar-right">
          <span>🔍</span>
          <div className="avatar">AK</div>
        </div>
      </header>

      <main className="page">
        <div className="eyebrow">Your workspace</div>

        <div className="page-head">
          <div>
            <h1 className="serif">My Project Workspaces</h1>
            <p>Manage ongoing projects and create new spaces for your work.</p>
          </div>
          <button className="btn-primary" onClick={handleCreate}>
            + Generate New Project
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p>Something went wrong: {error}</p>}

        <div className="grid">
          {projects.map((p) => {
            const percent = percentOf(p.done, p.total);
            return (
              <div className="card" key={p.id}>
                <div className="card-top">
                  <div className="card-icon">{p.icon}</div>
                  <button
                    className="menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === p.id ? null : p.id);
                    }}
                  >
                    ···
                  </button>
                </div>

                {openMenuId === p.id && (
                  <div className="menu">
                    <button onClick={() => handleRename(p)}>Edit name</button>
                    <button className="danger" onClick={() => handleDelete(p)}>
                      Delete
                    </button>
                  </div>
                )}

                <h3 className="serif">{p.name}</h3>
                <p className="desc">{p.description || "No description"}</p>

                <div className="progress-row">
                  <span>
                    {p.done} of {p.total} tasks
                  </span>
                  <span>{percent}%</span>
                </div>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${percent}%` }} />
                </div>

                <div className="card-footer">{p.updated}</div>
              </div>
            );
          })}
        </div>

        <div className="page-footer">
          <span>Showing {projects.length} project workspaces</span>
          <a>View archived projects</a>
        </div>
      </main>
    </div>
  );
}