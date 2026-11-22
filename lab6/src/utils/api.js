const BASE_URL = '/api/v1';
const LIMIT = 50;

export async function fetchList(resource, page, fields) {
    const url = `${BASE_URL}/${resource}?page=${page}&limit=${LIMIT}&fields=${fields}`;
    const response = await fetch(url);

    if (!response.ok) return null;
    const json = await response.json();

    if (!json.data || json.data.length === 0) return null;
    if (page > json.pagination.total_pages) return null;

    return json;
}

export async function fetchOne(resource, id) {
    const url = `${BASE_URL}/${resource}/${id}`;
    const response = await fetch(url);

    if (!response.ok) return null;
    const json = await response.json();

    return json;
}