// بيانات ثابتة للـ UI فقط. لاحقاً تقدرون تجيبونها من الـ API.
// pos = مكان العقدة والبطاقة داخل الخريطة (إحداثيات على لوحة 680×460)
export const MAP_SIZE = { w: 680, h: 460 }

export const PHASES = [
  {
    id: 1,
    name: 'Database Stage',
    accent: '#6f55a3',
    pos: { cx: 42, cy: 48, r: 39, card: { x: 96, y: 2 } },
    summary: 'Design the source of truth your product can safely grow on.',
    why: 'A thoughtful data model keeps every feature predictable. It gives your team shared language, protects data integrity, and prevents expensive migrations later.',
    build: [
      'Map the core entities and their relationships.',
      'Add constraints, indexes, and realistic seed data.',
      'Document access patterns before optimizing queries.',
    ],
    tools: [
      { name: 'PostgreSQL', note: 'Solid relational database with rich constraints.', url: 'https://www.postgresql.org' },
      { name: 'Supabase', note: 'Hosted Postgres with auth and a dashboard.', url: 'https://supabase.com' },
      { name: 'MySQL', note: 'Widely used relational database, easy to start with.', url: 'https://www.mysql.com' },
    ],
  },
  {
    id: 2,
    name: 'Backend Stage',
    accent: '#1f8a80',
    pos: { cx: 465, cy: 200, r: 37, card: { x: 519, y: 153 } },
    summary: 'Turn your data model into a secure, well-defined API.',
    why: 'The backend is where rules live. Validation, permissions, and business logic belong in one trusted place instead of being repeated across every screen.',
    build: [
      'Expose the core entities as clear REST endpoints.',
      'Validate input and return consistent error responses.',
      'Protect routes with authentication and role checks.',
    ],
    tools: [
      { name: 'Flask', note: 'Lightweight Python framework with a gentle learning curve.', url: 'https://flask.palletsprojects.com' },
      { name: 'FastAPI', note: 'Typed Python API framework with automatic docs.', url: 'https://fastapi.tiangolo.com' },
      { name: 'Express', note: 'Minimal Node.js framework for building APIs.', url: 'https://expressjs.com' },
    ],
  },
  {
    id: 3,
    name: 'Frontend Stage',
    accent: '#b0366b',
    pos: { cx: 81, cy: 407, r: 37, card: { x: 135, y: 360 } },
    summary: 'Give people a clear, friendly way to use what you built.',
    why: 'The interface is the product for most users. Clear states, helpful errors, and fast feedback make the underlying work visible and trustworthy.',
    build: [
      'Break the design into reusable components and pages.',
      'Connect screens to the API and handle loading and errors.',
      'Check keyboard use and layouts on small screens.',
    ],
    tools: [
      { name: 'React', note: 'Component library for building interactive interfaces.', url: 'https://react.dev' },
      { name: 'Vue', note: 'Approachable framework with great documentation.', url: 'https://vuejs.org' },
      { name: 'Svelte', note: 'Compiler-based framework with very little boilerplate.', url: 'https://svelte.dev' },
    ],
  },
]