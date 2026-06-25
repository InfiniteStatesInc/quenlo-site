import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import BookDemoPanel from '../components/BookDemoPanel'
import './Quenlo.css'

/* ---------------- reveal-on-scroll ---------------- */
function Reveal({ children, delay = 0, className = '', y = 24 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* small inline waveform */
function Wave({ bars = 22 }: { bars?: number }) {
  return (
    <div className="wave">
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} style={{ animationDelay: `${(i % 7) * 0.09}s`, height: `${20 + ((i * 37) % 60)}%` }} />
      ))}
    </div>
  )
}

/* ---------------- stage visuals ---------------- */
function CapturePanel() {
  return (
    <div className="sc-panel">
      <div className="sc-bar"><span className="sc-dot" /> live transcript · founder sync</div>
      <div className="capture-rows">
        {[['Maya', 'Ship the pricing experiments before the demo?'], ['Theo', 'Only if legal clears retention first.'], ['Nora', 'Then one owner, one rollback path.']].map(([who, line], i) => (
          <div className="capture-row" key={who}>
            <span className="who" data-i={i}>{who[0]}</span>
            <div><b>{who}</b><p>{line}</p></div>
          </div>
        ))}
      </div>
      <div className="capture-tags"><span>@maya resolved</span><span>“retention” recognized</span><span>00:12</span></div>
    </div>
  )
}
function CutPanel() {
  return (
    <div className="sc-panel">
      <div className="sc-bar"><span className="sc-dot" /> auto-cut · key moments</div>
      <div className="cut-track"><span className="cut-line" /><i className="cut-pin p1">decision</i><i className="cut-pin p2">risk</i><i className="cut-pin p3">owner</i></div>
      <div className="cut-list">
        {[['00:12', 'Decision', 'Ship after retention review.'], ['00:31', 'Owner', '@theo owns legal · @maya the note.'], ['00:44', 'Risk', 'Support load is the launch gate.']].map(([t, k, txt]) => (
          <article key={t}><span>{t}</span><b className={`tag-${k.toLowerCase()}`}>{k}</b><p>{txt}</p></article>
        ))}
      </div>
    </div>
  )
}
function RoutePanel() {
  return (
    <div className="sc-panel route-panel">
      <div className="route-head"><img src="/quenlo-logo-on-light.svg" alt="" /><div><b>Quenlo</b><span>APP · 4:12 PM</span></div></div>
      <h4>Founder sync — decision record</h4>
      <p className="route-summary">Partner demo ships after legal clears the retention line. Support load is the launch gate.</p>
      <ul>
        <li><b>@theo</b> Review retention language by Friday.</li>
        <li><b>@maya</b> Draft customer note after sign-off.</li>
        <li><b>@nora</b> Confirm rollback path in thread.</li>
      </ul>
    </div>
  )
}
function RememberPanel() {
  return (
    <div className="sc-panel">
      <div className="remember-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" /></svg>
        <span>retention language partner demo</span>
      </div>
      <div className="remember-results">
        <article><span className="r-kind kind-decision">Decision</span><b>Ship after retention review</b><p>Source: founder sync · 00:12 · @theo</p></article>
        <article><span className="r-kind kind-follow">Follow-up</span><b>Customer note due Friday</b><p>Routed to @maya · partner opportunity</p></article>
        <article><span className="r-kind kind-gap">Open gap</span><b>Rollback path to confirm</b><p>Asked @nora · updates on reply</p></article>
      </div>
    </div>
  )
}

const STAGES = [
  { key: 'capture', tab: 'Capture', heading: 'It captures the conversation.', line: 'Meetings, threads, and calls become structured memory — every person and moment attached.', Panel: CapturePanel },
  { key: 'cut', tab: 'Cut', heading: 'It clips the decision.', line: 'The exact moment of a decision, a risk, or an owner change becomes evidence — not a loose highlight.', Panel: CutPanel },
  { key: 'route', tab: 'Route', heading: 'It routes the follow-up.', line: 'Owners and open gaps land back in Slack, where the team already works.', Panel: RoutePanel },
  { key: 'remember', tab: 'Remember', heading: 'It remembers the reason.', line: 'A searchable layer across projects, owners, and decisions — so the reason is still there later.', Panel: RememberPanel },
]

