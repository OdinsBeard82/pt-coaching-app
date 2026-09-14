import { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { Navigate } from 'react-router-dom';

const PACKAGES = [
  {
    tier: 'silver',
    name: 'Silver Package',
    tagline: 'Structured programming with regular coach contact.',
    features: [
      'Tailored strength & cardio program, updated every 4-6 weeks',
      'Monthly 1-2-1 coaching call',
      'Bi-monthly video + WhatsApp check-ins',
      'Nutrition coaching with meal plans',
      'Behavioural accountability support',
      'Performance tracker — photos, steps, weight, measurements',
    ],
  },
  {
    tier: 'gold',
    name: 'Gold Package',
    tagline: 'Everything in Silver, with closer weekly contact and extras.',
    features: [
      'Everything in the Silver Package',
      'Weekly video check-ins',
      'Monthly in-person session',
      'Supplement regimen sent to your home',
      'Workout diarising fit around your schedule',
      'Accountability checker',
      'Discounted DEXA scan, VO2 max and blood testing',
    ],
  },
];

export default function Subscribe() {
  const { user } = useAuth();
  const [loadingTier, setLoadingTier] = useState(null);
  const [error, setError] = useState('');

  if (user?.subscription_status === 'active') {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubscribe(tier) {
    setLoadingTier(tier);
    setError('');
    try {
      const { url } = await api.createCheckoutSession(tier);
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setLoadingTier(null);
    }
  }

  return (
    <div className="page subscribe-page">
      <div className="page-center" style={{ margin: '2rem auto 2.5rem' }}>
        <h1>Choose your package</h1>
        <p className="subtle">Pick the level of coaching that fits you. You can switch later from your billing settings.</p>
      </div>

      {error && <div className="error-banner" style={{ maxWidth: 480, margin: '0 auto 1.5rem' }}>{error}</div>}

      <div className="tier-grid">
        {PACKAGES.map((pkg) => (
          <div className="tier-card" key={pkg.tier}>
            <h2>{pkg.name}</h2>
            <p className="subtle">{pkg.tagline}</p>
            <ul className="tier-features">
              {pkg.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <button
              className="btn-primary"
              onClick={() => handleSubscribe(pkg.tier)}
              disabled={loadingTier !== null}
            >
              {loadingTier === pkg.tier ? 'Redirecting to checkout...' : `Choose ${pkg.name}`}
            </button>
          </div>
        ))}
      </div>

      <p className="subtle" style={{ textAlign: 'center', marginTop: '2rem' }}>
        You'll be taken to Stripe's secure checkout.
      </p>
    </div>
  );
}