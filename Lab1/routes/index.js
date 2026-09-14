import usersRouter from './users.js';
import recipeRouter from './recipes.js';

const constructorMethod = (app) => {
    app.use('/', usersRouter);
    app.use('/recipes', recipeRouter);
};

export default constructorMethod;