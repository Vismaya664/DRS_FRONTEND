import React, { useState, useEffect } from 'react';
import './LicenseGate.scss';
import { Lock, ExternalLink } from 'lucide-react';
import imcLogo from '../assets/imclogo_new.jpeg';

// CONFIGURE YOUR API ENDPOINT HERE
const LICENSE_API_ENDPOINT = 'https://activate.imcbs.com/mobileapp/api/project/drs/';
const CURRENT_CLIENT_ID = "1EXDKHU3QE1DG"; // DRS UNITED — match by client_id
const CUSTOMER_LABEL = "DRS UNITED";
const POLL_INTERVAL = 3000; // Check license every 3 seconds

// Fallback license data (used only if the API is unreachable)
const DEFAULT_LICENSE_DATA = {
  "success": true,
  "project_name": "DRs",
  "customers": [
    {
      "customer_name": "DRS UNITED",
      "client_id": "1EXDKHU3QE1DG",
      "license_key": "NS0L-IPFU-JXYF-UVY6",
      "package": "DRs",
      "modules": [{ "module_name": "DRs", "module_code": "MOD060" }],
      "license_summary": { "registered_devices": 0, "max_devices": 0 },
      "license_validity": { "expiry_date": "2027-06-08", "remaining_days": 353, "is_expired": false },
      "registered_devices": [],
      "status": "Active"
    }
  ]
};

