const express = require('express');
const {
  getCartDetails,
  addItemToCart,
  resetCart,
  deleteCart,
} = require('../controllers/cart');

const router = express.Router();

router.get('/', getCartDetails);

router.post('/add', addItemToCart);

router.post('/reset', resetCart);

router.delete('/', deleteCart);

module.exports = router;
