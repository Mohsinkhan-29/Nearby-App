import pool from "../services/db.js";

export async function markVisited(req, res) {
  const { placeId, name, category, lat, lng } = req.body;

  if (!placeId) {
    return res.status(400).json({
      message: "placeId is required",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO visited_places (user_id, place_id, name, category, lat, lng)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [req.user.id, placeId, name, category, lat, lng]
    );

    res.status(201).json({
      place: result.rows[0],
    });
  } catch (err) {
    console.error("Mark visited error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function getVisitedPlaces(req, res) {
  try {
    const result = await pool.query(
      `SELECT *
       FROM visited_places
       WHERE user_id = $1
       ORDER BY visited_at DESC`,
      [req.user.id]
    );

    res.json({
      places: result.rows,
    });
  } catch (err) {
    console.error("Get visited places error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
}
