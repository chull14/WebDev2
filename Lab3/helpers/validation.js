import { GraphQLError } from "graphql";
import { ObjectId } from "mongodb";
import validator from 'validator';

import { parseDate } from "./helpers.js";

export const badInput = (message) => 
    new GraphQLError(message, { extensions: { code: 'BAD_USER_INPUT' } });

export const notFound = (message) => 
    new GraphQLError(message, { extensions: { code: 'NOT_FOUND' } });


export function checkString(string, fieldName) {
    if (string == undefined) throw badInput(`${fieldName} should be defined`);
    if (typeof string !== 'string') throw badInput(`${fieldName} must be of type string`);

    const trimmed = string.trim();
    if (trimmed.length === 0) throw badInput(`${fieldName} cannot be empty or just spaces`);

    return trimmed;
};

export function validateEmail(email, fieldName) {
    email = checkString(email, fieldName);
    if (!validator.isEmail(email)) throw badInput(`${fieldName} must be a valid email address`);
    return email;
};

export function validatePhone(phone, fieldName) {
    phone = checkString(phone, fieldName);
    if (!/^\d{3}-\d{3}-\d{4}$/.test(phone)) throw badInput(`${fieldName} must be in ###-###-#### format`);
    return phone;
};

export function validateDate(date, fieldName) {
    date = checkString(date, fieldName);
    if (!validator.isDate(date, {format: 'MM/DD/YYYY', strictMode: true, delimiters: ['/']})) {
        throw badInput(`${fieldName} must be a valid date in MM/DD/YYYY format`);
    }
    return date;
};

export function validateDateJoined(date, fieldName) {
    date = validateDate(date, fieldName);
    const dateParsed = parseDate(date);

    if (dateParsed.getFullYear() < 1900) throw badInput(`${fieldName} year must be 1900 or later`);

    const today = new Date();
    if (dateParsed > today) throw badInput(`${fieldName} must not be in the future`);

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
        throw badInput(`${fieldName} must make the participant between 16 and 120 years old`);
    };

    return dob;
};

export function validateMember(member, fieldName) {
    member = checkString(member, fieldName);
    const validMembers = ['standard', 'premium'];

    if (!validMembers.includes(member.toLowerCase())) throw badInput(`${fieldName} must be STANDARD or PREMIUM`);
    return member.toUpperCase();
};

export function validateDuration(duration, fieldName) {
    if (!Number.isInteger(duration)) throw badInput(`${fieldName} must be an integer`);
    if (duration < 1 || duration > 40) throw badInput(`${fieldName} must be between 1 and 40`);

    return duration;
};

export function validateId(id, fieldName) {
    id = checkString(id, fieldName);
    if (!ObjectId.isValid(id)) throw badInput(`${fieldName} is not a valid ID`);
    return id;
};

export function validateDateRange(start, end) {
    start = validateDate(start, 'start');
    end = validateDate(end, 'end');
    const startParsed = parseDate(start);
    const endParsed = parseDate(end);

    if (startParsed > endParsed) throw badInput('start cannot be after end');
    return { start, end };
};

export function validateWorkshopDates(open, close, start, end) {
    const registrationOpen = validateDate(open, 'registration_open');
    const registrationClose = validateDate(close, 'registration_close');
    const workshopStart = validateDate(start, 'workshop_start');
    const workshopEnd = validateDate(end, 'workshop_end');

    open = parseDate(registrationOpen);
    close = parseDate(registrationClose);
    start = parseDate(workshopStart);
    end = parseDate(workshopEnd);

    if (open >= close) throw badInput('registration_open must be before registration_close');
    if (close > start) throw badInput('registration_close must be on or before workshop_start');
    if (start > end) throw badInput('workshop_start must be on or before workshop_end');

    return { registrationOpen, registrationClose, workshopStart, workshopEnd };
};

export function validateArgs(args) {
    const updateFields = Object.keys(args).filter(
        (key) => key !== '_id' && args[key] !== undefined
    );

    if (updateFields.length === 0) throw badInput('You must provide at least one field to update');
    return updateFields;
};