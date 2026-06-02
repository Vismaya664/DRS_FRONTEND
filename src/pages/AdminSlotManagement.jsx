import { useState, useEffect, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import { getAllDoctors, getDoctorSlots, adminBlockSlots, adminUnblockSlots } from '../api/api'
import '../style/AdminSlotManagement.scss'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

function groupSlotsByTiming(rawSlots) {
  const groups = new Map()
  for (const s of rawSlots) {
    const key = s.slot_number
    if (!groups.has(key)) groups.set(key, { slno: key, slots: [] })
    groups.get(key).slots.push(s)
  }
  return Array.from(groups.values()).map((g, idx) => {
    const first = g.slots[0]
    const last  = g.slots[g.slots.length - 1]
    return {
      slno:      g.slno,
      label:     `Shift ${idx + 1}`,
      timeRange: `${formatTime(first.start_time)} – ${formatTime(last.end_time)}`,
      slots:     g.slots,
    }
  })
}

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// slotKey: unique string to identify a slot
function slotKey(s) {
  return `${s.slot_number}_${s.start_time}`
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminSlotManagement() {
  // Doctor
  const [doctors,            setDoctors]            = useState([])
  const [doctorsLoading,     setDoctorsLoading]     = useState(true)
  const [doctorsError,       setDoctorsError]       = useState(null)
  const [selectedDoctorCode, setSelectedDoctorCode] = useState('')

  // Date
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [dateError,    setDateError]    = useState(null)

  // Slots
  const [slots,        setSlots]        = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError,   setSlotsError]   = useState(null)
  const [fetchKey,     setFetchKey]     = useState(0)   // bump to force refetch
  const [activeTab,    setActiveTab]    = useState(null)

  // Multi-selection (Set of slotKey strings)
  // 'toBlock'   = available slots admin wants to block
  // 'toUnblock' = admin-blocked slots admin wants to unblock
  const [toBlock,   setToBlock]   = useState(new Set())
  const [toUnblock, setToUnblock] = useState(new Set())

  // Action state
  const [saving,   setSaving]   = useState(false)
  const [saveMsg,  setSaveMsg]  = useState(null)   // { type: 'success'|'error', text }

  // ── fetch doctors ────────────────────────────────────────────────────────────
  const fetchDoctors = useCallback(async () => {
    setDoctorsLoading(true)
    setDoctorsError(null)
    try {
      const data = await getAllDoctors()
      setDoctors(data)
      if (data.length > 0) setSelectedDoctorCode(data[0].code)
    } catch {
      setDoctorsError('Failed to load doctors')
    } finally {
      setDoctorsLoading(false)
    }
  }, [])

  useEffect(() => { fetchDoctors() }, [fetchDoctors])

  // ── fetch slots ──────────────────────────────────────────────────────────────
  const fetchSlots = useCallback(async () => {
    if (!selectedDoctorCode || !selectedDate) return
    setSlotsLoading(true)
    setSlotsError(null)
    setSlots([])
    setToBlock(new Set())
    setToUnblock(new Set())
    try {
      const data = await getDoctorSlots({ doctor_code: selectedDoctorCode, date: selectedDate })
      const arr = Array.isArray(data) ? data : (Array.isArray(data?.slots) ? data.slots : [])
      setSlots(arr)
      const groups = groupSlotsByTiming(arr)
      setActiveTab(groups.length > 0 ? groups[0].slno : null)
    } catch {
      setSlotsError('Failed to load slots')
    } finally {
      setSlotsLoading(false)
    }
  }, [selectedDoctorCode, selectedDate, fetchKey]) // eslint-disable-line

  useEffect(() => { fetchSlots() }, [fetchSlots])

  // Auto-clear save message after 4 s
  useEffect(() => {
    if (!saveMsg) return
    const t = setTimeout(() => setSaveMsg(null), 4000)
    return () => clearTimeout(t)
  }, [saveMsg])

  // ── derived ──────────────────────────────────────────────────────────────────
  const selectedDoctor = doctors.find(d => d.code === selectedDoctorCode)
  const department     = selectedDoctor?.department ?? ''
  const slotGroups     = groupSlotsByTiming(slots)
  const activeGroup    = slotGroups.find(g => g.slno === activeTab)

  const pendingBlockCount   = toBlock.size
  const pendingUnblockCount = toUnblock.size
  const hasPending          = pendingBlockCount > 0 || pendingUnblockCount > 0

  // ── handlers ─────────────────────────────────────────────────────────────────
  function handleDoctorChange(code) {
    setSelectedDoctorCode(code)
    setToBlock(new Set())
    setToUnblock(new Set())
    setSaveMsg(null)
  }

  function handleDateChange(val) {
    if (!val || !/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      setDateError('Please enter a valid date')
      return
    }
    setDateError(null)
    setSelectedDate(val)
    setToBlock(new Set())
    setToUnblock(new Set())
    setSaveMsg(null)
  }

  function handleTabChange(slno) {
    setActiveTab(slno)
  }

  function handleSlotClick(slot) {
    const key = slotKey(slot)

    // Slot booked by a real patient — cannot touch
    if (slot.status === 'Booked' && !slot.is_blocked) return

    if (slot.status === 'Booked' && slot.is_blocked) {
      // Toggle unblock selection
      setToUnblock(prev => {
        const next = new Set(prev)
        if (next.has(key)) next.delete(key)
        else next.add(key)
        return next
      })
      return
    }

    // Available slot → toggle block selection
    setToBlock(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function handleSelectAll() {
    // Select all available (unbooked) slots in the current active tab
    if (!activeGroup) return
    const available = activeGroup.slots.filter(s => s.status === 'Vacant')
    setToBlock(new Set(available.map(s => slotKey(s))))
  }

  function handleClearAll() {
    setToBlock(new Set())
    setToUnblock(new Set())
  }

  async function handleApply() {
    if (!hasPending) return
    setSaving(true)
    setSaveMsg(null)

    try {
      // Prepare block payload
      if (pendingBlockCount > 0) {
        const slotsToBlock = slots.filter(s => toBlock.has(slotKey(s)))
        await adminBlockSlots({
          doctor_code:     selectedDoctorCode,
          department_code: department,
          date:            selectedDate,
          slots: slotsToBlock.map(s => ({
            start_time:  s.start_time,
            slot_number: s.slot_number,
          })),
        })
      }

      // Prepare unblock payload
      if (pendingUnblockCount > 0) {
        const slotsToUnblock = slots.filter(s => toUnblock.has(slotKey(s)))
        await adminUnblockSlots({
          doctor_code: selectedDoctorCode,
          date:        selectedDate,
          slots: slotsToUnblock.map(s => ({
            start_time:  s.start_time,
            slot_number: s.slot_number,
          })),
        })
      }

      const parts = []
      if (pendingBlockCount > 0)   parts.push(`${pendingBlockCount} slot(s) blocked`)
      if (pendingUnblockCount > 0) parts.push(`${pendingUnblockCount} slot(s) unblocked`)
      setSaveMsg({ type: 'success', text: parts.join(' · ') })
      setFetchKey(k => k + 1)
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to apply changes. Please try again.'
      setSaveMsg({ type: 'error', text: msg })
    } finally {
      setSaving(false)
    }
  }

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <div className="sm-shell">
      <Sidebar active="slot-management" />

      <div className="sm-main">

        {/* Topbar */}
        <div className="sm-topbar">
          <div className="sm-topbar__crumbs">
            <span className="sm-topbar__crumb sm-topbar__crumb--root">Admin</span>
            <ChevronRightIcon />
            <span className="sm-topbar__crumb sm-topbar__crumb--active">Slot Management</span>
          </div>
          <span className="sm-topbar__date">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
            })}
          </span>
        </div>

        {/* Page header */}
        <div className="sm-page-hdr">
          <div>
            <div className="sm-page-hdr__title">Slot Management</div>
            <div className="sm-page-hdr__sub">
              Block or unblock appointment slots for a doctor. Blocked slots appear as unavailable to patients.
            </div>
          </div>
        </div>

        <div className="sm-body">

          {/* ─ Card 1: Doctor + Department + Date ─────────────────────────── */}
          <div className="sm-card">
            <div className="sm-card__head">
              <span className="sm-card__icon"><DoctorIcon /></span>
              <div>
                <div className="sm-card__title">Doctor &amp; Date</div>
                <div className="sm-card__sub">Choose the doctor and date to manage slots</div>
              </div>
            </div>

            <div className="sm-fields-row">

              {/* Doctor dropdown */}
              <div className="sm-field">
                <label className="sm-label" htmlFor="sm-doctor">Doctor</label>
                {doctorsLoading ? (
                  <div className="sm-skeleton">Loading doctors…</div>
                ) : doctorsError ? (
                  <div className="sm-error-block" role="alert">
                    <span>{doctorsError}</span>
                    <button className="sm-retry-btn" onClick={fetchDoctors} type="button">Retry</button>
                  </div>
                ) : (
                  <select
                    id="sm-doctor"
                    className="sm-select"
                    value={selectedDoctorCode}
                    onChange={e => handleDoctorChange(e.target.value)}
                  >
                    {doctors.map(d => (
                      <option key={d.code} value={d.code}>{d.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Department (read-only) */}
              <div className="sm-field">
                <label className="sm-label">Department</label>
                <div className="sm-display-value">{doctorsLoading ? '—' : (department || '—')}</div>
              </div>

              {/* Date */}
              <div className="sm-field">
                <label className="sm-label" htmlFor="sm-date">Date</label>
                <input
                  id="sm-date"
                  type="date"
                  className={`sm-input${dateError ? ' sm-input--err' : ''}`}
                  value={selectedDate}
                  onChange={e => handleDateChange(e.target.value)}
                />
                {dateError && <span className="sm-err-text" role="alert">{dateError}</span>}
              </div>

            </div>
          </div>

          {/* ─ Card 2: Slot Grid ───────────────────────────────────────────── */}
          <div className="sm-card">
            <div className="sm-card__head">
              <span className="sm-card__icon"><LockIcon /></span>
              <div>
                <div className="sm-card__title">Slot Grid</div>
                <div className="sm-card__sub">
                  {selectedDoctor
                    ? `${selectedDoctor.name}  ·  ${selectedDate}`
                    : 'Select a doctor and date above'}
                </div>
              </div>

              {/* Action toolbar — only shown when there are slots */}
              {slotGroups.length > 0 && !slotsLoading && (
                <div className="sm-toolbar">
                  <button
                    className="sm-toolbar-btn sm-toolbar-btn--ghost"
                    type="button"
                    onClick={handleSelectAll}
                    title="Select all available slots on this shift"
                  >
                    Select all available
                  </button>
                  <button
                    className="sm-toolbar-btn sm-toolbar-btn--ghost"
                    type="button"
                    onClick={handleClearAll}
                    disabled={!hasPending}
                  >
                    Clear selection
                  </button>
                  <button
                    className={`sm-toolbar-btn sm-toolbar-btn--primary${saving ? ' sm-toolbar-btn--saving' : ''}`}
                    type="button"
                    onClick={handleApply}
                    disabled={!hasPending || saving}
                  >
                    {saving ? (
                      <><span className="sm-spinner sm-spinner--sm" />Saving…</>
                    ) : (
                      <><LockIcon size={13} />Apply changes
                        {hasPending && (
                          <span className="sm-badge">
                            {pendingBlockCount + pendingUnblockCount}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Save message */}
            {saveMsg && (
              <div
                className={`sm-banner sm-banner--${saveMsg.type}`}
                role={saveMsg.type === 'error' ? 'alert' : 'status'}
                aria-live="polite"
              >
                {saveMsg.type === 'success' ? <CheckIcon /> : <ErrorIcon />}
                {saveMsg.text}
              </div>
            )}

            {/* Loading */}
            {slotsLoading && (
              <div className="sm-slot-state" aria-live="polite">
                <div className="sm-spinner" />
                <span>Loading slots…</span>
              </div>
            )}

            {/* Error */}
            {!slotsLoading && slotsError && (
              <div className="sm-slot-state sm-slot-state--error" role="alert">
                <ErrorIcon />
                <span>{slotsError}</span>
                <button className="sm-retry-btn" type="button" onClick={() => setFetchKey(k => k + 1)}>
                  Retry
                </button>
              </div>
            )}

            {/* Empty */}
            {!slotsLoading && !slotsError && slots.length === 0 && selectedDoctorCode && (
              <div className="sm-slot-state sm-slot-state--empty" aria-live="polite">
                <EmptyIcon />
                <span>No slots configured for this doctor on the selected date</span>
              </div>
            )}

            {/* Slot groups */}
            {!slotsLoading && !slotsError && slotGroups.length > 0 && (
              <>
                {/* Shift tabs */}
                <div className="sm-shift-tabs" role="tablist">
                  {slotGroups.map(g => {
                    const vacantCount  = g.slots.filter(s => s.status === 'Vacant').length
                    const blockedCount = g.slots.filter(s => s.status === 'Booked' && s.is_blocked).length
                    const patientCount = g.slots.filter(s => s.status === 'Booked' && !s.is_blocked).length
                    return (
                      <button
                        key={g.slno}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === g.slno}
                        className={`sm-shift-tab${activeTab === g.slno ? ' sm-shift-tab--active' : ''}`}
                        onClick={() => handleTabChange(g.slno)}
                      >
                        <span className="sm-shift-tab__label">{g.label}</span>
                        <span className="sm-shift-tab__time">{g.timeRange}</span>
                        <span className="sm-shift-tab__stats">
                          <span className="sm-stat sm-stat--open">{vacantCount} available</span>
                          {blockedCount > 0 && (
                            <span className="sm-stat sm-stat--blocked">{blockedCount} blocked</span>
                          )}
                          {patientCount > 0 && (
                            <span className="sm-stat sm-stat--patient">{patientCount} booked</span>
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="sm-legend">
                  <span className="sm-legend__item">
                    <span className="sm-legend__dot sm-legend__dot--open" />Available
                  </span>
                  <span className="sm-legend__item">
                    <span className="sm-legend__dot sm-legend__dot--sel" />Selected to block
                  </span>
                  <span className="sm-legend__item">
                    <span className="sm-legend__dot sm-legend__dot--blocked" />Admin blocked
                  </span>
                  <span className="sm-legend__item">
                    <span className="sm-legend__dot sm-legend__dot--unblock" />Selected to unblock
                  </span>
                  <span className="sm-legend__item">
                    <span className="sm-legend__dot sm-legend__dot--patient" />Patient booked
                  </span>
                </div>

                {/* Chip grid */}
                <div className="sm-slot-grid" role="group">
                  {activeGroup?.slots.map(s => {
                    const key            = slotKey(s)
                    const isVacant       = s.status === 'Vacant'
                    const isBlocked      = s.status === 'Booked' && s.is_blocked
                    const isPatientBooked = s.status === 'Booked' && !s.is_blocked
                    const isToBlock      = toBlock.has(key)
                    const isToUnblock    = toUnblock.has(key)

                    let chipClass = 'sm-slot-chip'
                    let labelText = 'Available'

                    if (isPatientBooked) {
                      chipClass += ' sm-slot-chip--patient'
                      labelText = 'Booked'
                    } else if (isToUnblock) {
                      chipClass += ' sm-slot-chip--unblock'
                      labelText = 'Unblock?'
                    } else if (isBlocked) {
                      chipClass += ' sm-slot-chip--blocked'
                      labelText = 'Blocked'
                    } else if (isToBlock) {
                      chipClass += ' sm-slot-chip--selected'
                      labelText = 'Block?'
                    }

                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={isPatientBooked}
                        aria-disabled={isPatientBooked}
                        aria-pressed={isToBlock || isToUnblock}
                        onClick={() => handleSlotClick(s)}
                        className={chipClass}
                        title={
                          isPatientBooked  ? 'Booked by a patient — cannot modify'
                            : isBlocked    ? 'Admin blocked — click to select for unblocking'
                            : isToUnblock  ? 'Click again to deselect'
                            : isToBlock    ? 'Click again to deselect'
                            : 'Click to select for blocking'
                        }
                      >
                        <span className="sm-slot-chip__time">{formatTime(s.start_time)}</span>
                        <span className="sm-slot-chip__label">{labelText}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Selection summary bar */}
                {hasPending && (
                  <div className="sm-selection-bar" aria-live="polite">
                    <div className="sm-selection-bar__info">
                      {pendingBlockCount > 0 && (
                        <span className="sm-sel-pill sm-sel-pill--block">
                          <LockIcon size={12} />
                          {pendingBlockCount} to block
                        </span>
                      )}
                      {pendingUnblockCount > 0 && (
                        <span className="sm-sel-pill sm-sel-pill--unblock">
                          <UnlockIcon />
                          {pendingUnblockCount} to unblock
                        </span>
                      )}
                    </div>
                    <div className="sm-selection-bar__actions">
                      <button
                        className="sm-ghost-btn"
                        type="button"
                        onClick={handleClearAll}
                      >
                        Clear
                      </button>
                      <button
                        className="sm-apply-btn"
                        type="button"
                        onClick={handleApply}
                        disabled={saving}
                        aria-busy={saving}
                      >
                        {saving
                          ? <><span className="sm-spinner sm-spinner--sm" />Saving…</>
                          : <><CheckIcon />Apply</>}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

        </div>{/* sm-body */}
      </div>{/* sm-main */}
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="10" height="10">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  )
}
function DoctorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="17" height="17">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  )
}
function LockIcon({ size = 17 }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={size} height={size}>
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  )
}
function UnlockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
      <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )
}
function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  )
}
function EmptyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" width="34" height="34">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
