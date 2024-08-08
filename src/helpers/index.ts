export const normalizeName = (name: string) => {
  return name.trim().toLocaleLowerCase().replace(/\s+/g, ' ');
}

export const capitalizeFirstLetter = (parameter: string) => {
  return parameter.charAt(0).toUpperCase() + parameter.slice(1);
}