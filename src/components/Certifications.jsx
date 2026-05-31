export default function Certifications({ certifications }) {
  if (!certifications?.length) return null

  return (
    <section id="certifications" className="section section--alt">
      <div className="container">
        <header className="section__header">
          <span className="section__kicker">Certifications</span>
          <h2 className="section__title">Certifications &amp; licenses</h2>
        </header>

        <ul className="certs__grid">
          {certifications.map((c, i) => {
            const inner = (
              <>
                <h3 className="cert__name">{c.name}</h3>
                <p className="cert__meta">
                  {c.issuer}
                  {c.date ? <span> · {c.date}</span> : null}
                </p>
              </>
            )
            return (
              <li key={i} className="cert">
                {c.link ? (
                  <a href={c.link} target="_blank" rel="noreferrer" className="cert__link">
                    {inner}
                    <span className="cert__arrow">↗</span>
                  </a>
                ) : (
                  inner
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
