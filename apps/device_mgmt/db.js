const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = {
  createSensor: async ({ name, type, location, unit }) => {
    const now = new Date();
    const query = `
      INSERT INTO sensors (name, type, location, unit, status, last_updated, created_at)
      VALUES ($1, $2, $3, $4, 'inactive', $5, $5)
      RETURNING id, name, type, location, value, unit, status, last_updated, created_at
    `;
    const values = [name, type, location, unit, now];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};
