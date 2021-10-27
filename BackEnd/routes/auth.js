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
 * @typedef Register
 * @property {string} name.required
 * @property {string} email.required
 * @property {string} password.required
 */

/**
 * @typedef Login
 * @property {string} email.required
 * @property {string} password.required
 */


/// Customer Registration API
/**
 * @route POST /auth/register
 * @group  Register
 * @param {Register.model} Register.body.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 */
router.post('/register', customerValidationRules(), validator, createCustomer);

/// Customer Login API
/**
 * @route POST /auth/login
 * @group  Login
 * @param {Login.model} Login.body.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 */
router.post('/login', customerValidationRules(), validator, customerLogin);

/// Restuarant Registration API
/**
 * @route POST /auth/reslogin
 * @group  Login
 * @param {Login.model} Login.body.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 */
router.post('/reslogin', restaurantValidationRules(), validator, restaurantLogin);



/// Restaurant Register API
/**
 * @route POST /auth/resregister
 * @group  Register
 * @param {Register.model} Register.body.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 */
router.post('/resregister', createRestaurant);

module.exports = router;
