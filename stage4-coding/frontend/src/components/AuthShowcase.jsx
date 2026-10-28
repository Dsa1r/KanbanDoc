const FEATURES = [
  {
    title: 'Turn growth into progress',
    text: 'Break ambitious learning goals into clear, achievable milestones.',
  },
  {
    title: 'Learn better, together',
    text: 'Get support from peers and timely guidance from experienced supervisors.',
  },
  {
    title: "See how far you've come",
    text: 'Keep your wins, feedback, and next steps organized in one calm workspace.',
  },
]

function CompassIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

export default function AuthShowcase() {
  return (
    <aside className="showcase">
      <div className="showcase__brand">
        <span className="showcase__logo"><CompassIcon /></span>
        <span className="showcase__name">DevCompass</span>
      </div>

      <div className="showcase__body">
        <p className="showcase__kicker">Your learning journey, mapped</p>
        <h1 className="showcase__headline">
          Small milestones.
          <br />
          <span>Remarkable growth.</span>
        </h1>
        <span className="showcase__rule" />
        <p className="showcase__lead">
          DevCompass gives developer teams a shared place to set goals, build skills, and celebrate
          real progress—one milestone at a time.
        </p>

        <ul className="showcase__cards">
          {FEATURES.map((f) => (
            <li key={f.title} className="feature-card">
              <span className="feature-card__check"><CheckIcon /></span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="showcase__footer">
        <span>Built for developers who keep moving.</span>
        <span>© 2025 DevCompass</span>
      </div>
    </aside>
  )
}
