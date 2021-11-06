/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Customer = require('../models/Customer');

const createCustomer = async (req, res) => {
  try {
    // Get user input
    // eslint-disable-next-line object-curly-newline
    // Validate user input
    if (!(req.body.name && req.body.email && req.body.password)) {
      res.status(400).send({ error: 'All input is required' });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldCust = await Customer.findOne({
      email: req.body.email,
    });

    if (oldCust) {
      return res.status(409).send({ error: 'User Already Exist. Please Login' });
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    // Create user in our database---------------
    req.body.password = encryptedPassword;

    const newCustomer = new Customer(req.body);
    const createdCust = await newCustomer.save();
    const email = req.body.email;

    console.log(createdCust._id);
    const token = jwt.sign({ c_id: createdCust._id, email, role: 'customer' }, 'UberEats', {
      expiresIn: '2h',
    });
    return res.status(201).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

const customerLogin = async (req, res) => {
  if (!(req.body.email && req.body.password))
    res.status(400).send({ error: 'All input is required' });

  const cust = await Customer.findOne({
    email: req.body.email,
  }).select('password');

  if (!cust) {
    res.status(409).send({ error: 'User does not exist' });
  } else {
    bcrypt.compare(req.body.password, cust.password, (err, result) => {
      if (err) {
        // handle error
        res.status(409).send({ error: 'Error Verifying details!' });
      }
      const email = req.body.email;
      if (result) {
        // Send JWT
        const token = jwt.sign({ c_id: cust._id, email, role: 'customer' }, 'UberEats', {
          expiresIn: '2h',
        });
        cust.token = token;
        res.status(201).json({ token });
      } else {
        return res.json({ success: false, message: 'passwords do not match' });
      }
    });
  }
};

const updateCustomer = async (req, res) => {
  const custId = req.headers.id;
  if (String(custId) !== String(req.params.cid)) return res.status(401).send('Unauthorised');
  try {
    await Customer.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(custId)),
      },
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    return res.status(201).send({ message: 'Customer Updated' });
  } catch (err) {
    return res.status(404).send(err);
  }
};

const addAddress = async (req, res) => {
  try {
    const custId = req.headers.id;
    const { role } = req.headers;
    const { address, zipcode } = req.body;

    if (!custId || role === 'restaurant') {
      return res.status(403).send({ error: 'Unauthorised Access' });
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
        return res.status(409).send({ error: 'Address Already Exists' });
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
    res.status(201).send({ message: 'Address Added' });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAddress = async (req, res) => {
  const custId = req.headers.id;

  try {
    const custDetails = await Customer.findOne({
      _id: mongoose.Types.ObjectId(String(custId)),
    });

    if (custDetails && custDetails.addresses.length === 0) {
      return res.staus(404).send({ error: 'No Addresses Found' });
    }
    return res.status(201).send(custDetails.addresses);
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteCustomer = async (req, res) => {
  const custId = req.params.cid;
  if (!custId) return res.status(404).send('Need Customer ID');
  try { 
    const cust = await Customer.findOneAndDelete({
      _id: mongoose.Types.ObjectId(String(custId)),
    });

    return res.status(201).send('Customer deleted');
  } catch (err) {
    return res.status(404).send(err);
  }
};

const getCustomerProfile = async (req, res) => {
  const custId = req.headers.id;
  const cust = await Customer.findOne({
    _id: mongoose.Types.ObjectId(String(custId)),
  });

  if (!cust) {
    return res.status(404).send({ error: 'Customer does not exists' });
  }
  return res.status(201).send(cust);
};

const getCustomerById = async (req, res) => {
  const cust = await Customer.findOne({
    _id: mongoose.Types.ObjectId(String(req.params.cid)),
  });
  if (!cust) {
    return res.status(404).send({ error: 'Customer does not exists' });
  }
  return res.status(201).send(cust);
};

const getAllCustomers = async (req, res) => {
  const rid = req.headers.id;

  const orders = await Order.find(
    {
      $lookup: {
        from: 'customers',
        localField: 'custId',
        foreignField: '_id',
        as: 'customer',
      },
    },
    {
      restId: mongoose.Types.ObjectId(String(rid)),
    },
    {
      $unwind: {
        path: '$customer',
      },
    }
  );
  return res.status(201).send(orders);
};

const addToFavorites = async (req, res) => {
  const custId = req.headers.id;
  const restId = req.body.restId;

  if (!custId) {
    return res.status(404).send({ error: 'Customer Id Not Found' });
  }

  try {
    const existingFvrt = await Customer.findOne({
      _id: mongoose.Types.ObjectId(String(custId)),
    });

    if (existingFvrt.fvrts.includes(mongoose.Types.ObjectId(restId))) {
      return res.status(200).send({ message: 'Restaurant is already added to fvrts' });
    }

    const addFavorite = await Customer.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(custId)),
      },
      {
        $addToSet: {
          fvrts: { _id: mongoose.Types.ObjectId(String(restId)) },
        },
      },
      {
        new: true,
      }
    );
    return res.status(201).send({ message: 'Added to Favorites', addFavorite });
  } catch (err) {
    return res.status(500).send(err);
  }
};

const deleteFromFavorites = async (req, res) => {
  const custId = req.headers.id;
  const restId = req.params.rid;
  if (!custId) {
    return res.status(404).send({ error: 'Customer Id Not FOund' });
  }

  try {
    await Customer.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(String(custId)) },
      { $pull: { fvrts: { restId: mongoose.Types.ObjectId(String(restId)) } } },
      { new: true }
    );
  } catch (err) {
    return res.status(500).send(err);
  }
  return res.status(200).send({ message: 'Removed from Favorites' });
};

const getAllFavorites = async (req, res) => {
  const custId = req.headers.id;
  if (!custId) {
    return res.status(404).send({ error: 'Customer Id Not Found' });
  }

  try {
    const custFvrts = await Customer.find({
      _id: mongoose.Types.ObjectId(String(custId)),
    }).populate({
      path: 'fvrts',
      select: {
        _id: 1,
        name: 1,
        city: 1,
        state: 1,
        address_line: 1,
        dish_types: 1,
        zipcode: 1,
        restaurantImages: 1,
      },
    });

    if (custFvrts.length) return res.status(200).send(custFvrts[0].fvrts);
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  createCustomer,
  customerLogin,
  updateCustomer,
  deleteCustomer,
  getCustomerProfile,
  getCustomerById,
  getAllCustomers,
  addAddress,
  getAddress,
  addToFavorites,
  deleteFromFavorites,
  getAllFavorites,
};
