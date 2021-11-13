/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const Customer = require('../../models/Customer');
const jwt = require('jsonwebtoken');

const handle_request = async (msg, callback) => {
  // Validate user input
  try {
    // Get user input
    // eslint-disable-next-line object-curly-newline
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

    // check if user already exist
    // Validate if user exist in our database
    const oldCust = await Customer.findOne({
      email: msg.email,
    });

    if (oldCust) {
      callback(
        {
          isError: true,
          error: 'User Already Exist. Please Login',
          status: 409
        },
        null
      );
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(msg.password, 10);
    // Create user in our database---------------
    msg.password = encryptedPassword;

    const newCustomer = new Customer(msg);
    const createdCust = await newCustomer.save();
    const email = msg.email;

    const token = jwt.sign({ c_id: createdCust._id, email, role: 'customer' }, 'UberEats', {
      expiresIn: '2h',
    });
    callback(
     null,
      {
        status: 201,
        token,
      }
    );
  } catch (err) {
    console.log(err);
    callback(
      {
        isError: true,
        error: err,
        status: 400
      },
      null
    );
  }};

module.exports = handle_request;
