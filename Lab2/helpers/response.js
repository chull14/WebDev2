
export function buildResponse(type, id, data, hit) {
    return {
        source: 'omdb',
        endpoint: `https://www.omdbapi.com/?i=${id}&plot=full`,
        cache: { hit: hit, key: `${type}:${id}` },
        fetchedAt: new Date().toISOString(),
        data: data,

    }
}