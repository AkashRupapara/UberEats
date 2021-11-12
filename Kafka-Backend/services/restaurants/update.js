/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const Restaurant = require('../../models/Restaurant');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const handle_request = async (msg, callback) => {
  try {
    const restId = msg.restId;
    const imgLink = msg.body.link;

    const rest = await Restaurant.findOne({
      _id: mongoose.Types.ObjectId(String(restId)),
    });

    if (!rest) {
      callback(
        {
          isError: true,
          error: 'Restaurant Not Found',
          status: 404,
        },
        null
      );
    }

    if (msg.body.email && msg.body.email !== rest.email) {
      const checkRest = await Restaurant.findOne({
        email: msg.body.email,
      });

      if (checkRest) {
        callback(
          {
            isError: true,
            error: 'Restaurant already exist with given email',
            status: 403,
          },
          null
        );
      }
    }

    await Restaurant.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(restId)),
      },
      {
        $set: msg.body,
      },
      {
        new: true,
      }
    );

    if (msg.body.dish_type && msg.body.dish_type.length > 0) {
      await Restaurant.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(String(restId)),
        },
        {
          $set: { dish_type: [] },
        }
      );

      await Restaurant.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(String(restId)),
        },
        {
          $addToSet: { dish_type },
        },
        {
          new: true,
        }
      );
    }

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
    }

    callback(null, {
      message: 'Restaurant Updated',
      status: 200,
    });
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
