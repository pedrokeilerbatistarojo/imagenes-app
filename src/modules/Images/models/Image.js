export const Image = (data) => ({
  id: data.id || null,
  name: data.description || '',
  alt_description: data.alt_description || 'alt_description',
  selected: data.selected || false,
  urls: data.urls || [],
  seller: data.seller || null,
});
