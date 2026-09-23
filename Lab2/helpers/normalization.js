/*
ALL FIELD VALIDATORS USED IN
DATA SUMMARY CONSTRUCTION
*/

export function checkField(field) {
    if (typeof field !== "string") return null;

    field = field.trim();
    if (field === "" || field === "N/A") return null;

    return field;
}

export function checkImdbId(expectedId, requestedId) {
    if (!requestedId) throw 'ImdbID must be available';
    if (typeof requestedId !== 'string') throw 'imdbID must be a string';

    if (!/^tt[0-9]{7,10}$/.test(requestedId)) throw 'Invalid ImdbID';
    if (requestedId !== expectedId) throw 'Requested ID does not match actual ID';

    return requestedId;
}

export function checkTitle(title) {
    title = checkField(title);
    if (!title) throw 'Title must be available';
    return title;
}

export function checkType(type) {
    type = checkField(type);
    if (!type) throw 'Type must be available';

    const validTypes = ["movie", "series", "episode"];
    if (!validTypes.includes(type)) throw `Invalid type ${type}`;

    return type;
}

export function checkYearPlotRated(value) {
    value = checkField(value);
    if (!value) return null;
    return value;
}

export function deconstructFieldArray(fieldArray) {
    fieldArray = checkField(fieldArray);
    if (!fieldArray) return [];

    const splitArray = fieldArray
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s != "" && s != "N/A");

    return [...new Set(splitArray)].sort();
}

export function checkRuntime(runtime) {
    runtime = checkField(runtime);
    if (runtime === null) return null;

    const match = /^(\d+)\s+min$/.exec(runtime);
    if (!match) return null;

    const num = Number(match[1]);
    return Number.isSafeInteger(num) ? num : null;
}

export function checkRating(rating) {
    rating = checkField(rating);
    if (rating === null) return null;

     if (!/^\d+(\.\d+)?$/.test(rating)) return null;
    const num = Number(rating);
    return num >= 0 && num <= 10 ? num : null;
}

export function checkTotalSzn(total) {
    total = checkField(total);
    if (total === null) return null;

    if (!/^\d+$/.test(total)) return null;
    const num = Number(total);
    return Number.isSafeInteger(num) && num > 0 ? num : null;
}

export function checkSznEp(number) {
    number = checkField(number);
    if (number === null) return null;

    if (!/^\d+$/.test(number)) return null;
    const num = Number(number);
    return Number.isSafeInteger(num) && num >= 0 ? num : null;
}

export function checkBox(value) {
    value = checkField(value);
    if (value === null) return null;

    if (!/^\$?(\d+|\d{1,3}(,\d{3})+)$/.test(value)) return null;
    const num = Number(value.replace(/[$,]/g, ''));
    return Number.isSafeInteger(num) && num >= 0 ? num : null;
}

export function checkPoster(url) {
    url = checkField(url);
    if (url === null) return null;

    try {
        const newUrl = new URL(url);
        return newUrl.protocol === 'http:' || newUrl.protocol === 'https:' ? url : null;
    } catch {
        return null;
    }
}

export function checkSeriesId(id) {
    id = checkField(id);
    if (!id) return null;
    return /^tt[0-9]{7,10}$/.test(id) ? id : null;
}

