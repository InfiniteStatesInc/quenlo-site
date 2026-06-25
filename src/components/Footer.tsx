import { Link } from 'react-router-dom'

const cols = [
  {
    title: 'Product',
    items: [
      { label: 'How it works', href: '/#product' },
      { label: 'Forward-deployed', href: '/#fde' },
      { label: 'Watch the film', href: '/#film' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'Infinite-State', href: 'https://infist.ai' },
      { label: 'Book a demo', href: '/#book-demo' },
      { label: 'Contact', href: 'mailto:Infistteam@infist.ai' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="q-footer">
      <div className="wrap q-footer-grid">
        <div className="q-footer-brand">
          <Link to="/" className="q-brand q-brand-dark">
            <img src="/quenlo-logo-on-dark.svg" alt="" width={30} height={30} />
            <span>Quenlo</span>
          </Link>
          <p>The organizational memory system for modern teams. Built by Infinite-State.</p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} className="q-footer-col">
            <h4>{c.title}</h4>
            {c.items.map((it) => (
              <a key={it.label} href={it.href}>{it.label}</a>
            ))}
          </nav>
        ))}
      </div>
      <div className="wrap q-footer-base">
        <span>© 2026 Infinite-State. All rights reserved.</span>
        <span>Made with care for teams that decide fast.</span>
      </div>
    </footer>
  )
}
