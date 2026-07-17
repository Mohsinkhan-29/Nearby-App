import pool from "../services/db.js";

export async function getSavedPlaces(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT place_id, name, category, lat, lng, saved_at
       FROM saved_places
       WHERE user_id = $1
       ORDER BY saved_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch saved places" });
  }
}

export async function savePlace(req, res) {
  const { placeId, name, category, lat, lng } = req.body;

  if (!placeId) {
    return res.status(400).json({ error: "placeId is required" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO saved_places (user_id, place_id, name, category, lat, lng)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, place_id) DO NOTHING
       RETURNING place_id, name, category, lat, lng, saved_at`,
      [req.user.id, placeId, name, category, lat, lng]
    );
    res.status(201).json(rows[0] ?? { place_id: placeId, alreadySaved: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save place" });
  }
}

export async function removeSavedPlace(req, res) {
  const { placeId } = req.params;

  try {
    await pool.query(
      `DELETE FROM saved_places WHERE user_id = $1 AND place_id = $2`,
      [req.user.id, placeId]
    );
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove saved place" });
  }
}