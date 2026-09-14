import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

export default function ProgramView() {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [error, setError] = useState('');
  const [activeWeek, setActiveWeek] = useState(0);

  useEffect(() => {
    api.getProgram(id).then(setProgram).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="page-center error-banner">{error}</div>;
  if (!program) return <div className="page-center">Loading...</div>;

  const weeks = program.content?.weeks || [];

  return (
    <div className="page">
      <Link to="/dashboard" className="back-link">&larr; Back to dashboard</Link>
      <h1>{program.title}</h1>
      <p className="subtle">{program.description}</p>

      {weeks.length === 0 && <p className="subtle">This program has no content yet.</p>}

      {weeks.length > 0 && (
        <>
          <div className="week-tabs">
            {weeks.map((w, i) => (
              <button
                key={i}
                className={`week-tab ${i === activeWeek ? 'active' : ''}`}
                onClick={() => setActiveWeek(i)}
              >
                {w.label || `Week ${i + 1}`}
              </button>
            ))}
          </div>

          <div className="days">
            {(weeks[activeWeek]?.days || []).map((day, di) => (
              <div className="day-card" key={di}>
                <h3>{day.label}</h3>
                <table className="exercise-table">
                  <thead>
                    <tr>
                      <th>Exercise</th>
                      <th>Sets</th>
                      <th>Reps</th>
                      <th>Rest</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(day.exercises || []).map((ex, ei) => (
                      <tr key={ei}>
                        <td>{ex.name}</td>
                        <td>{ex.sets}</td>
                        <td>{ex.reps}</td>
                        <td>{ex.rest || '—'}</td>
                        <td className="subtle">{ex.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
