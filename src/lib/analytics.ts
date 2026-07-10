import { track as vercelTrack } from '@vercel/analytics'

type AnalyticsProps = Record<string, string | number | boolean | null | undefined>

const SESSION_KEY = 'quenlo_analytics_session_id'

function getSessionId() {
  if (typeof window === 'undefined') return ''

  const existing = window.sessionStorage.getItem(SESSION_KEY)
  if (existing) return existing

  const next = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`
  window.sessionStorage.setItem(SESSION_KEY, next)
  return next
}

function getTrafficProps() {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)
  return {
    path: window.location.pathname,
    hash: window.location.hash || undefined,
    referrer: document.referrer || undefined,
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
  }
}

export function track(event: string, props: AnalyticsProps = {}) {
  const finalProps = {
    ...getTrafficProps(),
    ...props,
  }

  try {
    vercelTrack(event, finalProps)
  } catch {
    // Analytics must never block the landing page experience.
  }

  try {
    if (typeof window === 'undefined') return

    const payload = JSON.stringify({
      event,
      props: finalProps,
      sessionId: getSessionId(),
    })

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }))
      return
    }

    fetch('/api/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Fire-and-forget analytics only.
  }
}
