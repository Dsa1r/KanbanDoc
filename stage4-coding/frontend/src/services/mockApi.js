let projects = [
  { id: 1, name: "Website Redesign", description: "Q2 digital experience refresh", icon: "📁", done: 18, total: 25, updated: "Updated 2h ago" },
  { id: 2, name: "Mobile App Launch", description: "iOS and Android release plan", icon: "📱", done: 11, total: 25, updated: "Updated yesterday" },
  { id: 3, name: "Growth Campaign", description: "Product-led acquisition sprint", icon: "✏️", done: 22, total: 25, updated: "Updated 3d ago" },
  { id: 4, name: "Customer Portal", description: "Self-serve support experience", icon: "👤", done: 5, total: 25, updated: "Updated 5d ago" },
];
let nextId = 5;

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 300));

export const getProjects = () => delay([...projects]);

export const createProject = (body) => {
  const project = {
    id: nextId++,
    description: "",
    icon: "📁",
    done: 0,
    total: 25,
    updated: "Updated just now",
    ...body,
  };
  projects.push(project);
  return delay(project);
};

export const updateProject = (id, body) => {
  projects = projects.map((p) =>
    p.id === id ? { ...p, ...body, updated: "Updated just now" } : p
  );
  return delay(projects.find((p) => p.id === id));
};

export const deleteProject = (id) => {
  projects = projects.filter((p) => p.id !== id);
  return delay(null);
};