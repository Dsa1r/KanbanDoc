import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/apiClient";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // GET: يجيب المشاريع أول ما تفتح الصفحة
  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const refresh = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  // POST: إنشاء مشروع
  const handleCreate = async () => {
    const name = prompt("Project name?");
    if (!name) return;
    await createProject({ name, description: "" });
    refresh();
  };

  // PUT: تعديل الاسم
  const handleRename = async (project) => {
    const name = prompt("New name?", project.name);
    if (!name) return;
    await updateProject(project.id, { name });
    refresh();
  };

  // DELETE: حذف
  const handleDelete = async (project) => {
    if (!confirm(`Delete "${project.name}"?`)) return;
    await deleteProject(project.id);
    refresh();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {error}</p>;

  return (
    <div style={{ padding: 24, textAlign: "left" }}>
      <h1>My Project Workspaces</h1>
      <button onClick={handleCreate}>+ Generate New Project</button>

      {projects.length === 0 && <p>No projects yet.</p>}

      {projects.map((project) => (
        <div
          key={project.id}
          style={{ border: "1px solid #ccc", margin: "12px 0", padding: 12 }}
        >
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <button onClick={() => handleRename(project)}>Edit</button>{" "}
          <button onClick={() => handleDelete(project)}>Delete</button>
        </div>
      ))}
    </div>
  );
}