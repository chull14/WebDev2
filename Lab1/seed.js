/*
 * seed.js — populates the database with test data for CS554 Lab 1
 *
 * Run with:  node seed.js
 *
 * NOTE: adjust the import path below if your config folder is elsewhere.
 * This assumes the standard layout:
 *   config/mongoConnection.js  exporting { dbConnection, closeConnection }
 */

import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { dbConnection, closeConnection } from './config/mongoConnection.js';

const SALT_ROUNDS = 10;

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
// Plaintext passwords are listed here so you can log in via Postman.
// All of them satisfy: 6+ chars, 1 lowercase, 1 uppercase, 1 number, 1 special.

const userSeeds = [
  { name: 'Patrick Hill',        username: 'graffixnyc',  password: 'Chicken123!' },
  { name: 'Dade Murphy',         username: 'ZeroCool',    password: 'Hack3rs$99' },
  { name: 'Emmanuel Goldstein',  username: 'progman716',  password: 'Crash0verride#' },
  { name: 'Connor Hull',         username: 'chull2004',   password: 'Chull123!' }
];

// ---------------------------------------------------------------------------
// Recipes (hand written — these are the interesting ones to test against)
// ---------------------------------------------------------------------------

const recipeSeeds = [
  {
    title: 'Fried Chicken',
    ingredients: ['One whole chicken', '2 cups of flour', '2 eggs', 'salt', 'pepper', '1 cup cooking oil'],
    cookingSkillRequired: 'Novice',
    steps: [
      'First take the two eggs and mix them with the flour, the salt and the pepper.',
      'Next, dip the chicken pieces into the mix until they are fully coated.',
      'Take one cup of oil and pour it into the frier, then heat it thoroughly.',
      'Fry the chicken on medium heat for about one hour, turning occasionally.',
      'Remove the chicken and rest it on a wire rack so it stays crisp.'
    ],
    postedBy: 'graffixnyc'
  },
  {
    title: 'Garlic Butter Pasta',
    ingredients: ['spaghetti', 'unsalted butter', 'garlic cloves', 'parmesan cheese', 'fresh parsley'],
    cookingSkillRequired: 'Novice',
    steps: [
      'Bring a large pot of salted water to a rolling boil over high heat.',
      'Add the spaghetti and cook until al dente, about nine to eleven minutes.',
      'While the pasta cooks, melt the butter in a skillet over medium low heat.',
      'Add the minced garlic and cook gently for two minutes until fragrant.',
      'Drain the pasta, reserving half a cup of the starchy cooking water.',
      'Toss the pasta in the skillet with the butter and a splash of pasta water.',
      'Finish with grated parmesan and chopped parsley, then serve immediately.'
    ],
    postedBy: 'ZeroCool'
  },
  {
    title: 'Shakshuka',
    ingredients: ['crushed tomatoes', 'large eggs', 'yellow onion', 'red bell pepper', 'smoked paprika', 'ground cumin', 'feta cheese'],
    cookingSkillRequired: 'Intermediate',
    steps: [
      'Heat olive oil in a wide skillet over medium heat until it shimmers.',
      'Add the diced onion and bell pepper, cooking until softened, roughly eight minutes.',
      'Stir in the paprika and cumin and toast the spices for about one minute.',
      'Pour in the crushed tomatoes and simmer until the sauce thickens noticeably.',
      'Make several wells in the sauce and crack one egg into each of them.',
      'Cover the pan and cook until the whites are set but the yolks remain runny.',
      'Scatter crumbled feta over the top and serve with warm bread for dipping.'
    ],
    postedBy: 'progman716'
  },
  {
    title: 'Beef Wellington',
    ingredients: ['beef tenderloin', 'puff pastry', 'cremini mushrooms', 'prosciutto', 'dijon mustard', 'egg yolk', 'shallots', 'fresh thyme'],
    cookingSkillRequired: 'Advanced',
    steps: [
      'Sear the seasoned tenderloin in a very hot pan on all sides, then cool it completely.',
      'Pulse the mushrooms and shallots in a food processor until finely minced.',
      'Cook the mushroom mixture in a dry pan until all moisture has evaporated.',
      'Lay out overlapping prosciutto slices and spread the duxelles across them.',
      'Brush the cooled beef with dijon mustard and roll it tightly in the prosciutto.',
      'Chill the wrapped log for at least thirty minutes so that it holds its shape.',
      'Wrap the chilled log in puff pastry, seal the seams, and brush with egg yolk.',
      'Bake at four hundred degrees until the internal temperature reaches one hundred thirty.'
    ],
    postedBy: 'graffixnyc'
  },
  {
    title: 'Overnight Oats',
    ingredients: ['rolled oats', 'whole milk', 'greek yogurt', 'maple syrup', 'chia seeds'],
    cookingSkillRequired: 'Novice',
    steps: [
      'Combine the rolled oats and the chia seeds in a jar or airtight container.',
      'Pour in the milk and stir thoroughly so no dry pockets remain at the bottom.',
      'Fold in the greek yogurt until the mixture looks uniform and creamy.',
      'Drizzle in the maple syrup and give everything one final gentle stir.',
      'Seal the container and refrigerate overnight, or for at least six hours.',
      'Stir well before eating and top with fresh fruit or nuts as desired.'
    ],
    postedBy: 'chull2004'
  },
  {
    title: 'Thai Green Curry',
    ingredients: ['green curry paste', 'coconut milk', 'chicken thighs', 'thai basil', 'fish sauce', 'bamboo shoots', 'palm sugar'],
    cookingSkillRequired: 'Intermediate',
    steps: [
      'Skim the thick cream from the top of the coconut milk can into a hot wok.',
      'Fry the curry paste in the coconut cream until the oil separates out.',
      'Add the sliced chicken thighs and stir to coat them in the paste mixture.',
      'Pour in the remaining coconut milk along with the drained bamboo shoots.',
      'Simmer gently until the chicken is cooked through, around twelve minutes.',
      'Season with fish sauce and palm sugar, tasting as you go for balance.',
      'Stir in the thai basil leaves off the heat and serve over jasmine rice.'
    ],
    postedBy: 'ZeroCool'
  },
  {
    title: 'Sourdough Boule',
    ingredients: ['bread flour', 'whole wheat flour', 'filtered water', 'sea salt', 'active sourdough starter'],
    cookingSkillRequired: 'Advanced',
    steps: [
      'Mix the flours and water together and let them rest for one hour to autolyse.',
      'Add the active starter and the salt, then squeeze them through the dough.',
      'Perform four sets of stretch and folds spaced thirty minutes apart.',
      'Let the dough bulk ferment until it has risen by roughly fifty percent.',
      'Shape the dough into a tight round and place it seam side up in a banneton.',
      'Cold proof the shaped loaf in the refrigerator overnight for better flavor.',
      'Score the cold dough and bake it covered in a preheated dutch oven.',
      'Remove the lid after twenty minutes and bake until deeply browned.'
    ],
    postedBy: 'progman716'
  },
  {
    title: 'Black Bean Tacos',
    ingredients: ['canned black beans', 'corn tortillas', 'white onion', 'fresh cilantro', 'lime', 'cotija cheese', 'chipotle powder'],
    cookingSkillRequired: 'Novice',
    steps: [
      'Drain and rinse the black beans thoroughly under cold running water.',
      'Saute the diced onion in oil until it turns translucent and soft.',
      'Add the beans and the chipotle powder, mashing some of them lightly.',
      'Cook the mixture until it thickens and most of the liquid is gone.',
      'Warm the corn tortillas directly over a flame or in a dry skillet.',
      'Fill each tortilla and top with cilantro, cotija, and a squeeze of lime.'
    ],
    postedBy: 'chull2004'
  }
];

