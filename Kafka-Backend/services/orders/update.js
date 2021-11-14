/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');

const mongoose = require('mongoose');

const handle_request = async (msg, callback) => {
  const { status, oid, role } = msg;

  const orderDetails = await Order.findOne({
    _id: mongoose.Types.ObjectId(String(oid)),
  });

  const orderStatus = orderDetails.status;

  if (
    role === 'customer' &&
    status === 'Cancelled' &&
    orderStatus !== 'Initialized' &&
    orderStatus !== 'Placed'
  ) {
    callback(
      {
        isError: true,
        error: 'Order cannot be Cancelled',
        status: 400,
      },
      null
    );
  }
  try {
    await Order.updateOne(
      {
        _id: mongoose.Types.ObjectId(String(oid)),
      },
      {
        status,
      },
      {
        new: true,
      }
    );
    callback(null, {
      status: 201,
      message: 'Order Status Updated',
    });
  } catch (err) {
    callback(
      {
        isError: true,
        status: 500,
        error: err,
      },
      null
    );
  }
};

module.exports = handle_request;
