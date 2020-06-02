const mongoose = require('mongoose');
const Recipe = require('../lib/models/Recipe');

describe('Recipes Model', () => {
  it('has a name that is required', () => {
    const recipe = new Recipe();
    const { errors } = recipe.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it('has a name and directions', () => {
    const recipe = new Recipe({
      name: 'Falafel',
      ingredients: [{
        amount: 12,
        measurement: 'ounce',
        name: 'garbanzo beans'
      }
      ],
      directions: [
        'pour vegetable oil into a pan and preheat on medium high heat',
        'use a food processor and mix ingredients',
        'make small balls out of mix',
        'fry for 5 - 10 minutes on both sides',
        'remove from pan and pat dry with paper towels'
      ]
    });

    expect(recipe.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      name: 'Falafel',
      ingredients: [{
        _id: expect.any(mongoose.Types.ObjectId),
        amount: 12,
        measurement: 'ounce',
        name: 'garbanzo beans'
      }],
      directions: [
        'pour vegetable oil into a pan and preheat on medium high heat',
        'use a food processor and mix ingredients',
        'make small balls out of mix',
        'fry for 5 - 10 minutes on both sides',
        'remove from pan and pat dry with paper towels'
      ]
    });
  });
});

