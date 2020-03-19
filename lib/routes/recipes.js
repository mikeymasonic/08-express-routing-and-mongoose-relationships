const { Router } = require('express');
const Recipe = require('../models/Recipe');
const Event = require('../models/Event');

module.exports = Router()

  .post('/', (req, res, next) => {
    Recipe
      .create(req.body)
      .then(recipe => res.send(recipe))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    let ingredientsQuery = {};
    if(req.query.ingredient) {
      ingredientsQuery = { 'ingredients.name': req.query.ingredient };
    }
    Recipe
      .find(ingredientsQuery)
      .select({ name: true })
      .then(recipes => res.send(recipes))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Recipe.findById(req.params.id),
      Event.find({ recipe: req.params.id })
    ])
      .then(([recipe, events]) => {
        res.send({ ...recipe.toJSON(), events });
      })
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Recipe
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(recipe => res.send(recipe))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Promise.all([
      Recipe
        .findByIdAndDelete(req.params.id),
      Event
        .deleteMany({ recipeId: req.params.id })
    ])
      .then(([recipe]) => res.send(recipe))
      .catch(next);
  });

