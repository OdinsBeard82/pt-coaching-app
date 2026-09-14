import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function CheckInForm() {
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      if (weight) formData.append('weight_kg', weight);
      formData.append('notes', notes);
      formData.append('measurements', JSON.stringify(waist ? { waist_cm: Number(waist) } : {}));
      photos.forEach((file) => formData.append('photos', file));

      await api.submitCheckin(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Submit a check-in</h2>
        {error && <div className="error-banner">{error}</div>}
        <label>
          Weight (kg)
          <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </label>
        <label>
          Waist (cm) - optional
          <input type="number" step="0.1" value={waist} onChange={(e) => setWaist(e.target.value)} />
        </label>
        <label>
          Notes
          <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <label>
          Progress photos (optional)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setPhotos(Array.from(e.target.files))}
          />
        </label>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit check-in'}
        </button>
      </form>
    </div>
  );
}