// ---------------------------------------------------------------------------
// Comments to attach after the recipes exist.
// Deliberately seeded across different users so you can test that user B
// cannot delete user A's comment.
// ---------------------------------------------------------------------------

const commentSeeds = [
  { recipeTitle: 'Fried Chicken',       by: 'ZeroCool',   text: 'Nice Recipe!' },
  { recipeTitle: 'Fried Chicken',       by: 'progman716', text: 'This recipe was bad!' },
  { recipeTitle: 'Fried Chicken',       by: 'chull2004',  text: 'Made this last night, came out great.' },
  { recipeTitle: 'Garlic Butter Pasta', by: 'graffixnyc', text: 'Needs way more garlic in my opinion.' },
  { recipeTitle: 'Shakshuka',           by: 'ZeroCool',   text: 'Perfect brunch food, thanks for posting.' },
  { recipeTitle: 'Beef Wellington',     by: 'chull2004',  text: 'Way out of my skill range but fun to read.' }
];

// likes: recipeTitle -> usernames that liked it
const likeSeeds = [
  { recipeTitle: 'Fried Chicken',       by: ['ZeroCool', 'progman716', 'chull2004'] },
  { recipeTitle: 'Garlic Butter Pasta', by: ['graffixnyc'] },
  { recipeTitle: 'Shakshuka',           by: ['ZeroCool', 'chull2004'] },
  { recipeTitle: 'Overnight Oats',      by: [] }
];

