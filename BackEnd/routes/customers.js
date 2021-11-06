/* eslint-disable camelcase */
const express = require('express');
const {
  updateCustomer,
  deleteCustomer,
  getCustomerProfile,
  getCustomerById,
  getAllCustomers,
  addAddress,
  getAddress,
  getAllFavorites,
  addToFavorites,
  deleteFromFavorites,
} = require('../controllers/customer');
const { customerValidationRules, validator } = require('../controllers/validator');

const router = express.Router();

/**
 * @typedef updateCustomer
 * @property {string} name
 * @property {string} about
 * @property {[string]} dob
 * @property {string} nick_name
 * @property {string} contact_no
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {string} profile_img

/**
 * @typedef AddCustomerAddress
 * @property {string} address
 * @property {string} zipcode
 */

/**
 * @typedef AddToFavorites
 * @property {string} restId
*/

/**
 * @route PUT /customers/{cid}
 * @summary Update Customer Details
 * @group  Customer
 * @param {string} cid.path.required
 * @param {updateCustomer.model} updateCustomer.body.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.put('/:cid', customerValidationRules(), validator, updateCustomer);
router.delete('/:cid', deleteCustomer);
router.get('/', getAllCustomers);

/**
 * @route GET /customers/myprofile/
 * @summary Get Customer Details
 * @group  Customer
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.get('/myprofile', getCustomerProfile);
/**
 * @route GET /customers/profile/{cid}
 * @summary Get Customer Details by ID
 * @group  Customer
 * @param {string} cid.path.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.get('/profile/:cid', getCustomerById);

/**
 * @route GET /customers/fvrts
 * @summary Get Favorites
 * @group  Customer
 * @returns {object} 201 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.get('/fvrts', getAllFavorites);

/**
 * @route GET /customers/address/
 * @summary Get Customer Addresses
 * @group  Customer
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.get('/address', getAddress);

/**
 * @route POST /customers/address
 * @summary Add Customer Address
 * @group  Customer
 * @param {string} cid.path.required
 * @param {AddCustomerAddress.model} AddCustomerAddress.body.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.post('/address', addAddress);

/**
 * @route POST /customers/fvrts
 * @summary Add To Favorites
 * @group  Customer
 * @param {AddToFavorites.model} AddToFavorites.body.required
 * @returns {object} 201 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.post('/fvrts', addToFavorites);
router.delete('/fvrts/:rid', deleteFromFavorites);


module.exports = router;
