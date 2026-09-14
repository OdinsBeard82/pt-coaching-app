import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { pool } from '../db.js';
import { requireAuth, requireCoach } from '../middleware/auth.js';

const router = Router();

// Local disk storage for check-in photos.
// NOTE: for real production use, swap this for S3 / Cloudinary / similar -
// a single server's local disk won't survive redeploys on most hosts (Render, Railway, etc).
// The upload interface below stays the same either way, only `storage` changes.
const uploadDir = path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } });

// Client: submit a check-in
router.post('/', requireAuth, upload.array('photos', 6), async (req, res) => {
  const { weight_kg, notes, measurements } = req.body;
  const photoUrls = (req.files || []).map((f) => `/uploads/${f.filename}`);
  try {
    const result = await pool.query(
      `INSERT INTO checkins (user_id, weight_kg, measurements, photo_urls, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        req.user.id,
        weight_kg || null,
        measurements ? JSON.parse(measurements) : {},
        JSON.stringify(photoUrls),
        notes || '',
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not submit check-in' });
  }
});

// Client: view my own check-in history
router.get('/mine', requireAuth, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM checkins WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  );
  res.json(result.rows);
});

// Coach: leave feedback on a client's check-in
router.put('/:id/feedback', requireAuth, requireCoach, async (req, res) => {
  const { coach_feedback } = req.body;
  const result = await pool.query(
    `UPDATE checkins SET coach_feedback = $1, coach_feedback_at = now() WHERE id = $2 RETURNING *`,
    [coach_feedback, req.params.id]
  );
  if (!result.rows.length) return res.status(404).json({ error: 'Check-in not found' });
  res.json(result.rows[0]);
});

// Coach: recent check-ins across all clients (an activity feed)
router.get('/recent', requireAuth, requireCoach, async (req, res) => {
  const result = await pool.query(
    `SELECT c.*, u.name AS client_name FROM checkins c
     JOIN users u ON u.id = c.user_id
     ORDER BY c.created_at DESC LIMIT 30`
  );
  res.json(result.rows);
});

export default router;