// ---------------------------------------------------------------------------
// Filler recipes so that pagination can actually be exercised.
// Total recipe count lands at 55: page 1 -> 50, page 2 -> 5, page 3 -> 404.
// ---------------------------------------------------------------------------

const TARGET_COUNT = 55;

const fillerBases = [
  'Roasted Vegetable Soup', 'Lemon Herb Salmon', 'Mushroom Risotto', 'Chicken Tikka Masala',
  'Pork Carnitas', 'Eggplant Parmesan', 'Beef Bourguignon', 'Pad See Ew', 'Clam Chowder',
  'Falafel Wrap', 'Chicken Adobo', 'Ratatouille', 'Bibimbap', 'Shrimp Scampi', 'Lamb Tagine',
  'Miso Ramen', 'Chile Relleno', 'Duck Confit', 'Paella Valenciana', 'Gnocchi Alla Sorrentina',
  'Pho Ga', 'Jerk Chicken', 'Moussaka', 'Tonkatsu', 'Cassoulet', 'Arepas Con Queso',
  'Butter Chicken', 'Coq Au Vin', 'Khao Soi', 'Chicken Piccata', 'Borscht', 'Empanadas',
  'Pierogi Ruskie', 'Bulgogi', 'Feijoada', 'Laksa Lemak', 'Gumbo', 'Souvlaki', 'Injera Platter',
  'Banh Mi', 'Chana Masala', 'Okonomiyaki', 'Tamales', 'Goulash', 'Poutine', 'Ceviche', 'Katsu Curry'
];

const skills = ['Novice', 'Intermediate', 'Advanced'];

const makeFiller = (title, index) => ({
  title: title,
  ingredients: [
    'olive oil',
    'kosher salt',
    'cracked black pepper',
    'yellow onion',
    'garlic cloves'
  ],
  cookingSkillRequired: skills[index % skills.length],
  steps: [
    'Gather every ingredient and measure them out before you begin cooking.',
    'Heat a heavy bottomed pan over medium heat until it is fully preheated.',
    'Add the aromatics and cook them gently until they soften and smell sweet.',
    'Add the remaining ingredients and stir so nothing sticks to the bottom.',
    'Reduce the heat and let everything simmer until it has thickened nicely.',
    'Taste for seasoning, adjust the salt, and serve the dish while it is hot.'
  ],
  postedBy: fillerBases.length ? null : null // assigned below
});

// ---------------------------------------------------------------------------
// Seed routine
// ---------------------------------------------------------------------------

