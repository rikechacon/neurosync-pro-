const pool = require('../config/database');

class Routine {
  static async create(userId, routineData) {
    const {
      name,
      carrier_freq,
      beat_freq,
      band,
      nature_sound,
      duration,
      is_healing,
      healing_type,
      is_schumann,
      schumann_mode,
      answers
    } = routineData;

    const result = await pool.query(
      `INSERT INTO routines (
        user_id, name, carrier_freq, beat_freq, band, 
        nature_sound, duration, is_healing, healing_type,
        is_schumann, schumann_mode, answers
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        userId, name, carrier_freq, beat_freq, band,
        nature_sound, duration, is_healing || false, healing_type,
        is_schumann || false, schumann_mode, JSON.stringify(answers || {})
      ]
    );

    return result.rows[0];
  }

  static async findByUser(userId, limit = 10, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM routines 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  }

  static async findById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM routines WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    return result.rows[0];
  }

  static async delete(id, userId) {
    await pool.query(
      'DELETE FROM routines WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
  }
}

module.exports = Routine;
