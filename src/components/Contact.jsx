import { useState } from 'react'

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Hello from ${form.name || 'your site'}`)
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`,
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section id="contact" className="section section--alt">
      <div className="container">
        <header className="section__header">
          <span className="section__kicker">Contact</span>
          <h2 className="section__title">Let's talk</h2>
          <p className="section__lede">
            Have a project, role, or question in mind? Drop a note — I read everything.
          </p>
        </header>

        <div className="contact__grid">
          <form className="contact__form" onSubmit={onSubmit}>
            <label>
              <span>Name</span>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={onChange}
                placeholder="Your name"
              />
            </label>
            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
              />
            </label>
            <label>
              <span>Message</span>
              <textarea
                name="message"
                rows="5"
                required
                value={form.message}
                onChange={onChange}
                placeholder="What's on your mind?"
              />
            </label>
            <button type="submit" className="btn btn--primary">
              {sent ? 'Opening your email…' : 'Send message'}
            </button>
          </form>

          <aside className="contact__side">
            <p className="contact__hint">Prefer the direct route?</p>
            <a className="contact__email" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <ul className="contact__socials">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
