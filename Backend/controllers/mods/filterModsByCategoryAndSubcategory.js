import db from "../../config/db.js";

export async function filterModsByCategoryAndSubcategory(req, res) {
  try {
    const { 
      category, 
      subcategories = [], 
      page = 1, 
      limit = 20, 
      sortBy = 'latest_update',
      search = null 
    } = req.body;

    if (!category) {
      return res.status(400).json({ status: 400, message: "Category is required" });
    }

    // Decode slug
    const slug = category;
    let decodedSlug = slug.startsWith('minecraft-') ? slug.substring(10) : slug;

    // Prepare both singular and plural versions
    const hasTrailingS = decodedSlug.endsWith('s');
    const singular = hasTrailingS ? decodedSlug.slice(0, -1) : decodedSlug;
    const plural = hasTrailingS ? decodedSlug : decodedSlug + 's';

    const toTitleCase = (str) =>
      str.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    const singularFormatted = toTitleCase(singular);
    const pluralFormatted = toTitleCase(plural);

    // Update click count (match either singular or plural)
    await db
      .promise()
      .query(
        `UPDATE web_mods_category 
         SET cat_clickcount = cat_clickcount + 1 
         WHERE cat_name = ? OR cat_name = ?`,
        [singularFormatted, pluralFormatted]
      );

    const offset = (page - 1) * limit;

    const values = [singularFormatted, pluralFormatted];
    let baseQuery = `
      FROM web_mods_data 
      WHERE (Category1 = ? OR Category1 = ?) 
        AND Name IS NOT NULL AND Name != ''
    `;

    if (Array.isArray(subcategories) && subcategories.length > 0) {
      const placeholders = subcategories.map(() => "?").join(", ");
      baseQuery += ` AND SubCategory1 IN (${placeholders})`;
      values.push(...subcategories);
    }

    if (search && search.trim() !== '') {
      baseQuery += ' AND (Name LIKE ? OR Description LIKE ?)';
      values.push(`%${search}%`, `%${search}%`);
    }

    // Sorting
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
      default:
        orderBy = 'ORDER BY UpdatedDate DESC';
    }

    // Get total count
    const [countRows] = await db
      .promise()
      .query(`SELECT COUNT(*) as total ${baseQuery}`, values);
    const totalItems = countRows[0].total;

    // Fetch filtered mods
    const dataQuery = `
      SELECT id, Name, Loaders, Category, Category1, SubCategory1, Likes, CreatedDate, UpdatedDate, SubCategory, Version, DisplayImage, Title_for_path, DownloadCount, Description 
      ${baseQuery}
      ${orderBy}
      LIMIT ? OFFSET ?
    `;
    const dataValues = [...values, parseInt(limit), parseInt(offset)];

    const [rows] = await db.promise().query(dataQuery, dataValues);

    const filteredMods = rows.map((mod) => ({
      ...mod,
      id: String(mod.id),
      Loaders: mod.Loaders,
      Category: String(mod.Category1),
      SubCategory1: String(mod.SubCategory1),
      DownloadCount: String(mod.DownloadCount),
      Likes: String(mod.Likes || 0),
      DisplayImage: `${
        process.env.Download_data_url
      }/${mod.Category}/${mod.SubCategory.toLowerCase()}/${mod.Title_for_path}/${mod.DisplayImage}`,
    }));

    // Get subcategories
    const [subcategoryRows] = await db
      .promise()
      .query(
        "SELECT sub_category FROM web_mods_category WHERE cat_name = ? OR cat_name = ? ORDER BY cat_clickcount DESC",
        [singularFormatted, pluralFormatted]
      );

    let AllSubcategories = [];

    if (subcategoryRows.length > 0) {
      const raw = subcategoryRows[0].sub_category || '';
      const splitItems = raw
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      AllSubcategories = splitItems.map((sub) => ({ Name: sub }));
    }

    // Return response
    res.json({
      status: 200,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      count: filteredMods.length,
      mods: filteredMods,
      AllSubcategories,
      filters: {
        sortBy,
        category,
        subcategories,
        search
      }
    });
  } catch (err) {
    console.error("Error filtering mods:", err);
    res.status(500).json({ status: 500, message: "Server Error" });
  }
}
