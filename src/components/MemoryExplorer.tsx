import { useState } from 'react'

const Q = (
  <svg viewBox="0 0 40 40"><circle cx="18" cy="18" r="9.5" fill="none" stroke="#fff" strokeWidth="3.4" /><line x1="25" y1="25" x2="33" y2="33" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" /></svg>
)
const MEET = (
  <svg viewBox="0 0 176 138" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="url(#mxa)" d="M102 81.9C95.2 77.2 95.1 67.1 101.8 62.3L157 22.6c7.9-5.7 19 0 19 9.7v77.8c0 9.7-10.9 15.4-18.8 9.9z" /><path fill="url(#mxb)" d="M0 44C0 19.7 19.7 0 44 0h64c11 0 20 9 20 20v98c0 11-9 20-20 20H20c-11 0-20-9-20-20z" /><circle cx="30" cy="108" r="14" fill="#fff" /><defs><linearGradient id="mxa" x1="120" x2="219" y1="77" y2="77" gradientUnits="userSpaceOnUse"><stop stopColor="#f6a100" /><stop offset="1" stopColor="#ffbe00" /></linearGradient><radialGradient id="mxb" cx="0" cy="0" r="1" gradientTransform="matrix(-159 0 0 -135 152 69)" gradientUnits="userSpaceOnUse"><stop offset=".15" stopColor="#ffe921" /><stop offset="1" stopColor="#fec700" /></radialGradient></defs></svg>
)
const SLACK = (
  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="#e01e5a" d="M53.841 161.32c0 14.832-11.987 26.82-26.819 26.82S.203 176.152.203 161.32c0-14.831 11.987-26.818 26.82-26.818H53.84zm13.41 0c0-14.831 11.987-26.818 26.819-26.818s26.819 11.987 26.819 26.819v67.047c0 14.832-11.987 26.82-26.82 26.82c-14.83 0-26.818-11.988-26.818-26.82z" /><path fill="#36c5f0" d="M94.07 53.638c-14.832 0-26.82-11.987-26.82-26.819S79.239 0 94.07 0s26.819 11.987 26.819 26.819v26.82zm0 13.613c14.832 0 26.819 11.987 26.819 26.819s-11.987 26.819-26.82 26.819H26.82C11.987 120.889 0 108.902 0 94.069c0-14.83 11.987-26.818 26.819-26.818z" /><path fill="#2eb67d" d="M201.55 94.07c0-14.832 11.987-26.82 26.818-26.82s26.82 11.988 26.82 26.82s-11.988 26.819-26.82 26.819H201.55zm-13.41 0c0 14.832-11.988 26.819-26.82 26.819c-14.831 0-26.818-11.987-26.818-26.82V26.82C134.502 11.987 146.489 0 161.32 0s26.819 11.987 26.819 26.819z" /><path fill="#ecb22e" d="M161.32 201.55c14.832 0 26.82 11.987 26.82 26.818s-11.988 26.82-26.82 26.82c-14.831 0-26.818-11.988-26.818-26.82V201.55zm0-13.41c-14.831 0-26.818-11.988-26.818-26.82c0-14.831 11.987-26.818 26.819-26.818h67.25c14.832 0 26.82 11.987 26.82 26.819s-11.988 26.819-26.82 26.819z" /></svg>
)

type Tile = { i: string; c: string; n: string; spk?: boolean }
type Entry = {
  title: string
  q: { who: string; av: string; t: string; tx: string }
  a: { k: string; body: string; id: string }
  moment: { meetTitle: string; cap: string; tiles: Tile[]; sum: [string, string, string][] }
}

const DATA: Record<string, Entry> = {
  maya: {
    title: 'product-sync',
    q: { who: 'Theo', av: '#d98b32', t: '9:14 AM', tx: "Why didn't the pricing review happen yesterday?" },
    a: { k: '// from memory', body: 'Legal flagged a compliance blocker in Monday’s sync. <b>@mrod</b> owns the fix — due Thursday. The review is rescheduled once it clears.', id: '"Maya Rodriguez" on the call = @mrod here' },
    moment: { meetTitle: 'Monday Product Sync', cap: '<b>Maya:</b> I’ll get the pricing copy to legal — let’s hold the review till it clears.', tiles: [{ i: 'M', c: '#7e57c2', n: 'Maya', spk: true }, { i: 'T', c: '#26a69a', n: 'Theo' }], sum: [['dec', 'Decision', 'Hold pricing review until legal clears'], ['own', 'Owner', '@mrod'], ['risk', 'Risk', 'Compliance blocker on v2'], ['due', 'Due', 'Thursday']] },
  },
  thomas: {
    title: 'eng-standup',
    q: { who: 'Nora', av: '#ec407a', t: '10:02 AM', tx: "Who's actually on the onboarding revamp now?" },
    a: { k: '// from memory', body: '<b>@thomas</b> took it in the Apr 3 planning call. Phase 1 ships next sprint; he flagged the SSO piece as the only risk.', id: '"Tom R." on the call = @thomas here' },
    moment: { meetTitle: 'Apr 3 Planning', cap: '<b>Tom:</b> I’ll own the onboarding revamp — SSO is the part I’m worried about.', tiles: [{ i: 'T', c: '#26a69a', n: 'Tom R.', spk: true }, { i: 'N', c: '#ec407a', n: 'Nora' }], sum: [['dec', 'Decision', 'Onboarding revamp → phase 1 next sprint'], ['own', 'Owner', '@thomas'], ['risk', 'Risk', 'SSO integration'], ['due', 'Due', 'Next sprint']] },
  },
  pricing: {
    title: 'pricing-v2',
    q: { who: 'Theo', av: '#d98b32', t: 'Mon 4:30 PM', tx: 'What did we land on for pricing v2?' },
    a: { k: '// from memory', body: 'Three tiers, usage-based overage. Locked Mar 12, owned by <b>@nora</b>, shipped. Legal sign-off is still pending before the public page.', id: 'pulled from "Q1 Strategy Sync"' },
    moment: { meetTitle: 'Q1 Strategy Sync', cap: '<b>Nora:</b> Three tiers, usage-based overage — that’s the model we’re locking.', tiles: [{ i: 'N', c: '#ec407a', n: 'Nora', spk: true }, { i: 'T', c: '#d98b32', n: 'Theo' }], sum: [['dec', 'Decision', '3 tiers + usage-based overage'], ['own', 'Owner', '@nora'], ['due', 'Locked', 'Mar 12'], ['risk', 'Open', 'Legal sign-off']] },
  },
}

