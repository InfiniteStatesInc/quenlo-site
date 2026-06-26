import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import BookDemoPanel from '../components/BookDemoPanel'
import MemoryExplorer from '../components/MemoryExplorer'
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

/* ---------------- how it works ---------------- */
const HOWITWORKS = [
  { n: '01', t: 'It sits in your Google Meet', d: 'Quenlo quietly joins the call and listens — no bot to babysit, no notes to take. It even knows “Maya Rodriguez” on the call is “@mrod” in Slack.', img: '/mockups/01-google-meet.png', alt: 'Quenlo in a Google Meet call', id: 'Maya Rodriguez  =  @mrod', logo: '/logos/google-meet.svg', brand: 'Google Meet' },
  { n: '02', t: 'It does the follow-up in Slack', d: 'The second the call ends, Quenlo drafts the follow-up, assigns the owner, and posts it in Slack — with the full context. Nobody had to ask.', img: '/mockups/03-slack-followthrough.png', alt: 'Quenlo posting the follow-up in Slack', logo: '/logos/slack.svg', brand: 'Slack' },
  { n: '03', t: 'It opens the ticket and tracks it to done', d: 'Quenlo creates the ticket, nudges on the due date, and closes it out — so the work actually lands, not just the notes.', img: '/mockups/05-linear-ticket.png', alt: 'A ticket Quenlo created in Linear', logo: '/logos/linear.svg', brand: 'Linear' },
  { n: '04', t: 'It asks instead of guessing', d: 'Didn’t catch a detail? Quenlo @asks the person to confirm — so what ends up in Slack is right, not hallucinated.', img: '/mockups/04-slack-asks.png', alt: 'Quenlo asking to confirm in Slack', logo: '/logos/slack.svg', brand: 'Slack' },
  { n: '05', t: 'It remembers every meeting', d: '“What did we decide about pricing in Q1?” Ask Quenlo — it answers in seconds, from any call, anytime.', img: '/mockups/02-slack-recall.png', alt: 'Quenlo answering from memory in Slack', logo: '/logos/slack.svg', brand: 'Slack' },
]

