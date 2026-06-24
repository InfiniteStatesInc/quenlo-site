import BookDemoPanel from '../components/BookDemoPanel'
import './Quenlo.css'

export default function BookDemo() {
  return (
    <div className="q-page">
      <section className="book on-dark" id="book-demo" style={{ paddingTop: 120 }}>
        <div className="wrap book-grid">
          <div>
            <span className="eyebrow"><span className="dot" /> Book a demo</span>
            <h2 style={{ marginTop: 16, fontSize: 'clamp(32px,4vw,48px)', lineHeight: 1.05 }}>
              Test Quenlo on a real conversation.
            </h2>
            <p style={{ marginTop: 16 }}>
              Tell us where decisions disappear today. We will shape the first forward-deployed demo
              around your workflow, team vocabulary, and the conversations that already run the company.
            </p>
            <div className="book-points">
              <span>Slack workspace</span><span>Meet / call flow</span><span>Team vocabulary</span><span>Custom FDE skill</span>
            </div>
          </div>
          <BookDemoPanel />
        </div>
      </section>
    </div>
  )
}
