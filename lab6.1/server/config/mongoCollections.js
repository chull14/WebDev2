import {dbConnection} from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let col = undefined;

  return async () => {
    if (!col) {
      const db = await dbConnection();
      col = await db.collection(collection);
    }

    return col;
  };
};

export const instructors = getCollectionFn('instructors');
export const workshops = getCollectionFn('workshops');
export const participants = getCollectionFn('participants');