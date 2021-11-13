/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const { make_request } = require('../kafka/client');

const createCustomer = async (req, res) => {
  make_request('customer.create', req.body, (err, response) => {
    if (err || !response) {
      if ('status' in err) {
        return res.status(err.status).send({ error: err.error });
      }
      return res.status(500).send({ error: err.message });
    }
    return res.status(201).send({ token: response.token });
  });
};

const customerLogin = async (req, res) => {
  make_request('customer.login', req.body, (err, response) => {
    if (err || !response) {
      if ('status' in err) {
        return res.status(err.status).send({ error: err.error });
      }
      return res.status(500).send({ error: err.message });
    }
    return res.status(201).send({ token: response.token });
  });
};

const updateCustomer = async (req, res) => {
  make_request(
    'customer.update',
    { body: req.body, id: req.headers.id, custId: req.params.cid },
    (err, response) => {
      if (err || !response) {
        if ('status' in err) {
          return res.status(err.status).send({ error: err.error });
        }
        return res.status(500).send({ error: err.message });
      }
      return res.status(201).send({ token: response.token });
    }
  );
};

const addAddress = async (req, res) => {
  make_request(
    'customer.addAddress',
    {body: req.body, ...req.headers},
    (err, response) => {
      if (err || !response) {
        if ('status' in err) {
          return res.status(err.status).send({ error: err.error });
        }
        return res.status(500).send({ error: err.message });
      }
      return res.status(201).send({ token: response.token });
    }
  );
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
  make_request(
    'customer.delete',
    ...req.params,
    (err, response) => {
      if (err || !response) {
        if ('status' in err) {
          return res.status(err.status).send({ error: err.error });
        }
        return res.status(500).send({ error: err.message });
      }
      return res.status(201).send({ token: response.token });
    }
  );
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
  make_request(
    'customer.addFavorites',
    {...req.headers,...req.body },
    (err, response) => {
      if (err || !response) {
        if ('status' in err) {
          return res.status(err.status).send({ error: err.error });
        }
        return res.status(500).send({ error: err.message });
      }
      return res.status(201).send({ token: response.token });
    }
  );
};

const deleteFromFavorites = async (req, res) => {
  make_request(
    'customer.deleteFavorites',
    {...req.headers,...req.body },
    (err, response) => {
      if (err || !response) {
        if ('status' in err) {
          return res.status(err.status).send({ error: err.error });
        }
        return res.status(500).send({ error: err.message });
      }
      return res.status(201).send({ token: response.token });
    }
  );
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
