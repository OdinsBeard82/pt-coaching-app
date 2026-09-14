import { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { Navigate } from 'react-router-dom';

export default function Subscribe() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user?.subscription_status === 'active') {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubscribe() {
    setLoading(true);
    setError('');
    try {
      const { url } = await api.createCheckoutSession();
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="page-center subscribe-page">
      <h2>Join the coaching program</h2>
      <p>One monthly subscription gets you a personalised program, weekly check-ins and direct coach feedback.</p>
      {error && <div className="error-banner">{error}</div>}
      <button className="btn-primary" onClick={handleSubscribe} disabled={loading}>
        {loading ? 'Redirecting to checkout...' : 'Subscribe now'}
      </button>
      <p className="subtle">You'll be taken to Stripe's secure checkout.</p>
    </div>
  );
}
