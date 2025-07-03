
/**
 * Capitalizes the first letter of each word in a string
 * @param {string} text - The text to capitalize
 * @returns {string} - Text with first letter of each word capitalized
 */
export const capitalizeWords = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Capitalizes only the first letter of the entire string
 * @param {string} text - The text to capitalize
 * @returns {string} - Text with first letter capitalized
 */
export const capitalizeFirst = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formats category name for display in breadcrumbs
 * @param {string} categoryName - The category name to format
 * @returns {string} - Formatted category name
 */
export const formatCategoryName = (categoryName) => {
  if (!categoryName) return '';
  
  // Replace hyphens and underscores with spaces, then capitalize each word
  return categoryName
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Formats mod title for display
 * @param {string} modTitle - The mod title to format
 * @returns {string} - Formatted mod title
 */
export const formatModTitle = (modTitle) => {
  if (!modTitle) return '';
  
  // Replace hyphens and underscores with spaces, then capitalize each word
  return modTitle
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}; 