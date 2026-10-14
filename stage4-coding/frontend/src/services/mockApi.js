let projects = [
  { id: 1, name: "Website Redesign", description: "Q2 digital experience refresh" },
  { id: 2, name: "Mobile App Launch", description: "iOS and Android release plan" },
  { id: 3, name: "Growth Campaign", description: "Product-led acquisition sprint" },
  { id: 4, name: "Customer Portal", description: "Self-serve support experience" },
];
let nextId = 5;

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 300));

export const getProjects = () => delay([...projects]);

export const createProject = (body) => {
  const project = { id: nextId++, ...body };
  projects.push(project);
  return delay(project);
};

export const updateProject = (id, body) => {
  projects = projects.map((p) => (p.id === id ? { ...p, ...body } : p));
  return delay(projects.find((p) => p.id === id));
};

export const deleteProject = (id) => {
  projects = projects.filter((p) => p.id !== id);
  return delay(null);
};