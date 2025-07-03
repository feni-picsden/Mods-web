import db from '../../config/db.js';

// Helper function to convert ISO string to MySQL datetime format
function formatDateForMySQL(isoString) {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export async function storeSearchKeyword(req, res) {
  try {
    const { keyword, timestamp } = req.body;

    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({ status: 400, message: 'Keyword is required' });
    }

    const searchKeyword = keyword.trim().toLowerCase();
    const searchTimestamp = timestamp ? formatDateForMySQL(timestamp) : formatDateForMySQL(new Date().toISOString());

    // First, check if this keyword already exists
    const checkQuery = `
      SELECT id, search_count FROM web_mods_search_keywords
      WHERE keyword = ?
    `;

    const [existingRows] = await db.promise().query(checkQuery, [searchKeyword]);

    if (existingRows.length > 0) {
      // Update existing keyword count
      const updateQuery = `
        UPDATE web_mods_search_keywords 
        SET search_count = search_count + 1, last_searched = ? 
        WHERE keyword = ?
      `;
      
      await db.promise().query(updateQuery, [searchTimestamp, searchKeyword]);

      res.json({
        status: 200,
        message: 'Search keyword updated successfully',
        keyword: searchKeyword,
        count: existingRows[0].search_count + 1
      });
    } else {
      // Insert new keyword
      const insertQuery = `
        INSERT INTO web_mods_search_keywords (keyword, search_count, first_searched, last_searched) 
        VALUES (?, 1, ?, ?)
      `;
      
      await db.promise().query(insertQuery, [searchKeyword, searchTimestamp, searchTimestamp]);

      res.json({
        status: 200,
        message: 'Search keyword stored successfully',
        keyword: searchKeyword,
        count: 1
      });
    }

  } catch (err) {
    console.error('❌ Error storing search keyword:', err);
    res.status(500).json({ status: 500, message: 'Server Error' });
  }
} 