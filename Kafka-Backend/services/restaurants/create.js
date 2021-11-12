/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const Restaurant = require('../../models/Restaurant');
const jwt = require('jsonwebtoken');

const handle_request = (msg, callback) => {
  // Validate user input
  if (!(msg.name && msg.email && msg.password)) {
    callback(
      {
        isError: true,
        error: 'All input is required',
        status: 400
      },
      null
    );
  }

  // check if Restaurant already exist
  Restaurant.findOne({
    email: msg.email,
  })
    .then((oldRes) => {
      if (oldRes) {
        callback(
          {
            isError: true,
            error: 'Restaurant Already Exist. Please Login',
          },
          null
        );
      }
    })
    .catch((err) => {
      callback(err, null);
    });

  // Encrypt user password
  bcrypt
    .hash(msg.password, 10)
    .then((encryptedPassword) => {
      msg.password = encryptedPassword;

      const newRestaurant = new Restaurant(msg);
      return newRestaurant.save();
    })
    .then((createdRest) => {
      const email = msg.email;
      let token = jwt.sign({ r_id: createdRest._id, email, role: 'restaurant' }, 'UberEats', {
        expiresIn: '2h',
      });
      return { token };
    })
    .then((resp) => {
      callback(null, resp);
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports = handle_request;
