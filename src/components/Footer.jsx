export default function Footer({ profile, onStartTour }) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>
          © {new Date().getFullYear()} {profile.name}. Built with React + Vite.
        </span>
        <div className="footer__links">
          {onStartTour ? (
            <button
              type="button"
              className="footer__tour"
              onClick={onStartTour}
            >
              Take the tour
            </button>
          ) : null}
          <a href="#top" className="footer__top">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
