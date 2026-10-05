
export function parseDate(date) {
    const [month, day, year] = date.split('/').map(Number);
    return new Date(year, month - 1, day);
}