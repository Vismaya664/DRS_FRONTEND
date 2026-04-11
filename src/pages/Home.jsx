import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../style/Home.scss";

// ── Asset imports ──────────────────────────────────────────────────────────
import d1 from "../assets/d1.jpg";
import d2 from "../assets/d2.jpg";
import d3 from "../assets/d3.jpg";
import d4 from "../assets/d4.jpg";
import d5 from "../assets/d5.jpg";
import d6 from "../assets/d6.jpg";
import d7 from "../assets/d7.jpg";
import d8 from "../assets/d8.jpg";
import d9 from "../assets/d9.jpg";
import d10 from "../assets/d10.jpg";
import d11 from "../assets/d11.jpg";
import d12 from "../assets/d12.jpg";
import d13 from "../assets/d13.jpg";
import d14 from "../assets/d14.jpg";
import d15 from "../assets/d15.jpg";
import d16 from "../assets/d16.jpg";
import d17 from "../assets/d17.jpg";
import d18 from "../assets/d18.jpg";
import d19 from "../assets/d19.jpg";
import bannerBg from "../assets/Banner.jpg";
import storyImg from "../assets/story.jpg";

const DOCTORS = [
  { name: "Dr. Deepak",              image: d1  },
  { name: "Dr. Sandeep",             image: d2  },
  { name: "Dr. Reshmi K R",          image: d3  },
  { name: "Dr. Sheeba",              image: d4  },
  { name: "Dr. Nishal",              image: d5  },
  { name: "Dr. Shanavas",            image: d6  },
  { name: "Dr. Vineeta Rao",         image: d7  },
  { name: "Dr. Sadanadan",           image: d8  },
  { name: "Dr. Bijul",               image: d9  },
  { name: "Dr. Suneeth",             image: d10 },
  { name: "Dr. Rajesh",              image: d11 },
  { name: "Dr. Varun",               image: d12 },
  { name: "Dr. Saranya",             image: d13 },
  { name: "Dr. Reshmi S",            image: d14 },
  { name: "Dr. Adarsh",              image: d15 },
  { name: "Dr. Thejas",              image: d17 },
  { name: "Dr. Avinash Krishna RMO", image: d18 },
];

// ── Services data ──────────────────────────────────────────────────────────
const SERVICES = [
  {
    label: "Outpatient Services",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
        <path d="M4.5 6.5a4 4 0 004 4v3a4.5 4.5 0 009 0v-1a2 2 0 100-4 2 2 0 000 4v1a3.5 3.5 0 01-7 0v-3a4 4 0 004-4V5a.5.5 0 00-.5-.5h-1a.5.5 0 000 1H13V6.5a3 3 0 01-6 0V5.5h.5a.5.5 0 000-1h-1a.5.5 0 00-.5.5v2z"/>
        <circle cx="17.5" cy="13.5" r="1.5"/>
      </svg>
    ),
  },
  {
    label: "Pharmacy",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
        <rect x="2" y="9" width="20" height="6" rx="3"/>
        <line x1="12" y1="9" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    label: "High Tech Labs",
    image: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=600&q=80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
        <path d="M6 21h12"/><path d="M9 21v-4a6 6 0 006-6"/>
        <path d="M10 3h4v8h-4z"/><path d="M10 7H8a1 1 0 000 2h2"/>
        <circle cx="12" cy="18" r="1"/>
      </svg>
    ),
  },
  {
    label: "Physiotherapy",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
        <circle cx="13" cy="4" r="1.5"/>
        <path d="M7 21l3.5-5.5L14 18l2-5"/>
        <path d="M6 11.5C8 10 11 9.5 13 11l3.5-3.5"/>
        <path d="M16.5 7.5l2 3"/>
      </svg>
    ),
  },
  {
    label: "Home Visits",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
        <path d="M3 10.5L12 3l9 7.5"/>
        <path d="M5 9v11a1 1 0 001 1h12a1 1 0 001-1V9"/>
        <path d="M12 12v5M9.5 14.5h5"/>
      </svg>
    ),
  },
  {
    label: "Home Blood Collections",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&q=80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
        <path d="M12 3C12 3 5 10.5 5 15a7 7 0 0014 0C19 10.5 12 3 12 3z"/>
        <path d="M9 16a3.5 3.5 0 004.5-3" strokeLinecap="round"/>
      </svg>
    ),
  },
];

