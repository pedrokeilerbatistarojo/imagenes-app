export const Seller = (data) => ({
  id: data.id || null,
  avatar: data.avatar || '',
  name: data.name || '',
  identification: data.identification || null,
  observations: data.observations || '',
  status: data.status === 'active' ? 'Activo' : 'Inactivo',
  images: data.images || [],
});
