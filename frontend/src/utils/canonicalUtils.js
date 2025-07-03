export const setCanonicalTag = (url) => {
  const existingCanonical = document.querySelector('link[rel="canonical"]');
  if (existingCanonical) {
    existingCanonical.remove();
  }

  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = url;
  document.head.appendChild(canonical);
};

export const getBaseUrl = () => {
  return window.location.origin;
};

export const getCurrentPath = () => {
  return window.location.pathname;
};

export const buildCanonicalUrl = (path = '') => {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath.toLowerCase()}`;
}; 