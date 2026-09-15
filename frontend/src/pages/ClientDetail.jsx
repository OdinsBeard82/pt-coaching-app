import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

function tierLabel(tier) {
  if (tier === 'gold') return 'Gold Package';
  if (tier === 'silver') return 'Silver Package';
  return 'No package selected';
}

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState('');
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const [savingFeedbackId, setSavingFeedbackId] = useState(null);
  const [assigning, setAssigning] = useState(false);

  async function load() {
    try {
      const [c, p] = await Promise.all([api.getClient(id), api.listPrograms()]);
      setClient(c);
      setPrograms(p);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  if (error) return <div className="page-center error-banner">{error}</div>;
  if (!client) return <div className="page-center">Loading...</div>;

  async function handleAssign(e) {
    const programId = e.target.value ? Number(e.target.value) : null;
    setAssigning(true);
    try {
      await api.assignProgram(id, programId);
      await load();
    } finally {
      setAssigning(false);
    }
  }

  async function handleSaveFeedback(checkinId) {
    setSavingFeedbackId(checkinId);
    try {
      await api.giveFeedback(checkinId, feedbackDrafts[checkinId] || '');
      await load();
    } finally {
      setSavingFeedbackId(null);
    }
  }

  return (
    <div className="page">
      <Link to="/coach" className="back-link">&larr; Back to coach dashboard</Link>
      <h1>{client.name}</h1>
      <p className="subtle">{client.email}</p>

      <div className="card">
        <h2>Program</h2>
        <label>
          Assigned program
          <select value={client.current_program_id || ''} onChange={handleAssign} disabled={assigning}>
            <option value="">— Unassigned —</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="card">
        <h2>Subscription</h2>
        <p>
          Package: <span className={`tier-badge ${client.subscription_tier || ''}`}>
            {tierLabel(client.subscription_tier)}
          </span>
        </p>
        <p>
          Status: <span className={`status-badge ${client.subscription_status === 'active' ? 'active' : ''}`}>
            {client.subscription_status || 'none'}
          </span>
        </p>
        {client.current_period_end && (
          <p className="subtle">Renews: {new Date(client.current_period_end).toLocaleDateString()}</p>
        )}
      </div>

      <div className="card">
        <h2>Check-in history</h2>
        {client.checkins.length === 0 && <p className="subtle">No check-ins yet.</p>}
        <ul className="checkin-list">
          {client.checkins.map((c) => (
            <li key={c.id} className="checkin-item">
              <div className="checkin-date">{new Date(c.created_at).toLocaleDateString()}</div>
              {c.weight_kg && <div>{c.weight_kg} kg</div>}
              {c.measurements?.waist_cm && <div>Waist: {c.measurements.waist_cm} cm</div>}
              {c.notes && <div className="subtle">{c.notes}</div>}
              {(c.photo_urls || []).length > 0 && (
                <div className="photo-row">
                  {c.photo_urls.map((url, i) => (
                    <img key={i} src={url} alt="Progress" className="checkin-photo" />
                  ))}
                </div>
              )}

              {c.coach_feedback ? (
                <div className="coach-feedback">
                  <strong>Your feedback:</strong> {c.coach_feedback}
                </div>
              ) : (
                <div className="feedback-form">
                  <textarea
                    rows={2}
                    placeholder="Leave feedback for this check-in..."
                    value={feedbackDrafts[c.id] || ''}
                    onChange={(e) =>
                      setFeedbackDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))
                    }
                  />
                  <button
                    className="btn-small"
                    onClick={() => handleSaveFeedback(c.id)}
                    disabled={savingFeedbackId === c.id || !feedbackDrafts[c.id]}
                  >
                    {savingFeedbackId === c.id ? 'Saving...' : 'Send feedback'}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}