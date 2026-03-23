import { useState } from "react";
import '../style/BookAppoinment.scss';

// ─── Static Data ──────────────────────────────────────────────
const DOCTORS = [
  { id: 1,  name: "Dr. Shawn T Joseph",        role: "Senior Consultant – Program Director Head & Neck Oncology Network, Kerala Cluster",  qualifications: "MBBS, MS (ENT), DNB (ENT), MCh (Head & Neck Surgery), Fellow in skull base surgery, FACS, MBA (HAHM)",          bio: "Dr. Shawn T. Joseph is a pioneering Head and Neck Surgeon renowned for his innovative surgical techniques and contributions to minimally invasive procedures.", hospital: "Aster Medcity Kochi",   speciality: "Head and Neck Oncology",     initials: "SJ" },
  { id: 2,  name: "Prof. Dr. Somashekhar S P", role: "Chairman – Medical Advisory Board, Aster DM Healthcare – GCC & India",              qualifications: "MS, MCh (Surgical Oncology), FRCS (Edinburgh), FACS, FICS",                                                       bio: "Prof. Dr. Somashekhar is a globally recognized Surgical Oncologist with expertise in robotic and laparoscopic cancer surgery.",                               hospital: "Aster CMI Bangalore",  speciality: "Surgical Oncology",          initials: "SS" },
  { id: 3,  name: "Dr. Priya Menon",            role: "Senior Consultant – Cardiology, Aster MIMS Calicut",                               qualifications: "MBBS, MD (Medicine), DM (Cardiology), FSCAI",                                                                     bio: "Dr. Priya Menon is an interventional cardiologist with over 15 years of experience in complex coronary interventions and structural heart disease.",          hospital: "Aster MIMS Calicut",   speciality: "Cardiology",                initials: "PM" },
  { id: 4,  name: "Dr. Arjun Krishnaswamy",     role: "Director – Neurosurgery, Aster CMI Bangalore",                                     qualifications: "MBBS, MS (General Surgery), MCh (Neurosurgery), FRCS",                                                            bio: "Dr. Arjun Krishnaswamy specializes in minimally invasive spine surgery and complex brain tumor resections with over 3,000 successful surgeries.",              hospital: "Aster CMI Bangalore",  speciality: "Neurosurgery",              initials: "AK" },
  { id: 5,  name: "Dr. Meera Nair",             role: "Senior Consultant – Dermatology, Aster MIMS Kannur",                               qualifications: "MBBS, MD (Dermatology), DNB",                                                                                      bio: "Dr. Meera Nair is a specialist in clinical and cosmetic dermatology with extensive experience treating complex skin conditions and aesthetic procedures.",     hospital: "Aster MIMS Kannur",    speciality: "Dermatology",               initials: "MN" },
  { id: 6,  name: "Dr. Rajesh Kumar",            role: "Consultant – Orthopaedics & Joint Replacement, Aster Medcity Kochi",              qualifications: "MBBS, MS (Orthopaedics), DNB, Fellowship in Joint Replacement",                                                    bio: "Dr. Rajesh Kumar specializes in minimally invasive joint replacement and sports medicine, with over 2,500 successful knee and hip replacement surgeries.",    hospital: "Aster Medcity Kochi",  speciality: "Orthopaedics",              initials: "RK" },
  { id: 7,  name: "Dr. Anitha Suresh",           role: "Senior Consultant – Gynaecology & Obstetrics, Aster MIMS Kottakkal",              qualifications: "MBBS, MS (OBG), DNB, Fellowship in Laparoscopic Surgery",                                                          bio: "Dr. Anitha Suresh is an experienced obstetrician and gynaecologist known for high-risk pregnancies and minimally invasive procedures.",                       hospital: "Aster MIMS Kottakkal", speciality: "Gynaecology & Obstetrics",  initials: "AS" },
  { id: 8,  name: "Dr. Vivek Pillai",            role: "Consultant – Gastroenterology, Aster Medcity Kochi",                              qualifications: "MBBS, MD (Medicine), DM (Gastroenterology), MRCP (UK)",                                                            bio: "Dr. Vivek Pillai is a leading gastroenterologist specializing in advanced endoscopy, inflammatory bowel disease, and hepatobiliary disorders.",               hospital: "Aster Medcity Kochi",  speciality: "Gastroenterology",          initials: "VP" },
  { id: 9,  name: "Dr. Shalini Mohan",           role: "Senior Consultant – Endocrinology & Diabetes, Aster MIMS Calicut",                qualifications: "MBBS, MD (General Medicine), DM (Endocrinology)",                                                                  bio: "Dr. Shalini Mohan is a highly regarded endocrinologist with expertise in diabetes management, thyroid disorders, and hormonal imbalances.",                   hospital: "Aster MIMS Calicut",   speciality: "Endocrinology & Diabetes",  initials: "SM" },
  { id: 10, name: "Dr. Farouk Rasheed",          role: "Consultant – Pulmonology & Sleep Medicine, Aster CMI Bangalore",                  qualifications: "MBBS, MD (Respiratory Medicine), FCCP",                                                                            bio: "Dr. Farouk Rasheed specializes in asthma, COPD, interstitial lung diseases, and complex sleep disorders.",                                                   hospital: "Aster CMI Bangalore",  speciality: "Pulmonology",               initials: "FR" },
  { id: 11, name: "Dr. Nisha George",            role: "Senior Consultant – Nephrology, Aster MIMS Kannur",                               qualifications: "MBBS, MD (General Medicine), DM (Nephrology)",                                                                     bio: "Dr. Nisha George is a nephrologist with special expertise in chronic kidney disease, dialysis management, and renal transplantation follow-up care.",         hospital: "Aster MIMS Kannur",    speciality: "Nephrology",                initials: "NG" },
  { id: 12, name: "Dr. Sunil Varma",             role: "Director – Ophthalmology, Aster Medcity Kochi",                                   qualifications: "MBBS, MS (Ophthalmology), DNB, FRCS (Edinburgh)",                                                                  bio: "Dr. Sunil Varma is an acclaimed ophthalmologist specializing in cataract surgery, glaucoma management, and advanced retinal procedures.",                     hospital: "Aster Medcity Kochi",  speciality: "Ophthalmology",             initials: "SV" },
  { id: 13, name: "Dr. Kavitha Rajan",           role: "Senior Consultant – Paediatrics & Neonatology, Aster MIMS Kottakkal",             qualifications: "MBBS, MD (Paediatrics), Fellowship in Neonatology",                                                                bio: "Dr. Kavitha Rajan is a dedicated paediatrician and neonatologist providing comprehensive care for newborns, infants, and children with complex conditions.",   hospital: "Aster MIMS Kottakkal", speciality: "Paediatrics & Neonatology", initials: "KR" },
  { id: 14, name: "Dr. Thomas Mathew",           role: "Consultant – Urology & Andrology, Aster CMI Bangalore",                           qualifications: "MBBS, MS (General Surgery), MCh (Urology), Fellowship in Robotic Surgery",                                          bio: "Dr. Thomas Mathew is a urologist with expertise in robotic-assisted surgeries for prostate, kidney, and bladder conditions.",                                hospital: "Aster CMI Bangalore",  speciality: "Urology",                   initials: "TM" },
  { id: 15, name: "Dr. Rema Devi",               role: "Senior Consultant – Psychiatry & Mental Health, Aster MIMS Calicut",              qualifications: "MBBS, MD (Psychiatry), DNB",                                                                                       bio: "Dr. Rema Devi is a compassionate psychiatrist specializing in mood disorders, anxiety, psychosis, and addiction medicine with over 18 years of practice.",    hospital: "Aster MIMS Calicut",   speciality: "Psychiatry & Mental Health", initials: "RD" },
];

