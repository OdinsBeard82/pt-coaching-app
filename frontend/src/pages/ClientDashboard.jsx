import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [program, setProgram] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [p, c] = await Promise.all([api.myProgram(), api.myCheckins()]);
        setProgram(p);
        setCheckins(c);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="page-center">Loading...</div>;

  if (user?.subscription_status !== 'active') {
    return <Navigate to="/subscribe" replace />;
  }

  async function openBillingPortal() {
    setPortalLoading(true);
    try {
      const { url } = await api.createPortalSession();
      window.location.href = url;
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>

      <div className="card">
        <h2>Your program</h2>
        {program ? (
          <>
            <p className="program-title">{program.title}</p>
            <p className="subtle">{program.description}</p>
            <Link to={`/program/${program.id}`} className="btn-secondary">View program</Link>
          </>
        ) : (
          <p className="subtle">Your coach hasn't assigned a program yet. Check back soon.</p>
        )}
      </div>

      <div className="card">
        <h2>Check-ins</h2>
        <Link to="/checkin" className="btn-primary">Submit a check-in</Link>
        {checkins.length === 0 && <p className="subtle" style={{ marginTop: '1rem' }}>No check-ins yet.</p>}
        <ul className="checkin-list">
          {checkins.slice(0, 5).map((c) => (
            <li key={c.id} className="checkin-item">
              <div className="checkin-date">{new Date(c.created_at).toLocaleDateString()}</div>
              {c.weight_kg && <div>{c.weight_kg} kg</div>}
              {c.notes && <div className="subtle">{c.notes}</div>}
              {c.coach_feedback && (
                <div className="coach-feedback">
                  <strong>Coach feedback:</strong> {c.coach_feedback}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Billing</h2>
        <p className="subtle">Manage your subscription, payment method, or cancel anytime.</p>
        <button className="btn-secondary" onClick={openBillingPortal} disabled={portalLoading}>
          {portalLoading ? 'Opening...' : 'Manage billing'}
        </button>
      </div>
    </div>
  );
}
