import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function CoachDashboard() {
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [c, p, r] = await Promise.all([
          api.listClients(),
          api.listPrograms(),
          api.recentCheckins(),
        ]);
        setClients(c);
        setPrograms(p);
        setRecent(r);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="page-center">Loading...</div>;
  if (error) return <div className="page-center error-banner">{error}</div>;

  const activeCount = clients.filter((c) => c.subscription_status === 'active').length;

  return (
    <div className="page">
      <h1>Coach dashboard</h1>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{clients.length}</div>
          <div className="subtle">Total clients</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{activeCount}</div>
          <div className="subtle">Active subscriptions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{programs.length}</div>
          <div className="subtle">Programs built</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Programs</h2>
          <Link to="/coach/programs/new" className="btn-secondary">+ New program</Link>
        </div>
        {programs.length === 0 && <p className="subtle">No programs yet — create your first one.</p>}
        <ul className="simple-list">
          {programs.map((p) => (
            <li key={p.id}>
              <Link to={`/coach/programs/${p.id}`}>{p.title}</Link>
              <span className="subtle"> — {(p.content?.weeks || []).length} week(s)</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Clients</h2>
        {clients.length === 0 && <p className="subtle">No clients yet.</p>}
        <table className="client-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Program</th>
              <th>Last check-in</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>
                  <span className={`status-badge ${c.subscription_status === 'active' ? 'active' : ''}`}>
                    {c.subscription_status || 'none'}
                  </span>
                </td>
                <td>{c.program_title || <span className="subtle">Unassigned</span>}</td>
                <td className="subtle">
                  {c.last_checkin_at ? new Date(c.last_checkin_at).toLocaleDateString() : '—'}
                </td>
                <td>
                  <Link to={`/coach/clients/${c.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Recent check-ins</h2>
        {recent.length === 0 && <p className="subtle">No check-ins yet.</p>}
        <ul className="checkin-list">
          {recent.slice(0, 8).map((c) => (
            <li key={c.id} className="checkin-item">
              <div className="checkin-date">
                <strong>{c.client_name}</strong> — {new Date(c.created_at).toLocaleDateString()}
              </div>
              {c.weight_kg && <div>{c.weight_kg} kg</div>}
              {c.notes && <div className="subtle">{c.notes}</div>}
              {!c.coach_feedback && (
                <Link to={`/coach/clients/${c.user_id}`} className="btn-small-link">
                  Leave feedback
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
