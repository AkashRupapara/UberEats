/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');

const mongoose = require('mongoose');

const handle_request = async (msg, callback) => {
  const custId = msg.id;
  const cartDetails = await Cart.aggregate([
    {
      $match: {
        custId: mongoose.Types.ObjectId(String(custId)),
      },
    },
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restId',
        foreignField: '_id',
        as: 'restaurants',
      },
    },
    {
      $unwind: {
        path: '$restaurants',
      },
    },
  ]);

  if (cartDetails.length === 0) {
    callback(
      {
        isError: true,
        error: 'No Items in Cart',
        status: 404,
      },
      null
    );
  }

  let dishes = new Map();
  if (
    cartDetails &&
    cartDetails.length > 0 &&
    cartDetails[0].restaurants &&
    cartDetails[0].restaurants.dishes &&
    cartDetails[0].restaurants.dishes.length > 0
  ) {
    cartDetails[0].restaurants.dishes.forEach((dish) => {
      dishes.set(dish._id.toString(), dish);
    });
  }

  let sumTotal = 0;
  let orderDishArray = [];

  cartDetails.forEach((item) => {
    sumTotal += item.totalPrice;
    orderDishArray.push({
      dishId: item.dishId,
      qty: item.qty,
      totalPrice: item.totalPrice,
      name: dishes.get(item.dishId.toString()).name,
    });
  });

  let orderObj = {};
  orderObj['restId'] = cartDetails[0].restaurants._id;
  orderObj['custId'] = cartDetails[0].custId;
  orderObj['totalOrderPrice'] = sumTotal;
  orderObj['tax'] = (sumTotal * 0.18).toFixed(2);
  orderObj['finalOrderPrice'] = (sumTotal * 1.18).toFixed(2);
  orderObj['dishes'] = orderDishArray;
  orderObj['status'] = 'Initialized';
  orderObj['createdAt'] = new Date();
  orderObj['updatedAt'] = new Date();

  const newOrder = new Order(orderObj);
  const createdOrder = await newOrder.save();

  if (createdOrder) {
    // await Cart.find({
    //   custId: mongoose.Types.ObjectId(String(custId)),
    // }).remove();
    callback(null, {
      status: 201,
      orderId: createdOrder._id,
      message: 'Order Created',
    });
  }
  callback(
    {
      isError: true,
      error: 'Error Creating Order',
      status: 500,
    },
    null
  );
};

module.exports = handle_request;
