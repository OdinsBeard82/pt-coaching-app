// Creates (or promotes) your coach account.
// Usage: node src/seed-coach.js you@email.com "your password" "Your Name"
import bcrypt from 'bcryptjs';
import { pool } from './db.js';

async function main() {
  const [, , email, password, name] = process.argv;
  if (!email || !password || !name) {
    console.error('Usage: node src/seed-coach.js <email> <password> "<name>"');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 10);
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);

  if (existing.rows.length) {
    await pool.query(
      `UPDATE users SET role = 'coach', password_hash = $1, name = $2 WHERE email = $3`,
      [hash, name, email.toLowerCase()]
    );
    console.log(`Existing user ${email} promoted to coach.`);
  } else {
    await pool.query(
      `INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, 'coach')`,
      [email.toLowerCase(), hash, name]
    );
    console.log(`Coach account created for ${email}.`);
  }
  await pool.end();
}

main();
