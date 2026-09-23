import 'dotenv/config';
import { 
    movieSummary, 
    episodeSummary, 
    seriesSummary 
} from '../helpers/summary.js';
import { err } from '../helpers/errors.js';

async function fetchTitle(id) {
    if (typeof id !== "string") throw err(400, 'Invalid ID');

    id = id.trim();
    if (!/^tt[0-9]{7,10}$/.test(id)) throw err(400, 'Invalid ID');

    const key = process.env.OMDB_API_KEY;
    const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`;

    let res;
    try {
        res = await fetch(url);
    } catch {
        throw err(503, 'Could not fetch OMDb');
    }
    if (!res.ok) throw err(502, 'Bad Response');

    let omdb;
    try {
        omdb = await res.json();
    } catch (error) {
        throw err(502, 'Bad Response')
    }

    if (omdb.Response === "False") throw err(404, 'Not Found');
    return { omdb, id };
}

export async function getMovieById(omdbId) {
    const { omdb, id } = await fetchTitle(omdbId);
    if (omdb.Type !== "movie") throw err(404, 'Not Found');
    return movieSummary(omdb, id);
}

export async function getSeriesById(omdbId) {
    const { omdb, id } = await fetchTitle(omdbId);
    if (omdb.Type !== "series") throw err(404, 'Not Found');
    return seriesSummary(omdb, id);
}

export async function getEpisodeById(omdbId) {
    const { omdb, id } = await fetchTitle(omdbId);
    if (omdb.Type !== "episode") throw err(404, 'Not Found');
    return episodeSummary(omdb, id);
}
