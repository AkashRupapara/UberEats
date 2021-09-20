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
} = require('../controllers/customer');
const { customerValidationRules, validator } = require('../controllers/validator');

const router = express.Router();

router.put('/:cid', customerValidationRules(), validator, updateCustomer);
router.delete('/:cid', deleteCustomer);
router.get('/', getAllCustomers);
router.get('/myprofile', getCustomerProfile);
router.get('/address', getAddress);
router.get('/:cid', getCustomerById);
router.post('/address', addAddress);

module.exports = router;
