import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.scss";
import logoImage from "../assets/Logo.jpg";

const NAV_LINKS = [
  { label: "Homepage",   to: "/" },
  { label: "Our Team",   to: "/our-team", badge: true },
  // { label: "Contact Us", to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  return (
    <>
      <nav className={`navbar${isTransparent ? " navbar--transparent" : ""}${scrolled ? " scrolled" : ""}`}>
        <div className="navbar-inner">

          {/* ── Brand (left) ── */}
          <Link to="/" className="navbar-brand">
            <img src={logoImage} alt="Doctors United Logo" className="navbar-logo" />
            <span className="navbar-name">
              Doctors United<br />
              <em>Medicentre</em>
            </span>
          </Link>

          {/* ── Nav Links (center) ── */}
          <ul className={`navbar-links${menuOpen ? " open" : ""}`}>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className={`navbar-link${link.badge ? " navbar-link--badge" : ""}${location.pathname === link.to ? " active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── CTA Button (right) ── */}
          <Link to="/our-team" className="navbar-cta">
            Book Appointment
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>

          {/* ── Hamburger (mobile only) ── */}
          <button
            className={`navbar-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>

        </div>
      </nav>

      {!isTransparent && <div className="navbar-spacer" />}
    </>
  );
}