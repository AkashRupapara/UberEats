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

router.get('/fvrts', getAllFavorites);
router.get('/address', getAddress);
router.post('/address', addAddress);
router.post('/fvrts', addToFavorites);
router.delete('/fvrts/:rid', deleteFromFavorites);


module.exports = router;
