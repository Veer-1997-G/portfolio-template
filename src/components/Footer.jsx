export default function Footer({ profile }) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>
          © {new Date().getFullYear()} {profile.name}. Built with React + Vite.
        </span>
        <a href="#top" className="footer__top">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
