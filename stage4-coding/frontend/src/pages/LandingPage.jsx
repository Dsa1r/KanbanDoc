import { useLayoutEffect, useRef } from 'react';
import './LandingPage.css';

const FOREGROUND_DURATION = 1600;
const FOREGROUND_SCROLL_THRESHOLD = 70;

function shouldStartForeground(scrollY, initialScrollY) {
  return scrollY - initialScrollY >= FOREGROUND_SCROLL_THRESHOLD;
}

/** A single transform interpolates all three axes into the existing layout box. */
function foregroundKeyframes(
  rect,
  viewportWidth,
  viewportHeight,
  minimumTop = 0,
) {
  const scale = Math.min(2.8, viewportWidth * 0.9 / rect.width);
  const x = viewportWidth / 2 - (rect.left + rect.width / 2);
  // Reveal the upright, horizontally centered board beneath the opening copy.
  const y = Math.max(viewportHeight * 0.85, minimumTop) - rect.top + rect.height * (scale - 1) / 2;
  return [
    { transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) perspective(1400px) rotateY(0deg) rotateZ(0deg)` },
    { transform: 'translate3d(0px, 0px, 0) scale(1) perspective(1400px) rotateY(-10deg) rotateZ(5deg)' },
  ];
}

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
  const board = useRef(null);
  const copy = useRef(null);
  const scene = useRef(null);
  useLayoutEffect(() => {
    const element = board.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = element.getBoundingClientRect();
    const text = copy.current;
    const textRect = text?.getBoundingClientRect();
    const initialWidth = Math.min(620, window.innerWidth - 48);
    const textMotion = text && textRect ? text.animate([
      {
        transform: `translate3d(${(window.innerWidth - initialWidth) / 2 - textRect.left}px, ${window.innerWidth > 900 ? -40 : 28}px, 0)`,
        width: `${initialWidth}px`,
        textAlign: 'center',
      },
      { transform: 'translate3d(0px, 0px, 0)', width: `${textRect.width}px`, textAlign: window.innerWidth > 900 ? 'left' : 'center' },
    ], { duration: FOREGROUND_DURATION, easing: 'cubic-bezier(0.22, 0.68, 0.25, 1)', fill: 'both' }) : null;
    textMotion?.pause();
    if (textMotion) textMotion.currentTime = 0;
    const ctaBottom = text?.querySelector('.landing__btn')?.getBoundingClientRect().bottom ?? 0;
    const motion = element.animate(
      foregroundKeyframes(rect, window.innerWidth, window.innerHeight, ctaBottom + 24),
      { duration: FOREGROUND_DURATION, easing: 'cubic-bezier(0.22, 0.68, 0.25, 1)', fill: 'both' },
    );
    motion.pause();
    motion.currentTime = 0;
    const initialScrollY = window.scrollY;
    let taskTimer;
    let taskMotion;
    motion.onfinish = () => {
      taskTimer = setTimeout(() => {
        const columns = element.querySelectorAll('.landing__col');
        const source = columns.item(0);
        const destination = columns.item(1);
        const task = source?.querySelector('.landing__card');
        if (!task || !source || !destination) return;
        const before = task.getBoundingClientRect();
        destination.appendChild(task);
        const after = task.getBoundingClientRect();
        taskMotion = task.animate([
          { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px)`, opacity: 0.85 },
          { transform: 'translate(0px, 0px)', opacity: 1 },
        ], { duration: 1300, easing: 'cubic-bezier(0.22, 0.68, 0.25, 1)' });
        const sourceCount = source.querySelector('.landing__col-title span');
        const destinationCount = destination.querySelector('.landing__col-title span');
        if (sourceCount) sourceCount.textContent = '1';
        if (destinationCount) destinationCount.textContent = '2';
      }, 600);
    };
    const onScroll = () => {
      if (!shouldStartForeground(window.scrollY, initialScrollY)) return;
      window.removeEventListener('scroll', onScroll);
      scene.current?.classList.add('landing__hero-scene--blended');
      motion.play();
      textMotion?.play();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      motion.cancel();
      clearTimeout(taskTimer);
      taskMotion?.cancel();
      textMotion?.cancel();
      scene.current?.classList.remove('landing__hero-scene--blended');
    };
  }, []);
  return (
    <div className="landing">
      <header className="landing__header">
        <a href="/" className="landing__brand" aria-label="Devcompass home">
          <svg width="22" height="40" viewBox="0 0 22 40" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M13 2l1 17-9 5 2 11-5 3M17 2l1 19-9 5 1 8M21 1l1 22-9 5 1 6-5 4" /></svg><span>Devcompass</span>
        </a>
        <nav className="landing__nav">
          <a href="/auth" className="landing__login">
            Log in
          </a>
          <a href="/auth" className="landing__header-cta">
            Get started
          </a>
        </nav>
      </header>

      <main>
        <div className="landing__scroll-scene">
        <div ref={scene} className="landing__hero-scene">
        <section className="landing__hero">
          <div ref={copy} className="landing__hero-text">
            <h1 className="landing__title">
              Always know your <span className="landing__accent">next step.</span>
            </h1>
            <p className="landing__lead">
              Turn your project ideas into organized, actionable tasks. Use AI to
              create a personalized task plan, manage your workflow, and track your
              progress.
            </p>
            <a href="/auth" className="landing__btn landing__btn--primary">
              Get started →
            </a>
          </div>

          <div ref={board} className="landing__window" aria-hidden="true">
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
        </div>
        </div>

        <div className="landing__continuation">
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
            <a href="/auth" className="landing__cta-btn">
              Get started →
            </a>
          </div>
        </section>
        </div>
      </main>

      <footer className="landing__footer">
        © 2026 Devcompass
      </footer>
    </div>
  );
}

export default LandingPage;