const SPECIALITIES = [...new Set(DOCTORS.map(d => d.speciality))].sort();
const HOSPITALS    = [...new Set(DOCTORS.map(d => d.hospital))].sort();

// ─── Icons ─────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg className="ba-search__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="ba-card__cta-icon" width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="2.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1 6.5h14" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="5.5" cy="9.5" r="0.8" fill="currentColor" />
      <circle cx="8"   cy="9.5" r="0.8" fill="currentColor" />
      <circle cx="10.5" cy="9.5" r="0.8" fill="currentColor" />
      <circle cx="5.5"  cy="12" r="0.8" fill="currentColor" />
      <circle cx="8"    cy="12" r="0.8" fill="currentColor" />
    </svg>
  );
}

function HospitalIcon() {
  return (
    <svg className="ba-meta__icon" width="12" height="12" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="4" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 15V10h6v5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 7V3M6 5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SpecialityIcon() {
  return (
    <svg className="ba-meta__icon" width="12" height="12" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 5v4M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Filter Section ────────────────────────────────────────────
function FilterSection({ title, items, checked, onToggle }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="ba-filter-section">
      <button
        className={`ba-filter-section__header${open ? " ba-filter-section__header--open" : ""}`}
        onClick={() => setOpen(o => !o)}
      >
        {title}
        <span className="ba-filter-section__arrow">▲</span>
      </button>

      {open && (
        <ul className="ba-filter-section__list">
          {items.map(item => (
            <li key={item} className="ba-filter-section__item">
              <label className={`ba-filter-section__label${checked.includes(item) ? " ba-filter-section__label--checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={checked.includes(item)}
                  onChange={() => onToggle(item)}
                  className="ba-filter-section__checkbox"
                />
                {item}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Doctor Card ───────────────────────────────────────────────
function DoctorCard({ doctor, onBook }) {
  return (
    <div className="ba-card">
      <div className="ba-card__avatar-wrap">
        <div className="ba-card__avatar">{doctor.initials}</div>
      </div>

      <div className="ba-card__body">
        <h2 className="ba-card__name">{doctor.name}</h2>
        <p className="ba-card__role">{doctor.role}</p>
        <p className="ba-card__quals">{doctor.qualifications}</p>
        <p className="ba-card__bio">{doctor.bio}</p>
      </div>

      <div className="ba-card__meta">
        <div className="ba-card__info-block">
          <span className="ba-card__info-label">
            STATUS <HospitalIcon />
          </span>
          <span className="ba-card__info-value">{doctor.hospital}</span>
        </div>

        <div className="ba-card__info-block">
          <span className="ba-card__info-label">
            PRIORITY <SpecialityIcon />
          </span>
          <span className="ba-card__info-value">{doctor.speciality}</span>
        </div>

        <button className="ba-card__cta" onClick={() => onBook(doctor)}>
          <CalendarIcon />
          Book An Appointment
        </button>
      </div>
    </div>
  );
}

// ─── Booking Modal ─────────────────────────────────────────────
function BookingModal({ doctor, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", date: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = () => { if (form.name && form.phone && form.date) setSubmitted(true); };

  return (
    <div className="ba-modal-overlay" onClick={onClose}>
      <div className="ba-modal" onClick={e => e.stopPropagation()}>
        <button className="ba-modal__close" onClick={onClose}>×</button>

        {!submitted ? (
          <>
            <h3 className="ba-modal__title">Book Appointment</h3>
            <p className="ba-modal__subtitle">
              with <strong>{doctor.name}</strong>
              <br />{doctor.speciality} · {doctor.hospital}
            </p>

            {[
              { label: "Your Name",      name: "name",  type: "text", placeholder: "Full name" },
              { label: "Phone Number",   name: "phone", type: "tel",  placeholder: "+91 98765 43210" },
              { label: "Preferred Date", name: "date",  type: "date", placeholder: "" },
            ].map(({ label, name, type, placeholder }) => (
              <div className="ba-modal__field" key={name}>
                <label className="ba-modal__label">{label}</label>
                <input
                  className="ba-modal__input"
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <button className="ba-modal__submit" onClick={handleSubmit}>
              Confirm Appointment
            </button>
          </>
        ) : (
          <div className="ba-modal__success">
            <div className="ba-modal__success-icon">✅</div>
            <h3 className="ba-modal__success-title">Appointment Requested!</h3>
            <p className="ba-modal__success-text">
              We'll confirm your appointment with <strong>{doctor.name}</strong> on <strong>{form.date}</strong>.
              <br />A confirmation will be sent to <strong>{form.phone}</strong>.
            </p>
            <button className="ba-modal__done" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function BookAppointment() {
  const [checkedSpecialities, setCheckedSpecialities] = useState([]);
  const [checkedHospitals,    setCheckedHospitals]    = useState([]);
  const [search,              setSearch]              = useState("");
  const [bookedDoctor,        setBookedDoctor]        = useState(null);

  const toggleSpeciality = (name) =>
    setCheckedSpecialities(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  const toggleHospital = (name) =>
    setCheckedHospitals(prev =>
      prev.includes(name) ? prev.filter(h => h !== name) : [...prev, name]
    );
  const clearAll = () => {
    setCheckedSpecialities([]);
    setCheckedHospitals([]);
    setSearch("");
  };

  const filteredDoctors = DOCTORS.filter(doc => {
    const matchSpec   = checkedSpecialities.length === 0 || checkedSpecialities.includes(doc.speciality);
    const matchHosp   = checkedHospitals.length === 0    || checkedHospitals.includes(doc.hospital);
    const matchSearch = !search.trim() ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(search.toLowerCase());
    return matchSpec && matchHosp && matchSearch;
  });

  const hasFilters = checkedSpecialities.length > 0 || checkedHospitals.length > 0 || search.trim();

  return (
    <div className="ba-page">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="ba-header">
        <div className="ba-header__inner">
          <h1 className="ba-header__title">Find Doctors</h1>
          <div className="ba-search">
            <SearchIcon />
            <input
              className="ba-search__input"
              type="text"
              placeholder="Search doctors (e.g., name, speciality)"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="ba-search__clear" onClick={() => setSearch("")}>×</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="ba-body">

        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="ba-sidebar">
          <p className="ba-sidebar__heading">FILTERS</p>

          <FilterSection
            title="Speciality"
            items={SPECIALITIES}
            checked={checkedSpecialities}
            onToggle={toggleSpeciality}
          />
          <FilterSection
            title="Hospital"
            items={HOSPITALS}
            checked={checkedHospitals}
            onToggle={toggleHospital}
          />

          {hasFilters && (
            <button className="ba-sidebar__clear" onClick={clearAll}>
              Clear all filters
            </button>
          )}
        </aside>

        {/* ── Main ────────────────────────────────────────── */}
        <main className="ba-main">
          <p className="ba-main__count">
            <strong>{filteredDoctors.length}</strong> Doctors found
          </p>

          <div className="ba-cards">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map(doc => (
                <DoctorCard key={doc.id} doctor={doc} onBook={setBookedDoctor} />
              ))
            ) : (
              <div className="ba-empty">
                <div className="ba-empty__icon">🔍</div>
                No doctors found. Try adjusting your filters.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Modal ───────────────────────────────────────────── */}
      {bookedDoctor && (
        <BookingModal doctor={bookedDoctor} onClose={() => setBookedDoctor(null)} />
      )}
    </div>
  );
}