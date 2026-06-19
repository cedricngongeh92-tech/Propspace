export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '';
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');

  return `${baseUrl}${imagePath}`;
};
