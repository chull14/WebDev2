import { recipes, users } from "../config/mongoCollections.js";
import { checkId, checkString, checkTitle, checkSteps, checkCookingSkill, checkIngredients } from "../helpers/validators.js";
import { err } from '../helpers/errors.js';
import { ObjectId } from "mongodb";

export async function getAllRecipes(page = 1) { // GET
    page = Number(page);
    if (!Number.isInteger(page) || page < 1) throw 'Page must be a positive integer';

    const recipeCol = await recipes();
    const fiftyRecipes = await recipeCol
        .aggregate([
                { $skip : 50 * (page-1) },
                { $limit : 50 }
        ]).toArray();
    
    if (fiftyRecipes.length === 0) throw err(404, `No recipes found on page ${page}`);
    // this should throw a 404 error if recipes aren't found on a page
    
    return fiftyRecipes;
}

export async function getRecipeById(id) { // GET
    if (id === undefined) throw 'Must have an id';

    id = checkId(id);

    const recipeCol = await recipes();
    const recipe = await recipeCol.findOne({ _id: new ObjectId(id) });

    if (!recipe) throw err(404, `Recipe with ID: ${id} not found`);
    // this should throw 404 if no recipe is found

    recipe._id = recipe._id.toString();

    return recipe;
}

export async function createRecipe({ title, ingredients, cookingSkillRequired, steps, userId }) { // POST
    if (title === undefined) throw 'Must havae a title';
    if (ingredients === undefined) throw 'Must have ingredients';
    if (cookingSkillRequired === undefined) throw 'Must have cooking skill';
    if (steps === undefined) throw 'Must have steps';
    if (userId === undefined) throw 'Must have user ID';

    userId = checkId(userId);

    // title validation
    title = checkTitle(title);
    // ingredients vaidation
    ingredients = checkIngredients(ingredients);
    // steps validation
    steps = checkSteps(steps);
    // cookingSkill validation
    cookingSkillRequired = checkCookingSkill(cookingSkillRequired);

    // get user that posted
    const userCol = await users();
    const userPosted = await userCol.findOne({ _id: new ObjectId(userId) });
    if (userPosted === null) throw `User ID: ${userId} not found`;

    const recipeCol = await recipes();
    const newRecipe = {
        _id: new ObjectId(),
        title: title,
        ingredients: ingredients,
        cookingSkillRequired: cookingSkillRequired,
        steps: steps,
        userThatPosted: { _id: userPosted._id, username: userPosted.username },
        comments: [],
        likes: []
    };

    await recipeCol.insertOne(newRecipe);
    return newRecipe;
}

export async function updateRecipe(userId, recipeId, updateObject) { // PATCH
    if (userId === undefined) throw 'Must provide a user ID';
    if (recipeId === undefined) throw 'Must provide a recipe ID to update'; 
    if (updateObject === undefined) throw 'Must provide updated recipe fields';
    if (typeof updateObject !== 'object' || updateObject === null || Array.isArray(updateObject)) throw 'Object to update must be a valid object';

    userId = checkId(userId);
    recipeId = checkId(recipeId);

    // check if updated fields are valid
    const updateKeys = Object.keys(updateObject);
    const nonUpdate = [ '_id', 'comments', 'likes', 'userThatPosted' ];
    const forbidden = nonUpdate.find(item => updateKeys.includes(item));
    if (forbidden) throw `Unable to update ${forbidden}`;

    // retrieve recipe collection and validate existence
    const recipeCol = await recipes();
    const recipeToUpdate = await recipeCol.findOne({ _id: new ObjectId(recipeId) });
    if (!recipeToUpdate) throw err(404, `Recipe with ID: ${recipeId} not found`);

    // retrieve user collection and cross check users
    if (userId !== recipeToUpdate.userThatPosted._id.toString()) throw err(403, 'You may only update your own recipes');

    const updates = {};

    // validate title if present 
    if ('title' in updateObject) {
        const { title } = updateObject;
        updates.title = checkTitle(title);
    }

    // validate ingredients if present 
    if ('ingredients' in updateObject) {
        const { ingredients } = updateObject;
        updates.ingredients = checkIngredients(ingredients);
    }

    // validate coooking skill if present 
    if ('cookingSkillRequired' in updateObject) {
        const { cookingSkillRequired } = updateObject;
        updates.cookingSkillRequired = checkCookingSkill(cookingSkillRequired);
    }

    // validate steps if present 
    if ('steps' in updateObject) {
        const { steps } = updateObject;
        updates.steps = checkSteps(steps);
    }

    if (Object.keys(updates).length === 0) throw 'At least one valid field must be supplied'; // check for an empty update obj

    // check if updated values are different
    const changed = {};
    for (const [key, value] of Object.entries(updates)) {
        if (JSON.stringify(recipeToUpdate[key]) !== JSON.stringify(value)) changed[key] = value;
    }
    if (Object.keys(changed).length === 0) throw 'No fields differ from what is currently stored';

    const updatedRecipe = await recipeCol.findOneAndUpdate(
        { _id: new ObjectId(recipeId) },
        { $set: changed },
        { returnDocument: 'after' }
    );

    if (!updatedRecipe) throw 'Failed to update recipe';
    return updatedRecipe;
}

