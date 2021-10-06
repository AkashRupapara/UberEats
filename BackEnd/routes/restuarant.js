/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/// Authentication

const express = require('express');
const {
  updateRestaurant,
  deleteRestaurant,
  getRestaurantDetails,
  deleteRestaurantImage,
  addRestaurantImage,
  getAllRestaurants,
} = require('../controllers/restaurant');
const { restaurantValidationRules, validator } = require('../controllers/validator');

const router = express.Router();

// Updating Restaurant Details
router.put('/:rid', restaurantValidationRules(), validator, updateRestaurant);
// Delete Restaurant
router.delete('/:rid', deleteRestaurant);
router.get('/all', getAllRestaurants);
router.get('/:rid', getRestaurantDetails);
router.post('/restImages/', addRestaurantImage)
router.delete('/restImages/:imgId', deleteRestaurantImage);
module.exports = router;
