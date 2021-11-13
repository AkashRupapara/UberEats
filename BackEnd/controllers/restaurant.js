/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const _ = require('underscore');
const mongoose = require('mongoose');
const { make_request } = require('../kafka/client');

const Restaurant = require('../models/Restaurant');

const createRestaurant = async (req, res) => {
  make_request('restaurant.create', req.body, (err, response) => {
    if (err || !response) {
      return res.status(500).send({ err });
    }
    return res.status(201).send({ response });
  });
};

const restaurantLogin = async (req, res) => {
  make_request('restaurant.login', req.body, (err, response) => {
    if (err || !response) {
      if ('status' in err) {
        return res.status(err.status).send({ error: err.error });
      }
      return res.status(500).send({ err });
    }
    return res.status(201).send({ token: response.token });
  });
};

const updateRestaurant = async (req, res) => {
  make_request('restaurant.update', { ...req.params, body: req.body }, (err, response) => {
    if (err || !response) {
      if ('status' in err) {
        return res.status(err.status).send({ error: err.error });
      }
      return res.status(500).send({error: err.message});
    }
    return res.status(201).send({ token: response.token });
  });
};

const deleteRestaurant = async (req, res) => {
  make_request('restaurant.update', req.params, (err, response) => {
    if (err || !response) {
      if ('status' in err) {
        return res.status(err.status).send({ error: err.error });
      }
      return res.status(500).send({error: err.message});
    }
    return res.status(201).send({ token: response.token });
  });
};

const addRestaurantImage = async (req, res) => {
  make_request('restaurant.addImage', {body: req.body, id: req.headers.id }, (err, response) => {
    if (err || !response) {
      if ('status' in err) {
        return res.status(err.status).send({ error: err.error });
      }
      return res.status(500).send({error: err.message});
    }
    return res.status(201).send({ token: response.token });
  });
};

const getRestaurantDetails = async (req, res) => {
  const restId = req.params.restId;
  if (!restId) return res.status(404).send({ error: 'Provide Restaurant ID' });

  const restDetails = await Restaurant.findOne({
    _id: mongoose.Types.ObjectId(String(restId)),
  });

  if (restDetails) return res.status(201).send(restDetails);

  return res.status(404).send({ error: 'Restaurant Does not exist with given Id' });
};

const getRestaurantBySearch = async (req, res) => {
  const { keyWord } = req.query;
  const custId = req.headers.id;
  if (!custId) {
    return res.status(403).send({ error: 'login Again!!' });
  }

  const restaurants = await Restaurant.find({
    $or: [  
      { name: new RegExp(`.*${keyWord}.*`, 'i') },
      { desc: new RegExp(`.*${keyWord}.*`, 'i') },
      {
        dishes: {
          $elemMatch: {
            name: new RegExp(`.*${keyWord}.*`, 'i'),
          },
        },
      },
    ],
  });

  return res.status(200).send(restaurants);
};

const getAllRestaurants = async (req, res) => {
  try {
    const { city } = req.query;
    const { dishType } = req.query;
    let { deliveryType } = req.query;

    if (deliveryType === 'Pickup') {
      deliveryType = ['Both', 'Pickup'];
    }
    if (deliveryType === 'Delivery') {
      deliveryType = ['Both', 'Delivery'];
    }

    const searchObject = {
      city: city,
      del_type: deliveryType,
      dish_types: dishType,
    };

    const checkProperties = (obj) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
          // eslint-disable-next-line no-param-reassign
          delete obj[key];
        }
      });
    };

    checkProperties(searchObject);
    let filteredRestaurants = await Restaurant.find({
      $and: [searchObject],
    });
    return res.status(200).json({ filteredRestaurants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  restaurantLogin,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantDetails,
  addRestaurantImage,
  getAllRestaurants,
  getRestaurantBySearch,
};
