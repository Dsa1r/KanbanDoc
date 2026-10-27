export const BOARD_COLUMNS = [
  { id: 'todo', title: 'To Do', subtitle: '未着手', color: 'gray' },
  { id: 'in_progress', title: 'In Progress', subtitle: '作業中', color: 'blue' },
  { id: 'review', title: 'Testing/Review', subtitle: '確認中', color: 'amber' },
  { id: 'done', title: 'Done', subtitle: '完了', color: 'green' },
];

export const STAGES = [
  { id: 'db', label: 'DB' },
  { id: 'backend', label: 'Backend' },
  { id: 'frontend', label: 'Frontend' },
];

export const mockBoard = {
  project: {
    id: 'demo',
    name: 'My first web app',
    description: 'Full stack project · Starter template',
  },
  tasks: [
    // ---------- DB ----------
    {
      id: 1,
      title: 'Create the database tables',
      stage: 'db',
      status: 'todo',
      note: 'Follow your ERD · e.g. PostgreSQL',
      description: 'Turn your ERD into real tables. Create one table per entity with clear column names and the right data types.',
      resources: [
        { label: 'PostgreSQL: Table basics', url: 'https://www.postgresql.org/docs/current/ddl-basics.html' },
        { label: 'PostgreSQL: Data types', url: 'https://www.postgresql.org/docs/current/datatype.html' },
      ],
    },
    {
      id: 2,
      title: 'Add relations and constraints',
      stage: 'db',
      status: 'todo',
      note: 'Primary, foreign and unique keys',
      description: 'Link tables with foreign keys and protect your data with primary keys, unique and not-null constraints.',
      resources: [
        { label: 'PostgreSQL: Constraints', url: 'https://www.postgresql.org/docs/current/ddl-constraints.html' },
      ],
    },
    {
      id: 3,
      title: 'Add indexes for common queries',
      stage: 'db',
      status: 'todo',
      note: 'Speed up searches and filters',
      description: 'Add indexes to the columns you search or filter by most, so queries stay fast as your data grows.',
      resources: [
        { label: 'PostgreSQL: Indexes', url: 'https://www.postgresql.org/docs/current/indexes.html' },
      ],
    },
    {
      id: 4,
      title: 'Add seed data for testing',
      stage: 'db',
      status: 'todo',
      note: 'A few sample rows per table',
      description: 'Insert a few realistic rows in each table so you can test the app without typing data by hand.',
      resources: [
        { label: 'PostgreSQL: INSERT', url: 'https://www.postgresql.org/docs/current/sql-insert.html' },
      ],
    },

    // ---------- Backend ----------
    {
      id: 5,
      title: 'Set up the backend project',
      stage: 'backend',
      status: 'todo',
      note: 'e.g. Flask, Express · folders and .env',
      description: 'Create the project, organize your folders (routes, services, models) and keep secrets in a .env file that is never pushed to GitHub.',
      resources: [
        { label: 'The Twelve-Factor App: Config', url: 'https://12factor.net/config' },
        { label: 'Flask documentation', url: 'https://flask.palletsprojects.com/' },
        { label: 'Express documentation', url: 'https://expressjs.com/' },
      ],
    },
    {
      id: 6,
      title: 'Connect the backend to the database',
      stage: 'backend',
      status: 'todo',
      note: 'Test the connection first',
      description: 'Connect using environment variables, then run a simple query to confirm the connection works.',
      resources: [
        { label: 'Supabase Python client', url: 'https://supabase.com/docs/reference/python/introduction' },
      ],
    },
    {
      id: 7,
      title: 'Build sign up and login endpoints',
      stage: 'backend',
      status: 'todo',
      note: 'Hash passwords, return a token',
      description: 'Let users create an account and log in. Never store plain passwords: hash them, and return a token after a successful login.',
      resources: [
        { label: 'OWASP: Password storage', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html' },
        { label: 'Introduction to JWT', url: 'https://jwt.io/introduction' },
      ],
    },
    {
      id: 8,
      title: 'Build CRUD endpoints for the main feature',
      stage: 'backend',
      status: 'todo',
      note: 'Create, read, update, delete',
      description: 'Create endpoints to create, read, update and delete your main resource, using the right HTTP method for each one.',
      resources: [
        { label: 'MDN: HTTP request methods', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods' },
      ],
    },
    {
      id: 9,
      title: 'Validate input and handle errors',
      stage: 'backend',
      status: 'todo',
      note: 'Clear messages and status codes',
      description: 'Check every request before using it, and return clear error messages with the correct status codes.',
      resources: [
        { label: 'MDN: HTTP status codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' },
      ],
    },
    {
      id: 10,
      title: 'Test the API endpoints',
      stage: 'backend',
      status: 'todo',
      note: 'e.g. Postman, Thunder Client',
      description: 'Call each endpoint with valid and invalid data to make sure it behaves the way you expect.',
      resources: [
        { label: 'Postman documentation', url: 'https://learning.postman.com/docs/' },
      ],
    },
    {
      id: 11,
      title: 'Document the API',
      stage: 'backend',
      status: 'todo',
      note: 'Request and response examples',
      description: 'Write down every endpoint: its URL, method, request body and response, so the frontend team can use it without guessing.',
      resources: [
        { label: 'Swagger documentation', url: 'https://swagger.io/docs/' },
      ],
    },

    // ---------- Frontend ----------
    {
      id: 12,
      title: 'Set up the frontend project',
      stage: 'frontend',
      status: 'todo',
      note: 'e.g. React + Vite · add routing',
      description: 'Create the React app, add routing, and organize folders for pages, components and services.',
      resources: [
        { label: 'Vite guide', url: 'https://vite.dev/guide/' },
        { label: 'React Router', url: 'https://reactrouter.com/' },
      ],
    },
    {
      id: 13,
      title: 'Build the sign up and login pages',
      stage: 'frontend',
      status: 'todo',
      note: 'Follow the design',
      description: 'Build the auth forms with input validation and clear error messages.',
      resources: [
        { label: 'React: Reacting to input with state', url: 'https://react.dev/learn/reacting-to-input-with-state' },
      ],
    },
    {
      id: 14,
      title: 'Build the main pages',
      stage: 'frontend',
      status: 'todo',
      note: 'One component at a time',
      description: 'Split each page into small reusable components and build them one at a time.',
      resources: [
        { label: 'React: Thinking in React', url: 'https://react.dev/learn/thinking-in-react' },
      ],
    },
    {
      id: 15,
      title: 'Style the pages to match the design',
      stage: 'frontend',
      status: 'todo',
      note: 'CSS, Tailwind or any tool',
      description: 'Match the colors, fonts and spacing from the design. Use variables so your styles stay consistent.',
      resources: [
        { label: 'MDN: CSS', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
        { label: 'MDN: CSS custom properties', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties' },
      ],
    },
    {
      id: 16,
      title: 'Connect the pages to the API',
      stage: 'frontend',
      status: 'todo',
      note: 'Send the token with requests',
      description: 'Fetch real data from the backend and send the user token with every protected request.',
      resources: [
        { label: 'MDN: Using Fetch', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch' },
      ],
    },
    {
      id: 17,
      title: 'Add loading, empty and error states',
      stage: 'frontend',
      status: 'todo',
      note: 'Never leave a blank screen',
      description: 'Show the user what is happening while data loads, when there is nothing to show, and when something fails.',
      resources: [
        { label: 'React: Conditional rendering', url: 'https://react.dev/learn/conditional-rendering' },
      ],
    },
    {
      id: 18,
      title: 'Make the layout responsive',
      stage: 'frontend',
      status: 'todo',
      note: 'Test on a phone width',
      description: 'Make every page work on small screens using flexible layouts and media queries.',
      resources: [
        { label: 'web.dev: Learn responsive design', url: 'https://web.dev/learn/design/' },
      ],
    },
  ],
};