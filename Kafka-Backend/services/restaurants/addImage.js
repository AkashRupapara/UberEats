/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const Restaurant = require('../../models/Restaurant');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const handle_request = async (msg, callback) => {
  try {
    const restId = msg.id;
    const imgLink = msg.body.link;
    if (imgLink) {
      await Restaurant.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(String(restId)),
        },
        {
          $push: { restaurantImages: imgLink },
        },
        {
          new: true,
        }
      );
      callback(
       null,
        {
            message: 'Image Added',
            status: 201
        }
      );
    }
  } catch (err) {
    console.log(err);
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
