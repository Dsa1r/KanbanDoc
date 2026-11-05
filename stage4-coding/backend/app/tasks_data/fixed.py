
FIXED_TASKS = [
    {
        "title": "Define Project Requirements",
        "stage": "DATABASE",
        "phases": {
            "TO_DO": {
                "description": "Identify stakeholders and document the functional and non-functional requirements of the project.",
                "why_it_matters": "Clear requirements establish the project scope and prevent misunderstandings during development.",
                "resources": [],
                "checklist": [
                    "Identify project stakeholders",
                    "Collect functional requirements",
                    "Collect non-functional requirements",
                    "Document project requirements"
                ]
            },
            "IN_PROGRESS": {
                "description": "Organize requirements into user stories and define acceptance criteria for each feature.",
                "why_it_matters": "Organizing requirements makes development tasks easier to understand and prioritize.",
                "resources": [],
                "checklist": [
                    "Write user stories",
                    "Define acceptance criteria",
                    "Prioritize requirements",
                    "Review requirements with the team"
                ]
            },
            "TESTING_REVIEW": {
                "description": "Review the documented requirements and check for missing, unclear, or conflicting information.",
                "why_it_matters": "Reviewing requirements helps detect problems before implementation begins.",
                "resources": [],
                "checklist": [
                    "Review all requirements",
                    "Check for missing requirements",
                    "Identify conflicting requirements",
                    "Verify acceptance criteria"
                ]
            },
            "DONE": {
                "description": "Finalize the requirements documentation and obtain approval from the project stakeholders.",
                "why_it_matters": "An approved requirements document provides a reliable reference for the development team.",
                "resources": [],
                "checklist": [
                    "Finalize requirements documentation",
                    "Verify stakeholder approval",
                    "Store the approved document"
                ]
            }
        }
    },

    {
        "title": "Design Database Schema",
        "stage": "DATABASE",
        "phases": {
            "TO_DO": {
                "description": "Identify the entities, attributes, relationships, and business rules required by the application.",
                "why_it_matters": "Understanding the data structure before implementation prevents database design problems.",
                "resources": [],
                "checklist": [
                    "Identify database entities",
                    "List entity attributes",
                    "Identify relationships",
                    "Define business rules"
                ]
            },
            "IN_PROGRESS": {
                "description": "Create the Entity Relationship Diagram and define primary keys, foreign keys, and database constraints.",
                "why_it_matters": "A structured schema ensures consistent relationships and organized data storage.",
                "resources": [],
                "checklist": [
                    "Create the ER diagram",
                    "Define primary keys",
                    "Define foreign keys",
                    "Specify data types and constraints"
                ]
            },
            "TESTING_REVIEW": {
                "description": "Review the database schema for normalization issues, incorrect relationships, and missing constraints.",
                "why_it_matters": "Schema validation reduces data redundancy and prevents integrity problems.",
                "resources": [],
                "checklist": [
                    "Review entity relationships",
                    "Check normalization",
                    "Verify foreign key constraints",
                    "Check for redundant attributes"
                ]
            },
            "DONE": {
                "description": "Finalize and document the database schema.",
                "why_it_matters": "A finalized schema provides the foundation for database implementation.",
                "resources": [],
                "checklist": [
                    "Finalize the ER diagram",
                    "Document database tables",
                    "Confirm schema approval"
                ]
            }
        }
    },

    {
        "title": "Set Up Development Environment",
        "stage": "BACKEND",
        "phases": {
            "TO_DO": {
                "description": "Identify the programming languages, frameworks, libraries, and tools required for development.",
                "why_it_matters": "Selecting the appropriate tools ensures a consistent development environment.",
                "resources": [],
                "checklist": [
                    "Identify required technologies",
                    "Select development tools",
                    "Define project dependencies"
                ]
            },
            "IN_PROGRESS": {
                "description": "Configure the project structure, install dependencies, set up environment variables, and initialize version control.",
                "why_it_matters": "A properly configured environment helps developers work consistently and efficiently.",
                "resources": [],
                "checklist": [
                    "Create project directories",
                    "Install required dependencies",
                    "Configure environment variables",
                    "Initialize Git repository"
                ]
            },
            "TESTING_REVIEW": {
                "description": "Verify that all dependencies and configurations work correctly and that the application starts successfully.",
                "why_it_matters": "Testing the environment early prevents configuration issues from interrupting development.",
                "resources": [],
                "checklist": [
                    "Verify dependency installation",
                    "Check environment variables",
                    "Run the application",
                    "Resolve configuration errors"
                ]
            },
            "DONE": {
                "description": "Confirm that the development environment is configured and ready for the team.",
                "why_it_matters": "A ready environment allows development tasks to begin without setup delays.",
                "resources": [],
                "checklist": [
                    "Verify project setup",
                    "Confirm application startup",
                    "Document setup instructions"
                ]
            }
        }
    },

    {
        "title": "Implement User Authentication",
        "stage": "BACKEND",
        "phases": {
            "TO_DO": {
                "description": "Define the authentication requirements, including registration, login, logout, and access control.",
                "why_it_matters": "Authentication requirements determine how users access and interact with the application.",
                "resources": [],
                "checklist": [
                    "Define registration requirements",
                    "Define login requirements",
                    "Identify authorization rules",
                    "Define password security requirements"
                ]
            },
            "IN_PROGRESS": {
                "description": "Implement authentication endpoints, password hashing, token generation, and token validation.",
                "why_it_matters": "Secure authentication protects user accounts and restricts access to authorized users.",
                "resources": [],
                "checklist": [
                    "Implement user registration",
                    "Implement user login",
                    "Hash user passwords",
                    "Implement token validation"
                ]
            },
            "TESTING_REVIEW": {
                "description": "Test authentication using valid and invalid credentials and verify access restrictions.",
                "why_it_matters": "Authentication testing helps identify security weaknesses and access control errors.",
                "resources": [],
                "checklist": [
                    "Test valid login credentials",
                    "Test invalid login credentials",
                    "Test token expiration",
                    "Verify protected endpoints"
                ]
            },
            "DONE": {
                "description": "Verify that authentication and authorization work correctly across the application.",
                "why_it_matters": "Completed authentication ensures that application access follows the defined security rules.",
                "resources": [],
                "checklist": [
                    "Verify registration",
                    "Verify login and logout",
                    "Verify authorization",
                    "Document authentication endpoints"
                ]
            }
        }
    },

    {
        "title": "Build REST API",
        "stage": "BACKEND",
        "phases": {
            "TO_DO": {
                "description": "Identify the API endpoints, HTTP methods, request parameters, and expected response formats.",
                "why_it_matters": "API planning establishes how the frontend and backend will communicate.",
                "resources": [],
                "checklist": [
                    "List required API endpoints",
                    "Select HTTP methods",
                    "Define request structures",
                    "Define response structures"
                ]
            },
            "IN_PROGRESS": {
                "description": "Implement API routes, business logic, request validation, and error handling.",
                "why_it_matters": "API implementation provides the functionality required by the frontend.",
                "resources": [],
                "checklist": [
                    "Create API routes",
                    "Implement service functions",
                    "Add request validation",
                    "Implement error handling"
                ]
            },
            "TESTING_REVIEW": {
                "description": "Test API endpoints using different requests and verify response data and HTTP status codes.",
                "why_it_matters": "API testing ensures that endpoints behave correctly under different conditions.",
                "resources": [],
                "checklist": [
                    "Test successful requests",
                    "Test invalid requests",
                    "Verify HTTP status codes",
                    "Check response structures"
                ]
            },
            "DONE": {
                "description": "Finalize the API implementation and document the available endpoints.",
                "why_it_matters": "API documentation helps frontend developers and other team members use the backend correctly.",
                "resources": [],
                "checklist": [
                    "Verify all endpoints",
                    "Finalize API documentation",
                    "Confirm API functionality"
                ]
            }
        }
    },

    {
        "title": "Implement Data Persistence",
        "stage": "BACKEND",
        "phases": {
            "TO_DO": {
                "description": "Identify the data that must be stored and define the required database operations.",
                "why_it_matters": "Data persistence planning ensures that application information is stored and managed correctly.",
                "resources": [],
                "checklist": [
                    "Identify persistent data",
                    "Define CRUD operations",
                    "Review database relationships"
                ]
            },
            "IN_PROGRESS": {
                "description": "Implement database queries, repository functions, and CRUD operations.",
                "why_it_matters": "Database integration allows the application to store, retrieve, and modify information.",
                "resources": [],
                "checklist": [
                    "Implement create operations",
                    "Implement read operations",
                    "Implement update operations",
                    "Implement delete operations"
                ]
            },
            "TESTING_REVIEW": {
                "description": "Test database operations and verify data integrity, relationships, and error handling.",
                "why_it_matters": "Testing persistence prevents incorrect data operations and database inconsistencies.",
                "resources": [],
                "checklist": [
                    "Test data insertion",
                    "Test data retrieval",
                    "Test data updates and deletion",
                    "Verify database constraints"
                ]
            },
            "DONE": {
                "description": "Verify that all required database operations work correctly within the application.",
                "why_it_matters": "Reliable data persistence ensures that application data remains consistent and accessible.",
                "resources": [],
                "checklist": [
                    "Verify CRUD operations",
                    "Confirm data integrity",
                    "Document repository functions"
                ]
            }
        }
    },

    {
        "title": "Design User Interface",
        "stage": "FRONTEND",
        "phases": {
            "TO_DO": {
                "description": "Identify the application screens, navigation flows, and user interface requirements.",
                "why_it_matters": "Understanding interface requirements ensures that the design supports user needs.",
                "resources": [],
                "checklist": [
                    "Identify application screens",
                    "Define navigation structure",
                    "Identify UI requirements"
                ]
            },
            "IN_PROGRESS": {
                "description": "Create wireframes and implement reusable interface components and layouts.",
                "why_it_matters": "Reusable components improve consistency and make frontend development easier to maintain.",
                "resources": [],
                "checklist": [
                    "Create wireframes",
                    "Design page layouts",
                    "Implement reusable components",
                    "Apply visual styling"
                ]
            },
            "TESTING_REVIEW": {
                "description": "Review the interface for responsiveness, accessibility, usability, and visual consistency.",
                "why_it_matters": "Interface review helps ensure that users can navigate and use the application effectively.",
                "resources": [],
                "checklist": [
                    "Test responsive layouts",
                    "Review accessibility",
                    "Check visual consistency",
                    "Review navigation"
                ]
            },
            "DONE": {
                "description": "Finalize the user interface components and confirm that all required screens are implemented.",
                "why_it_matters": "A finalized interface provides the frontend foundation for application integration.",
                "resources": [],
                "checklist": [
                    "Finalize interface components",
                    "Verify all required screens",
                    "Confirm design consistency"
                ]
            }
        }
    },

    {
        "title": "Integrate Frontend with Backend",
        "stage": "FRONTEND",
        "phases": {
            "TO_DO": {
                "description": "Identify the backend API endpoints required by each frontend feature.",
                "why_it_matters": "Integration planning clarifies how frontend components will obtain and submit data.",
                "resources": [],
                "checklist": [
                    "Identify required endpoints",
                    "Map endpoints to frontend features",
                    "Review request and response formats"
                ]
            },
            "IN_PROGRESS": {
                "description": "Connect frontend components to backend endpoints and implement request handling.",
                "why_it_matters": "Frontend and backend integration enables the application to exchange real data.",
                "resources": [],
                "checklist": [
                    "Configure API base URL",
                    "Implement API requests",
                    "Handle API responses",
                    "Implement loading and error states"
                ]
            },
            "TESTING_REVIEW": {
                "description": "Test frontend and backend communication, including authentication, failed requests, and data synchronization.",
                "why_it_matters": "Integration testing detects communication problems between application layers.",
                "resources": [],
                "checklist": [
                    "Test successful API requests",
                    "Test failed API requests",
                    "Verify authentication headers",
                    "Check displayed data"
                ]
            },
            "DONE": {
                "description": "Verify that frontend features communicate correctly with backend services.",
                "why_it_matters": "Successful integration ensures that the application works as a connected system.",
                "resources": [],
                "checklist": [
                    "Verify all integrated features",
                    "Confirm correct data exchange",
                    "Resolve remaining integration issues"
                ]
            }
        }
    },

    {
        "title": "Perform Application Testing",
        "stage": "FRONTEND",
        "phases": {
            "TO_DO": {
                "description": "Define test scenarios, expected results, and the application features that require testing.",
                "why_it_matters": "Test planning ensures that important application functionality is evaluated systematically.",
                "resources": [],
                "checklist": [
                    "Identify test scenarios",
                    "Define expected results",
                    "Identify critical features",
                    "Prepare test data"
                ]
            },
            "IN_PROGRESS": {
                "description": "Execute unit, integration, and functional tests across the application.",
                "why_it_matters": "Testing helps detect defects before the application is released.",
                "resources": [],
                "checklist": [
                    "Run unit tests",
                    "Run integration tests",
                    "Run functional tests",
                    "Record test results"
                ]
            },
            "TESTING_REVIEW": {
                "description": "Analyze test failures, verify bug fixes, and perform regression testing.",
                "why_it_matters": "Reviewing test results confirms that defects are resolved without introducing new issues.",
                "resources": [],
                "checklist": [
                    "Analyze failed tests",
                    "Verify bug fixes",
                    "Perform regression testing",
                    "Document remaining issues"
                ]
            },
            "DONE": {
                "description": "Confirm that critical test cases pass and finalize the testing report.",
                "why_it_matters": "Completed testing provides evidence that the application meets its expected functional requirements.",
                "resources": [],
                "checklist": [
                    "Verify critical test cases",
                    "Confirm test completion",
                    "Finalize testing report"
                ]
            }
        }
    },

    {
        "title": "Deploy Application",
        "stage": "FRONTEND",
        "phases": {
            "TO_DO": {
                "description": "Select the deployment environment and identify the production configuration requirements.",
                "why_it_matters": "Deployment planning reduces configuration problems during application release.",
                "resources": [],
                "checklist": [
                    "Select hosting environment",
                    "Identify deployment requirements",
                    "Prepare production configuration"
                ]
            },
            "IN_PROGRESS": {
                "description": "Configure hosting, environment variables, database connectivity, and the deployment process.",
                "why_it_matters": "Correct deployment configuration ensures that the application can run outside the development environment.",
                "resources": [],
                "checklist": [
                    "Configure hosting",
                    "Set production environment variables",
                    "Configure database connection",
                    "Deploy application"
                ]
            },
            "TESTING_REVIEW": {
                "description": "Verify production functionality, connectivity, security settings, and application performance.",
                "why_it_matters": "Production verification helps identify deployment issues before users access the application.",
                "resources": [],
                "checklist": [
                    "Test application availability",
                    "Verify database connectivity",
                    "Check production configuration",
                    "Review application performance"
                ]
            },
            "DONE": {
                "description": "Confirm that the application is successfully deployed and accessible to its intended users.",
                "why_it_matters": "Successful deployment makes the completed application available for real-world use.",
                "resources": [],
                "checklist": [
                    "Verify deployment success",
                    "Confirm application accessibility",
                    "Document deployment details"
                ]
            }
        }
    }
]
