/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Customer = require('../../models/Customer');
const mongoose = require('mongoose');

const handle_request = async (msg, callback) => {
  try {
    const custId = msg.id;
    const restId = msg.rid;
    if (!custId) {
      callback(
        {
          isError: true,
          error: 'Customer Id Not FOund',
          status: 404,
        },
        null
      );
    }

    await Customer.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(String(custId)) },
      { $pull: { fvrts: { restId: mongoose.Types.ObjectId(String(restId)) } } },
      { new: true }
    );
    callback(null, {
      status: 200,
      message: 'Removed from Favorites',
    });
  } catch (err) {
    callback(
      {
        isError: true,
        error: err,
        status: 500,
      },
      null
    );
  }
};

module.exports = handle_request;
