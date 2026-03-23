import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./doctorssidebar.scss";

import logoImg from "../assets/Logo.jpg";

// ── Icons ─────────────────────────────────────────────────────────
function DashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity=".9"/>
      <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity=".5"/>
      <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity=".5"/>
      <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity=".9"/>
    </svg>
  );
}
function CalIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="2.5" y="3.5" width="15" height="14" rx="2"/>
      <path d="M6.5 2v3M13.5 2v3M2.5 8h15"/>
      <circle cx="7" cy="12" r="1" fill="currentColor" stroke="none"/>
      <circle cx="10" cy="12" r="1" fill="currentColor" stroke="none"/>
      <circle cx="13" cy="12" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function PatientsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="8" cy="6" r="3"/>
      <path d="M2 17c0-3.314 2.686-5 6-5s6 1.686 6 5"/>
      <circle cx="15" cy="7" r="2"/>
      <path d="M18 17c0-2.21-1.343-3.5-3-3.5"/>
    </svg>
  );
}
function CollapseIcon({ collapsed }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {collapsed
        ? <><path d="M7 5l5 5-5 5"/><path d="M4 10h9" opacity=".4"/></>
        : <><path d="M13 5l-5 5 5 5"/><path d="M16 10H7" opacity=".4"/></>}
    </svg>
  );
}

// ── Nav config ────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",    icon: DashIcon,     path: "/doctor/dashboard"    },
  { id: "appointments", label: "Appointments", icon: CalIcon,      path: "/doctor/appointments" },
  { id: "patients",     label: "My Patients",  icon: PatientsIcon, path: "/doctor/patients"     },
];

// ── Component ─────────────────────────────────────────────────────
export default function DoctorsSidebar() {
  const [collapsed, setCollapsed]     = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate  = useNavigate();
  const location  = useLocation();

  const isActive  = (path) => location.pathname === path;
  const handleNav = (path) => navigate(path);

  return (
    <aside className={`jsb ${collapsed ? "jsb--collapsed" : ""}`}>

      {/* ── Logo ── */}
      <div className="jsb__logo">
        <div className="jsb__logo-mark">
          <img src={logoImg} alt="ApexHealth Logo" />
        </div>
        {!collapsed && (
          <div className="jsb__logo-text">
            <span className="jsb__logo-name">DRS Hospital</span>
            <span className="jsb__logo-sub">Doctor Portal</span>
          </div>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="jsb__nav">
        {NAV_ITEMS.map((item) => {
          const Icon   = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              className={`jsb__item ${active ? "jsb__item--active" : ""}`}
              onClick={() => handleNav(item.path)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <span className="jsb__item-icon"><Icon /></span>

              {!collapsed && (
                <span className="jsb__item-label">{item.label}</span>
              )}

              {item.badge && !collapsed && (
                <span className="jsb__badge">{item.badge}</span>
              )}

              {item.badge && collapsed && (
                <span className="jsb__badge-dot" />
              )}

              {collapsed && hoveredItem === item.id && (
                <div className="jsb__tooltip">
                  {item.label}
                  {item.badge && (
                    <span className="jsb__tooltip-badge">{item.badge}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="jsb__footer">

        {/* Profile */}
        <div className={`jsb__profile ${collapsed ? "jsb__profile--collapsed" : ""}`}>
          <div className="jsb__avatar">
            {/* 👉 Replace with real doctor photo */}
            <img src="https://i.pravatar.cc/150?img=12" alt="Dr. Rajan A." />
            <span className="jsb__avatar-status" />
          </div>
          {!collapsed && (
            <div className="jsb__profile-info">
              <span className="jsb__profile-name">Dr. Rajan A.</span>
              <span className="jsb__profile-role">Cardiologist</span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          className="jsb__collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="jsb__collapse-icon">
            <CollapseIcon collapsed={collapsed} />
          </span>
          {!collapsed && (
            <span className="jsb__collapse-label">Collapse</span>
          )}
        </button>

      </div>
    </aside>
  );
}