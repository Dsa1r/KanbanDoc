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