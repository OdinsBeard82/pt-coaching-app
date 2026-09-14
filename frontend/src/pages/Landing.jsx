import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Landing() {
  const { user } = useAuth();
  return (
    <div className="landing">
      <div className="landing-hero">
        <h1>Your program. Your check-ins. One place.</h1>
        <p>
          Personalised training programs, weekly check-ins, and direct coach feedback —
          all for one simple monthly subscription.
        </p>
        {!user && (
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary">Start your program</Link>
            <Link to="/login" className="btn-secondary">I already have an account</Link>
          </div>
        )}
        {user?.role === 'client' && (
          <Link to="/dashboard" className="btn-primary">Go to your dashboard</Link>
        )}
        {user?.role === 'coach' && (
          <Link to="/coach" className="btn-primary">Go to coach dashboard</Link>
        )}
      </div>

      <div className="landing-features">
        <div className="feature-card">
          <h3>Custom programs</h3>
          <p>A training plan built around your goals, updated as you progress.</p>
        </div>
        <div className="feature-card">
          <h3>Weekly check-ins</h3>
          <p>Log your weight, measurements and progress photos in seconds.</p>
        </div>
        <div className="feature-card">
          <h3>Direct feedback</h3>
          <p>Get personal notes back on every check-in, not just a chart.</p>
        </div>
      </div>
    </div>
  );
}