/* ---------------- forward-deployed (FDE) ---------------- */
const FDE_STEPS = [
  { n: '01', t: 'Embed', d: 'A forward-deployed engineer joins your team for a sprint — in your meetings, your Slack, your real work.', ic: (<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.3 3-5.6 6.5-5.6s6.5 2.3 6.5 5.6" /><circle cx="18" cy="9" r="2.4" /><path d="M16.2 14.6c2.7-.2 5.3 1.5 5.3 4.4" /></svg>) },
  { n: '02', t: 'Learn your flow', d: 'How your team actually decides and talks — your rhythm, your vocabulary, your tools, where things fall through.', ic: (<svg viewBox="0 0 24 24"><path d="M2 13h3.4l2.2-7 3.6 14 2.6-9 1.8 4H22" /></svg>) },
  { n: '03', t: 'Ship what fits', d: 'Quenlo is shaped to your workflow — custom skills built for how you work, not a fixed feature set.', ic: (<svg viewBox="0 0 24 24"><path d="M4 13l16-8-6 16-3-7-7-1z" /></svg>) },
]
function Fde() {
  return (
    <section className="fde-sec" id="fde">
      <div className="wrap">
        <Reveal className="sec-head-c">
          <span className="kicker">// forward-deployed</span>
          <h2>Not a tool you adapt to.<br />One that&apos;s built around you.</h2>
          <p className="fde-sub">A forward-deployed engineer embeds with your team, learns exactly how you run Google Meet and Slack, and shapes Quenlo to it.</p>
        </Reveal>
        <div className="fde-steps">
          {FDE_STEPS.map((s, i) => (
            <Reveal key={s.n} className="fde-step" delay={i * 0.08} y={28}>
              <div className="fde-top"><span className="fde-ic">{s.ic}</span><span className="fde-num">STEP {s.n}</span></div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="fde-foot" delay={0.22}>
          <p>So it does exactly what your team needs — <span className="hl">and nothing it doesn&apos;t.</span></p>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- how it works — scroll story ---------------- */
function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)
  useEffect(() => {
    const n = HOWITWORKS.length
    return scrollYProgress.on('change', (v) => {
      const i = Math.max(0, Math.min(n - 1, Math.floor(v * n + 0.0001)))
      setActive(i)
    })
  }, [scrollYProgress])
  const fillH = useTransform(scrollYProgress, [0, 1], ['4%', '100%'])
  const cls = (i: number) => (i === active ? 'is-active' : i < active ? 'is-prev' : '')
  return (
    <section className="ss-wrap" id="product" ref={ref}>
      <div className="ss-sticky">
        <div className="wrap ss-inner">
          <div className="ss-left">
            <span className="kicker">// how it works</span>
            <div className="ss-steps">
              {HOWITWORKS.map((s, i) => (
                <div key={s.n} className={`ss-step ${i === active ? 'on' : i < active ? 'done' : ''}`}><i>{s.n}</i>{s.t}</div>
              ))}
            </div>
            <div className="ss-copystack">
              {HOWITWORKS.map((s, i) => (
                <div key={s.n} className={`ss-copy ${cls(i)}`}>
                  <h2>{s.t}</h2>
                  <p>{s.d}</p>
                  {s.id ? <span className="hiw-id">↔ {s.id}</span> : null}
                </div>
              ))}
            </div>
          </div>
          <div className="ss-right">
            <div className="ss-rail"><motion.i style={{ height: fillH }} /></div>
            {HOWITWORKS.map((s, i) => (
              <div key={s.n} className={`ss-stagepanel ${cls(i)}`}>
                <div className="sc-panel ss-shot">
                  <div className="sc-bar"><span className="sc-dot" />{s.logo ? <img className="sc-blogo" src={s.logo} alt="" /> : null} {s.alt}</div>
                  <img src={s.img} alt={s.alt} />
                </div>
              </div>
            ))}
          </div>
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
        {HERO_CHIPS.map((ch, i) => (
          <motion.div key={ch.c} className={`hero-chip ${ch.c}`} style={{ left: ch.x, top: ch.y, y: chipY[i] }} aria-hidden>
            {ch.t}
          </motion.div>
        ))}
        <div className="wrap hero-inner">
          <motion.div className="hero-head" style={{ y: slogY, opacity: slogOpacity }}>
            <Reveal y={14}><span className="eyebrow"><span className="dot" /> Meeting follow-through agent</span></Reveal>
            <Reveal delay={0.06} y={18}>
              <h1>It listens in Google Meet.<br />It <span className="grad">follows through in Slack.</span></h1>
            </Reveal>
            <Reveal delay={0.1} y={14}>
              <p className="hero-sub">Turn every conversation into organizational memory.</p>
            </Reveal>
            <Reveal delay={0.16} y={14}>
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
      </section>

      {/* ============ MEET + SLACK BANNER ============ */}
      <section className="ms-band" aria-label="Built for Google Meet and Slack">
        <div className="wrap ms-inner">
          <div className="ms-pair">
            <img src="/logos/google-meet.svg" alt="Google Meet" /><span>Google Meet</span>
            <span className="ms-arrow"><svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            <img src="/logos/slack.svg" alt="Slack" /><span>Slack</span>
          </div>
          <p className="ms-tag">Built for teams that live in Google Meet + Slack.</p>
        </div>
      </section>

      {/* ============ PROBLEM ============ */}
      <section className="prob">
        <div className="wrap">
          <Reveal>
            <span className="kicker">// what quenlo fixes</span>
            <h2>The meeting ends.<br />The follow-up doesn&apos;t.</h2>
            <p>Decisions get made. Owners get named. Dates get set. Then the call drops — and it all evaporates. Someone&apos;s supposed to remember. Usually, no one does.</p>
          </Reveal>
        </div>
      </section>

      {/* ============ HOW IT WORKS (scroll story) ============ */}
      <ScrollStory />

      {/* ============ MEMORY EXPLORER ============ */}
      <MemoryExplorer />

      {/* ============ STATEMENT ============ */}
      <section className="statement on-dark">
        <div className="statement-grid-bg" aria-hidden />
        <div className="wrap">
          <Reveal>
            <h2>Notes tell you <span className="dim">what was said.</span><br />Quenlo makes sure <span className="hl">it gets done.</span></h2>
          </Reveal>
        </div>
      </section>

      {/* ============ FDE ============ */}
      <Fde />

      {/* ============ BOOK DEMO ============ */}
      <section className="book on-dark" id="book-demo">
        <div className="wrap book-grid">
          <Reveal>
            <span className="eyebrow"><span className="dot" /> Book a demo</span>
            <h2>See Quenlo run one of your meetings.</h2>
            <p>Bring one real recurring call — a founder sync, a product review, a customer call. We&apos;ll show you the follow-up landing in Slack, automatically.</p>
            <div className="book-points"><span>Google Meet</span><span>Slack</span><span>Your vocabulary</span><span>A real meeting</span></div>
          </Reveal>
          <Reveal delay={0.1}><BookDemoPanel /></Reveal>
        </div>
      </section>
    </div>
  )
}
