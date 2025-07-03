import db from "../../config/db.js";

export async function getModDetail(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ status: 400, message: "Mod ID is required" });
    }

    const [modRows] = await db
      .promise()
      .query(
        'SELECT * FROM web_mods_data WHERE id = ? AND Name IS NOT NULL AND Name != ""',
        [id]
      );

    if (modRows.length === 0) {
      return res.status(404).json({ status: 404, message: "Mod not found" });
    }

    const mod = modRows[0];

    const DisplayImage = `${
      process.env.Download_data_url
    }/${mod.Category}/${mod.SubCategory.toLowerCase()}/${mod.Title_for_path}/${
      mod.DisplayImage
    }`;
    const SubImages = mod.SubImages
      ? mod.SubImages.split(",").map(
          (img) =>
            `${
              process.env.Download_data_url
            }/${mod.Category}/${mod.SubCategory.toLowerCase()}/${
              mod.Title_for_path
            }/${img.trim()}`
        )
      : [];

       // 4. Categories
    const [categoriesRaw] = await db.promise().query(
      'SELECT id,cat_name FROM web_mods_category WHERE isActive = 1 ORDER BY cat_clickcount DESC'
    );
     const Categories = categoriesRaw.map(category => ({
      id: String(category.id),
      Name: String(category.cat_name)
    }));

    // 5. Related Mods - Top 4 mods with high download count from same category
    let [relatedModsRaw] = await db.promise().query(
      `SELECT id, Name,Loaders, Category, Category1, SubCategory1, Version, DownloadCount, Likes, DisplayImage, Title_for_path, SubCategory 
       FROM web_mods_data 
       WHERE Category1 = ? AND id != ? AND Name IS NOT NULL AND Name != "" AND DisplayImage IS NOT NULL AND DisplayImage != ""
       ORDER BY CAST(DownloadCount AS UNSIGNED) DESC 
       LIMIT 5`,
      [mod.Category1, id]
    );
    
    
    if (relatedModsRaw.length < 4) {
      console.log("Not enough mods in same category, fetching popular mods...");
      const [additionalMods] = await db.promise().query(
        `SELECT id, Name,Loaders, Category, Category1, SubCategory1, Version, DownloadCount, Likes, DisplayImage, Title_for_path, SubCategory 
         FROM web_mods_data 
         WHERE id != ? AND Name IS NOT NULL AND Name != "" AND DisplayImage IS NOT NULL AND DisplayImage != ""
         ORDER BY CAST(DownloadCount AS UNSIGNED) DESC 
         LIMIT 5`,
        [id]
      );
      relatedModsRaw = additionalMods;
      console.log(`Fallback query result: ${relatedModsRaw.length} popular mods found`);
    }
    
    
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

    res.json({
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
        Version: String(mod.Version),
        CreatedDate: String(mod.CreatedDate),
        UpdatedDate: String(mod.UpdatedDate),
      },
       Categories,
       RelatedMods,
    });
  } catch (err) {
    console.error("❌ Error fetching mod details:", err);
    res.status(500).json({ status: 500, message: "Server Error" });
  }
}
