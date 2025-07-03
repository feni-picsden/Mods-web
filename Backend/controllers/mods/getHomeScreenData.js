import db from "../../config/db.js";

// In-memory cache (can replace with Redis later)
let homeScreenCache = null;
let lastCacheTime = 0;
const CACHE_DURATION_MS = 60 * 1000; // 60 seconds

function mapMod(mod) {
  return {
    id: String(mod.id),
    Name: mod.Name,
    Loaders: mod.Loaders,
    Category: mod.Category1
    ? mod.Category1.charAt(0).toUpperCase() + mod.Category1.slice(1).toLowerCase()
    : '',
      Version: mod.Version || null,
    DownloadCount: String(mod.DownloadCount),
    DisplayImage: `${process.env.Download_data_url}/${mod.Category}/${mod.SubCategory.toLowerCase()}/${mod.Title_for_path}/${mod.DisplayImage}`,
  };
}

export default async function getHomeScreenData(req, res) {
  const now = Date.now();
  if (homeScreenCache && (now - lastCacheTime < CACHE_DURATION_MS)) {
    return res.json(homeScreenCache);
  }

  try {

    const latestQuery = `
      SELECT * FROM (
        SELECT id, Name,Loaders, Category, Category1, SubCategory,Version, DisplayImage, DownloadCount, Title_for_path,
               ROW_NUMBER() OVER (PARTITION BY Category1 ORDER BY CreatedDate DESC) AS rn
        FROM web_mods_data
        WHERE Name IS NOT NULL AND Name != '' AND Category1 IN ('Mods', 'Addon', 'Maps', 'Gun')
      ) AS ranked
      WHERE rn <= 7;
    `;

    const popularQuery = `
      SELECT * FROM (
        SELECT id, Name,Loaders, Version, Category, Category1, SubCategory, DisplayImage, DownloadCount, Title_for_path,
               ROW_NUMBER() OVER (PARTITION BY Category1 ORDER BY DownloadCount DESC) AS rn
        FROM web_mods_data
        WHERE Name IS NOT NULL AND Name != '' AND Category1 IN ('Mods', 'Addon', 'Maps', 'Gun')
      ) AS ranked
      WHERE rn <= 7;
    `;

    const browseAllQuery = `
      SELECT id, Name,Loaders, Version, Category, Category1, SubCategory, DisplayImage, DownloadCount, Title_for_path
      FROM web_mods_data
      WHERE Name IS NOT NULL AND Name != ''
      ORDER BY CreatedDate DESC
      LIMIT 7;
    `;

    const carouselQuery = `
      SELECT id, Name,Loaders, Description, Version, Category, Category1, SubCategory, DisplayImage,Likes, DownloadCount, Title_for_path
      FROM web_mods_data
      WHERE Name IS NOT NULL AND Name != '' 
      ORDER BY DownloadCount DESC
      LIMIT 5;
    `;

    const categoriesQuery = `
      SELECT id, cat_name FROM web_mods_category
      WHERE isActive = 1
      ORDER BY cat_clickcount DESC;
    `;

    const [[latestData], [popularData], [browseAllRaw], [carouselRaw], [categoriesRaw]] = await Promise.all([
      db.promise().query(latestQuery),
      db.promise().query(popularQuery),
      db.promise().query(browseAllQuery),
      db.promise().query(carouselQuery),
      db.promise().query(categoriesQuery),
    ]);

    const groupByCategory = (data) => {
      return data.reduce((acc, mod) => {
        const cat = mod.Category1?.toLowerCase();
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(mapMod(mod));
        return acc;
      }, {});
    };

    const latestGrouped = groupByCategory(latestData);
    const popularGrouped = groupByCategory(popularData);
    const Browse_all = browseAllRaw.map(mapMod);
    const Trending_carousel = carouselRaw.map((mod) => ({
      id: String(mod.id),
      Name: String(mod.Name),
      Loaders: mod.Loaders,
      Category: mod.Category1
        ? mod.Category1.charAt(0).toUpperCase() + mod.Category1.slice(1).toLowerCase()
        : '',
      Description: String(mod.Description || ''),
      Version: mod.Version || null,
      DownloadCount: String(mod.DownloadCount),
      DisplayImage: `${process.env.Download_data_url}/${mod.Category}/${mod.SubCategory.toLowerCase()}/${mod.Title_for_path}/${mod.DisplayImage}`,
    }));
    
    const Categories = categoriesRaw.map(cat => ({
      id: String(cat.id),
      Name: cat.cat_name,
    }));

    const response = {
      status: 200,
      Latest_mods: latestGrouped.mods || [],
      Latest_addons: latestGrouped.addon || [],
      Latest_maps: latestGrouped.maps || [],
      Latest_guns: latestGrouped.gun || [],
      Popular_mods: popularGrouped.mods || [],
      Popular_addons: popularGrouped.addon || [],
      Popular_maps: popularGrouped.maps || [],
      Popular_guns: popularGrouped.gun || [],
      Browse_all,
      Trending_carousel,
      Categories,
    };
    homeScreenCache = response;
    lastCacheTime = now;
    res.json(response);
  } catch (err) {
    console.error("❌ Error fetching home screen data:", err);
    res.status(500).json({ status: 500, message: "Server Error" });
  }
}

