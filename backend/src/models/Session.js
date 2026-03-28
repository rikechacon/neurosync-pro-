const pool = require('../config/database');

class Session {
  static async create(userId, routineId, sessionData) {
    const {
      duration_completed,
      completion_percentage,
      device_type,
      notes
    } = sessionData;

    const result = await pool.query(
      `INSERT INTO sessions (
        user_id, routine_id, duration_completed, 
        completion_percentage, device_type, notes
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        userId, routineId, duration_completed || 0,
        completion_percentage || 0, device_type || 'web', notes
      ]
    );

    return result.rows[0];
  }

  static async findByUser(userId, limit = 20, offset = 0) {
    const result = await pool.query(
      `SELECT s.*, r.name as routine_name, r.beat_freq 
       FROM sessions s
       JOIN routines r ON s.routine_id = r.id
       WHERE s.user_id = $1 
       ORDER BY s.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  }

  static async getStats(userId) {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_sessions,
        SUM(duration_completed) as total_time,
        AVG(completion_percentage) as avg_completion,
        MAX(created_at) as last_session
       FROM sessions
       WHERE user_id = $1`,
      [userId]
    );

    return result.rows[0];
  }

  static async getFrequencyStats(userId) {
    const result = await pool.query(
      `SELECT r.beat_freq, r.band, COUNT(*) as usage_count
       FROM sessions s
       JOIN routines r ON s.routine_id = r.id
       WHERE s.user_id = $1
       GROUP BY r.beat_freq, r.band
       ORDER BY usage_count DESC
       LIMIT 10`,
      [userId]
    );

    return result.rows;
  }
}

module.exports = Session;
