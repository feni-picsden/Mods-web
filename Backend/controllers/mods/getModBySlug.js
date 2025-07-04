import db from "../../config/db.js";

const modCache = new Map();

export async function getModBySlug(req, res) {
  try {
    const { category, modTitle } = req.body;

    if (!category || !modTitle) {
      return res.status(400).json({ 
        status: 400, 
        message: "Category and mod title are required" 
      });
    }

    const cacheKey = `${category}-${modTitle}`;
    if (modCache.has(cacheKey)) {
      return res.json(modCache.get(cacheKey));
    }

    // Remove minecraft- prefix from category and mod title
    const cleanCategory = category.startsWith('minecraft-') ? category.substring(10) : category;
    const cleanModTitle = modTitle.startsWith('minecraft-') ? modTitle.substring(10) : modTitle;
    
    const searchTitle = cleanModTitle.replace(/-/g, '');
    const categorySearch = cleanCategory.replace(/-/g, '');
    
    // Handle both singular and plural forms of category
    const categorySearchPlural = categorySearch.endsWith('s') ? categorySearch : categorySearch + 's';
    const categorySearchSingular = categorySearch.endsWith('s') ? categorySearch.slice(0, -1) : categorySearch;
    
    const [modRows] = await db.promise().query(
      `SELECT id, Name,Loaders, Category, Category1, SubCategory, DisplayImage, Title_for_path, 
              Price, Version, DownloadCount, Likes, Seen, SubImages, Description, 
              CreatedDate, UpdatedDate
       FROM web_mods_data 
       WHERE name_slug = ? AND (category_slug = ? OR category_slug = ?)
       AND Name IS NOT NULL AND Name != ""
       LIMIT 1`,
      [searchTitle.toLowerCase(), categorySearchSingular.toLowerCase(), categorySearchPlural.toLowerCase()]
    );

    if (modRows.length === 0) {
      return res.status(404).json({ 
        status: 404, 
        message: "Mod not found"
      });
    }

    const mod = modRows[0];
    const DisplayImage = `${process.env.Download_data_url}/${mod.Category}/${mod.SubCategory.toLowerCase()}/${mod.Title_for_path}/${mod.DisplayImage}`;
    const SubImages = mod.SubImages
      ? mod.SubImages.split(",").map(img =>
          `${process.env.Download_data_url}/${mod.Category}/${mod.SubCategory.toLowerCase()}/${mod.Title_for_path}/${img.trim()}`
        )
      : [];

    const [ [categoriesRaw], [relatedModsRaw] ] = await Promise.all([
      db.promise().query(
        'SELECT id, cat_name FROM web_mods_category WHERE isActive = 1 ORDER BY cat_clickcount DESC'
      ),
      db.promise().query(
        `SELECT id, Name,Loaders, Category, Category1, SubCategory1, Version, DownloadCount, Likes, DisplayImage, Title_for_path, SubCategory 
         FROM web_mods_data 
         WHERE (category_slug = ? OR category_slug = ?) AND id != ? AND Name IS NOT NULL AND DisplayImage IS NOT NULL AND DisplayImage != ""
         ORDER BY CAST(DownloadCount AS UNSIGNED) DESC 
         LIMIT 5`,
        [categorySearchSingular.toLowerCase(), categorySearchPlural.toLowerCase(), mod.id]
      )
    ]);

    const Categories = categoriesRaw.map(category => ({
      id: String(category.id),
      Name: String(category.cat_name)
    }));

    const RelatedMods = relatedModsRaw.map(relatedMod => ({
      id: String(relatedMod.id),
      Name: String(relatedMod.Name),
      Loaders: String(relatedMod.Loaders),
      Category: String(relatedMod.Category1),
      SubCategory1: String(relatedMod.SubCategory1 || ''),
      Version: String(relatedMod.Version),
      DownloadCount: String(relatedMod.DownloadCount),
      Likes: String(relatedMod.Likes || 0),
      DisplayImage: `${process.env.Download_data_url}/${relatedMod.Category}/${relatedMod.SubCategory.toLowerCase()}/${relatedMod.Title_for_path}/${relatedMod.DisplayImage}`
    }));

    const response = {
      status: 200,
      mod: {
        id: String(mod.id),
        Category: String(mod.Category1),
        Name: String(mod.Name),
        Loaders: String(mod.Loaders),
        Price: String(mod.Price),
        Version: String(mod.Version),
        DownloadCount: String(mod.DownloadCount),
        Likes: String(mod.Likes),
        Seen: String(mod.Seen),
        SubImages,
        DisplayImage,
        Description: String(mod.Description),
        CreatedDate: String(mod.CreatedDate),
        UpdatedDate: String(mod.UpdatedDate),
      },
      Categories,
      RelatedMods
    };

    modCache.set(cacheKey, response); 
    res.json(response);
    
  } catch (err) {
    console.error("❌ Error fetching mod by slug:", err);
    res.status(500).json({ status: 500, message: "Server Error", error: err.message });
  }
}
