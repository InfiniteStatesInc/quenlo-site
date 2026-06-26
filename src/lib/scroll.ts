import type { MouseEvent } from 'react'

/**
 * Smooth-scroll to an in-page section without leaving a #hash in the URL.
 * Pass the link's href (e.g. "/#how-it-works" or "#book-demo").
 * External links / mailto (no '#') are left untouched.
 */
export function inPageNav(e: MouseEvent<HTMLAnchorElement>, href: string) {
  const i = href.indexOf('#')
  if (i === -1) return
  const id = href.slice(i + 1)
  if (!id) return
  const el = document.getElementById(id)
  if (el) {
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
