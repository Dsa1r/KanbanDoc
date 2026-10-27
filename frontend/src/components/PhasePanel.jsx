import { useEffect, useRef } from 'react'
import { PHASES } from '../data/phases.js'

function Section({ num, title, children }) {
  return (
    <section className="panel-section">
      <h3 className="panel-section__title">
        <span className="panel-section__num">{num}</span>
        {title}
      </h3>
      <span className="panel-section__rule" />
      {children}
    </section>
  )
}

export default function PhasePanel({ phase }) {
  const bodyRef = useRef(null)
  const progress = Math.round((phase.id / PHASES.length) * 100)

  // كل ما تتغير المرحلة نرجّع التمرير لفوق
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [phase.id])

  return (
    <aside className="panel" aria-label={`${phase.name} details`}>
      <header className="panel__head">
        <div className="panel__head-row">
          <div>
            <p className="panel__eyebrow">Phase {phase.id} of {PHASES.length}</p>
            <h2 className="panel__title">{phase.name}</h2>
          </div>
          <span className="panel__badge">{String(phase.id).padStart(2, '0')}</span>
        </div>
        <span className="panel__rule" />
        <p className="panel__summary">{phase.summary}</p>

        <div className="segments" aria-hidden="true">
          {PHASES.map((p) => (
            <span key={p.id} className={p.id === phase.id ? 'is-current' : ''} />
          ))}
        </div>
      </header>

      <div className="panel__body" ref={bodyRef}>
        <Section num="01" title="Why It Matters">
          <p className="panel__text">{phase.why}</p>
        </Section>

        <Section num="02" title="What to Build">
          <ol className="build-list">
            {phase.build.map((step, i) => (
              <li key={step}>
                <span>{i + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section num="03" title="Alternative Tools & Resources">
          <ul className="tool-list">
            {phase.tools.map((t) => (
              <li key={t.name}>
                <a href={t.url} target="_blank" rel="noreferrer">
                  <span className="tool-list__name">{t.name}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                  <span className="tool-list__note">{t.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <footer className="panel__foot">
        <div className="progress__row">
          <span>Overall progress</span>
          <span>{progress}%</span>
        </div>
        <div className="progress__track">
          <span style={{ width: `${progress}%` }} />
        </div>
      </footer>
    </aside>
  )
}