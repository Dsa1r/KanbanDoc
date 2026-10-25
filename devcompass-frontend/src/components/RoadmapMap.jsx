import { PHASES, MAP_SIZE } from '../data/phases.js'

const pct = (v, total) => `${(v / total) * 100}%`

const CARD = { w: 149, h: 95 }

export default function RoadmapMap({ activeId, onSelect }) {
  return (
    <div className="roadmap" style={{ aspectRatio: `${MAP_SIZE.w} / ${MAP_SIZE.h}` }}>
      {/* المسار: خط عريض + خط منقّط */}
      <svg className="roadmap__path" viewBox={`0 0 ${MAP_SIZE.w} ${MAP_SIZE.h}`} aria-hidden="true">
        <path
          d="M42 48 L100 52 C330 40 560 80 568 180 C572 290 380 330 100 395 L81 407"
          className="roadmap__road"
        />
        <path
          d="M42 48 L100 52 C330 40 560 80 568 180 C572 290 380 330 100 395 L81 407"
          className="roadmap__dots"
        />
      </svg>

      {PHASES.map((p) => {
        const active = p.id === activeId
        const { cx, cy, r, card } = p.pos
        const num = String(p.id).padStart(2, '0')
        return (
          <div key={p.id} className={`phase ${active ? 'is-active' : ''}`} style={{ '--accent': p.accent }}>
            {/* الدائرة قابلة للضغط مثل البطاقة */}
            <button
              type="button"
              className="phase__node"
              aria-label={`Open ${p.name}`}
              aria-pressed={active}
              onClick={() => onSelect(p.id)}
              style={{
                left: pct(cx - r, MAP_SIZE.w),
                top: pct(cy - r, MAP_SIZE.h),
                width: pct(r * 2, MAP_SIZE.w),
              }}
            >
              {num}
            </button>
            <button
              type="button"
              className="phase__card"
              aria-pressed={active}
              onClick={() => onSelect(p.id)}
              style={{
                left: pct(card.x, MAP_SIZE.w),
                top: pct(card.y, MAP_SIZE.h),
                width: pct(CARD.w, MAP_SIZE.w),
                height: pct(CARD.h, MAP_SIZE.h),
              }}
            >
              <span className="phase__label">Phase {p.id}</span>
              <span className="phase__name">{p.name}</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}