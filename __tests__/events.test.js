require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Event = require('../lib/models/Event');
const Recipe = require('../lib/models/Recipe');

describe('event routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates an event', () => {
    return Recipe.create({
      name: 'falafel',
      ingredients: [
        { name: 'garbanzo beans', amount: 12, measurement: 'ounce' }
      ],
      directions: [
        'pour vegetable oil into a pan and preheat on medium high heat',
        'use a food processor and mix ingredients',
        'make small balls out of mix',
        'fry for 5 - 10 minutes on both sides',
        'remove from pan and pat dry with paper towels'
      ],
    })
      .then(recipe => {
        return request(app)
          .post('/api/v1/events')
          .send({
            recipeId: recipe.id,
            dateOfEvent: Date.now(),
            notes: 'It went well',
            rating: 4
          });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: expect.any(String),
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 4,
          __v: 0
        });
      });
  });

  it('gets all events', async() => {
    const recipe = await Recipe.create({
      name: 'falafel',
      ingredients: [
        { name: 'garbanzo beans', amount: 12, measurement: 'ounce' }
      ],
      directions: [
        'pour vegetable oil into a pan and preheat on medium high heat',
        'use a food processor and mix ingredients',
        'make small balls out of mix',
        'fry for 5 - 10 minutes on both sides',
        'remove from pan and pat dry with paper towels'
      ],
    });

    const events = await Event.create([
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 3 },
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 2 },
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 3 },
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 5 },
    ]);

    return request(app)
      .get('/api/v1/events')
      .then(res => {
        events.forEach(event => {
          expect(res.body).toContainEqual(JSON.parse(JSON.stringify(event)));
        });
      });
  });

  it('gets an event by id', async() => {
    const recipe = await Recipe.create({
      name: 'falafel',
      ingredients: [
        { name: 'garbanzo beans', amount: 12, measurement: 'ounce' }
      ],
      directions: [
        'pour vegetable oil into a pan and preheat on medium high heat',
        'use a food processor and mix ingredients',
        'make small balls out of mix',
        'fry for 5 - 10 minutes on both sides',
        'remove from pan and pat dry with paper towels'
      ],
    });

    const event = await Event.create({
      recipeId: recipe.id,
      dateOfEvent: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .get(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: {
            _id: expect.any(String),
            name: 'falafel',
            ingredients: [
              { _id: expect.any(String), name: 'garbanzo beans', amount: 12, measurement: 'ounce' }
            ],
            directions: [
              'pour vegetable oil into a pan and preheat on medium high heat',
              'use a food processor and mix ingredients',
              'make small balls out of mix',
              'fry for 5 - 10 minutes on both sides',
              'remove from pan and pat dry with paper towels'
            ],
            __v: 0
          },
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 4,
          __v: 0
        });
      });
  });

  it('updates an event by id', async() => {
    const recipe = await Recipe.create({
      name: 'falafel',
      ingredients: [
        { name: 'garbanzo beans', amount: 12, measurement: 'ounce' }
      ],
      directions: [
        'pour vegetable oil into a pan and preheat on medium high heat',
        'use a food processor and mix ingredients',
        'make small balls out of mix',
        'fry for 5 - 10 minutes on both sides',
        'remove from pan and pat dry with paper towels'
      ],
    });

    const event = await Event.create({
      recipeId: recipe.id,
      dateOfEvent: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .patch(`/api/v1/events/${event._id}`)
      .send({ rating: 5 })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 5,
          __v: 0
        });
      });
  });

  it('deletes an event by id', async() => {
    const recipe = await Recipe.create({
      name: 'falafel',
      ingredients: [
        { name: 'garbanzo beans', amount: 12, measurement: 'ounce' }
      ],
      directions: [
        'pour vegetable oil into a pan and preheat on medium high heat',
        'use a food processor and mix ingredients',
        'make small balls out of mix',
        'fry for 5 - 10 minutes on both sides',
        'remove from pan and pat dry with paper towels'
      ],
    });

    const event = await Event.create({
      recipeId: recipe.id,
      dateOfEvent: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .delete(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 4,
          __v: 0
        });
      });
  });
});
