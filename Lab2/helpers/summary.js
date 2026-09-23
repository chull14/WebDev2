import { 
    checkBox, 
    checkImdbId, 
    checkPoster, 
    checkRating, 
    checkRuntime, 
    checkSznEp, 
    checkTitle, 
    checkTotalSzn, 
    checkType, 
    deconstructFieldArray,
    checkYearPlotRated,
    checkSeriesId 
} from "./normalization.js";


export function movieSummary(omdb, requestedId) {
    const type = checkType(omdb.Type);
    if (type !== 'movie') throw `Expected movie, got ${type}`;

    return {
        id: checkImdbId(requestedId, omdb.imdbID),
        title: checkTitle(omdb.Title),
        type: checkType(omdb.Type),
        year: checkYearPlotRated(omdb.Year),
        rated: checkYearPlotRated(omdb.Rated),
        runtimeMinutes: checkRuntime(omdb.Runtime),
        genres: deconstructFieldArray(omdb.Genre),
        directors: deconstructFieldArray(omdb.Director),
        plot: checkYearPlotRated(omdb.Plot),
        posterUrl: checkPoster(omdb.Poster),
        imdbRating: checkRating(omdb.imdbRating),
        boxOffice: checkBox(omdb.BoxOffice)
    };
}

export function seriesSummary(omdb, requestedId) {
    const type = checkType(omdb.Type);
    if (type !== 'series') throw `Expected series, got ${type}`;

    return {
        id: checkImdbId(requestedId, omdb.imdbID),
        title: checkTitle(omdb.Title),
        type: checkType(omdb.Type),
        year: checkYearPlotRated(omdb.Year),
        rated: checkYearPlotRated(omdb.Rated),
        runtimeMinutes: checkRuntime(omdb.Runtime),
        genres: deconstructFieldArray(omdb.Genre),
        actors: deconstructFieldArray(omdb.Actors),
        plot: checkYearPlotRated(omdb.Plot),
        posterUrl: checkPoster(omdb.Poster),
        imdbRating: checkRating(omdb.imdbRating),
        totalSeasons: checkTotalSzn(omdb.totalSeasons)
    };
}

export function episodeSummary(omdb, requestedId) {
    const type = checkType(omdb.Type);
    if (type !== 'episode') throw `Expected episode, got ${type}`;

    return {
        id: checkImdbId(requestedId, omdb.imdbID),
        title: checkTitle(omdb.Title),
        type: checkType(omdb.Type),
        year: checkYearPlotRated(omdb.Year),
        rated: checkYearPlotRated(omdb.Rated),
        runtimeMinutes: checkRuntime(omdb.Runtime),
        genres: deconstructFieldArray(omdb.Genre),
        directors: deconstructFieldArray(omdb.Director),
        plot: checkYearPlotRated(omdb.Plot),
        posterUrl: checkPoster(omdb.Poster),
        imdbRating: checkRating(omdb.imdbRating),
        seriesId: checkSeriesId(omdb.seriesID),
        season: checkSznEp(omdb.Season),
        episodeNumber: checkSznEp(omdb.Episode)
    };
}