export async function createComment(recipeId, userId, comment) { // POST
    if (userId === undefined) throw 'Must provide a user ID';
    if (recipeId === undefined) throw 'Must provide a recipe ID'; 
    if (comment === undefined) throw 'Must provide a comment to post';

    recipeId = checkId(recipeId);
    userId = checkId(userId);
    comment = checkString(comment);
    
    // find user posting the comment
    const userCol = await users();
    const currUser = await userCol.findOne({ _id: new ObjectId(userId) });
    if (!currUser) throw err(404, `User with ID: ${userId} not found`);

    const newComment = {
        _id: new ObjectId(),
        userThatPostedComment: { _id: currUser._id, username: currUser.username },
        comment: comment
    };

    // find recipe to post comment to
    const recipeCol = await recipes();
    const recipeWithComment = await recipeCol.findOneAndUpdate(
        { _id: new ObjectId(recipeId) },
        { $push: { comments: newComment } },
        { returnDocument: 'after' }
    );

    if (!recipeWithComment) throw err(404, `Recipe with ID: ${recipeId} not found`);;
    return recipeWithComment;
}

export async function deleteComment(commentId, recipeId, userId) { // DELETE
    if (userId === undefined) throw 'Must provide a user ID';
    if (recipeId === undefined) throw 'Must provide a recipe ID'; 
    if (commentId === undefined) throw 'Must provide a comment ID to delete';

    commentId = checkId(commentId);
    recipeId = checkId(recipeId);
    userId = checkId(userId);

    // find recipe
    const recipeCol = await recipes();
    const recipeWithComment = await recipeCol.findOne({ _id: new ObjectId(recipeId) });
    if (!recipeWithComment) throw err(404, `Recipe with ID: ${recipeId} not found`);

    // find comment
    const comment = recipeWithComment.comments.find((c) => c._id.toString() === commentId);
    if (!comment) throw err(404, `Comment with ID: ${commentId} not found`);

    // cross check user
    if (comment.userThatPostedComment._id.toString() !== userId) throw err(403, 'You may only delete your own comments');

    const updatedRecipe = await recipeCol.findOneAndUpdate(
        { _id: new ObjectId(recipeId) },
        { $pull: { comments: { _id: new ObjectId(commentId) } } },
        { returnDocument: 'after' }
    );

    if (!updatedRecipe) throw 'Failed to delete comment';
    return updatedRecipe;
}

export async function likeRecipe(recipeId, userId) { // POST
    if (userId === undefined) throw 'Must provide a user ID';
    if (recipeId === undefined) throw 'Must provide a recipe ID'; 

    userId = checkId(userId);
    recipeId = checkId(recipeId);

    // find recipe
    const recipeCol = await recipes();
    const recipeToLike = await recipeCol.findOne({ _id: new ObjectId(recipeId) });
    if (!recipeToLike) throw err(404, `Recipe with ID: ${recipeId} not found`);

    // check for userId in likes
    const exists = recipeToLike.likes.some((l) => l.toString() === userId);
    const operator = exists ? '$pull' : '$push'; // user has or has not liked before
    const updatedRecipe = await recipeCol.findOneAndUpdate(
        { _id: new ObjectId(recipeId) },
        { [operator] : { likes: new ObjectId(userId) } },
        { returnDocument: 'after' }
    );
    
    if (!updatedRecipe) throw 'Failed to like or dislike recipe';
    return updatedRecipe;
}