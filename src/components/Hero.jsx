export default function Hero({ profile }) {
  return (
    <section id="top" className="hero">
      <div className="container hero__inner">
        <div className="hero__text">
          <p className="hero__eyebrow">Hello, I'm</p>
          <h1 className="hero__name">{profile.name}</h1>
          <h2 className="hero__title">{profile.title}</h2>
          {profile.stream ? (
            <div className="hero__chips">
              <span className="chip">{profile.stream}</span>
              {profile.location ? <span className="chip chip--ghost">{profile.location}</span> : null}
            </div>
          ) : null}
          <p className="hero__tagline">{profile.tagline}</p>
          <div className="hero__cta">
            <a href="#projects" className="btn btn--primary">
              View my work
            </a>
            <a href="#contact" className="btn btn--ghost">
              Get in touch
            </a>
          </div>
        </div>
        <div className="hero__avatar" aria-hidden="true">
          <div className="hero__avatar-ring" />
          <div className="hero__avatar-initials">{profile.initials}</div>
        </div>
      </div>
    </section>
  )
}
