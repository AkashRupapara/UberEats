/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Order = require('../../models/Order');

const mongoose = require('mongoose');

const handle_request = async (msg, callback) => {
  try {
    console.log(msg);
    const { type, address, id, notes } = msg;

    let newAddr = '';
    if (type === 'Pickup') {
      newAddr = 'Pickup From Restaurant';
    } else {
      newAddr = address;
    }

    await Order.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(id)),
      },
      {
        status: 'Placed',
        orderType: type,
        orderAddress: newAddr,
        updatedAt: new Date(),
        notes,
      }
    );
    callback(null, {
      status: 201,
      message: 'Order Placed',
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
