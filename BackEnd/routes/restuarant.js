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
  createRestaurant,
  restaurantLogin,
} = require('../controllers/restaurant');
const { restaurantValidationRules, validator } = require('../controllers/validator');

const router = express.Router();

// Updating Restaurant Details
router.put('/:rid', restaurantValidationRules(), validator, updateRestaurant);
// Delete Restaurant
router.delete('/:rid', deleteRestaurant);
router.get('/:rid', getRestaurantDetails);
module.exports = router;
