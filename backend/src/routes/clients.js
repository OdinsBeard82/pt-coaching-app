import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireCoach } from '../middleware/auth.js';

const router = Router();

// Coach: list all clients with their subscription status/tier and assigned program
router.get('/', requireAuth, requireCoach, async (req, res) => {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.current_program_id, p.title AS program_title,
            s.status AS subscription_status, s.tier AS subscription_tier, s.current_period_end,
            (SELECT MAX(created_at) FROM checkins c WHERE c.user_id = u.id) AS last_checkin_at
     FROM users u
     LEFT JOIN programs p ON p.id = u.current_program_id
     LEFT JOIN LATERAL (
       SELECT status, tier, current_period_end FROM subscriptions
       WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1
     ) s ON true
     WHERE u.role = 'client'
     ORDER BY u.created_at DESC`
  );
  res.json(result.rows);
});

// Coach: assign a program to a client
router.put('/:id/assign-program', requireAuth, requireCoach, async (req, res) => {
  const { program_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET current_program_id = $1 WHERE id = $2 AND role = 'client' RETURNING id, name, current_program_id`,
      [program_id || null, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Client not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not assign program' });
  }
});

// Coach: view a single client's detail (profile + checkin history)
router.get('/:id', requireAuth, requireCoach, async (req, res) => {
  const userResult = await pool.query(
    `SELECT u.id, u.name, u.email, u.current_program_id, p.title AS program_title,
            s.status AS subscription_status, s.tier AS subscription_tier, s.current_period_end
     FROM users u
     LEFT JOIN programs p ON p.id = u.current_program_id
     LEFT JOIN LATERAL (
       SELECT status, tier, current_period_end FROM subscriptions
       WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1
     ) s ON true
     WHERE u.id = $1 AND u.role = 'client'`,
    [req.params.id]
  );
  if (!userResult.rows.length) return res.status(404).json({ error: 'Client not found' });

  const checkins = await pool.query(
    'SELECT * FROM checkins WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
    [req.params.id]
  );

  res.json({ ...userResult.rows[0], checkins: checkins.rows });
});

export default router;