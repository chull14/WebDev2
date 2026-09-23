import { Router } from 'express';
import {
    getMovieById,
    getSeriesById,
    getEpisodeById
} from '../data/omdb.js';
import client from '../config/client.js';
import { buildResponse } from '../helpers/response.js';
import { checkCache } from '../middleware/cache.js';
import { getHistory } from '../data/history.js';
import { sendError } from '../helpers/errors.js';

const router = Router();

// GET history
router.get('/movies/history', async function (req, res) {
    try {
        return res.json(await getHistory());
    } catch (e) {
        return sendError(res, e);
    }
});

// GET movie
router.get('/movies/:id', checkCache('movie'), async function (req, res) {
    const id = req.params.id.trim();

    if (!/^tt[0-9]{7,10}$/.test(id)) {
        return res.status(400).json({ error: 'Invalid id' });
    };

    try {
        const summary = await getMovieById(id);
        await client.set(`movie:${id}`, JSON.stringify(summary));
        await client.lPush('recentlyViewedMovies', `${id}:${Date.now()}`);
        await client.lTrim('recentlyViewedMovies', 0, 19);
        return res.json(buildResponse('movie', id, summary, false));
    } catch (e) {
        return sendError(res, e);
    };
});

// GET series
router.get('/series/:id', checkCache('series'), async function (req, res) {
    const id = req.params.id.trim();

    if (!/^tt[0-9]{7,10}$/.test(id)) {
        return res.status(400).json({ error: 'Invalid id' });
    };

    try {
        const summary = await getSeriesById(id);
        await client.set(`series:${id}`, JSON.stringify(summary));
        return res.json(buildResponse('series', id, summary, false));
    } catch (e) {
        return sendError(res, e);
    };
});

// GET episode
router.get('/episodes/:id', checkCache('episode'), async function (req, res) {
    const id = req.params.id.trim();

    if (!/^tt[0-9]{7,10}$/.test(id)) {
        return res.status(400).json({ error: 'Invalid id' });
    };

    try {
        const summary = await getEpisodeById(id);
        await client.set(`episode:${id}`, JSON.stringify(summary));
        return res.json(buildResponse('episode', id, summary, false));
    } catch (e) {
        return sendError(res, e);
    };
});

export default router;