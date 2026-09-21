/*
ALL FIELD VALIDATORS USED IN
DATA SUMMARY CONSTRUCTION
*/

export function checkField(field) {
    if (!field) return null;
    if (typeof field !== "string") throw 'Field must be a string';

    field = field.trim();
    if (field === "" || field === "N/A") return null;

    return field;
}

export function checkImdbId(expectedId, imdbId) {
    if (!imdbId) throw 'ImdbID must be available';
    if (typeof imdbId !== 'string') throw 'imdbID must be a string';

    if (!/^tt[0-9]{7,10}$/.test(imdbId)) throw 'Invalid ImdbID';
    if (imdbId !== expectedId) throw 'Requested ID does not match actual ID';

    return imdbId;
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

    const splitRuntime = runtime.split(' ');

    if (splitRuntime.length !== 2) throw 'Invalid runtime format';

    const [time, unit] = splitRuntime;
    if (unit !== 'min' || !/^\d+$/.test(time)) return null;

    const num = Number(time);
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

    if (!/^\$?(\d+|\d{1,3}(,\d{3})+)$/.test(s)) return null;
    const num = Number(value.replace(/[$,]/g, ''));
    return Number.isSafeInteger(num) && num >= 0 ? num : null;
}

export function checkPoster(url) {
    url = checkField(url);
    if (url === null) return null;

    try {
        const newUrl = new URL(url);
        return newUrl.protocol === 'http:' || url.protocol === 'https:' ? url : null;
    } catch {
        return null;
    }
}