export function hasWhiteSpace(str: string) {
  return /\s/g.test(str);
}

export function hashStringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function removeVietnameseTones(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function slugify(str: string) {
  return removeVietnameseTones(str)
    .toLowerCase()
    .replace(/[^a-zA-Z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/ /g, '-');
}

export function toSnakeCase(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_');
}

export function getInitialName(firstName: string, lastName: string): string {
  return [firstName, lastName]
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}
