const STAGES = ['Database', 'Backend', 'Frontend']

const FEATURES = [
  {
    title: 'One clear next step',
    text: 'The Next Up banner points to the single task to work on, so you never wonder where to start.',
  },
  {
    title: 'A roadmap, not a blank board',
    text: 'Begin with a starter template that walks you through the Database, Backend and Frontend stages.',
  },
  {
    title: 'Everything on the card',
    text: 'Each task comes with a description, helpful resources and notes to keep you moving.',
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
        <p className="showcase__kicker">Built for junior developers</p>
        <h1 className="showcase__headline">
          Always know
          <br />
          <span>your next step.</span>
        </h1>
        <span className="showcase__rule" />
        <p className="showcase__lead">
          DevCompass turns a big project into a guided path. Start from a ready-made roadmap,
          see the one task to do next, and ship your first real app without the clutter of
          enterprise tools.
        </p>

        <ol className="showcase__path" aria-label="The DevCompass roadmap">
          {STAGES.map((stage, i) => (
            <li key={stage}>
              <span className="showcase__path-num">{i + 1}</span>
              {stage}
            </li>
          ))}
        </ol>

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
        <span>Made for developers who keep moving.</span>
        <span>© {new Date().getFullYear()} DevCompass</span>
      </div>
    </aside>
  )
}