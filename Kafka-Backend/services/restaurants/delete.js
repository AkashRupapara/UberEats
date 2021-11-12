/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const Restaurant = require('../../models/Restaurant');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const handle_request = async (msg, callback) => {
  try {
    const findEntry = await Restaurant.findOne({
      _id: mongoose.Schema.Types.ObjectId(String(msg.rid)),
    });
    if (!findEntry) {
      res.status(404).send('Restaurant Does not Exist to delete');
    } else {
      await Restaurant.findOneAndDelete({
          _id: mongoose.Schema.Types.ObjectId(String(msg.rid)),
      });
      callback(
       null,
        {
            status: 201,
            message: 'Restaurant Deleted'
        }
      );
    }
  } catch (err) {
    callback(
        {
          isError: true,
          error: err,
          status: 404,
        },
        null
      );  }
};

module.exports = handle_request;
