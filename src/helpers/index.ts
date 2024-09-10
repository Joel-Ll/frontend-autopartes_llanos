export const normalizeName = (name: string) => {
  return name.trim().toLocaleLowerCase().replace(/\s+/g, ' ');
}

export const capitalizeFirstLetter = (parameter: string) => {
  return parameter.charAt(0).toUpperCase() + parameter.slice(1);
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  };

  return date.toLocaleDateString('es-ES', options);
}