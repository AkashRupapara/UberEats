/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const Customer = require('../../models/Customer');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

const handle_request = async (msg, callback) => {
  try {
    const custId = msg.id;
    console.log(msg);
    if (String(custId) !== String(msg.custId)) {
      console.log('IN');
      callback(
        {
          isError: true,
          error: 'Unauthorised',
          status: 401,
        },
        null
      );
    }

    await Customer.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(custId)),
      },
      {
        $set: msg.body,
      },
      {
        new: true,
      }
    );
    console.log('askfhsajfhejkwfbhj');
    callback(null, {
      status: 201,
      message: 'Customer Updated',
    });
  } catch (err) {
      console.log(err)
    callback(
      {
        isError: true,
        status: 404,
        error: err,
      },
      null
    );
  }
};

module.exports = handle_request;
