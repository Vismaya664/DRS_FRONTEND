import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import '../style/Ourteam.scss';

const INITIAL_SHOW = 16;

const SPECIALITIES = [
  "General Medicine", "Cardiology", "Gynaecology & Obstetrics",
  "Orthopaedics", "Paediatrics", "Neurology", "Dermatology",
  "Physiotherapy", "Ophthalmology", "ENT", "Psychiatry",
  "Urology", "Nephrology", "Gastroenterology", "Endocrinology", "Pulmonology",
];

const teamMembers = [
  { id: 1,  name: "Dr. Anil Kumar",      designation: "Senior Consultant",       speciality: "General Medicine",         image: "https://randomuser.me/api/portraits/men/32.jpg",   qual: "MBBS, MD (Internal Medicine)" },
  { id: 2,  name: "Dr. Priya Menon",     designation: "Lead Consultant",         speciality: "Gynaecology & Obstetrics", image: "https://randomuser.me/api/portraits/women/44.jpg", qual: "MBBS, MS (OBG)" },
  { id: 3,  name: "Dr. Rajesh Nair",     designation: "Senior Specialist",       speciality: "Orthopaedics",             image: "https://randomuser.me/api/portraits/men/45.jpg",   qual: "MBBS, MS (Ortho)" },
  { id: 4,  name: "Dr. Meera Pillai",    designation: "Consultant",              speciality: "Paediatrics",              image: "https://randomuser.me/api/portraits/women/68.jpg", qual: "MBBS, DCH, MD" },
  { id: 5,  name: "Dr. Suresh Varma",    designation: "Senior Cardiologist",     speciality: "Cardiology",               image: "https://randomuser.me/api/portraits/men/67.jpg",   qual: "MBBS, MD, DM (Cardio)" },
  { id: 6,  name: "Dr. Anitha Rajan",    designation: "Consultant",              speciality: "Dermatology",              image: "https://randomuser.me/api/portraits/women/55.jpg", qual: "MBBS, MD (Dermatology)" },
  { id: 7,  name: "Dr. Sanjay Krishnan", designation: "Senior Neurologist",      speciality: "Neurology",                image: "https://randomuser.me/api/portraits/men/52.jpg",   qual: "MBBS, MD, DM (Neurology)" },
  { id: 8,  name: "Dr. Divya Thomas",    designation: "Physiotherapist",         speciality: "Physiotherapy",            image: "https://randomuser.me/api/portraits/women/33.jpg", qual: "BPT, MPT (Orthopaedics)" },
  { id: 9,  name: "Dr. Ravi Shankar",    designation: "Ophthalmologist",         speciality: "Ophthalmology",            image: "https://randomuser.me/api/portraits/men/41.jpg",   qual: "MBBS, MS (Ophthalmology)" },
  { id: 10, name: "Dr. Fathima Nazar",   designation: "ENT Specialist",          speciality: "ENT",                      image: "https://randomuser.me/api/portraits/women/61.jpg", qual: "MBBS, MS (ENT)" },
  { id: 11, name: "Dr. Arjun Menon",     designation: "Consultant Psychiatrist", speciality: "Psychiatry",               image: "https://randomuser.me/api/portraits/men/29.jpg",   qual: "MBBS, MD (Psychiatry)" },
  { id: 12, name: "Dr. Sreeja Mohan",    designation: "Nephrologist",            speciality: "Nephrology",               image: "https://randomuser.me/api/portraits/women/48.jpg", qual: "MBBS, MD, DM (Nephrology)" },
];

