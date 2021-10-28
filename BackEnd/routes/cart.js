const express = require('express');
const {
  getCartDetails,
  addItemToCart,
  resetCart,
  deleteCart,
  deleteCartItem,
} = require('../controllers/cart');

/**
 * @typedef addItemToCart
 * @property {string} dishId
 * @property {string} restId
 * @property {string} qty
 */

const router = express.Router();

router.get('/', getCartDetails);

/**
 * @route POST /cart/add
 * @summary Add Item to Cart
 * @group  Cart
 * @param {addItemToCart.model} addItemToCart.body.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  400 - All fields not entered
 * @returns {Error}  500 - Internal server error
 * @security JWT
 */
router.post('/add', addItemToCart);

router.delete("/item/:cartId", deleteCartItem);

router.post('/reset', resetCart);

router.delete('/', deleteCart);

module.exports = router;
