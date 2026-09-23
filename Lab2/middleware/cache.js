import client from '../config/client.js';
import { buildResponse } from '../helpers/response.js';

// check cache
export function checkCache(type) {
    return async (req, res, next) => {
        const id = req.params.id.trim();

        if (!/^tt[0-9]{7,10}$/.test(id)) {
            return res.status(400).json({ error: 'Invalid id' });
        };

        const inCache = await client.get(`${type}:${id}`);
        if (inCache) {
            if (type === 'movie') {
                await client.lPush('recentlyViewedMovies', `${id}:${Date.now()}`);
                await client.lTrim('recentlyViewedMovies', 0, 19);
            };
            
            return res.json(buildResponse(type, id, JSON.parse(inCache), true));
        };
        next();
    }
}