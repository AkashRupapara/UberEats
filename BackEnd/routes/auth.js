/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/// Authentication

const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line camelcase
const {
  customers, restaurants, restaurant_dishtypes, sequelize,
} = require('../models/data.model');

function isValidEmailAddress(emailAddress) {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(emailAddress).toLowerCase());
}
/// Customer Registration API
router.post('/register', async (req, res) => {
  try {
    // Get user input
    const {
      email, password, name, dob, city, state, country, nname, contact,
    } = req.body;

    // Validate user input
    if (!(name && email && password)) {
      res.status(400).send('All input is required');
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldCust = await customers.findOne({
      where: {
        c_email: email,
      },
    });

    if (oldCust) {
      return res.status(409).send('User Already Exist. Please Login');
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    if (!isValidEmailAddress(email)) return res.json({ status: 'error', message: 'Please Enter Valid Email Address.' });
    // Create user in our database---------------
    const customer = await customers.create({
      c_name: name,
      c_email: email, // sanitize: convert email to lowercase
      c_password: encryptedPassword,
      c_dob: dob,
      c_city: city,
      c_state: state,
      c_country: country,
      c_nick_name: nname,
      c_contact_no: contact,

    });

    // Create token
    const token = jwt.sign(
      { c_id: customer.c_id, email, role: 'customer' },
      'UberEats',
      {
        expiresIn: '2h',
      },
    );
    // save customer token
    customer.token = token;
    res.status(201).json(token);
  } catch (err) {
    console.log(err);
  }
});

/// Customer Login API
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) res.status(400).send('All input is required');

  const cust = await customers.findOne({
    where: {
      c_email: email,
    },
  });

  if (!cust) {
    res.status(409).send('User does not exist');
  } else {
    bcrypt.compare(password, cust.c_password, (err, result) => {
      if (err) {
        // handle error
        res.status(409).send('Error Verifying details!!!');
      }
      if (result) {
        // Send JWT
        const token = jwt.sign(
          { c_id: cust.c_id, email, role: 'customer' },
          'UberEats',
          {
            expiresIn: '2h',
          },
        );
        // save customer token
        cust.token = token;
        res.status(201).json(token);
      } else {
        // response is OutgoingMessage object that server response http request
        return res.json({ success: false, message: 'passwords do not match' });
      }
    });
  }
});

/// Restuarant Registration API
router.post('/reslogin', async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) res.status(400).send('All input is required');

  const rest = await restaurants.findOne({
    where: {
      r_email: email,
    },
  });

  if (!rest) {
    res.status(409).send('Restaurant does not exist');
  } else {
    bcrypt.compare(password, rest.r_password, (err, result) => {
      if (err) {
        // handle error
        res.status(409).send('Error Verifying details!!!');
      }
      if (result) {
        // Send JWT
        // Create token
        const token = jwt.sign(
          { r_id: rest.r_id, email, role: 'restaurant' },
          'UberEats',
          {
            expiresIn: '2h',
          },
        );
        // save customer token
        rest.token = token;
        return res.status(201).json(token);
      }
      // response is OutgoingMessage object that server response http request
      return res.json({ success: false, message: 'passwords do not match' });
    });
  }
});

/// Restaurant Login API
router.post('/resregister', async (req, res) => {
  try {
    // Get user input
    const {
      email, password, name, city, state, desc, contact, dish_types, del_type, start, end,
    } = req.body;

    // Validate user input
    if (!(name && email && password)) {
      res.status(400).send('All input is required');
    }

    // check if Restaurant already exist
    // Validate if user exist in our database
    const oldRes = await restaurants.findOne({
      where: {
        r_email: email,
      },
    });

    if (oldRes) {
      res.status(409).send('Restaurant Already Exist. Please Login');
    } else {
      // Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);
      let token;

      const t = await sequelize.transaction();
      try {
        // const t = await sequelize.transaction()
        const restaurant = await restaurants.create({
          r_name: name,
          r_email: email,
          r_password: encryptedPassword,
          r_city: city,
          r_state: state,
          r_desc: desc,
          r_contact: contact,
          r_del_type: del_type,
          r_start: start,
          r_end: end,
        }, { transaction: t });

        const dishTypes = dish_types.map((ele) => ({ r_id: restaurant.r_id, rdt_type: ele }));
        const dishType = await restaurant_dishtypes.bulkCreate(dishTypes, { transaction: t });
        token = jwt.sign(
          { r_id: restaurant.r_id, email, role: 'restaurant' },
          'UberEats',
          {
            expiresIn: '2h',
          },
        );
        await t.commit();
        res.status(201).json(token);
      } catch (error) {
        await t.rollback();
        console.error(error);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
