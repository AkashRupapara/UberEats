/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const express = require('express');
const mongoose = require("mongoose");

const {
  createOrder,
  placeOrder,
  updateOrder,
  getOrders,
  getOrderById,
  filterOrders,
} = require('../controllers/order');

const router = express.Router();

/**
 * @typedef updateOrderStatus
 * @property {string} status
 */

/**
 * @route POST /orders/neworder
 * @summary Create Order of Customer
 * @group  Order
 * @returns {object} 201 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.post('/neworder', createOrder);

/**
 * @route Get /orders/filterorders
 * @summary Get Filtered Orders of Customer/ Restaurant
 * @group  Order
 * @param {string} page.query
 * @param {string} limit.query
 * @param {string} orderStatus.query
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.get('/filterorders?', filterOrders);
router.put('/finalorder', placeOrder);

/**
 * @route PUT /orders/updatestatus/{oid}
 * @summary Updagte Order Status
 * @group  Order
 * @param {string} oid.path.required
 * @param {updateOrderStatus.model} updateOrderStatus.body.required
 * @returns {object} 201 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.put('/updatestatus/:oid', updateOrder);

/**
 * @route Get /orders/
 * @summary Get Orders of Customer/ Restaurant
 * @group  Order
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.get('/', getOrders);

/**
 * @route Get /orders/details/{oid}
 * @summary Get Order Detail of Customer/ Restaurant
 * @group  Order
 * @param {string} oid.path.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.get('/details/:oid', getOrderById);

module.exports = router;
