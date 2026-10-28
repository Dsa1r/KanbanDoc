
STARTER_TASKS = [
    {
        "title": "Create the database tables",
        "stage": "DATABASE",
        "note": "Follow your ERD · e.g. PostgreSQL",
        "description": "Turn your ERD into real tables. Create one table per entity with clear column names and the right data types.",
        "resources": [
            {
                "label": "PostgreSQL: Table basics",
                "url": "https://www.postgresql.org/docs/current/ddl-basics.html"
            },
            {
                "label": "PostgreSQL: Data types",
                "url": "https://www.postgresql.org/docs/current/datatype.html"
            }
        ]
    },
    {
        "title": "Add relations and constraints",
        "stage": "DATABASE",
        "note": "Primary, foreign and unique keys",
        "description": "Link tables with foreign keys and protect your data with primary keys, unique and not-null constraints.",
        "resources": [
            {
                "label": "PostgreSQL: Constraints",
                "url": "https://www.postgresql.org/docs/current/ddl-constraints.html"
            }
        ]
    },
    {
        "title": "Add indexes for common queries",
        "stage": "DATABASE",
        "note": "Speed up searches and filters",
        "description": "Add indexes to the columns you search or filter by most, so queries stay fast as your data grows.",
        "resources": [
            {
                "label": "PostgreSQL: Indexes",
                "url": "https://www.postgresql.org/docs/current/indexes.html"
            }
        ]
    },
    {
        "title": "Add seed data for testing",
        "stage": "DATABASE",
        "note": "A few sample rows per table",
        "description": "Insert a few realistic rows in each table so you can test the app without typing data by hand.",
        "resources": [
            {
                "label": "PostgreSQL: INSERT",
                "url": "https://www.postgresql.org/docs/current/sql-insert.html"
            }
        ]
    },
    {
        "title": "Set up the backend project",
        "stage": "BACKEND",
        "note": "e.g. Flask, Express · folders and .env",
        "description": "Create the project, organize your folders (routes, services, models) and keep secrets in a .env file that is never pushed to GitHub.",
        "resources": [
            {
                "label": "The Twelve-Factor App: Config",
                "url": "https://12factor.net/config"
            },
            {
                "label": "Flask documentation",
                "url": "https://flask.palletsprojects.com/"
            },
            {
                "label": "Express documentation",
                "url": "https://expressjs.com/"
            }
        ]
    },
    {
        "title": "Connect the backend to the database",
        "stage": "BACKEND",
        "note": "Test the connection first",
        "description": "Connect using environment variables, then run a simple query to confirm the connection works.",
        "resources": [
            {
                "label": "Supabase Python client",
                "url": "https://supabase.com/docs/reference/python/introduction"
            }
        ]
    },
    {
        "title": "Build sign up and login endpoints",
        "stage": "BACKEND",
        "note": "Hash passwords, return a token",
        "description": "Let users create an account and log in. Never store plain passwords: hash them, and return a token after a successful login.",
        "resources": [
            {
                "label": "OWASP: Password storage",
                "url": "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"
            },
            {
                "label": "Introduction to JWT",
                "url": "https://jwt.io/introduction"
            }
        ]
    },
    {
        "title": "Build CRUD endpoints for the main feature",
        "stage": "BACKEND",
        "note": "Create, read, update, delete",
        "description": "Create endpoints to create, read, update and delete your main resource, using the right HTTP method for each one.",
        "resources": [
            {
                "label": "MDN: HTTP request methods",
                "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods"
            }
        ]
    },
    {
        "title": "Validate input and handle errors",
        "stage": "BACKEND",
        "note": "Clear messages and status codes",
        "description": "Check every request before using it, and return clear error messages with the correct status codes.",
        "resources": [
            {
                "label": "MDN: HTTP status codes",
                "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
            }
        ]
    },
    {
        "title": "Test the API endpoints",
        "stage": "BACKEND",
        "note": "e.g. Postman, Thunder Client",
        "description": "Call each endpoint with valid and invalid data to make sure it behaves the way you expect.",
        "resources": [
            {
                "label": "Postman documentation",
                "url": "https://learning.postman.com/docs/"
            }
        ]
    },
    {
        "title": "Document the API",
        "stage": "BACKEND",
        "note": "Request and response examples",
        "description": "Write down every endpoint: its URL, method, request body and response, so the frontend team can use it without guessing.",
        "resources": [
            {
                "label": "Swagger documentation",
                "url": "https://swagger.io/docs/"
            }
        ]
    },
    {
        "title": "Set up the frontend project",
        "stage": "FRONTEND",
        "note": "e.g. React + Vite · add routing",
        "description": "Create the React app, add routing, and organize folders for pages, components and services.",
        "resources": [
            {
                "label": "Vite guide",
                "url": "https://vite.dev/guide/"
            },
            {
                "label": "React Router",
                "url": "https://reactrouter.com/"
            }
        ]
    },
    {
        "title": "Build the sign up and login pages",
        "stage": "FRONTEND",
        "note": "Follow the design",
        "description": "Build the auth forms with input validation and clear error messages.",
        "resources": [
            {
                "label": "React: Reacting to input with state",
                "url": "https://react.dev/learn/reacting-to-input-with-state"
            }
        ]
    },
    {
        "title": "Build the main pages",
        "stage": "FRONTEND",
        "note": "One component at a time",
        "description": "Split each page into small reusable components and build them one at a time.",
        "resources": [
            {
                "label": "React: Thinking in React",
                "url": "https://react.dev/learn/thinking-in-react"
            }
        ]
    },
    {
        "title": "Style the pages to match the design",
        "stage": "FRONTEND",
        "note": "CSS, Tailwind or any tool",
        "description": "Match the colors, fonts and spacing from the design. Use variables so your styles stay consistent.",
        "resources": [
            {
                "label": "MDN: CSS",
                "url": "https://developer.mozilla.org/en-US/docs/Web/CSS"
            },
            {
                "label": "MDN: CSS custom properties",
                "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties"
            }
        ]
    },
    {
        "title": "Connect the pages to the API",
        "stage": "FRONTEND",
        "note": "Send the token with requests",
        "description": "Fetch real data from the backend and send the user token with every protected request.",
        "resources": [
            {
                "label": "MDN: Using Fetch",
                "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"
            }
        ]
    },
    {
        "title": "Add loading, empty and error states",
        "stage": "FRONTEND",
        "note": "Never leave a blank screen",
        "description": "Show the user what is happening while data loads, when there is nothing to show, and when something fails.",
        "resources": [
            {
                "label": "React: Conditional rendering",
                "url": "https://react.dev/learn/conditional-rendering"
            }
        ]
    },
    {
        "title": "Make the layout responsive",
        "stage": "FRONTEND",
        "note": "Test on a phone width",
        "description": "Make every page work on small screens using flexible layouts and media queries.",
        "resources": [
            {
                "label": "web.dev: Learn responsive design",
                "url": "https://web.dev/learn/design/"
            }
        ]
    }
]