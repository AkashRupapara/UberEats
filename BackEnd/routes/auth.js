/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/// Authentication

const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line camelcase

const { createCustomer, customerLogin } = require('../controllers/customer');
const { restaurantLogin, createRestaurant } = require('../controllers/restaurant');
const { validator, restaurantValidationRules, customerValidationRules } = require('../controllers/validator');


/**
 * @typedef RegisterRestaurant
 * @property {string} name.required
 * @property {string} email.required
 * @property {string} password.required
 */

/**
 * @typedef LoginRestaurant
 * @property {string} email.required
 * @property {string} password.required
 */


/// Customer Registration API
router.post('/register', customerValidationRules(), validator, createCustomer);

/// Customer Login API
router.post('/login', customerValidationRules(), validator, customerLogin);

/// Restuarant Registration API
/**
 * @route POST /auth/reslogin
 * @group  Login
 * @param {LoginRestaurant.model} LoginRestaurant.body.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 */
router.post('/reslogin', restaurantValidationRules(), validator, restaurantLogin);



/// Restaurant Register API
/**
 * @route POST /auth/resregister
 * @group  Register
 * @param {RegisterRestaurant.model} RegisterRestaurant.body.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 */
router.post('/resregister', createRestaurant);

module.exports = router;
