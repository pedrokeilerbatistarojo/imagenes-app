export const Seller = (data) => ({
  id: data.id || null,
  name: data.name || '',
  identification: data.identification || null,
  observations: data.observations || '',
  status: data.status === 'active' ? 'Activo' : 'Inactivo',
});
