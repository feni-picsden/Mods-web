import db from '../../config/db.js';

export async function increaseLikes(req, res) {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ status: 400, message: 'Mod ID is required' });
    }

    // Check if mod exists and has a valid name
    const [modCheck] = await db.promise().query(
      'SELECT id FROM web_mods_data WHERE id = ? AND Name IS NOT NULL AND Name != ""',
      [id]
    );

    if (modCheck.length === 0) {
      return res.status(404).json({ status: 404, message: 'Mod not found or has empty name' });
    }

    // Update the download count
    await db.promise().query(
      'UPDATE web_mods_data SET Likes = Likes + 1 WHERE id = ?',
      [id]
    );

    res.json({ status: 200, message: 'Likes incremented successfully' });
  } catch (err) {
    console.error('❌ Error Likes count:', err);
    res.status(500).json({ status: 500, message: 'Server Error' });
  }
}