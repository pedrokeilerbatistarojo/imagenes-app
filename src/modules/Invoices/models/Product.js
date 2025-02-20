export const Product = (data) => ({
  uid: data.uid || '',
  idItemRemission: data.idItemRemission || '',
  id: data.id || null,
  price: data.price || 0,
  quantity: data.quantity || 0,
  reference: data.reference || '',
  description: data.description || '',
  predial: data.predial || '',
  discount: data.discount || 0,
  tax: data.tax || [],
  exonerations: data.exonerations || {}
});