// ── Doctors Auto-Scroll ────────────────────────────────────────────────────
function DoctorsCarousel() {
  const items = [...DOCTORS, ...DOCTORS];
  return (
    <div className="doctors-marquee-wrap">
      <div className="doctors-marquee">
        {items.map((doc, i) => (
          <div key={i} className="doc-card-new">
            <img src={doc.image} alt={doc.name} className="doc-card-new__img" />
            <div className="doc-card-new__overlay">
              <h3 className="doc-card-new__name">{doc.name}</h3>
              {doc.qualification && (
                <p className="doc-card-new__qual">{doc.qualification}</p>
              )}
              {doc.specialization && (
                <p className="doc-card-new__spec">{doc.specialization}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────
export default function Home() {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <>
      {/* 1 ── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="home-hero" style={{ backgroundImage: `url(${bannerBg})` }}>
        <div className="hero-overlay" />
        <Navbar />
        <div className="hero-content">
          <h1 className="hero-headline">
            Caring for Your<br />Health
          </h1>
          <p className="hero-sub">
            100+ specialists. Every day. Detecting and treating 1,000+<br />
            conditions. All under one roof in Balussery.
          </p>

          {/* ── Navigates to OurTeam → doctor card → RequestAppointment ── */}
          <Link to="/our-team" className="hero-cta">
            Book Appointment
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* 2 ── Meet Our Doctors ────────────────────────────────────────────── */}
      <section className="doctors-section">
        <div className="doctors-inner">
          <div className="doctors-header">
            <span className="doctors-eyebrow">Our Medical Team</span>
            <h2 className="doctors-title">Meet Our Doctors</h2>
            <div className="doctors-accent-bar" />
            <p className="doctors-subtitle">
              Our team of experienced specialists is dedicated to providing compassionate,
              personalised care for every patient across all stages of life.
            </p>
          </div>
          <DoctorsCarousel />
        </div>
      </section>

      {/* 3 ── Our Story ──────────────────────────────────────────────────── */}
      <section className="story-section">
        <div className="story-inner">
          <div className="story-img-col">
            <img src={storyImg} alt="Our Story" className="story-img" />
          </div>
          <div className="story-text-col">
            <blockquote className="story-quote">
              "Bringing every specialty under one roof was not just a business
              decision — it was our promise to the people of Balussery."
            </blockquote>
            <p className="story-body">
              Doctors United Multispeciality Medicentre was founded by a group
              of dedicated doctors who shared a common vision; quality healthcare,
              close to home. What began as a small clinic has grown into a trusted
              centre serving thousands of patients across all stages of life —
              all under one roof.
            </p>
            <div className="story-cta-row">
              <p className="story-cta-hint">Want to know more about us?</p>
              <a
                href="https://doctorsunited.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="story-cta-btn"
              >
                Visit Our Website
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 10h14M10 3l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4 ── Our Services ────────────────────────────────────────────────── */}
      <section className="services-section">
        <div className="services-inner">
          <div className="services-header">
            <span className="services-eyebrow">Our Best Service</span>
            <h2 className="services-title">
              We Deliver <span className="highlight">Quality Care</span> Giving Services
            </h2>
          </div>
          <div className="services-viewport">
            <div
              className="services-grid"
              style={{
                transform: `translateX(-${currentPage * 100}%)`,
                transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {SERVICES.map((svc) => (
                <div key={svc.label} className="svc-card">
                  <div className="svc-card__img-wrap">
                    <img src={svc.image} alt={svc.label} className="svc-card__img" />
                  </div>
                  <div className="svc-card__bottom">
                    <div className="svc-card__icon">{svc.icon}</div>
                    <div className="svc-card__text">
                      <h3 className="svc-card__label">{svc.label}</h3>
                      <span className="svc-card__link">→ Explore</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="services-dots">
            {Array.from({ length: Math.ceil(SERVICES.length / 4) }).map((_, i) => (
              <button
                key={i}
                className={`services-dot${i === currentPage ? " active" : ""}`}
                onClick={() => setCurrentPage(i)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}