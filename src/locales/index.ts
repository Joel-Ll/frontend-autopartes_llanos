export const productsStatus = [
  { label: 'Sin gestionar', status: 'notManaged' },
  { label: 'Disponible', status: 'available' },
  { label: 'No disponible', status: 'notAvailable' },
  { label: 'Pocas unidades', status: 'lowStock' },
];

export const statusDictionary = productsStatus.reduce((acc, curr) => {
  acc[curr.status] = curr.label;
  return acc;
}, {} as { [key: string]: string });

export const colorStatusStatus: { color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning', status: string }[] = [
  { color: 'default', status: 'notManaged' },
  { color: 'success', status: 'available' },
  { color: 'error', status: 'notAvailable' },
  { color: 'warning', status: 'lowStock' },
];

export const colorStatus = colorStatusStatus.reduce((acc, curr) => {
  acc[curr.status] = curr.color;
  return acc;
}, {} as { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' });