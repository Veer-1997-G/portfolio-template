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
import Walkthrough from './components/Walkthrough.jsx'
import Admin from './pages/Admin.jsx'
import { ProfileProvider, useProfile } from './context/ProfileContext.jsx'

const TOUR_KEY = 'portfolio-tour-completed-v1'

const TOUR_STEPS = [
  {
    title: "Welcome to your portfolio template! 👋",
    body:
      "This is a free template that works for every stream — IT, Marketing, Sales, Engineering, Finance, Collections, and more. Edit your details, save them in your browser, and download a clean ATS-friendly PDF anytime.",
  },
  {
    title: "Step 1 — Edit your profile",
    body:
      "Click the Edit button in the navbar to fill in your name, role, skills, experience, education, certifications, and projects. Every field is repeatable, so add as many items as you like.",
    target: '.navbar__edit',
  },
  {
    title: "Step 2 — Show only what's relevant",
    body:
      "Inside the Edit page you'll find 'Visible sections' — toggle off any section that doesn't apply to your stream (e.g. hide Education if you're senior, or hide Certifications if you have none). Only enabled sections appear on the site and in the PDF.",
    tip: "Customise the 'Projects / Work' section heading too — call it Campaigns, Engagements, Key Accounts, or whatever fits your field.",
  },
  {
    title: 'Step 3 — Download your resume',
    body:
      "Click the Download button to save a single-page, ATS-friendly PDF in light mode. Recommended print settings: turn ON Background graphics and turn OFF Headers and footers — the PDF then comes out completely clean.",
    target: '.navbar__download',
  },
  {
    title: 'Step 4 — Back up or share your data',
    body:
      "Your edits live in YOUR browser only — nobody else sees them. Inside the Edit page, use 'Export JSON' to download your config as a file you can keep as backup or share with friends. Use 'Import JSON' to load one back.",
  },
  {
    title: "You're all set 🚀",
    body:
      "Click Edit in the navbar to start filling in your details. If you want to see this tour again later, click 'Take the tour' in the footer.",
    target: '.navbar__edit',
  },
]

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

  // Show the first-time walkthrough until the user completes/skips it.
  const [showTour, setShowTour] = useState(() => {
    if (typeof window === 'undefined') return false
    return !localStorage.getItem(TOUR_KEY)
  })

  const closeTour = (markComplete = true) => {
    if (markComplete) {
      try {
        localStorage.setItem(TOUR_KEY, 'yes')
      } catch {
        // ignore quota/private-mode errors
      }
    }
    setShowTour(false)
  }

  const startTour = () => setShowTour(true)

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
      <Footer profile={profile} onStartTour={startTour} />

      {showTour && (
        <Walkthrough steps={TOUR_STEPS} onClose={closeTour} />
      )}
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
