import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Quenlo from './pages/Quenlo'
import BookDemo from './pages/BookDemo'
import { track } from './lib/analytics'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function PageViewTracker() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    track('page_view', { page: pathname, hash: hash || undefined })
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <PageViewTracker />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Quenlo />} />
          <Route path="/book-demo" element={<BookDemo />} />
          <Route path="*" element={<Quenlo />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
