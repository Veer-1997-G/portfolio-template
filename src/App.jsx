import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Experience from './components/Experience.jsx'
import Projects from './components/Projects.jsx'
import Education from './components/Education.jsx'
import Certifications from './components/Certifications.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Admin from './pages/Admin.jsx'
import { ProfileProvider, useProfile } from './context/ProfileContext.jsx'

function useHashRoute() {
  const get = () =>
    (typeof window === 'undefined' ? '/' : window.location.hash.replace(/^#/, '')) ||
    '/'
  const [route, setRoute] = useState(get)
  useEffect(() => {
    const onChange = () => setRoute(get())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

function formatPrintDate(date) {
  return date.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Site() {
  const { profile } = useProfile()
  const route = useHashRoute()
  const sections = profile.sections || {}

  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('theme') || 'dark'
  })
  const [printedAt, setPrintedAt] = useState(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  // Keep document title in sync with the saved name (browser uses this in
  // its default print header, top of every printed page).
  useEffect(() => {
    document.title = profile.name
      ? `${profile.name} — Portfolio`
      : 'Portfolio'
  }, [profile.name])

  // Safety net: also stamp printedAt if user prints via Ctrl/Cmd+P.
  useEffect(() => {
    const onBefore = () => setPrintedAt(new Date())
    window.addEventListener('beforeprint', onBefore)
    return () => window.removeEventListener('beforeprint', onBefore)
  }, [])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const handleDownload = () => {
    const now = new Date()
    setPrintedAt(now)
    const originalTitle = document.title
    // Include date/time in the document title so the browser's automatic
    // print header (top of each printed page) shows it as well.
    document.title = `${profile.name || 'Portfolio'} — Portfolio · ${formatPrintDate(now)}`
    setTimeout(() => {
      window.print()
      setTimeout(() => {
        document.title = originalTitle
      }, 1500)
    }, 80)
  }

  if (route.startsWith('/admin')) {
    return <Admin />
  }

  const printDate = printedAt || new Date()

  return (
    <div className="app">
      <Navbar
        profile={profile}
        sections={sections}
        theme={theme}
        onToggleTheme={toggleTheme}
        onDownload={handleDownload}
      />
      <main>
        {/* Print-only banner shown at the top of the PDF (hidden on screen
            and currently hidden in print stylesheet — kept for future use). */}
        <div className="print-header" aria-hidden="true">
          <strong>{profile.name} — Portfolio</strong>
          <span>{formatPrintDate(printDate)}</span>
        </div>

        <Hero profile={profile} />

        {/* Print-only ATS-friendly contact strip — sits directly under the
            name in the PDF so resume parsers find the contact details fast. */}
        <div className="print-contact" aria-hidden="true">
          {[
            profile.email,
            profile.phone,
            profile.location,
            profile.stream,
            ...(profile.socials || [])
              .filter((s) => s.href)
              .map((s) => `${s.label}: ${s.href}`),
          ]
            .filter(Boolean)
            .join('  ·  ')}
        </div>
        {sections.about !== false && <About profile={profile} />}
        {sections.skills !== false && <Skills skills={profile.skills} />}
        {sections.experience !== false && <Experience experience={profile.experience} />}
        {sections.projects !== false && (
          <Projects projects={profile.projects} label={profile.labels?.projects} />
        )}
        {sections.education !== false && <Education education={profile.education} />}
        {sections.certifications !== false && (
          <Certifications certifications={profile.certifications} />
        )}
        {sections.contact !== false && <Contact profile={profile} />}
      </main>
      <Footer profile={profile} />
    </div>
  )
}

export default function App() {
  return (
    <ProfileProvider>
      <Site />
    </ProfileProvider>
  )
}
