/**
 * Creates a URL-friendly slug from a string
 * @param {string} text - The text to convert to a slug
 * @returns {string} - URL-friendly slug
 */
export const createSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-') 
    .replace(/^-|-$/g, ''); 
};

/**
 * @param {string} categoryName 
 * @returns {string} 
 */
export const createCategorySlug = (categoryName) => {
  if (!categoryName) return '';
  const slug = createSlug(categoryName);
  return `minecraft-${slug}`;
};

/**
 * Creates a mod slug with minecraft- prefix
 * @param {string} modTitle
 * @returns {string} 
 */
export const createModSlug = (modTitle) => {
  if (!modTitle) return '';
  const slug = createSlug(modTitle);
  return `minecraft-${slug}`;
};

/**
 * @param {string} categoryName - The category name
 * @param {string} modTitle - The mod title
 * @returns {string} - Full URL path for the mod
 */
export const createModUrl = (categoryName, modTitle) => {
  const categorySlug = createCategorySlug(categoryName);
  const modSlug = createModSlug(modTitle);
  return `/all/${categorySlug}/${modSlug}`;
};

/**
 * @param {string} slug - The slug to decode
 * @returns {string} - Decoded text
 */
export const decodeSlug = (slug) => {
  if (!slug) return '';
  
  // Remove minecraft- prefix if present
  let decodedSlug = slug;
  if (slug.startsWith('minecraft-')) {
    decodedSlug = slug.substring(10); // Remove 'minecraft-' prefix
  }
  
  return decodedSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}; 