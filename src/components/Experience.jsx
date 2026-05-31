export default function Experience({ experience }) {
  if (!experience?.length) return null

  return (
    <section id="experience" className="section section--alt">
      <div className="container">
        <header className="section__header">
          <span className="section__kicker">Experience</span>
          <h2 className="section__title">Where I've worked</h2>
        </header>

        <ol className="timeline">
          {experience.map((job, i) => (
            <li key={i} className="timeline__item">
              <div className="timeline__dot" aria-hidden="true" />
              <div className="timeline__dates">
                {job.startDate}
                {job.endDate ? ` — ${job.endDate}` : ' — Present'}
              </div>
              <div className="timeline__body">
                <h3 className="timeline__role">{job.role}</h3>
                <p className="timeline__company">
                  {job.company}
                  {job.location ? <span> · {job.location}</span> : null}
                </p>
                {job.bullets?.length ? (
                  <ul className="timeline__bullets">
                    {job.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
