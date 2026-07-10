import { useState } from 'react'
import { track } from '../lib/analytics'

type FormState = {
  name: string
  email: string
  company: string
  role: string
  teamSize: string
  meetingFlow: string
  timeline: string
}

const initialForm: FormState = {
  name: '',
  email: '',
  company: '',
  role: '',
  teamSize: '',
  meetingFlow: '',
  timeline: '',
}

export default function BookDemoPanel() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    track('book_demo_submit_attempt', {
      team_size: form.teamSize || undefined,
      timeline: form.timeline || undefined,
      has_meeting_flow: Boolean(form.meetingFlow.trim()),
    })

    try {
      const response = await fetch('/api/book-demo', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...form,
          pageUrl: window.location.href,
        }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Could not submit the request.')
      }
      track('book_demo_submit_success', {
        team_size: form.teamSize || undefined,
        timeline: form.timeline || undefined,
      })
      setSent(true)
    } catch (submitError) {
      track('book_demo_submit_error', {
        message: submitError instanceof Error ? submitError.message : 'unknown',
      })
      setError(submitError instanceof Error ? submitError.message : 'Could not submit the request.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="demo-form-card demo-form-card-done">
        <img src="/quenlo-logo-on-light.svg" alt="" />
        <h3>Demo request queued.</h3>
        <p>
          Thanks, {form.name || 'there'}. We saved your request and will follow up at {form.email || 'your work email'}.
        </p>
      </div>
    )
  }

  return (
    <form className="demo-form-card" onSubmit={handleSubmit}>
      <div className="demo-form-head">
        <strong>Book a Quenlo demo</strong>
      </div>
      <div className="demo-form-grid">
        <label className="form-group">
          <span className="form-label">Name</span>
          <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="Emma Carter" required />
        </label>
        <label className="form-group">
          <span className="form-label">Work email</span>
          <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="emma@company.com" required />
        </label>
      </div>
      <div className="demo-form-grid">
        <label className="form-group">
          <span className="form-label">Company</span>
          <input className="form-input" name="company" value={form.company} onChange={handleChange} placeholder="Acme AI" required />
        </label>
        <label className="form-group">
          <span className="form-label">Role</span>
          <input className="form-input" name="role" value={form.role} onChange={handleChange} placeholder="Founder, PM, Eng lead..." />
        </label>
      </div>
      <div className="demo-form-grid">
        <label className="form-group">
          <span className="form-label">Team size</span>
          <select className="form-select" name="teamSize" value={form.teamSize} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="5-15">5-15 people</option>
            <option value="16-50">16-50 people</option>
            <option value="51-200">51-200 people</option>
            <option value="200+">200+ people</option>
          </select>
        </label>
        <label className="form-group">
          <span className="form-label">Demo timing</span>
          <select className="form-select" name="timeline" value={form.timeline} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="this-week">This week</option>
            <option value="next-week">Next week</option>
            <option value="exploring">Still exploring</option>
          </select>
        </label>
      </div>
      <label className="form-group">
        <span className="form-label">Conversation flow to map</span>
        <textarea
          className="form-textarea"
          name="meetingFlow"
          value={form.meetingFlow}
          onChange={handleChange}
          placeholder="Founder syncs, customer calls, product reviews, weekly planning..."
        />
      </label>
      {error ? <p className="demo-form-error">{error} You can also reach us at Infistteam@infist.ai.</p> : null}
      <button className="btn btn-primary demo-submit" type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Book demo'}
      </button>
      <p className="demo-form-note">We&apos;ll get back to you within one business day — no prep needed.</p>
    </form>
  )
}