// ───────────────────────── Lock mark ─────────────────────────
const LockMark = () => (
  <svg className="lg-lockmark" viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lg-steel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#dff3ff" />
        <stop offset="100%" stopColor="#5aa9d6" />
      </linearGradient>
      <filter id="lg-iceglow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <g filter="url(#lg-iceglow)">
      <path d="M38 58V44a22 22 0 0 1 44 0v14" stroke="url(#lg-steel)" strokeWidth="8" strokeLinecap="round" />
      <rect x="26" y="58" width="68" height="54" rx="10" fill="#0d1b27" stroke="url(#lg-steel)" strokeWidth="3" />
      <circle cx="60" cy="82" r="7" fill="#7fd6ff" />
      <rect x="57" y="86" width="6" height="16" rx="3" fill="#7fd6ff" />
    </g>
  </svg>
);

// ───────────────────────── Blocking screen ─────────────────────────
const BlockShell = ({ statusCode, headline, message, customer, onRefresh, showButton }) => (
  <div className="lg-overlay">
    <div className="lg-grid" />
    <div className="lg-scan" />
    <div className="lg-glitchbar" />
    <div className="lg-vignette" />

    <div className="lg-stage">
      <span className="lg-corner lg-tl" />
      <span className="lg-corner lg-tr" />
      <span className="lg-corner lg-bl" />
      <span className="lg-corner lg-br" />

      <div className="lg-statusline">
        <span className="lg-dot" /> LOCKDOWN ACTIVE — {statusCode}
      </div>

      <LockMark />

      <h1 className="lg-glitch" data-text={headline}>{headline}</h1>
      <p className="lg-sub">{message}</p>

      {customer && (
        <div className="lg-panel">
          <div className="lg-row">
            <span className="lg-label">CUSTOMER</span>
            <span className="lg-value">{customer.customer_name}</span>
          </div>
          <div className="lg-row">
            <span className="lg-label">LICENSE KEY</span>
            <span className="lg-value lg-mono">{customer.license_key}</span>
          </div>
          <div className="lg-row">
            <span className="lg-label">STATUS</span>
            <span className="lg-value lg-pill">{customer.status}</span>
          </div>
          {customer.license_validity?.expiry_date && (
            <div className="lg-row">
              <span className="lg-label">EXPIRY DATE</span>
              <span className="lg-value">{customer.license_validity.expiry_date}</span>
            </div>
          )}
          {customer.license_validity?.remaining_days !== null &&
            customer.license_validity?.remaining_days !== undefined && (
            <div className="lg-row">
              <span className="lg-label">REMAINING DAYS</span>
              <span className="lg-value">{customer.license_validity.remaining_days}</span>
            </div>
          )}
        </div>
      )}

      {showButton && <button onClick={onRefresh} className="lg-cta">Retry Connection</button>}

      <div className="lg-provider">
        <span className="lg-provider-label">System Provided By</span>
        <a href="https://imcbs.com" target="_blank" rel="noopener noreferrer" className="lg-provider-card">
          <span className="lg-logo-box">
            <img src={imcLogo} alt="IMCBS Logo" />
          </span>
          <span className="lg-provider-meta">
            <span className="lg-provider-name">IMCBS</span>
            <span className="lg-provider-link">Visit Website <ExternalLink size={12} /></span>
          </span>
        </a>
      </div>

      <div className="lg-secure">
        <Lock size={13} />
        <span>Secure License Management System</span>
      </div>
    </div>
  </div>
);

const LicenseGate = ({ children }) => {
  const [licenseData, setLicenseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forceRefreshCount, setForceRefreshCount] = useState(0);

  const fetchLicenseData = async () => {
    try {
      console.log('[License] Fetching from:', LICENSE_API_ENDPOINT);
      const response = await fetch(LICENSE_API_ENDPOINT, {
        method: 'GET',
        mode: 'cors',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`API returned ${response.status}: ${response.statusText}`);
      const data = await response.json();
      console.log('[License] API Response:', JSON.stringify(data, null, 2));
      setLicenseData(data);
      setError(null);
    } catch (err) {
      console.error('[License] Fetch failed:', err.message);
      console.log('[License] Using fallback data (API not accessible)');
      setLicenseData(DEFAULT_LICENSE_DATA);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    console.log('[License] Manual refresh triggered');
    setLoading(true);
    setForceRefreshCount(prev => prev + 1);
    fetchLicenseData();
  };

  useEffect(() => {
    fetchLicenseData();
    const pollInterval = setInterval(() => {
      console.log('[License] Polling for status changes...');
      fetchLicenseData();
    }, POLL_INTERVAL);
    return () => clearInterval(pollInterval);
  }, [forceRefreshCount]);

  if (loading || !licenseData) {
    return (
      <div className="lg-overlay">
        <div className="lg-grid" />
        <div className="lg-scan" />
        <div className="lg-vignette" />
        <div className="lg-loading">
          <div className="lg-spinner" />
          <h2 className="lg-glitch" data-text="VERIFYING">VERIFYING</h2>
          <p>Establishing secure connection…</p>
          {error && <div className="lg-loading-error">⚠ {error}</div>}
        </div>
      </div>
    );
  }

  const customer = licenseData?.customers?.find(c => c.client_id === CURRENT_CLIENT_ID);

  if (!customer || customer.client_id !== CURRENT_CLIENT_ID) {
    console.error('[License] Customer not found - wrong app instance');
    return (
      <BlockShell
        statusCode="ERR 403"
        headline="ACCESS DENIED"
        message={`This application is licensed for ${CUSTOMER_LABEL} only. Please contact support@imcbs.com.`}
        customer={null}
        onRefresh={handleManualRefresh}
        showButton={false}
      />
    );
  }

  const isExpired = customer.license_validity.is_expired === true;
  const status = (customer.status || "").toLowerCase().trim();
  const isActive = status === "active";
  const isInactive = !isActive;

  console.log('[License] Client ID:', customer.client_id, '| Raw Status:', customer.status, '| Normalized:', status, '| Is Active:', isActive, '| Is Expired:', isExpired);

  if (isExpired || isInactive) {
    const statusCode = isExpired ? "ERR 410" : "ERR 423";
    const headline = isExpired ? "LICENSE EXPIRED" : "LICENSE INACTIVE";
    const message = isExpired
      ? "Your application license has expired. Please renew your subscription to continue."
      : "Your application license is currently inactive. Please contact your system administrator to activate it.";

    return (
      <BlockShell
        statusCode={statusCode}
        headline={headline}
        message={message}
        customer={customer}
        onRefresh={handleManualRefresh}
        showButton={false}
      />
    );
  }

  console.log('[License] ✓ License valid - allowing access');
  return children;
};

export default LicenseGate;