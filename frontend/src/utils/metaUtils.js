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

  updateMetaTag('description', description);

  updateMetaTag('og:title', title, true);
  updateMetaTag('og:description', description, true);
  updateMetaTag('og:type', 'website', true);
  updateMetaTag('og:site_name', 'CurseForge', true);

  updateMetaTag('twitter:title', title);
  updateMetaTag('twitter:description', description);
  updateMetaTag('twitter:site', '@CurseForge');
}; 