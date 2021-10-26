/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable object-curly-newline */
const express = require('express');
const { createDish, updateDish, deleteDish, getDishById, getAllDishes, insertDishImage, deleteDishImage } = require('../controllers/dish');
const { dishDetailsValidator, validator } = require('../controllers/validator');

const router = express.Router();


/**
 * @typedef addDish
 * @property {string} name
 * @property {string} price
 * @property {[string]} ingredients
 * @property {string} desc
 * @property {string} dishType
 * @property {string} category
 */

/**
 * @typedef updateDish
 * @property {string} name
 * @property {string} price
 * @property {[string]} ingredients
 * @property {string} desc
 * @property {string} dishType
 * @property {string} category
 * @property {[string]} dishImages
 * @security JWT
 */

/**
 * @typedef addDishImage
 * @property {string} imageLink
 */


/**
 * @route POST /dishes/newdish
 * @group  Dishes
 * @param {addDish.model} addDish.body.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  404 - Restaurant Not Found
 * @returns {Error}  409 - Dish with same name exist
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.post('/newdish', dishDetailsValidator(), validator, createDish);

/**
 * @route PUT /dishes/{did}
 * @group  Dishes
 * @param {updateDish.model} updateDish.body.required
 * @param {string} did.path.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  404 - Restaurant Not Found
 * @returns {Error}  409 - Dish with same name exist
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.put('/:did', dishDetailsValidator(), validator, updateDish);

router.delete('/:did', deleteDish);

router.get('/:did', getDishById);

/**
 * @route POST /dishes/images/{did}
 * @group  Dishes
 * @param {addDishImage.model} addDishImage.body.required
 * @param {string} did.path.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  404 - Dish Not Found
 * @returns {Error}  409 - Dish with same name exist
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.post('/images/:did', insertDishImage);

router.delete('/images/:imgId', deleteDishImage);


router.get('/', getAllDishes);
module.exports = router;