/* ---------------- scroll-pinned showcase ---------------- */
function ScrollShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [idx, setIdx] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setIdx(Math.max(0, Math.min(STAGES.length - 1, Math.floor(v * STAGES.length))))
  })
  const railH = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="ss-wrap" id="product" ref={ref}>
      <div className="ss-sticky">
        <div className="wrap ss-inner">
          <div className="ss-left">
            <span className="kicker">// how memory forms</span>
            <div className="ss-steps">
              {STAGES.map((s, i) => (
                <div key={s.key} className={`ss-step ${i === idx ? 'on' : ''} ${i < idx ? 'done' : ''}`}>
                  <i>{String(i + 1).padStart(2, '0')}</i>{s.tab}
                </div>
              ))}
            </div>
            <div className="ss-copystack">
              {STAGES.map((s, i) => (
                <div key={s.key} className={`ss-copy ${i === idx ? 'is-active' : i < idx ? 'is-prev' : 'is-next'}`}>
                  <h2>{s.heading}</h2>
                  <p>{s.line}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="ss-right">
            <div className="ss-rail"><motion.i style={{ height: railH }} /></div>
            {STAGES.map((s, i) => {
              const Panel = s.Panel
              return (
                <div key={s.key} className={`ss-stagepanel ${i === idx ? 'is-active' : i < idx ? 'is-prev' : 'is-next'}`}>
                  <Panel />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- memory-graph constellation (draws on scroll) ---------------- */
const NODES = [
  { x: 500, y: 70, label: 'Meeting', cls: 'n-meet' },
  { x: 175, y: 150, label: 'Decision', cls: 'n-dec' },
  { x: 825, y: 150, label: 'Owner', cls: 'n-own' },
  { x: 120, y: 400, label: 'Customer signal', cls: 'n-cust' },
  { x: 880, y: 400, label: 'Risk', cls: 'n-risk' },
  { x: 500, y: 500, label: 'Follow-up', cls: 'n-follow' },
]
const MEMORIES = [
  { kind: 'Decision', cls: 'n-dec', title: 'Ship the UI after the retention review', meta: 'Founder sync · 00:12 · @theo' },
  { kind: 'Owner', cls: 'n-own', title: 'Pricing v2 tiers are locked', meta: 'Owned by @nora' },
  { kind: 'Customer signal', cls: 'n-cust', title: 'Two churn risks flagged this week', meta: 'Surfaced from support' },
  { kind: 'Risk', cls: 'n-risk', title: 'Legal review is the launch gate', meta: 'Blocks pricing v2' },
  { kind: 'Follow-up', cls: 'n-follow', title: 'Customer note due Friday', meta: 'Routed to @maya' },
]
function MemoryGraph() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'center 0.4'] })
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1])
  const coreScale = useTransform(scrollYProgress, [0, 0.5], [0.4, 1])
  const [open, setOpen] = useState(false)
  return (
    <section className="graph" ref={ref}>
      <div className="wrap graph-inner">
        <Reveal className="graph-head">
          <span className="kicker">// one memory, many threads</span>
          <h2>Every decision stays connected<br />to where it came from.</h2>
        </Reveal>
        <div className={`graph-stage ${open ? 'is-board' : ''}`}>
          <div className="graph-map">
            <svg viewBox="0 0 1000 560" className="graph-svg" aria-hidden>
              <defs>
                <linearGradient id="gline" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="560">
                  <stop offset="0" stopColor="#0f9488" /><stop offset="1" stopColor="#57e7c6" />
                </linearGradient>
              </defs>
              {NODES.map((n, i) => (
                <motion.path key={i} d={`M500 280 L${n.x} ${n.y}`} stroke="url(#gline)" strokeWidth="2.4" strokeLinecap="round" fill="none" style={{ pathLength: draw }} />
              ))}
              {NODES.map((n, i) => (
                <motion.circle key={i} cx={n.x} cy={n.y} r="7" className="g-node"
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 200 }} style={{ transformOrigin: `${n.x}px ${n.y}px` }} />
              ))}
            </svg>
            {NODES.map((n, i) => (
              <motion.span key={i} className={`g-label ${n.cls}`}
                style={{ left: `${(n.x / 1000) * 100}%`, top: `${(n.y / 560) * 100}%` }}
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.08 }}>
                {n.label}
              </motion.span>
            ))}
          </div>
          <motion.button type="button" className="graph-core" style={{ scale: open ? 1 : coreScale }} onClick={() => setOpen((o) => !o)}>
            <img src="/quenlo-logo-on-light.svg" alt="Quenlo" />
            <span className="core-hint">click to explore</span>
          </motion.button>
          <div className="graph-board">
            <div className="gb-head">
              <span className="kicker">// searchable org memory</span>
              <button type="button" className="gb-back" onClick={() => setOpen(false)}>← back to map</button>
            </div>
            {MEMORIES.map((m) => (
              <div className="gb-row" key={m.title}>
                <span className={`gb-kind ${m.cls}`}>{m.kind}</span>
                <div className="gb-body"><b>{m.title}</b><i>{m.meta}</i></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- bento ---------------- */
function Bento() {
  return (
    <section className="bento-sec" id="fde">
      <div className="wrap">
        <Reveal className="sec-head-c">
          <span className="kicker">// forward-deployed</span>
          <h2>Shaped to how your team actually decides.</h2>
        </Reveal>
        <div className="bento">
          <Reveal className="b-tile b-lead" y={30}>
            <span className="b-tag">Decision ledger</span>
            <p>Every decision with its owner, status, and the moment it was made.</p>
            <div className="b-ledger">
              <div><b>Ship after review</b><i className="st st-wait">waiting on legal</i></div>
              <div><b>Customer note</b><i className="st st-go">@maya · Fri</i></div>
              <div><b>Rollback path</b><i className="st st-gap">open</i></div>
            </div>
          </Reveal>
          <Reveal className="b-tile b-wave" delay={0.06} y={30}>
            <span className="b-tag">Auto-cut moments</span>
            <Wave bars={26} />
            <div className="b-pins"><i>decision</i><i>risk</i><i>owner</i></div>
          </Reveal>
          <Reveal className="b-tile b-search" delay={0.1} y={30}>
            <span className="b-tag">Searchable memory</span>
            <div className="b-searchbar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" /></svg>
              why did we ship?
            </div>
            <div className="b-chips"><span>by project</span><span>by owner</span><span>by customer</span></div>
          </Reveal>
          <Reveal className="b-tile b-route" delay={0.14} y={30}>
            <span className="b-tag">Routed to Slack</span>
            <div className="b-slack"><img src="/quenlo-logo-on-light.svg" alt="" /><div><b>@theo</b> review retention by Friday</div></div>
            <div className="b-slack"><span className="b-av">M</span><div><b>@maya</b> drafting the customer note</div></div>
          </Reveal>
          <Reveal className="b-tile b-stack" delay={0.18} y={30}>
            <span className="b-tag">Alias & jargon</span>
            <div className="b-alias"><code>"Bobby"</code><i>→</i><code>@robert</code></div>
            <div className="b-alias"><code>DPA</code><i>→</i><code>data-processing</code></div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------------- page ---------------- */
const HERO_CHIPS = [
  { c: 'hc-dec', t: 'Decision · ship after review', x: '6%', y: '20%', speed: 90 },
  { c: 'hc-own', t: '00:31 · owner @theo', x: '80%', y: '14%', speed: 150 },
  { c: 'hc-cust', t: 'Customer signal clipped', x: '83%', y: '64%', speed: 60 },
  { c: 'hc-search', t: '🔍 why did we decide this?', x: '3%', y: '60%', speed: 120 },
]
export default function Quenlo() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const filmScale = useTransform(heroP, [0, 1], [0.92, 1.12])
  const filmY = useTransform(heroP, [0, 1], [0, 70])
  const slogY = useTransform(heroP, [0, 1], [0, -90])
  const slogOpacity = useTransform(heroP, [0, 0.7], [1, 0])
  // chip parallax
  const c0 = useTransform(heroP, [0, 1], [0, -HERO_CHIPS[0].speed])
  const c1 = useTransform(heroP, [0, 1], [0, -HERO_CHIPS[1].speed])
  const c2 = useTransform(heroP, [0, 1], [0, -HERO_CHIPS[2].speed])
  const c3 = useTransform(heroP, [0, 1], [0, -HERO_CHIPS[3].speed])
  const chipY = [c0, c1, c2, c3]

  return (
    <div className="q-page">
      {/* ============ HERO ============ */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg" aria-hidden>
          <span className="blob blob-a" /><span className="blob blob-b" /><span className="blob blob-c" />
          <span className="hero-dots" />
        </div>
        {/* floating product "materials" */}
        {HERO_CHIPS.map((ch, i) => (
          <motion.div key={ch.c} className={`hero-chip ${ch.c}`} style={{ left: ch.x, top: ch.y, y: chipY[i] }} aria-hidden>
            {ch.t}
          </motion.div>
        ))}
        <div className="wrap hero-inner">
          <motion.div className="hero-head" style={{ y: slogY, opacity: slogOpacity }}>
            <Reveal y={14}><span className="eyebrow"><span className="dot" /> Organizational Memory System</span></Reveal>
            <Reveal delay={0.06} y={18}>
              <h1>Turn every conversation<br />into <span className="grad">organizational memory.</span></h1>
            </Reveal>
            <Reveal delay={0.14} y={14}>
              <div className="hero-cta">
                <a className="btn btn-teal btn-lg" href="#book-demo">Book a demo</a>
                <a className="btn btn-ghost btn-lg" href="#film"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>Watch the film</a>
              </div>
            </Reveal>
          </motion.div>
          <motion.div className="hero-film" id="film" style={{ scale: filmScale, y: filmY }}>
            <div className="film-frame">
              <div className="film-bar"><span /><span /><span /><em>quenlo — founder sync · replay</em></div>
              <video controls playsInline preload="metadata" poster="/quenlo-cover-v2.png" src="/quenlo-demo-v2.mp4" />
            </div>
          </motion.div>
        </div>
        <div className="scroll-cue" aria-hidden><span /></div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="marquee-sec" aria-label="integrations">
        <div className="marquee">
          <div className="marquee-row">
            {[...Array(2)].map((_, k) => (
              <div className="marquee-track" key={k}>
                {['Slack', 'Google Meet', 'Zoom', 'Linear', 'Notion', 'HubSpot', 'Gmail', 'Teams',
                  'Slack', 'Google Meet', 'Zoom', 'Linear', 'Notion', 'HubSpot', 'Gmail', 'Teams',
                  'Slack', 'Google Meet', 'Zoom', 'Linear', 'Notion', 'HubSpot', 'Gmail', 'Teams'].map((n, idx) => (
                  <span key={n + k + idx} aria-hidden={idx >= 8}><i className="m-dot" />{n}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SCROLL SHOWCASE ============ */}
      <ScrollShowcase />

      {/* ============ MEMORY GRAPH ============ */}
      <MemoryGraph />

      {/* ============ STATEMENT ============ */}
      <section className="statement on-dark">
        <div className="statement-grid-bg" aria-hidden />
        <div className="wrap">
          <Reveal>
            <h2>Notes capture <span className="dim">what was said.</span><br />Memory captures <span className="hl">why it was decided.</span></h2>
          </Reveal>
        </div>
      </section>

      {/* ============ BENTO ============ */}
      <Bento />

      {/* ============ BOOK DEMO ============ */}
      <section className="book on-dark" id="book-demo">
        <div className="wrap book-grid">
          <Reveal>
            <span className="eyebrow"><span className="dot" /> Book a demo</span>
            <h2>Bring one messy recurring conversation.</h2>
            <p>A founder sync, a product review, a customer call. We map where decisions disappear — and what Quenlo should remember.</p>
            <div className="book-points"><span>Slack</span><span>Meet / calls</span><span>Team vocabulary</span><span>Custom FDE skill</span></div>
          </Reveal>
          <Reveal delay={0.1}><BookDemoPanel /></Reveal>
        </div>
      </section>
    </div>
  )
}
