import omdbRouter from './omdb.js';

const constructorMethod = (app) => {
    app.use('/api', omdbRouter);
};

export default constructorMethod;