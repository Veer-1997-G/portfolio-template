export default function Education({ education }) {
  if (!education?.length) return null

  return (
    <section id="education" className="section">
      <div className="container">
        <header className="section__header">
          <span className="section__kicker">Education</span>
          <h2 className="section__title">Academic background</h2>
        </header>

        <div className="education__grid">
          {education.map((ed, i) => (
            <article key={i} className="education-card">
              <h3 className="education-card__degree">
                {ed.degree}
                {ed.field ? <span className="education-card__field"> · {ed.field}</span> : null}
              </h3>
              <p className="education-card__institution">
                {ed.institution}
                {ed.location ? <span> · {ed.location}</span> : null}
              </p>
              <p className="education-card__dates">
                {ed.startDate}
                {ed.endDate ? ` — ${ed.endDate}` : ''}
              </p>
              {ed.detail ? <p className="education-card__detail">{ed.detail}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
