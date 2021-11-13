/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const Customer = require('../../models/Customer');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const handle_request = async (msg, callback) => {
  const custId = msg.cid;
  if (!custId) {
    callback(
      {
        isError: true,
        error: 'Need Customer ID',
        status: 404,
      },
      null
    );
  }
  try {
    await Customer.findOneAndDelete({
      _id: mongoose.Types.ObjectId(String(custId)),
    });

    callback(null, {
      status: 201,
      message: 'Customer Deleted',
    });
  } catch (err) {
    callback(
        {
          isError: true,
          error: err,
          status: 404,
        },
        null
      );
  }
};

module.exports = handle_request;