export default function OurTeam() {
  const [checkedSpecs, setCheckedSpecs] = useState([]);
  const [specSearch,   setSpecSearch]   = useState("");
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const navigate = useNavigate();

  const toggleSpec = (s) =>
    setCheckedSpecs((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const allMatchingSpecs = useMemo(() =>
    SPECIALITIES.filter((s) =>
      s.toLowerCase().includes(specSearch.toLowerCase())
    ), [specSearch]);

  const visibleSpecs = showAllSpecs ? allMatchingSpecs : allMatchingSpecs.slice(0, INITIAL_SHOW);
  const hiddenCount  = Math.max(0, allMatchingSpecs.length - INITIAL_SHOW);

  const filtered = checkedSpecs.length === 0
    ? teamMembers
    : teamMembers.filter((m) => checkedSpecs.includes(m.speciality));

  return (
    <>
      <Navbar />
      <div className="ot-root">

        {/* ── Page layout ── */}
        <div className="ot-container">
          <div className="ot-layout">

            {/* ── Sidebar ── */}
            <aside className="ot-sidebar">
              <div className="ot-sidebar__top">
                <span className="ot-sidebar__title">Filters</span>
                {checkedSpecs.length > 0 && (
                  <button className="ot-clear-link" onClick={() => setCheckedSpecs([])}>
                    Clear All
                  </button>
                )}
              </div>

              <div className="ot-sidebar__section">
                <p className="ot-sidebar__section-title">Filter by Specialty</p>

                <div className="ot-spec-search">
                  <svg className="ot-spec-search__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8.5" cy="8.5" r="5.5"/>
                    <line x1="13" y1="13" x2="17" y2="17"/>
                  </svg>
                  <input
                    type="text"
                    className="ot-spec-search__input"
                    placeholder="Search specialties..."
                    value={specSearch}
                    onChange={(e) => setSpecSearch(e.target.value)}
                  />
                </div>

                <div className="ot-checkbox-list">
                  {visibleSpecs.map((s) => {
                    const checked = checkedSpecs.includes(s);
                    return (
                      <label key={s} className="ot-checkbox-item">
                        <span className={`ot-cb-box${checked ? " ot-cb-box--on" : ""}`}>
                          {checked && (
                            <svg viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="1.5,5 4,8 8.5,2"/>
                            </svg>
                          )}
                        </span>
                        <input
                          type="checkbox"
                          className="ot-checkbox-item__native"
                          checked={checked}
                          onChange={() => toggleSpec(s)}
                        />
                        <span className={`ot-checkbox-item__label${checked ? " ot-checkbox-item__label--on" : ""}`}>
                          {s}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {!showAllSpecs && hiddenCount > 0 && (
                  <button className="ot-more-btn" onClick={() => setShowAllSpecs(true)}>
                    +{hiddenCount} more
                  </button>
                )}
                {showAllSpecs && hiddenCount > 0 && (
                  <button className="ot-more-btn" onClick={() => setShowAllSpecs(false)}>
                    − Show less
                  </button>
                )}
              </div>
            </aside>

            {/* ── Doctor cards ── */}
            <main className="ot-main">

              <p className="ot-main-heading">
                Nearby Specialists
                <span>({filtered.length} Results)</span>
              </p>

              {checkedSpecs.length > 0 && (
                <div className="ot-active-tags">
                  {checkedSpecs.map((s) => (
                    <span key={s} className="ot-tag">
                      {s}
                      <button className="ot-tag__remove" onClick={() => toggleSpec(s)} aria-label={`Remove ${s}`}>×</button>
                    </span>
                  ))}
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="ot-empty">
                  <p className="ot-empty__title">No specialists found</p>
                  <p className="ot-empty__sub">Try adjusting or clearing your filters.</p>
                  <button className="ot-book-btn" style={{ marginTop: 16 }} onClick={() => setCheckedSpecs([])}>
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="ot-cards">
                  {filtered.map((m) => (
                    <div key={m.id} className="ot-card">

                      {/* Photo */}
                      <div className="ot-card__photo-col">
                        <img src={m.image} alt={m.name} className="ot-card__avatar" />
                      </div>

                      {/* Info */}
                      <div className="ot-card__info">
                        <div className="ot-card__header-row">
                          <h2 className="ot-card__name">{m.name}</h2>
                          <span className="ot-card__spec-tag">{m.speciality}</span>
                        </div>
                        <p className="ot-card__designation">{m.designation}</p>
                        <div className="ot-card__meta-row">
                          <svg className="ot-card__meta-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z"/>
                          </svg>
                          <span className="ot-card__qual">{m.qual}</span>
                        </div>
                        <div className="ot-card__meta-row">
                          <svg className="ot-card__meta-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                          </svg>
                          <span className="ot-card__clinic">Doctors United Medicentre, Balussery</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="ot-card__cta-col">
                        <button
                          className="ot-book-btn"
                          onClick={() => navigate("/request-appointment", { state: { doctor: m.name, speciality: m.speciality } })}
                        >
                          Book Appointment
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </main>

          </div>
        </div>
      </div>
    </>
  );
}