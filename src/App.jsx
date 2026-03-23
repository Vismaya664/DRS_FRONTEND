import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import AdminDashboard from './pages/Admindashboard'
import AdminAppointment from './pages/Adminappointment'
import Admindoctors from './pages/Admindoctors'
import BookAppointment from './pages/BookAppoinment'
import DoctorDashboard from './pages/Doctorsdashboard/Dashboard'
import DoctorAppointments from './pages/Doctorsdashboard/Appointments'
import OurTeam from './pages/Ourteam'
import RequestAppointment from './pages/RequestAppointment'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public patient-facing home */}
        <Route path="/"                        element={<Home />} />

        {/* Our Team page */}
        <Route path="/our-team"                element={<OurTeam />} />

        {/* Book an appointment */}
        <Route path="/book-appointment"        element={<BookAppointment />} />

        {/* Request an appointment */}
        <Route path="/request-appointment"     element={<RequestAppointment />} />

        {/* Staff portals */}
        <Route path="/login/doctor"            element={<Login role="DOCTOR" />} />
        <Route path="/login/admin"             element={<Login role="ADMIN" />} />

        {/* Admin pages */}
        <Route path="/admin/dashboard"         element={<AdminDashboard />} />
        <Route path="/admin/appointments"      element={<AdminAppointment />} />
        <Route path="/admin/doctors"           element={<Admindoctors />} />

        {/* Doctor pages */}
        <Route path="/doctor/dashboard"        element={<DoctorDashboard />} />
        <Route path="/doctor/appointments"     element={<DoctorAppointments />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App