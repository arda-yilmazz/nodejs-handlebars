export function slug(str) {
    return str
        .toUpperCase()
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
}