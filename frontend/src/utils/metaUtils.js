export const updateMetaTags = (title, description, image = '') => {
  // Update page title
  document.title = title;
  
  // Helper function to update or create meta tag
  const updateMetaTag = (name, content, property = false) => {
    let meta = property 
      ? document.querySelector(`meta[property="${name}"]`)
      : document.querySelector(`meta[name="${name}"]`);
      
    if (!meta) {
      meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  // Basic meta description
  updateMetaTag('description', description);

  // Open Graph meta tags
  updateMetaTag('og:title', title, true);
  updateMetaTag('og:description', description, true);
  updateMetaTag('og:type', 'website', true);
  if (image) {
    updateMetaTag('og:image', image, true);
  }
  updateMetaTag('og:site_name', 'CurseForge', true);

  // Twitter Card meta tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', title);
  updateMetaTag('twitter:description', description);
  if (image) {
    updateMetaTag('twitter:image', image);
  }
  updateMetaTag('twitter:site', '@CurseForge');
}; 