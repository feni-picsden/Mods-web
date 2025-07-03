import db from '../../config/db.js';

export default async function downloadMod(req, res) {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        status: 400,
        message: 'Mod ID is required'
      });
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
      'UPDATE web_mods_data SET DownloadCount = DownloadCount + 1 WHERE id = ?',
      [id]
    );
    const [mods] = await db.promise().query(
      'SELECT id,Category, SubCategory, Title_for_path FROM web_mods_data WHERE id = ?',
      [id]
    );
    const [downloadData] = await db.promise().query(
      'SELECT url, Title FROM web_mods_downloadData WHERE ModsId1 = ?',
      [id]
    );

    if (!downloadData || downloadData.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'Download data not found for this mod'
      });
    }

    const title_for_path = mods[0].Title_for_path;
    const SubCategory = mods[0].SubCategory;
    const Category = mods[0].Category;
    const downloadUrls = downloadData.map(data => {
      return `${process.env.Download_data_url}/${Category}/${SubCategory.toLowerCase()}/${title_for_path}/${data.url}`;
    });

    res.json({
      status: 200,
      downloadUrls
    });
  } catch (err) {
    console.error('❌ Error generating download link:', err);
    res.status(500).json({ status: 500, message: 'Server Error' });
  }
}
