/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const Restaurant = require('../../models/Restaurant');
const jwt = require('jsonwebtoken');

const handle_request = (msg, callback) => {
  const { email, password } = msg;

  if (!(email && password)) {
    callback(
      {
        isError: true,
        error: 'All input is required',
        status: 400
      },
      null
    );
  }

  Restaurant.findOne({
    email,
  }).select('password').then((rest)=>{
    if (!rest) {
      callback(
        {
          isError: true,
          error: 'Restaurant does not exist',
          status: 409
        },
        null
      );
    } else {
      bcrypt.compare(password, rest.password, (err, result) => {
        if (err) {
          // handle error
          callback(
            {
              isError: true,
              error: 'Error Verifying details!',
              status: 409
            },
            null
          );
        }
        if (result) {
          // Send JWT
          // Create token
          const token = jwt.sign({ r_id: rest._id, email, role: 'restaurant' }, 'UberEats', {
            expiresIn: '2h',
          });
          // save customer token
          rest.token = token;
          callback(
           null,
            {
              token,
              status: 201,
            }
          );
        }
        callback(
          {
            success: false,
            isError: true,
            error: 'passwords do not match',
            status: 409,
          },
           null
         );
      });
    }
  });
};

module.exports = handle_request;
