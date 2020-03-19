require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Recipe = require('../lib/models/Recipe');
const Event = require('../lib/models/Event');

describe('recipe routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'falafel',
        ingredients: [
          { amount: 12, measurement: 'ounce', name: 'garbanzo beans' }
        ],
        directions: [
          'pour vegetable oil into a pan and preheat on medium high heat',
          'use a food processor and mix ingredients',
          'make small balls out of mix',
          'fry for 5 - 10 minutes on both sides',
          'remove from pan and pat dry with paper towels'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'falafel',
          ingredients: [{ _id: expect.any(String), amount: 12, measurement: 'ounce', name: 'garbanzo beans' }],
          directions: [
            'pour vegetable oil into a pan and preheat on medium high heat',
            'use a food processor and mix ingredients',
            'make small balls out of mix',
            'fry for 5 - 10 minutes on both sides',
            'remove from pan and pat dry with paper towels'
          ],
          __v: 0
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Recipe.create([
      { name: 'falafel', directions: [] },
      { name: 'shwarma', directions: [] },
      { name: 'grape leaves', directions: [] }
    ]);

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual({
            _id: recipe._id.toString(),
            name: recipe.name
          });
        });
      });
  });

  it('finds a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'sick falafel',
      ingredients: [
        { amount: 12, measurement: 'ounce', name: 'garbanzo beans' }
      ],
      directions: [
        'pour vegetable oil into a pan and preheat on medium high heat',
        'use a food processor and mix ingredients',
        'make small balls out of mix',
        'fry for 5 - 10 minutes on both sides',
        'remove from pan and pat dry with paper towels'
      ],
    });

    await Event.create([
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 3 },
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 2 },
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 3 },
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 5 }
    ]);

    return request(app)
      .get(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'sick falafel',
          ingredients: [{ _id: expect.any(String), amount: 12, measurement: 'ounce', name: 'garbanzo beans' }],
          directions: [
            'pour vegetable oil into a pan and preheat on medium high heat',
            'use a food processor and mix ingredients',
            'make small balls out of mix',
            'fry for 5 - 10 minutes on both sides',
            'remove from pan and pat dry with paper towels'
          ],
          __v: 0
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'falafel',
      ingredients: [
        { amount: 12, measurement: 'ounce', name: 'garbanzo beans' }
      ],
      directions: [
        'pour vegetable oil into a pan and preheat on medium high heat',
        'use a food processor and mix ingredients',
        'make small balls out of mix',
        'fry for 5 - 10 minutes on both sides',
        'remove from pan and pat dry with paper towels'
      ],
    });

    return request(app)
      .patch(`/api/v1/recipes/${recipe._id}`)
      .send({ name: 'pretty good falafel' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'pretty good falafel',
          ingredients: [{ _id: expect.any(String), amount: 12, measurement: 'ounce', name: 'garbanzo beans' }],
          directions: [
            'pour vegetable oil into a pan and preheat on medium high heat',
            'use a food processor and mix ingredients',
            'make small balls out of mix',
            'fry for 5 - 10 minutes on both sides',
            'remove from pan and pat dry with paper towels'
          ],
          __v: 0
        });
      });
  });

  it('deletes a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'what dis falafel',
      ingredients: [
        { amount: 12, measurement: 'ounce', name: 'garbanzo beans' }
      ],
      directions: [
        'pour vegetable oil into a pan and preheat on medium high heat',
        'use a food processor and mix ingredients',
        'make small balls out of mix',
        'fry for 5 - 10 minutes on both sides',
        'remove from pan and pat dry with paper towels'
      ],
    });

    return request(app)
      .delete(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'what dis falafel',
          ingredients: [{ _id: expect.any(String), amount: 12, measurement: 'ounce', name: 'garbanzo beans' }],
          directions: [
            'pour vegetable oil into a pan and preheat on medium high heat',
            'use a food processor and mix ingredients',
            'make small balls out of mix',
            'fry for 5 - 10 minutes on both sides',
            'remove from pan and pat dry with paper towels'
          ],
          __v: 0
        });
      });
  });
});
