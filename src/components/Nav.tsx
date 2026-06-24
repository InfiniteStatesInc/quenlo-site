import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const links = [
  { href: '/#product', label: 'How it works' },
  { href: '/#fde', label: 'Forward-deployed' },
  { href: '/#usecases', label: 'Use cases' },
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
            <a key={href} href={href}>{label}</a>
          ))}
        </div>
        <a href="/#book-demo" className="btn btn-teal q-nav-cta">Book a demo</a>
      </div>
    </nav>
  )
}
