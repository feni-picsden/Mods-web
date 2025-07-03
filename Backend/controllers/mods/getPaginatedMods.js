import db from '../../config/db.js';

export default async function getPaginatedMods(req, res) {
  try {
    const { 
      page = 1, 
      limit = 20, 
      sortBy = 'latest_update',
      category = null,
      search = null 
    } = req.body;
    
    const offset = (page - 1) * limit;
    
    // Build base query
    let baseQuery = 'FROM web_mods_data WHERE Name IS NOT NULL AND Name != ""';
    let queryParams = [];
    
    // Add category filter
    if (category && category !== 'all') {
      baseQuery += ' AND Category1 = ?';
      queryParams.push(category);
    }
    
    // Add search filter
    if (search && search.trim() !== '') {
      baseQuery += ' AND (Name LIKE ? OR Description LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    // Add sorting
    let orderBy = '';
    switch (sortBy) {
      case 'latest_update':
        orderBy = 'ORDER BY UpdatedDate DESC';
        break;
      case 'relevancy':
        orderBy = 'ORDER BY DownloadCount DESC, Likes DESC';
        break;                           
      case 'popularity':
        orderBy = 'ORDER BY DownloadCount DESC';
        break;
      case 'creation_date':
        orderBy = 'ORDER BY CreatedDate DESC';
        break;
      case 'total_downloads':
        orderBy = 'ORDER BY DownloadCount DESC';
        break;
      case 'name_asc':
        orderBy = 'ORDER BY Name ASC';
        break;
      case 'name_desc':
        orderBy = 'ORDER BY Name DESC';
        break;
      default:
        orderBy = 'ORDER BY UpdatedDate DESC';
    }
    
    // Count total items
    const [countRows] = await db.promise().query(
      `SELECT COUNT(*) as count ${baseQuery}`,
      queryParams
    );
    const total = countRows[0].count;
    
    // Fetch paginated data
    const [mods] = await db.promise().query(
      `SELECT id, Name, Category, Category1, SubCategory, Version, DisplayImage, Title_for_path, DownloadCount, Likes, CreatedDate, UpdatedDate, Description 
       ${baseQuery} 
       ${orderBy} 
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), parseInt(offset)]
    );

    // Format the mods data to match other endpoints
    const formattedMods = mods.map(mod => ({
      ...mod,
      id: String(mod.id),
      Category: String(mod.Category1),
      DownloadCount: String(mod.DownloadCount),
      Likes: String(mod.Likes || 0),
      DisplayImage: `${process.env.Download_data_url}/${mod.Category}/${mod.SubCategory.toLowerCase()}/${mod.Title_for_path}/${mod.DisplayImage}`,
      CreatedDate: mod.CreatedDate,
      UpdatedDate: mod.UpdatedDate
    }));

    res.json({
      status: 200,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      mods: formattedMods,
      filters: {
        sortBy,
        category,
        search
      }
    });
  } catch (err) {
    console.error('❌ Error fetching paginated mods:', err);
    res.status(500).json({ status: 500, message: 'Server Error' });
  }
}
