-- Create search_keywords table for storing search analytics
CREATE TABLE IF NOT EXISTS web_mods_search_keywords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  search_count INT DEFAULT 1,
  first_searched DATETIME NOT NULL,
  last_searched DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_keyword (keyword),
  INDEX idx_search_count (search_count DESC),
  INDEX idx_last_searched (last_searched DESC)
);

-- Optional: Create a view for popular search terms
CREATE OR REPLACE VIEW popular_search_keywords AS
SELECT 
  keyword,
  search_count,
  first_searched,
  last_searched,
  DATEDIFF(NOW(), first_searched) as days_since_first_search
FROM web_mods_search_keywords 
WHERE search_count > 1
ORDER BY search_count DESC, last_searched DESC
LIMIT 100; 