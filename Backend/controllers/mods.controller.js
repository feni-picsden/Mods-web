import db from '../config/db.js';
const metaInfo = require('../config/meta.json');

export async function getPaginatedMods(req, res) {
  try {
    const { page = 1, limit = 10 } = req.body;
    const offset = (page - 1) * limit;
    const [countRows] = await db.promise().query('SELECT COUNT(*) as count FROM web_mods_data');
    const total = countRows[0].count;

    const [mods] = await db.promise().query(
      'SELECT id, Name,Category, Version, DisplayImage, DownloadCount FROM web_mods_data LIMIT ? OFFSET ?',
      [limit, offset]
    );

    res.json({
      status: 200,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      mods,
    });
  } catch (err) {
    console.error('❌ Error fetching paginated mods:', err);
    res.status(500).json({ success: false, message: 'Server Error'});
  }
}

export async function getHomeScreenData(req, res) {
  try {
    const { category } = req.body;
    
    const [trendingModsRaw] = await db.promise().query(
      'SELECT id, Name, Description,SubCategory, DisplayImage, Title_for_path FROM web_mods_data ORDER BY DownloadCount DESC LIMIT 3'
    );
    
    const [categoriesRaw] = await db.promise().query(
      'SELECT * FROM ModifiedCategoryModsToolbox WHERE isActive = 1 ORDER BY cat_clickcount DESC'
    );
    
    let categoryModsRaw = [];
    
    if (category) {
      [categoryModsRaw] = await db.promise().query(
        'SELECT id, Name,Category, Category1, Version, DisplayImage, SubCategory, Title_for_path, DownloadCount FROM web_mods_data WHERE Category1 = ? LIMIT 15',
        [category]
      );
    } else {
      [categoryModsRaw] = await db.promise().query(
        'SELECT id, Name,Category, Category1, Version, DisplayImage, SubCategory, Title_for_path, DownloadCount FROM web_mods_data LIMIT 15'
      );
    }
    
    const Trending_mods = trendingModsRaw.map(mod => ({
      id: String(mod.id),
      Description: String(mod.Description),
      Name: String(mod.Name),
      DisplayImage: `${process.env.Download_data_url}/${mod.Category}/${mod.SubCategory.toLowerCase()}/${mod.Title_for_path}/${mod.DisplayImage}`
    }));
    
    const Category_mods = categoryModsRaw.map(mod => ({
      ...mod,
      id: String(mod.id),
      DownloadCount: String(mod.DownloadCount),
      DisplayImage: `${process.env.Download_data_url}/${mod.Category}/${mod.SubCategory.toLowerCase()}/${mod.Title_for_path}/${mod.DisplayImage}`
    }));
    
    const Categories = categoriesRaw.map(category => ({
      id: String(category.id),
      Name: String(category.cat_name)
    }));
    
    res.json({
      status: 200,
      Trending_mods,
      Categories,
      Category_mods
    });
  } catch (err) {
    console.error('❌ Error fetching home screen data:', err);
    res.status(500).json({ status: 500, message: 'Server Error' });
  }
}

export async function downloadMod(req, res) {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ 
        status: 400, 
        message: 'Mod ID is required' 
      });
    }
    const [mods] = await db.promise().query(
      'SELECT id,Category, SubCategory, Title_for_path FROM web_mods_data WHERE id = ?',
      [id]
    )
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
      const rawDownloadUrl = data.url;
      const fileName = data.Title;
      console.log(`Download requested for: ${fileName}`);
      return `${process.env.Download_data_url}/${Category}/${SubCategory.toLowerCase()}/${title_for_path}/${title_for_path}`;
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

const getMetaInfo = (category) => {
  if (category && metaInfo.categories[category]) {
    return metaInfo.categories[category];
  }
  return metaInfo.categories.mods; // default meta info
};

// Add meta info to your existing response handlers
exports.getPaginatedMods = async (req, res) => {
  try {
    const { category } = req.query;
    const meta = getMetaInfo(category);
    const result = await getPaginatedMods(req.query);
    res.json({
      ...result,
      meta
    });
  } catch (error) {
    console.error('Error in getPaginatedMods:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

