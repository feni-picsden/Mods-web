import db from "../config/db.js";

// Import utility functions for creating slugs
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function createCategorySlug(category) {
  if (!category) return '';
  const slug = createSlug(category);
  return `minecraft-${slug}`;
}

function createModSlug(modName) {
  if (!modName) return '';
  const slug = createSlug(modName);
  return `minecraft-${slug}`;
}

function createModUrl(category, modName) {
  const categorySlug = createCategorySlug(category);
  const modSlug = createModSlug(modName);
  return `/all/${categorySlug}/${modSlug}`;
}

export async function generateSitemap(req, res) {
  try {
    const [categories] = await db.promise().query(
      'SELECT DISTINCT cat_name FROM web_mods_category WHERE isActive = 1'
    );
    const [mods] = await db.promise().query(
      'SELECT id, Name, Category1 FROM web_mods_data WHERE Name IS NOT NULL AND Name != "" AND Category1 IS NOT NULL AND Category1 != ""'
    );

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/mods', priority: '0.9', changefreq: 'daily' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly'},
      { url: '/installation-steps', priority: '0.8', changefreq: 'monthly'},
      { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly'},
      { url: '/terms-of-use', priority: '0.5', changefreq: 'yearly'},
    ];

    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>https://modscraft.net${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    // Add category pages
    categories.forEach(category => {
      const categorySlug = createCategorySlug(category.cat_name);
      xml += '  <url>\n';
      xml += `    <loc>https://modscraft.net/all/${categorySlug}</loc>\n`;
      xml += '    <changefreq>daily</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });

    // Add mod pages with new URL structure
    mods.forEach(mod => {
      const modUrl = createModUrl(mod.Category1, mod.Name);
      xml += '  <url>\n';
      xml += `    <loc>https://modscraft.net${modUrl}</loc>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });

    // Close XML
    xml += '</urlset>';

    // Set content type to XML and send response
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error("❌ Error generating sitemap:", err);
    res.status(500).json({ status: 500, message: "Server Error" });
  }
} 