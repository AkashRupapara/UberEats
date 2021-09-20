/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { customers } = require('../models/data.model');

const createCustomer = async (req, res) => {
  try {
    // Get user input
    // eslint-disable-next-line object-curly-newline
    const { email, password, name, dob, city, state, country, nname, contact } = req.body;

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
    // Create user in our database---------------
    const customer = await customers.create({
      c_name: name,
      c_email: email, // sanitize: convert email to lowercase
      c_password: encryptedPassword,
      c_dob: dob,
      c_city: city,
      c_state: state,
      c_zipcode: req.body.zipcode,
      c_country: country,
      c_nick_name: nname,
      c_contact_no: contact,
    });

    // Create token
    const token = jwt.sign({ c_id: customer.c_id, email, role: 'customer' }, 'UberEats', {
      expiresIn: '2h',
    });
    // save customer token
    customer.token = token;
    return res.status(201).json(token);
  } catch (err) {
    return res.status(400).send(err);
  }
};

const customerLogin = async (req, res) => {
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
        const token = jwt.sign({ c_id: cust.c_id, email, role: 'customer' }, 'UberEats', {
          expiresIn: '2h',
        });
        cust.token = token;
        res.status(201).json(token);
      } else {
        return res.json({ success: false, message: 'passwords do not match' });
      }
    });
  }
};

const updateCustomer = async (req, res) => {
  const custID = req.headers.id;

  if (String(custID) !== String(req.params.cid)) return res.status(401).send('Unauthorised');

  const {
    name, email, about, profile_img, dob, city, state, country, nname, contact,
  } = req.body;

  const cust = await customers.findOne({
    where: {
      c_id: custID,
    },
  });

  if (email && email !== cust.c_email) {
    const checkCust = await customers.findOne({
      where: {
        c_email: email,
      },
    });

    if (checkCust) {
      return res.status(403).send('Customer already exist with given email');
    }
  }

  try {
    await cust.update(
      {
        c_name: name,
        c_email: email,
        c_about: about,
        c_profile_img: profile_img,
        c_dob: dob,
        c_city: city,
        c_state: state,
        c_country: country,
        c_nick_name: nname,
        c_contact_no: contact,
      },
      {
        returning: true,
      },
    );
    return res.status(201).send('Customer Updated');
  } catch (err) {
    return res.status(404).send(err);
  }
};

const deleteCustomer = async (req, res) => {
  const custID = req.params.cid;
  if (!custID) return res.status(404).send('Need Customer ID');

  const cust = await customers.findOne({
    where: {
      c_id: custID,
    },
  });

  if (!cust) return res.status(403).send('Customer does not exist');
  try {
    cust.destroy();
    return res.status(201).send('Customer deleted');
  } catch (err) {
    return res.status(404).send(err);
  }
};

const getCustomerProfile = async (req, res) => {
  const custId = req.headers.id;
  const cust = await customers.findOne({
    where: {
      c_id: custId,
    },
  });

  if (!cust) {
    return res.status(404).send('Customer does not exists');
  }
  return res.status(201).send(cust);
};

const getCustomerById = async (req, res) => {
  const cust = await customers.findOne({
    where: {
      c_id: req.params.cid,
    },
  });
  if (!cust) {
    return res.status(404).send('Customer does not exists');
  }
  return res.status(201).send(cust);
};

const getAllCustomers = async (req, res) => {
  const custs = await customers.findAll();
  return res.status(201).send(custs);
};

module.exports = {
  createCustomer,
  customerLogin,
  updateCustomer,
  deleteCustomer,
  getCustomerProfile,
  getCustomerById,
  getAllCustomers,
};