const PEOPLE = [
  { k: 'maya', av: '#7e57c2', i: 'M', nm: 'Maya Rodriguez', sub: '@mrod · Product' },
  { k: 'thomas', av: '#26a69a', i: 'T', nm: 'Tom R.', sub: '@thomas · Eng' },
  { k: 'pricing', av: '#ef6c57', i: '#', nm: 'pricing-v2', sub: 'thread · 14 msgs' },
]

export default function MemoryExplorer() {
  const [sel, setSel] = useState('maya')
  const [moment, setMoment] = useState<string | null>(null)
  const d = DATA[sel]
  const m = moment ? DATA[moment].moment : null

  return (
    <section className="mx-sec" id="memory">
      <div className="wrap">
        <div className="sec-head-c">
          <span className="kicker">// your team&apos;s memory</span>
          <h2>Ask Quenlo anything that ever happened.</h2>
          <p className="mx-sub">Pick anyone. See what Quenlo remembers — then jump straight to the moment it was said.</p>
        </div>
        <div className="mx-grid">
          {/* rail */}
          <div className="mx-panel mx-rail">
            <div className="mx-rh">PEOPLE &amp; THREADS</div>
            {PEOPLE.map((p) => (
              <button key={p.k} type="button" className={`mx-item ${sel === p.k ? 'on' : ''}`} onClick={() => { setSel(p.k); setMoment(null) }}>
                <span className="mx-av" style={{ background: p.av }}>{p.i}</span>
                <span className="mx-it"><b>{p.nm}</b><i>{p.sub}</i></span>
              </button>
            ))}
          </div>
          {/* chat */}
          <div className="mx-panel mx-chat">
            <div className="mx-top"><span className="mx-slk">{SLACK}</span> Slack <span className="mx-hash">·  #</span>{d.title}</div>
            <div className="mx-feed">
              <div className="mx-m">
                <span className="mx-pic" style={{ background: d.q.av }}>{d.q.who[0]}</span>
                <div><div><span className="mx-who">{d.q.who}</span><span className="mx-t">{d.q.t}</span></div><div className="mx-tx">{d.q.tx} <span className="mx-mention">@Quenlo</span></div></div>
              </div>
              <div className="mx-m mx-q">
                <span className="mx-pic mx-qpic">{Q}</span>
                <div style={{ flex: 1 }}>
                  <div><span className="mx-who">Quenlo</span></div>
                  <div className="mx-ans">
                    <div className="mx-k">{d.a.k}</div>
                    <div className="mx-body" dangerouslySetInnerHTML={{ __html: d.a.body }} />
                    <span className="mx-id">↔ {d.a.id}</span>
                    <div style={{ marginTop: 12 }}>
                      <button type="button" className={`mx-mbtn ${moment === sel ? 'is-on' : ''}`} onClick={() => setMoment(sel)}>
                        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg> See the moment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* moment */}
          <div className={`mx-panel mx-moment ${m ? '' : 'is-empty'}`}>
            {m ? (
              <>
                <div className="mx-meet">
                  <div className="mx-mbar"><span className="mx-meetlogo">{MEET}</span> Google Meet <span className="mx-rec"><i />REC</span> · {m.meetTitle}</div>
                  <div className="mx-tiles">
                    {m.tiles.map((t) => (
                      <div key={t.n} className={`mx-tile ${t.spk ? 'spk' : ''}`}><span className="mx-ta" style={{ background: t.c }}>{t.i}</span><span className="mx-tn">{t.n}</span></div>
                    ))}
                  </div>
                  <div className="mx-cap" dangerouslySetInnerHTML={{ __html: m.cap }} />
                </div>
                <div className="mx-sum">
                  <div className="mx-sh"><span className="mx-qpic mx-shq">{Q}</span> QUENLO · AI RECAP</div>
                  {m.sum.map((s) => (
                    <div className="mx-srow" key={s[1]}><span className={`mx-tag t-${s[0]}`}>{s[1]}</span><span className="mx-st">{s[2]}</span></div>
                  ))}
                </div>
              </>
            ) : (
              <div className="mx-hint"><span className="mx-big">▶ Click “see the moment”</span>Quenlo jumps to the exact clip from the meeting — with its own AI recap beside it.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
