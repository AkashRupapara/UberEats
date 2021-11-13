/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const Customer = require('../../models/Customer');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const handle_request = async (msg, callback) => {
  console.log(msg);
  try {
    const custId = msg.id;
    const { role } = msg;
    const { address, zipcode } = msg.body;

    if (!custId || role === 'restaurant') {
      callback(
        {
          isError: true,
          error: 'Unauthorised Access',
          status: 403,
        },
        null
      );
    }
    if (role === 'customer') {
      const existingAddress = await Customer.findOne(
        {
          _id: mongoose.Types.ObjectId(String(custId)),
        },
        {
          addresses: {
            $elemMatch: {
              address_line: address,
              zipcode: zipcode,
            },
          },
        }
      );

      if (existingAddress.addresses.length > 0) {
        callback(
          {
            isError: true,
            error: 'Address Already Exists',
            status: 409,
          },
          null
        );
      }

      await Customer.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(String(custId)),
        },
        {
          $push: { addresses: { address_line: address, zipcode: zipcode } },
        },
        {
          new: true,
        }
      );
    }
    callback(null, {
      status: 201,
      message: 'Address Added',
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
