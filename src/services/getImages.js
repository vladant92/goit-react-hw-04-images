const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40885590-2ea7b34c06b5aa745c6ad6380';

export const getImages = (searchQuery, currentPage, imgPerPage) => {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: imgPerPage,
  });

  return fetch(`${BASE_URL}?${params}`);
};
