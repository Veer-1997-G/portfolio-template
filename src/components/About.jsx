export default function About({ profile }) {
  return (
    <section id="about" className="section">
      <div className="container">
        <header className="section__header">
          <span className="section__kicker">About</span>
          <h2 className="section__title">A bit about me</h2>
        </header>
        <div className="about__grid">
          <div className="about__copy">
            {profile.about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <aside className="about__facts">
            <div className="fact">
              <span className="fact__label">Industry</span>
              <span className="fact__value">{profile.stream || '—'}</span>
            </div>
            <div className="fact">
              <span className="fact__label">Based in</span>
              <span className="fact__value">{profile.location || '—'}</span>
            </div>
            <div className="fact">
              <span className="fact__label">Email</span>
              {profile.email ? (
                <a className="fact__value" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              ) : (
                <span className="fact__value">—</span>
              )}
            </div>
            <div className="fact">
              <span className="fact__label">Contact</span>
              {profile.phone ? (
                <a className="fact__value" href={`tel:${profile.phone}`}>
                  {profile.phone}
                </a>
              ) : (
                <span className="fact__value">—</span>
              )}
            </div>
            {profile.resumeUrl && profile.resumeUrl !== '#' ? (
              <div className="fact">
                <span className="fact__label">Résumé</span>
                <a className="fact__value" href={profile.resumeUrl}>
                  Download →
                </a>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  )
}
