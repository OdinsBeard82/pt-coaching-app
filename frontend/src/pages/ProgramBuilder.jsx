import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

const emptyExercise = () => ({ name: '', sets: '', reps: '', rest: '', notes: '' });
const emptyDay = () => ({ label: 'Day 1', exercises: [emptyExercise()] });
const emptyWeek = () => ({ label: 'Week 1', days: [emptyDay()] });

export default function ProgramBuilder({ isNew }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [weeks, setWeeks] = useState([emptyWeek()]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      api.getProgram(id).then((p) => {
        setTitle(p.title);
        setDescription(p.description || '');
        setWeeks(p.content?.weeks?.length ? p.content.weeks : [emptyWeek()]);
        setLoading(false);
      });
    }
  }, [id, isNew]);

  function updateWeek(wi, patch) {
    setWeeks((prev) => prev.map((w, i) => (i === wi ? { ...w, ...patch } : w)));
  }
  function updateDay(wi, di, patch) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i !== wi ? w : { ...w, days: w.days.map((d, j) => (j === di ? { ...d, ...patch } : d)) }
      )
    );
  }
  function updateExercise(wi, di, ei, patch) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i !== wi
          ? w
          : {
            ...w,
            days: w.days.map((d, j) =>
              j !== di
                ? d
                : { ...d, exercises: d.exercises.map((ex, k) => (k === ei ? { ...ex, ...patch } : ex)) }
            ),
          }
      )
    );
  }

  function addWeek() {
    setWeeks((prev) => [...prev, { ...emptyWeek(), label: `Week ${prev.length + 1}` }]);
  }
  function removeWeek(wi) {
    setWeeks((prev) => prev.filter((_, i) => i !== wi));
  }
  function addDay(wi) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i !== wi ? w : { ...w, days: [...w.days, { ...emptyDay(), label: `Day ${w.days.length + 1}` }] }
      )
    );
  }
  function removeDay(wi, di) {
    setWeeks((prev) =>
      prev.map((w, i) => (i !== wi ? w : { ...w, days: w.days.filter((_, j) => j !== di) }))
    );
  }
  function addExercise(wi, di) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i !== wi
          ? w
          : {
            ...w,
            days: w.days.map((d, j) =>
              j !== di ? d : { ...d, exercises: [...d.exercises, emptyExercise()] }
            ),
          }
      )
    );
  }
  function removeExercise(wi, di, ei) {
    setWeeks((prev) =>
      prev.map((w, i) =>
        i !== wi
          ? w
          : {
            ...w,
            days: w.days.map((d, j) =>
              j !== di ? d : { ...d, exercises: d.exercises.filter((_, k) => k !== ei) }
            ),
          }
      )
    );
  }

  async function handleSave() {
    if (!title.trim()) {
      setError('Program needs a title');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const content = { weeks };
      if (isNew) {
        const created = await api.createProgram({ title, description, content });
        navigate(`/coach/programs/${created.id}`);
      } else {
        await api.updateProgram(id, { title, description, content });
        navigate('/coach');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this program? This cannot be undone.')) return;
    await api.deleteProgram(id);
    navigate('/coach');
  }

  if (loading) return <div className="page-center">Loading...</div>;

  return (
    <div className="page">
      <Link to="/coach" className="back-link">&larr; Back to coach dashboard</Link>
      <h1>{isNew ? 'New program' : 'Edit program'}</h1>
      {error && <div className="error-banner">{error}</div>}

      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 12-Week Strength Base" />
      </label>
      <label>
        Description
        <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      {weeks.map((week, wi) => (
        <div className="builder-week" key={wi}>
          <div className="builder-row">
            <input
              className="week-label-input"
              value={week.label}
              onChange={(e) => updateWeek(wi, { label: e.target.value })}
            />
            <button className="btn-small-link" onClick={() => removeWeek(wi)}>Remove week</button>
          </div>

          {week.days.map((day, di) => (
            <div className="builder-day" key={di}>
              <div className="builder-row">
                <input
                  className="day-label-input"
                  value={day.label}
                  onChange={(e) => updateDay(wi, di, { label: e.target.value })}
                />
                <button className="btn-small-link" onClick={() => removeDay(wi, di)}>Remove day</button>
              </div>

              <table className="exercise-table builder-table">
                <thead>
                  <tr>
                    <th>Exercise</th>
                    <th>Sets</th>
                    <th>Reps</th>
                    <th>Rest</th>
                    <th>Notes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {day.exercises.map((ex, ei) => (
                    <tr key={ei}>
                      <td>
                        <input
                          value={ex.name}
                          onChange={(e) => updateExercise(wi, di, ei, { name: e.target.value })}
                          placeholder="Goblet squat"
                        />
                      </td>
                      <td>
                        <input
                          className="cell-narrow"
                          value={ex.sets}
                          onChange={(e) => updateExercise(wi, di, ei, { sets: e.target.value })}
                          placeholder="4"
                        />
                      </td>
                      <td>
                        <input
                          className="cell-narrow"
                          value={ex.reps}
                          onChange={(e) => updateExercise(wi, di, ei, { reps: e.target.value })}
                          placeholder="10-12"
                        />
                      </td>
                      <td>
                        <input
                          className="cell-narrow"
                          value={ex.rest || ''}
                          onChange={(e) => updateExercise(wi, di, ei, { rest: e.target.value })}
                          placeholder="60 sec"
                        />
                      </td>
                      <td>
                        <input
                          value={ex.notes}
                          onChange={(e) => updateExercise(wi, di, ei, { notes: e.target.value })}
                          placeholder="Tempo, RPE, cues..."
                        />
                      </td>
                      <td>
                        <button className="btn-small-link" onClick={() => removeExercise(wi, di, ei)}>x</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn-small" onClick={() => addExercise(wi, di)}>+ Add exercise</button>
            </div>
          ))}
          <button className="btn-small" onClick={() => addDay(wi)}>+ Add day</button>
        </div>
      ))}

      <button className="btn-secondary" onClick={addWeek}>+ Add week</button>

      <div className="builder-actions">
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save program'}
        </button>
        {!isNew && (
          <button className="btn-danger" onClick={handleDelete}>Delete program</button>
        )}
      </div>
    </div>
  );
}
