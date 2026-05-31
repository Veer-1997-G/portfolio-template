export default function Skills({ skills }) {
  return (
    <section id="skills" className="section section--alt">
      <div className="container">
        <header className="section__header">
          <span className="section__kicker">Skills</span>
          <h2 className="section__title">What I work with</h2>
        </header>
        <div className="skills__grid">
          {skills.map((group) => (
            <div key={group.group} className="skill-card">
              <h3 className="skill-card__title">{group.group}</h3>
              <ul className="skill-card__list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
