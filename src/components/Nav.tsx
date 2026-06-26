import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { inPageNav } from '../lib/scroll'

const links = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#approach', label: 'Forward-deployed' },
  { href: 'https://infist.ai', label: 'Company' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`q-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap q-nav-inner">
        <Link to="/" className="q-brand">
          <img src="/quenlo-logo-on-light.svg" alt="" width={30} height={30} />
          <span>Quenlo</span>
        </Link>
        <div className="q-nav-links">
          {links.map(({ href, label }) => (
            <a key={href} href={href} onClick={(e) => inPageNav(e, href)}>{label}</a>
          ))}
        </div>
        <a href="/#book-demo" className="btn btn-teal q-nav-cta" onClick={(e) => inPageNav(e, '/#book-demo')}>Book a demo</a>
      </div>
    </nav>
  )
}
