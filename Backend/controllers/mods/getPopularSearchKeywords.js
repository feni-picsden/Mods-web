import db from '../../config/db.js';

export async function getPopularSearchKeywords(req, res) {
  try {
    const { limit = 10 } = req.query;

    const query = `
      SELECT keyword, search_count, last_searched
      FROM web_mods_search_keywords 
      WHERE search_count > 0
      ORDER BY search_count DESC, last_searched DESC
      LIMIT ?
    `;

    const [rows] = await db.promise().query(query, [parseInt(limit)]);

    const popularKeywords = rows.map(row => ({
      keyword: row.keyword,
      searchCount: row.search_count,
      lastSearched: row.last_searched
    }));

    res.json({
      status: 200,
      count: popularKeywords.length,
      keywords: popularKeywords
    });

  } catch (err) {
    console.error('❌ Error fetching popular search keywords:', err);
    res.status(500).json({ status: 500, message: 'Server Error' });
  }
} 