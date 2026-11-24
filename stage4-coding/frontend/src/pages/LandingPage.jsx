import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import './LandingPage.css';

const BOARD = [
  {
    title: 'To Do',
    tasks: [
      { name: 'Design the database schema', tag: 'Database' },
      { name: 'Build the login page', tag: 'Frontend' },
    ],
  },
  {
    title: 'In Progress',
    tasks: [{ name: 'Build your first API endpoint', tag: 'Backend' }],
  },
  {
    title: 'Testing',
    tasks: [{ name: 'Test the sign up form', tag: 'Frontend' }],
  },
  {
    title: 'Done',
    tasks: [{ name: 'Set up the project', tag: 'Database' }],
  },
];

const STAGES = [
  {
    n: '01',
    name: 'Database',
    sub: 'Shape the foundation',
    icon: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3ZM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  },
  {
    n: '02',
    name: 'Backend',
    sub: 'Build the engine',
    icon: 'm9 8-4 4 4 4M15 8l4 4-4 4',
  },
  {
    n: '03',
    name: 'Frontend',
    sub: 'Create the experience',
    icon: 'm12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5',
  },
];

const FEATURES = [
  {
    n: '01',
    title: 'A clear plan from day one',
    text: 'Start from a template with the essential tasks for each stage (database, backend and frontend), or begin with a blank board.',
  },
  {
    n: '02',
    title: 'AI-powered task planning',
    text: 'Describe your project and get a personalized list of tasks you can review, edit and add to your board.',
  },
  {
    n: '03',
    title: 'See your progress at a glance',
    text: 'Your dashboard shows how much of each project is done, so you always know how far you have come and what is left.',
  },
];

function LandingPage() {
  return (
    <div className="landing">
      <header className="landing__header">
        <Link to="/" className="landing__brand" aria-label="Devcompass home">
          <Logo height={46} />
        </Link>
        <nav className="landing__nav">
          <Link to="/auth" className="landing__login">
            Log in
          </Link>
          <Link to="/auth" className="landing__header-cta">
            Get started
          </Link>
        </nav>
      </header>

      <main>
        <section className="landing__hero">
          <div className="landing__hero-text">
            <h1 className="landing__title">
              Always know your <span className="landing__accent">next step.</span>
            </h1>
            <p className="landing__lead">
              Turn your project ideas into organized, actionable tasks. Use AI to
              create a personalized task plan, manage your workflow, and track your
              progress.
            </p>
            <Link to="/auth" className="landing__btn landing__btn--primary">
              Get started →
            </Link>
          </div>

          <div className="landing__window" aria-hidden="true">
            <div className="landing__window-bar">
              <span className="landing__dot" />
              <span className="landing__dot" />
              <span className="landing__dot" />
            </div>
            <div className="landing__window-body">
              <div className="landing__window-head">
                <div>
                  <p className="landing__window-label">Project</p>
                  <p className="landing__window-title">Recipe app</p>
                </div>
                <span className="landing__avatar">NF</span>
              </div>

              <div className="landing__next">
                <span className="landing__next-label">NEXT UP</span>
                <span className="landing__next-task">Build your first API endpoint</span>
              </div>

              <div className="landing__board">
                {BOARD.map((col) => (
                  <div key={col.title} className="landing__col">
                    <p className="landing__col-title">
                      {col.title} <span>{col.tasks.length}</span>
                    </p>
                    {col.tasks.map((task) => (
                      <div key={task.name} className="landing__card">
                        <p>{task.name}</p>
                        <span className={`landing__tag landing__tag--${task.tag.toLowerCase()}`}>
                          {task.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="landing__stages">
          {STAGES.map((stage) => (
            <div key={stage.n} className="landing__stage">
              <span className="landing__stage-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={stage.icon} />
                </svg>
              </span>
              <div>
                <p className="landing__stage-name">{stage.name}</p>
                <p className="landing__stage-sub">{stage.sub}</p>
              </div>
              <svg
                className="landing__stage-arrow"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m9 6 6 6-6 6" />
              </svg>
              <span className="landing__stage-n">{stage.n}</span>
            </div>
          ))}
        </section>

        <section className="landing__features">
          <div className="landing__features-head">
            <p className="landing__eyebrow">FEATURES</p>
            <h2 className="landing__h2">Less guessing. More building.</h2>
            <p className="landing__features-sub">
              Devcompass gives junior developers a clear plan, smart task suggestions
              and a live view of their progress.
            </p>
          </div>

          <div className="landing__feature-grid">
            {FEATURES.map((f) => (
              <article key={f.n} className="landing__feature">
                <p className="landing__feature-n">{f.n}</p>
                <h3 className="landing__feature-title">{f.title}</h3>
                <p className="landing__feature-text">{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing__cta">
          <div className="landing__cta-card">
            <h2 className="landing__cta-title">Ready to plan your next project?</h2>
            <Link to="/auth" className="landing__cta-btn">
              Get started →
            </Link>
          </div>
        </section>
      </main>

      <footer className="landing__footer">
        © {new Date().getFullYear()} Devcompass
      </footer>
    </div>
  );
}

export default LandingPage;