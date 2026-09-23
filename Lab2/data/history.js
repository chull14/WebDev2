import client from '../config/client.js';
import { getMovieById } from './omdb.js';
import { buildResponse } from '../helpers/response.js';


function validateEntry(entry) {
    if (typeof entry !== "string") throw err(400, 'Invalid Entry');

    const parsed = entry.split(':');
    if (parsed.length !== 2) throw err(400, 'Invalid Entry');

    const id = parsed[0];
    const viewedAt = parsed[1];

    if (!/^tt[0-9]{7,10}$/.test(id)) throw err(400, 'Invalid ID');
    if (!/^\d+$/.test(viewedAt)) throw err(400, 'Invalid Timestamp');
    if (!Number.isSafeInteger(Number(viewedAt))) throw err(400, 'Invalid Timestamp');

    return { id, viewedAt: new Date(Number(viewedAt)).toISOString() };
};

async function getMovieInCache(id) {
    const inCache = await client.get(`movie:${id}`);
    if (inCache) return { data: JSON.parse(inCache), hit: true };

    const data = await getMovieById(id);
    await client.set(`movie:${id}`, JSON.stringify(data));
    return { data: data, hit: false };
};

export async function getHistory() {
    const topTwenty = await client.lRange('recentlyViewedMovies', 0, 19);
    const result = [];

    for (const entry of topTwenty) {
        const { id, viewedAt } = validateEntry(entry);
        const { data, hit } = await getMovieInCache(id);
        result.push({
            viewedAt: viewedAt,
            id: id,
            movie: buildResponse('movie', id, data, hit)
        });
    }

    return result;
};