import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Subscribe from './pages/Subscribe.jsx';
import ClientDashboard from './pages/ClientDashboard.jsx';
import ProgramView from './pages/ProgramView.jsx';
import CheckInForm from './pages/CheckInForm.jsx';
import CoachDashboard from './pages/CoachDashboard.jsx';
import ClientDetail from './pages/ClientDetail.jsx';
import ProgramBuilder from './pages/ProgramBuilder.jsx';

function Protected({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
}

function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">Coaching Portal</Link>
      <div className="nav-links">
        {!user && <Link to="/login">Log in</Link>}
        {!user && <Link to="/signup" className="btn-small">Get started</Link>}
        {user?.role === 'client' && <Link to="/dashboard">Dashboard</Link>}
        {user?.role === 'client' && <Link to="/checkin">Check in</Link>}
        {user?.role === 'coach' && <Link to="/coach">Coach dashboard</Link>}
        {user && (
          <button
            className="link-btn"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Log out
          </button>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/subscribe"
          element={
            <Protected role="client">
              <Subscribe />
            </Protected>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Protected role="client">
              <ClientDashboard />
            </Protected>
          }
        />
        <Route
          path="/program/:id"
          element={
            <Protected>
              <ProgramView />
            </Protected>
          }
        />
        <Route
          path="/checkin"
          element={
            <Protected role="client">
              <CheckInForm />
            </Protected>
          }
        />
        <Route
          path="/coach"
          element={
            <Protected role="coach">
              <CoachDashboard />
            </Protected>
          }
        />
        <Route
          path="/coach/clients/:id"
          element={
            <Protected role="coach">
              <ClientDetail />
            </Protected>
          }
        />
        <Route
          path="/coach/programs/:id"
          element={
            <Protected role="coach">
              <ProgramBuilder />
            </Protected>
          }
        />
        <Route
          path="/coach/programs/new"
          element={
            <Protected role="coach">
              <ProgramBuilder isNew />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
