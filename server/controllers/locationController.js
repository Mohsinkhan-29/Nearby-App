import pool from "../services/db.js";

export async function logLocation(req, res) {
  const { lat, lng } = req.body;

  if (lat == null || lng == null) {
    return res.status(400).json({
      message: "lat and lng are required",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO user_locations (user_id, lat, lng)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, lat, lng]
    );

    res.status(201).json({
      location: result.rows[0],
    });
  } catch (err) {
    console.error("Log location error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function getLatestLocation(req, res) {
  try {
    const result = await pool.query(
      `SELECT *
       FROM user_locations
       WHERE user_id = $1
       ORDER BY recorded_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    res.json({
      location: result.rows[0] || null,
    });
  } catch (err) {
    console.error("Get location error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
}