import { useState } from 'react'
import { PHASES } from '../data/phases.js'
import RoadmapMap from '../components/RoadmapMap.jsx'
import PhasePanel from '../components/PhasePanel.jsx'
import '../styles/learningPath.css'

export default function LearningPathPage() {
  const [activeId, setActiveId] = useState(1)
  const phase = PHASES.find((p) => p.id === activeId)

  return (
    <div className="lp">
      <main className="lp__main">
        <header className="lp__top">
          <div className="lp__brand">
            <span className="lp__logo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M15.5 8.5l-2 5-5 2 2-5z" />
              </svg>
            </span>
            <div>
              <p className="lp__brand-name">DevCompass</p>
              <p className="lp__brand-sub">Learning path</p>
            </div>
          </div>
          <span className="lp__chip">{PHASES.length} phases · guided</span>
        </header>

        <section className="lp__hero">
          <p className="lp__eyebrow">Your build journey</p>
          <h1 className="lp__headline">From raw data to a real product.</h1>
          <span className="lp__rule" />
          <p className="lp__lead">
            Follow the path in order. Select a phase to explore the skills, tools, and decisions that
            bring it to life.
          </p>
        </section>

        <RoadmapMap activeId={activeId} onSelect={setActiveId} />
      </main>

      <PhasePanel phase={phase} />

      <button type="button" className="lp__help" aria-label="Help" title="Help">?</button>
    </div>
  )
}