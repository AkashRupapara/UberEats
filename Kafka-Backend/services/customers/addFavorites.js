/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Customer = require('../../models/Customer');
const mongoose = require('mongoose');

const handle_request = async (msg, callback) => {
  const custId = msg.id;
  const restId = msg.restId;

  if (!custId) {
    callback(
      {
        isError: true,
        error: 'Customer Id Not Found',
        status: 404,
      },
      null
    );
  }

  try {
    const existingFvrt = await Customer.findOne({
      _id: mongoose.Types.ObjectId(String(custId)),
    });

    if (existingFvrt.fvrts.includes(mongoose.Types.ObjectId(restId))) {
      callback(null, {
        status: 200,
        message: 'Restaurant is already added to fvrts',
      });
    }

    const addFavorite = await Customer.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(custId)),
      },
      {
        $addToSet: {
          fvrts: { _id: mongoose.Types.ObjectId(String(restId)) },
        },
      },
      {
        new: true,
      }
    );
    callback(null, {
      status: 201,
      message: 'Added to Favorites',
      addFavorite,
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
