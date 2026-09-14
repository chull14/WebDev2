import { ObjectId } from 'mongodb';

export function checkString(string) {
    if (string === undefined || string === null) {
        throw 'Value is required';
    }
    if (typeof string !== 'string') {
        throw 'Must be a string';
    }
    string = string.trim();
    if (string.length === 0) {
        throw 'Cannot be empty';
    }
    return string;
}

export function checkId(value) {
    value = checkString(value);
    if (!ObjectId.isValid(value)) {
        throw 'Not a valid ID';
    }
    return value;
}

// recipe field validators
export const checkTitle = (title) => checkString(title);

export const checkIngredients = (ingredients) => {
    if (!Array.isArray(ingredients)) throw 'Ingredients must be an array';
    if (ingredients.length < 3) throw 'Recipe must have 3 or more ingredients';
    return ingredients.map((ing) => {
        ing = checkString(ing);
        if (ing.length < 3 || ing.length > 50) throw `Invalid ingredient: ${ing}`;
        return ing;
    });
};

export const checkSteps = (steps) => {
    if (!Array.isArray(steps)) throw 'Steps must be an array';
    if (steps.length < 5) throw 'Recipe must have 5 or more steps';
    return steps.map((step) => {
        step = checkString(step);
        if (step.length < 20) throw `Invalid step: ${step}`;
        return step;
    });
};

export const checkCookingSkill = (skill) => {
    skill = checkString(skill);
    const skills = ['Novice', 'Intermediate', 'Advanced'];
    if (!skills.includes(skill)) throw 'Cooking skill must be either Novice, Intermediate, or Advanced';
    return skill;
};