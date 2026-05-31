import { useEffect, useState } from 'react'

const ALL_LINKS = [
  { href: '#about', label: 'About', key: 'about' },
  { href: '#skills', label: 'Skills', key: 'skills' },
  { href: '#experience', label: 'Experience', key: 'experience' },
  { href: '#projects', label: 'Work', key: 'projects' },
  { href: '#education', label: 'Education', key: 'education' },
  { href: '#certifications', label: 'Certifications', key: 'certifications' },
  { href: '#contact', label: 'Contact', key: 'contact' },
]

export default function Navbar({
  profile,
  sections = {},
  theme,
  onToggleTheme,
  onDownload,
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visibleLinks = ALL_LINKS.filter((l) => sections[l.key] !== false)

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#top" className="navbar__brand" onClick={() => setOpen(false)}>
          <span className="navbar__mark">{profile.initials}</span>
          <span className="navbar__name">{profile.name}</span>
        </a>

        <nav className={`navbar__links${open ? ' navbar__links--open' : ''}`}>
          {visibleLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <button
            type="button"
            className="navbar__download"
            onClick={() => {
              setOpen(false)
              onDownload?.()
            }}
            aria-label="Download portfolio as PDF"
          >
            ↓ Download
          </button>
          <a
            href="#/admin"
            className="navbar__edit"
            onClick={() => setOpen(false)}
          >
            Edit
          </a>
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? 'Light' : 'Dark'} mode
          </button>
        </nav>

        <button
          type="button"
          className="navbar__burger"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