async function main() {
  const db = await dbConnection();

  console.log('Dropping existing database...');
  await db.dropDatabase();

  const userCol = db.collection('users');
  const recipeCol = db.collection('recipes');

  // --- users -------------------------------------------------------------
  console.log('Seeding users...');
  const userDocs = [];
  for (const u of userSeeds) {
    const doc = {
      _id: new ObjectId(),
      name: u.name,
      username: u.username,
      password: await bcrypt.hash(u.password, SALT_ROUNDS)
    };
    userDocs.push(doc);
  }
  await userCol.insertMany(userDocs);

  const userByName = {};
  for (const d of userDocs) userByName[d.username] = d;

  // --- recipes -----------------------------------------------------------
  console.log('Seeding recipes...');
  const recipeDocs = [];

  for (const r of recipeSeeds) {
    const poster = userByName[r.postedBy];
    recipeDocs.push({
      _id: new ObjectId(),
      title: r.title,
      ingredients: r.ingredients,
      cookingSkillRequired: r.cookingSkillRequired,
      steps: r.steps,
      userThatPosted: { _id: poster._id, username: poster.username },
      comments: [],
      likes: []
    });
  }

  // pad out to TARGET_COUNT with filler
  let fillerIndex = 0;
  while (recipeDocs.length < TARGET_COUNT) {
    const base = fillerBases[fillerIndex % fillerBases.length];
    const suffix = Math.floor(fillerIndex / fillerBases.length);
    const title = suffix === 0 ? base : `${base} ${suffix + 1}`;
    const filler = makeFiller(title, fillerIndex);
    const poster = userDocs[fillerIndex % userDocs.length];

    recipeDocs.push({
      _id: new ObjectId(),
      title: filler.title,
      ingredients: filler.ingredients,
      cookingSkillRequired: filler.cookingSkillRequired,
      steps: filler.steps,
      userThatPosted: { _id: poster._id, username: poster.username },
      comments: [],
      likes: []
    });
    fillerIndex++;
  }

  await recipeCol.insertMany(recipeDocs);

  const recipeByTitle = {};
  for (const d of recipeDocs) recipeByTitle[d.title] = d;

  // --- comments ----------------------------------------------------------
  console.log('Seeding comments...');
  for (const c of commentSeeds) {
    const recipe = recipeByTitle[c.recipeTitle];
    const author = userByName[c.by];
    await recipeCol.updateOne(
      { _id: recipe._id },
      {
        $push: {
          comments: {
            _id: new ObjectId(),
            userThatPostedComment: { _id: author._id, username: author.username },
            comment: c.text
          }
        }
      }
    );
  }

  // --- likes -------------------------------------------------------------
  console.log('Seeding likes...');
  for (const l of likeSeeds) {
    const recipe = recipeByTitle[l.recipeTitle];
    const ids = l.by.map((uname) => userByName[uname]._id);
    if (ids.length > 0) {
      await recipeCol.updateOne({ _id: recipe._id }, { $set: { likes: ids } });
    }
  }

  // --- summary -----------------------------------------------------------
  const friedChicken = await recipeCol.findOne({ _id: recipeByTitle['Fried Chicken']._id });

  console.log('\n========================================================');
  console.log('  SEED COMPLETE');
  console.log('========================================================');
  console.log(`  users:   ${userDocs.length}`);
  console.log(`  recipes: ${recipeDocs.length}  (page 1 = 50, page 2 = ${recipeDocs.length - 50}, page 3 = 404)`);

  console.log('\n--- LOGIN CREDENTIALS (POST /login) --------------------');
  for (const u of userSeeds) {
    console.log(`  { "username": "${u.username}", "password": "${u.password}" }`);
  }

  console.log('\n--- USER IDS -------------------------------------------');
  for (const d of userDocs) {
    console.log(`  ${d.username.padEnd(12)} ${d._id.toString()}`);
  }

  console.log('\n--- HANDY RECIPE IDS -----------------------------------');
  for (const r of recipeSeeds) {
    const doc = recipeByTitle[r.title];
    console.log(`  ${doc._id.toString()}  ${r.title}  (posted by ${r.postedBy})`);
  }

  console.log('\n--- COMMENT IDS ON "Fried Chicken" ---------------------');
  console.log(`  recipeId: ${friedChicken._id.toString()}`);
  for (const c of friedChicken.comments) {
    console.log(`  ${c._id.toString()}  by ${c.userThatPostedComment.username.padEnd(12)} "${c.comment}"`);
  }

  console.log('\n--- SUGGESTED TEST FLOW --------------------------------');
  console.log('  1. GET  /recipes            -> 50 results');
  console.log('  2. GET  /recipes?page=2     -> 5 results');
  console.log('  3. GET  /recipes?page=3     -> 404');
  console.log('  4. GET  /recipes?page=abc   -> 400');
  console.log('  5. POST /recipes            -> 401 before logging in');
  console.log('  6. POST /login as chull2004, then retry step 5');
  console.log('  7. PATCH a recipe posted by graffixnyc while logged in as chull2004 -> 403');
  console.log('  8. DELETE a ZeroCool comment while logged in as chull2004 -> 403');
  console.log('  9. POST /recipes/<id>/likes twice -> id added, then removed');
  console.log('========================================================\n');

  await closeConnection();
}

main().catch(async (e) => {
  console.error('Seed failed:', e);
  try {
    await closeConnection();
  } catch (_) {}
  process.exit(1);
});