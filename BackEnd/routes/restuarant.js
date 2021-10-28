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
  getRestaurantBySearch,
} = require('../controllers/restaurant');
const { restaurantValidationRules, validator } = require('../controllers/validator');

const router = express.Router();


/**
 * @typedef getRestaurantBYId
 * @property {string} email.required
 * @property {string} password.required
 */


/**
 * @typedef updateRestaurant
 * @property {string} name
 * @property {string} desc
 * @property {[string]} dish_types
 * @property {string} address_line
 * @property {string} city
 * @property {string} state
 * @property {string} zipcode
 * @property {string} contact_no
 * @property {string} del_type
 * @property {string} start
 * @property {string} end
 */

// Updating Restaurant Details
/**
 * @route PUT /restaurant/{restId}
 * @summary Update Restaurant Details
 * @group  Restaurant
 * @param {string} restId.path.required
 * @param {updateRestaurant.model} updateRestaurant.body.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.put('/:restId', restaurantValidationRules(), validator, updateRestaurant);
// Delete Restaurant
router.delete('/:rid', deleteRestaurant);

/**
 * @route GET /restaurant/rest/{restId}
 * @summary Get Restaurant Details
 * @group  Restaurant
 * @param {string} restId.path.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.get('/rest/:restId', getRestaurantDetails);
router.get('/all/search?', getRestaurantBySearch);

/**
 * @route GET /restaurant/all
 * @summary Get All Restaurant
 * @group  Restaurant
 * @param {string} city.query
 * @param {string} deliveryType.query
 * @param {string} dishType.query
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.get('/all?', getAllRestaurants);
router.post('/restImages/', addRestaurantImage)
router.delete('/restImages/:imgId', deleteRestaurantImage);
module.exports = router;
