import { Router } from 'express';
import { 
    getAllRecipes, 
    getRecipeById, 
    createRecipe, 
    updateRecipe, 
    createComment, 
    deleteComment, 
    likeRecipe 
} from '../data/recipes.js';
import { checkString, checkCookingSkill, checkId, checkIngredients, checkSteps, checkTitle } from '../helpers/validators.js';
import { requireLogin } from '../middleware/auth.js';
import { sendError } from '../helpers/errors.js';

const router = Router();

// GET /recipes
router.get('/', async function (req, res) {
    let page = req.query.page === undefined ? 1 : req.query.page;

    page = Number(page);
    if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({ error: 'Page must be a positive integer' });
    };

    try {
        const recipes = await getAllRecipes(page);
        return res.status(200).json(recipes);
    } catch (e) {
        return sendError(res, e);
    }
});

// GET /recipes/:id
router.get('/:id', async function (req, res) {
    let recipeId = req.params.id;

    try {
        recipeId = checkId(recipeId);
    } catch (e) {
        return sendError(res, e);
    };

    try {
        const recipe = await getRecipeById(recipeId);
        return res.status(200).json(recipe);
    } catch (e) {
        return sendError(res, e);
    };
});

// POST /recipes
router.post('/', requireLogin, async function (req, res) {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ error: 'Must provide full recipe details' });
    };

    let title, ingredients, cookingSkillRequired, steps;
    let userId;
    try {
        ({ title, ingredients, cookingSkillRequired, steps } = body);
        userId = req.session.user._id;
        title = checkTitle(title);
        ingredients = checkIngredients(ingredients);
        cookingSkillRequired = checkCookingSkill(cookingSkillRequired);
        steps = checkSteps(steps);
    } catch (e) {
        return sendError(res, e);
    }

    try {
        const newRecipe = await createRecipe({ title, ingredients, cookingSkillRequired, steps, userId });
        return res.status(201).json(newRecipe);
    } catch (e) {
        return sendError(res, e);
    }
});

// PATCH /recipes/:id
router.put('/:id', requireLogin, async function (req, res) {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ error: 'Must provide all updated details' });
    };

    let recipeId, userId;
    const updateObject = {};
    try {
        recipeId = checkId(req.params.id);
        userId = req.session.user._id;

        if ('title' in body) updateObject.title = checkTitle(body.title);
        if ('ingredients' in body) updateObject.ingredients = checkIngredients(body.ingredients);
        if ('cookingSkillRequired' in body) updateObject.cookingSkillRequired = checkCookingSkill(body.cookingSkillRequired);
        if ('steps' in body) updateObject.steps = checkSteps(body.steps);
    } catch (e) {
        return sendError(res, e);
    }

    try {
        const updated = await updateRecipe(userId, recipeId, body);
        return res.status(200).json(updated);
    } catch (e) {
        return sendError(res, e);
    }
});

// POST /recipes/:id/comments
router.post('/:id/comments', requireLogin, async function (req, res) {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ error: 'Must provide the comment to post' });
    };

    let recipeId, userId, comment;
    try {
        recipeId = checkId(req.params.id);
        userId = req.session.user._id;
        comment = checkString(body.comment);
    } catch (e) {
        return sendError(res, e);
    };

    try {
        const updatedRecipe = await createComment(recipeId, userId, comment);
        return res.status(201).json(updatedRecipe);
    } catch (e) {
        return sendError(res, e);
    }
});

// DELETE /:recipeid/:commentid
router.delete('/:recipeid/:commentid', requireLogin, async function (req, res) {
    let recipeId, commentId, userId;
    try {
        recipeId = checkId(req.params.recipeid);
        commentId = checkId(req.params.commentid);
        userId = req.session.user._id;
    } catch (e) {
        return sendError(res, e);
    }

    try {
        const updatedRecipe = await deleteComment(commentId, recipeId, userId);
        return res.status(200).json(updatedRecipe);
    } catch (e) {
        return sendError(res, e);
    }
});

// POST /:id/likes
router.post('/:id/likes', requireLogin, async function (req, res) {
    let recipeId, userId;
    try {
        recipeId = checkId(req.params.id);
        userId = req.session.user._id;
    } catch (e) {
        return sendError(res, e);
    }

    try {
        const updatedRecipe = await likeRecipe(recipeId, userId);
        return res.status(200).json(updatedRecipe);
    } catch (e) {
        return sendError(res, e);
    }
});

export default router;
