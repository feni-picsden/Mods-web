import db from '../../config/db.js';

export async function searchMod(req, res) {
  try {
    const { keyword } = req.body;

    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({ status: 400, message: 'Keyword is required' });
    }

    const searchTerm = `%${keyword.trim()}%`;

    const query = `
      SELECT id, Name,Loaders, Category, Category1, SubCategory,SubCategory1, Version, DisplayImage, Title_for_path, DownloadCount
      FROM web_mods_data
      WHERE 
        (Name LIKE ? OR Category1 LIKE ? OR SubCategory1 LIKE ?)
        AND Name IS NOT NULL AND Name != ''
      ORDER BY DownloadCount DESC
      LIMIT 30
    `;

    const [rows] = await db.promise().query(query, [searchTerm, searchTerm, searchTerm]);

    const mods = rows.map(mod => ({
      ...mod,
      id: String(mod.id),
      Loaders: String(mod.Loaders),
      DownloadCount: String(mod.DownloadCount),
      DisplayImage: `${process.env.Download_data_url}/${mod.Category}/${mod.SubCategory.toLowerCase()}/${mod.Title_for_path}/${mod.DisplayImage}`
    }));

    res.json({
      status: 200,
      count: mods.length,
      mods
    });

  } catch (err) {
    console.error('❌ Error searching mods:', err);
    res.status(500).json({ status: 500, message: 'Server Error' });
  }
}
