export default function Projects({ projects, label }) {
  if (!projects?.length) return null

  return (
    <section id="projects" className="section">
      <div className="container">
        <header className="section__header">
          <span className="section__kicker">Work</span>
          <h2 className="section__title">{label || 'Selected work'}</h2>
        </header>
        <div className="projects__grid">
          {projects.map((p) => (
            <article key={p.title} className="project-card">
              <div className="project-card__top">
                <h3 className="project-card__title">{p.title}</h3>
                <p className="project-card__desc">{p.description}</p>
              </div>
              {p.tech?.length ? (
                <ul className="project-card__tech">
                  {p.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              ) : null}
              {(p.link || p.repo) ? (
                <div className="project-card__links">
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noreferrer">
                      View ↗
                    </a>
                  ) : null}
                  {p.repo ? (
                    <a href={p.repo} target="_blank" rel="noreferrer">
                      Details ↗
                    </a>
                  ) : null}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
