import { useEffect, useRef, useState } from 'react'
import { useProfile } from '../context/ProfileContext.jsx'
import { STREAMS } from '../data/profile.js'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

const SECTION_LABELS = {
  about: 'About',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects / Work',
  education: 'Education',
  certifications: 'Certifications',
  contact: 'Contact',
}

export default function Admin() {
  const { profile, setProfile, resetProfile, exportProfile, importProfile } =
    useProfile()

  const [draft, setDraft] = useState(() => clone(profile))
  const [savedFlash, setSavedFlash] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  // Per-input raw-text buffers for array fields (skills, tags, bullets, …).
  // While a user is typing, we store the raw string here instead of parsing
  // every keystroke — that lets them type spaces and trailing commas freely.
  // On blur (or Save), we parse the buffer into the target array.
  const [textBuffers, setTextBuffers] = useState({})
  // Pending parsers, so we can flush on Save without needing blur to fire.
  const parsersRef = useRef({})

  useEffect(() => {
    setDraft(clone(profile))
    setTextBuffers({})
    parsersRef.current = {}
  }, [profile])

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }))

  const updateAt = (path, value) => {
    setDraft((d) => {
      const next = clone(d)
      let cur = next
      for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]]
      cur[path[path.length - 1]] = value
      return next
    })
  }

  const bufKey = (path) => path.join('.')

  const getText = (path, fallback) => {
    const k = bufKey(path)
    return textBuffers[k] !== undefined ? textBuffers[k] : fallback
  }

  const setText = (path, value, parser) => {
    const k = bufKey(path)
    parsersRef.current[k] = { path, parser }
    setTextBuffers((b) => ({ ...b, [k]: value }))
  }

  const commitText = (path) => {
    const k = bufKey(path)
    const raw = textBuffers[k]
    const entry = parsersRef.current[k]
    if (raw === undefined || !entry) return
    updateAt(entry.path, entry.parser(raw))
    setTextBuffers((b) => {
      const next = { ...b }
      delete next[k]
      return next
    })
    delete parsersRef.current[k]
  }

  // Flush every pending buffer using its parser. Used before Save so the
  // user doesn't lose data they typed but never blurred out of.
  const flushAllBuffers = () => {
    const entries = Object.entries(parsersRef.current)
    if (!entries.length) return draft
    let nextDraft = clone(draft)
    for (const [k, { path, parser }] of entries) {
      const raw = textBuffers[k]
      if (raw === undefined) continue
      let cur = nextDraft
      for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]]
      cur[path[path.length - 1]] = parser(raw)
    }
    setDraft(nextDraft)
    setTextBuffers({})
    parsersRef.current = {}
    return nextDraft
  }

  const handleSave = (e) => {
    e?.preventDefault?.()
    const finalDraft = flushAllBuffers()
    setProfile(finalDraft)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1800)
  }

  const handleReset = () => {
    if (confirm('Reset all fields back to the template defaults?')) {
      resetProfile()
    }
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleImportFile = async (e) => {
    setError('')
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      importProfile(data)
    } catch (err) {
      setError(err?.message || 'Could not read that JSON file.')
    } finally {
      e.target.value = ''
    }
  }

  return (
    <div className="admin">
      <div className="container admin__inner">
        <header className="admin__header">
          <div>
            <span className="section__kicker">Admin</span>
            <h1 className="admin__title">Edit your profile</h1>
            <p className="admin__lede">
              This template works for any stream — IT, marketing, sales, engineering, finance,
              collections, and more. Fill in what's relevant, hide sections you don't need under{' '}
              <strong>Visible sections</strong>, and click <strong>Save</strong>.
            </p>
          </div>
          <div className="admin__actions">
            <a href="#/" className="btn btn--ghost">
              ← View site
            </a>
            <button type="button" className="btn btn--ghost" onClick={exportProfile}>
              Export JSON
            </button>
            <button type="button" className="btn btn--ghost" onClick={handleImportClick}>
              Import JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              style={{ display: 'none' }}
            />
            <button type="button" className="btn btn--ghost" onClick={handleReset}>
              Reset
            </button>
            <button type="button" className="btn btn--primary" onClick={handleSave}>
              {savedFlash ? '✓ Saved' : 'Save'}
            </button>
          </div>
        </header>

        {error && <div className="admin__error">{error}</div>}

        <form className="admin__form" onSubmit={handleSave} noValidate>
          {/* ---------- Visible sections ---------- */}
          <fieldset className="admin__group">
            <legend>Visible sections</legend>
            <p className="admin__hint">
              Turn off sections that don't apply to your stream. For example, a senior sales lead
              may hide Education; a fresh engineering grad may hide Experience.
            </p>
            <div className="admin__toggles">
              {Object.entries(SECTION_LABELS).map(([key, label]) => (
                <label key={key} className="toggle">
                  <input
                    type="checkbox"
                    checked={draft.sections?.[key] !== false}
                    onChange={(e) =>
                      update({
                        sections: { ...draft.sections, [key]: e.target.checked },
                      })
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* ---------- Basics ---------- */}
          <fieldset className="admin__group">
            <legend>Basic info</legend>
            <div className="admin__grid-2">
              <label>
                <span>Full name</span>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => update({ name: e.target.value })}
                />
              </label>
              <label>
                <span>Initials (avatar, 1–3 chars)</span>
                <input
                  type="text"
                  maxLength={3}
                  value={draft.initials}
                  onChange={(e) => update({ initials: e.target.value.toUpperCase() })}
                />
              </label>
              <label>
                <span>Job title / role</span>
                <input
                  type="text"
                  placeholder="e.g. Senior Mechanical Engineer"
                  value={draft.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
              </label>
              <label>
                <span>Industry / stream</span>
                <select
                  value={STREAMS.includes(draft.stream) ? draft.stream : 'Other'}
                  onChange={(e) => update({ stream: e.target.value })}
                >
                  {STREAMS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              {!STREAMS.includes(draft.stream) || draft.stream === 'Other' ? (
                <label className="admin__span-2">
                  <span>Custom stream label</span>
                  <input
                    type="text"
                    placeholder="e.g. Logistics, Procurement, Pharma…"
                    value={draft.stream === 'Other' ? '' : draft.stream}
                    onChange={(e) => update({ stream: e.target.value || 'Other' })}
                  />
                </label>
              ) : null}
              <label>
                <span>Location</span>
                <input
                  type="text"
                  value={draft.location}
                  onChange={(e) => update({ location: e.target.value })}
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => update({ email: e.target.value })}
                />
              </label>
              <label>
                <span>Contact number</span>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={draft.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                />
              </label>
              <label>
                <span>Résumé / CV URL</span>
                <input
                  type="text"
                  value={draft.resumeUrl}
                  onChange={(e) => update({ resumeUrl: e.target.value })}
                />
              </label>
            </div>
            <label>
              <span>Tagline (1 line)</span>
              <textarea
                rows="2"
                value={draft.tagline}
                onChange={(e) => update({ tagline: e.target.value })}
              />
            </label>
          </fieldset>

          {/* ---------- About paragraphs ---------- */}
          <fieldset className="admin__group">
            <legend>About — paragraphs</legend>
            {draft.about.map((para, i) => (
              <div key={i} className="admin__row">
                <textarea
                  rows="3"
                  value={para}
                  onChange={(e) => {
                    const next = [...draft.about]
                    next[i] = e.target.value
                    update({ about: next })
                  }}
                />
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() =>
                    update({ about: draft.about.filter((_, idx) => idx !== i) })
                  }
                  aria-label="Remove paragraph"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => update({ about: [...draft.about, ''] })}
            >
              + Add paragraph
            </button>
          </fieldset>

          {/* ---------- Socials ---------- */}
          <fieldset className="admin__group">
            <legend>Social / professional links</legend>
            {draft.socials.map((s, i) => (
              <div key={i} className="admin__row admin__row--two">
                <input
                  type="text"
                  placeholder="Label (e.g. LinkedIn)"
                  value={s.label}
                  onChange={(e) => updateAt(['socials', i, 'label'], e.target.value)}
                />
                <input
                  type="text"
                  placeholder="https://..."
                  value={s.href}
                  onChange={(e) => updateAt(['socials', i, 'href'], e.target.value)}
                />
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() =>
                    update({
                      socials: draft.socials.filter((_, idx) => idx !== i),
                    })
                  }
                  aria-label="Remove social"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() =>
                update({
                  socials: [...draft.socials, { label: '', href: '' }],
                })
              }
            >
              + Add link
            </button>
          </fieldset>

          {/* ---------- Skills ---------- */}
          <fieldset className="admin__group">
            <legend>Skills</legend>
            <p className="admin__hint">
              Group skills however makes sense for your stream — Core skills, Tools, Languages,
              Machinery, Domain knowledge, etc. Separate items with commas.
            </p>
            {draft.skills.map((group, i) => {
              const itemsPath = ['skills', i, 'items']
              const parseCsv = (raw) =>
                raw.split(',').map((s) => s.trim()).filter(Boolean)
              return (
                <div key={i} className="admin__row admin__row--two">
                  <input
                    type="text"
                    placeholder="Group name"
                    value={group.group}
                    onChange={(e) => updateAt(['skills', i, 'group'], e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Item 1, Item 2, Item 3 …"
                    value={getText(itemsPath, group.items.join(', '))}
                    onChange={(e) => setText(itemsPath, e.target.value, parseCsv)}
                    onBlur={() => commitText(itemsPath)}
                  />
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() =>
                      update({
                        skills: draft.skills.filter((_, idx) => idx !== i),
                      })
                    }
                    aria-label="Remove group"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() =>
                update({
                  skills: [...draft.skills, { group: '', items: [] }],
                })
              }
            >
              + Add skill group
            </button>
          </fieldset>

          {/* ---------- Experience ---------- */}
          <fieldset className="admin__group">
            <legend>Experience</legend>
            <p className="admin__hint">
              List your work history with the most recent first. Leave "End date" empty for your
              current role.
            </p>
            {draft.experience?.map((job, i) => (
              <div key={i} className="admin__project">
                <div className="admin__project-head">
                  <strong>Role {i + 1}</strong>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() =>
                      update({
                        experience: draft.experience.filter((_, idx) => idx !== i),
                      })
                    }
                    aria-label="Remove role"
                  >
                    ✕
                  </button>
                </div>
                <div className="admin__grid-2">
                  <label>
                    <span>Job title / role</span>
                    <input
                      type="text"
                      value={job.role}
                      onChange={(e) => updateAt(['experience', i, 'role'], e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Company / organisation</span>
                    <input
                      type="text"
                      value={job.company}
                      onChange={(e) => updateAt(['experience', i, 'company'], e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Location</span>
                    <input
                      type="text"
                      value={job.location}
                      onChange={(e) => updateAt(['experience', i, 'location'], e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Start date</span>
                    <input
                      type="text"
                      placeholder="e.g. Jan 2022"
                      value={job.startDate}
                      onChange={(e) => updateAt(['experience', i, 'startDate'], e.target.value)}
                    />
                  </label>
                  <label>
                    <span>End date (leave blank if current)</span>
                    <input
                      type="text"
                      placeholder="e.g. Dec 2024 or Present"
                      value={job.endDate}
                      onChange={(e) => updateAt(['experience', i, 'endDate'], e.target.value)}
                    />
                  </label>
                </div>
                <label>
                  <span>Achievements / responsibilities (one per line)</span>
                  <textarea
                    rows="4"
                    value={getText(
                      ['experience', i, 'bullets'],
                      (job.bullets || []).join('\n'),
                    )}
                    onChange={(e) =>
                      setText(
                        ['experience', i, 'bullets'],
                        e.target.value,
                        (raw) =>
                          raw.split('\n').map((s) => s.trim()).filter(Boolean),
                      )
                    }
                    onBlur={() => commitText(['experience', i, 'bullets'])}
                  />
                </label>
              </div>
            ))}
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() =>
                update({
                  experience: [
                    ...(draft.experience || []),
                    {
                      role: '',
                      company: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      bullets: [],
                    },
                  ],
                })
              }
            >
              + Add role
            </button>
          </fieldset>

          {/* ---------- Education ---------- */}
          <fieldset className="admin__group">
            <legend>Education</legend>
            {draft.education?.map((ed, i) => (
              <div key={i} className="admin__project">
                <div className="admin__project-head">
                  <strong>Entry {i + 1}</strong>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() =>
                      update({
                        education: draft.education.filter((_, idx) => idx !== i),
                      })
                    }
                    aria-label="Remove entry"
                  >
                    ✕
                  </button>
                </div>
                <div className="admin__grid-2">
                  <label>
                    <span>Degree</span>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech, MBA, Diploma"
                      value={ed.degree}
                      onChange={(e) => updateAt(['education', i, 'degree'], e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Field of study</span>
                    <input
                      type="text"
                      placeholder="e.g. Mechanical Engineering, Finance"
                      value={ed.field}
                      onChange={(e) => updateAt(['education', i, 'field'], e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Institution</span>
                    <input
                      type="text"
                      value={ed.institution}
                      onChange={(e) => updateAt(['education', i, 'institution'], e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Location</span>
                    <input
                      type="text"
                      value={ed.location}
                      onChange={(e) => updateAt(['education', i, 'location'], e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Start year</span>
                    <input
                      type="text"
                      value={ed.startDate}
                      onChange={(e) => updateAt(['education', i, 'startDate'], e.target.value)}
                    />
                  </label>
                  <label>
                    <span>End year</span>
                    <input
                      type="text"
                      value={ed.endDate}
                      onChange={(e) => updateAt(['education', i, 'endDate'], e.target.value)}
                    />
                  </label>
                </div>
                <label>
                  <span>Detail (GPA, honours, thesis — optional)</span>
                  <input
                    type="text"
                    value={ed.detail}
                    onChange={(e) => updateAt(['education', i, 'detail'], e.target.value)}
                  />
                </label>
              </div>
            ))}
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() =>
                update({
                  education: [
                    ...(draft.education || []),
                    {
                      degree: '',
                      field: '',
                      institution: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      detail: '',
                    },
                  ],
                })
              }
            >
              + Add education
            </button>
          </fieldset>

          {/* ---------- Certifications ---------- */}
          <fieldset className="admin__group">
            <legend>Certifications &amp; licenses</legend>
            <p className="admin__hint">
              Especially useful for engineers (PE, ISO, Six Sigma), finance (CFA, CPA), IT (AWS,
              Azure), healthcare (board certifications), etc.
            </p>
            {draft.certifications?.map((c, i) => (
              <div key={i} className="admin__row admin__row--cert">
                <input
                  type="text"
                  placeholder="Name (e.g. AWS Solutions Architect)"
                  value={c.name}
                  onChange={(e) => updateAt(['certifications', i, 'name'], e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Issuer"
                  value={c.issuer || ''}
                  onChange={(e) => updateAt(['certifications', i, 'issuer'], e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={c.date || ''}
                  onChange={(e) => updateAt(['certifications', i, 'date'], e.target.value)}
                />
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() =>
                    update({
                      certifications: draft.certifications.filter((_, idx) => idx !== i),
                    })
                  }
                  aria-label="Remove certification"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() =>
                update({
                  certifications: [
                    ...(draft.certifications || []),
                    { name: '', issuer: '', date: '', link: '' },
                  ],
                })
              }
            >
              + Add certification
            </button>
          </fieldset>

          {/* ---------- Projects / Work ---------- */}
          <fieldset className="admin__group">
            <legend>Projects / Work</legend>
            <label>
              <span>Section heading (rename for your stream)</span>
              <input
                type="text"
                placeholder='e.g. "Selected work", "Key campaigns", "Engagements", "Site projects"'
                value={draft.labels?.projects || ''}
                onChange={(e) =>
                  update({
                    labels: { ...draft.labels, projects: e.target.value },
                  })
                }
              />
            </label>

            {draft.projects.map((p, i) => (
              <div key={i} className="admin__project">
                <div className="admin__project-head">
                  <strong>Item {i + 1}</strong>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() =>
                      update({
                        projects: draft.projects.filter((_, idx) => idx !== i),
                      })
                    }
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
                <div className="admin__grid-2">
                  <label>
                    <span>Title</span>
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) => updateAt(['projects', i, 'title'], e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Tags (comma-separated)</span>
                    <input
                      type="text"
                      value={getText(
                        ['projects', i, 'tech'],
                        p.tech.join(', '),
                      )}
                      onChange={(e) =>
                        setText(
                          ['projects', i, 'tech'],
                          e.target.value,
                          (raw) =>
                            raw.split(',').map((s) => s.trim()).filter(Boolean),
                        )
                      }
                      onBlur={() => commitText(['projects', i, 'tech'])}
                    />
                  </label>
                  <label>
                    <span>Primary URL (optional)</span>
                    <input
                      type="text"
                      value={p.link}
                      onChange={(e) => updateAt(['projects', i, 'link'], e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Secondary URL (optional)</span>
                    <input
                      type="text"
                      value={p.repo}
                      onChange={(e) => updateAt(['projects', i, 'repo'], e.target.value)}
                    />
                  </label>
                </div>
                <label>
                  <span>Description</span>
                  <textarea
                    rows="3"
                    value={p.description}
                    onChange={(e) =>
                      updateAt(['projects', i, 'description'], e.target.value)
                    }
                  />
                </label>
              </div>
            ))}
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() =>
                update({
                  projects: [
                    ...draft.projects,
                    {
                      title: '',
                      description: '',
                      tech: [],
                      link: '',
                      repo: '',
                    },
                  ],
                })
              }
            >
              + Add item
            </button>
          </fieldset>

          <div className="admin__footer">
            <button type="submit" className="btn btn--primary">
              {savedFlash ? '✓ Saved' : 'Save changes'}
            </button>
            <a href="#/" className="btn btn--ghost">
              Done — view site
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
