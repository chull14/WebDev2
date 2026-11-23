import validator from 'validator';

// date helpers
export function parseDate(date) {
    const [month, day, year] = date.split('/').map(Number);
    return new Date(year, month - 1, day);
}


// MM/DD/YYYY format
export function toMMDDYYYY(inputValue) {
    if (!inputValue) return '';

    const [year, month, day] = inputValue.split('-');
    return `${month}/${day}/${year}`;
};

// input date format
export function toInputDate(date) {
    if (!date) return '';

    const [month, day, year] = date.split('/');
    return `${year}-${month}-${day}`;
}

export function getToday() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${month}/${day}/${today.getFullYear()}`;
}

// VALDIATORS
export function checkString(string, fieldName) {
    if (string == undefined) throw new Error(`${fieldName} is required.`);
    if (typeof string !== 'string') throw new Error(`${fieldName} must be text.`);

    const trimmed = string.trim();
    if (trimmed.length === 0) throw new Error(`${fieldName} cannot be empty.`);

    return trimmed;
};

export function validateEmail(email, fieldName) {
    email = checkString(email, fieldName);

    if (!validator.isEmail(email)) throw new Error('Please enter a valid email address.');
    return email;
};

export function validatePhone(phone, fieldName) {
    phone = checkString(phone, fieldName);

    if (!/^\d{3}-\d{3}-\d{4}$/.test(phone)) throw new Error('Phone number must use the ###-###-#### format.');
    return phone;
};

export function validateDate(date, fieldName) {
    date = checkString(date, fieldName);

    if (!validator.isDate(date, { format: 'MM/DD/YYYY', strictMode: true, delimiters: ['/'] })) {
        throw new Error(`${fieldName} must be a valid date in MM/DD/YYYY format.`);
    }

    return date;
};

export function validateDateJoined(date, fieldName) {
    date = validateDate(date, fieldName);
    const dateParsed = parseDate(date);

    if (dateParsed.getFullYear() < 1900) throw new Error(`${fieldName} must be in 1900 or later.`);

    const today = new Date();
    if (dateParsed > today) throw new Error(`${fieldName} cannot be in the future.`);

    return date;
};

export function validateDOB(dob, fieldName) {
    dob = validateDate(dob, fieldName);
    const dobParsed = parseDate(dob);
    const today = new Date();

    let age = today.getFullYear() - dobParsed.getFullYear();
    if (today.getMonth() < dobParsed.getMonth() ||
        (today.getMonth() === dobParsed.getMonth() && today.getDate() < dobParsed.getDate())) {
        age = age - 1;
    };

    if (age < 16 || age > 120) {
        throw new Error('Participants must be between 16 and 120 years old.');
    };

    return dob;
};

export function validateDuration(duration) {
    const value = Number(duration);
    if (String(duration).trim() === '' || !Number.isInteger(value) || value < 1 || value > 40) {
        throw new Error('Duration must be a whole number between 1 and 40.');
    }
    return value;
};


export function validateDateRange(start, end) {
    start = start || '01/01/1900';
    end = end || getToday();

    start = validateDate(start, 'Start date');
    end = validateDate(end, 'End date');

    if (parseDate(start) > parseDate(end)) throw new Error('Start date cannot be after end date.');
    return { start, end };
};

export function validateWorkshopDates(open, close, start, end) {
    const registrationOpen = validateDate(open, 'Registration open date');
    const registrationClose = validateDate(close, 'Registration close date');
    const workshopStart = validateDate(start, 'Workshop start date');
    const workshopEnd = validateDate(end, 'Workshop end date');

    open = parseDate(registrationOpen);
    close = parseDate(registrationClose);
    start = parseDate(workshopStart);
    end = parseDate(workshopEnd);

    if (open >= close) throw new Error('Registration must open before it closes.');
    if (close > start) throw new Error('Registration must close on or before the workshop starts.');
    if (start > end) throw new Error('The workshop must start on or before it ends.');

    return { registrationOpen, registrationClose, workshopStart, workshopEnd };
};

// PATCH validation
export function validateChanges(original, values) {
    const changes = {};

    for (const key of Object.keys(values)) {
        const value = typeof values[key] === 'string' ? values[key].trim() : values[key];
        if (value !== original[key]) changes[key] = value;
    }

    if (Object.keys(changes).length === 0) throw new Error('You must change at least one field.');

    return changes;
};