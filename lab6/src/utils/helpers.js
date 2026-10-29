
export function validatePage(page) {
    if (!/^\d+$/.test(page)) return null;
    const pageNum = Number(page);

    if (pageNum < 1) return null;
    return pageNum;
};

export function getImage(iiifUrl, imageId) {
    if (!iiifUrl || !imageId) return null;
    return `${iiifUrl}/${imageId}/full/400,/0/default.jpg`;
};

export function checkValue(value) { 
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;

    return true;
};

export function idToTitle(ids, titles, label) {
    const valIds = Array.isArray(ids) ? ids : [];
    const valTitles = Array.isArray(titles) ? titles : [];

    return valIds.map((id, index) => ({
        id: id,
        title: checkValue(valTitles[index]) ? valTitles[index] : `${label} ${id}`
    }));
};

export function formatDate(date) {
    if (!checkValue(date)) return null;

    const valDate = new Date(date);
    if (isNaN(valDate.getTime())) return null;

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Chicago'
    });
}