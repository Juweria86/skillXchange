export const getFullImageUrl = (path: string) => {
  if (!path) return '';

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${import.meta.env.VITE_API_BASE_URL}/uploads/${path}`;
};
