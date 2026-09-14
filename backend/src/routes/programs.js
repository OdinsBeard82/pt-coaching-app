import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireCoach } from '../middleware/auth.js';

const router = Router();

// Coach: list all programs
router.get('/', requireAuth, requireCoach, async (req, res) => {
  const result = await pool.query('SELECT * FROM programs ORDER BY created_at DESC');
  res.json(result.rows);
});

// Coach: create a program
router.post('/', requireAuth, requireCoach, async (req, res) => {
  const { title, description, content } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  try {
    const result = await pool.query(
      `INSERT INTO programs (title, description, content, created_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description || '', content || { weeks: [] }, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create program' });
  }
});

// Coach: update a program (e.g. editing weeks/exercises)
router.put('/:id', requireAuth, requireCoach, async (req, res) => {
  const { title, description, content } = req.body;
  try {
    const result = await pool.query(
      `UPDATE programs SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         content = COALESCE($3, content),
         updated_at = now()
       WHERE id = $4 RETURNING *`,
      [title, description, content, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Program not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update program' });
  }
});

router.delete('/:id', requireAuth, requireCoach, async (req, res) => {
  await pool.query('DELETE FROM programs WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

// Any logged-in user: view a single program (client can only view their assigned one)
router.get('/:id', requireAuth, async (req, res) => {
  const result = await pool.query('SELECT * FROM programs WHERE id = $1', [req.params.id]);
  const program = result.rows[0];
  if (!program) return res.status(404).json({ error: 'Program not found' });

  if (req.user.role === 'client') {
    const userResult = await pool.query('SELECT current_program_id FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows[0]?.current_program_id !== program.id) {
      return res.status(403).json({ error: 'This is not your assigned program' });
    }
  }
  res.json(program);
});

// Client: fetch my currently assigned program
router.get('/mine/current', requireAuth, async (req, res) => {
  const userResult = await pool.query('SELECT current_program_id FROM users WHERE id = $1', [req.user.id]);
  const programId = userResult.rows[0]?.current_program_id;
  if (!programId) return res.json(null);
  const result = await pool.query('SELECT * FROM programs WHERE id = $1', [programId]);
  res.json(result.rows[0] || null);
});

export default router;
