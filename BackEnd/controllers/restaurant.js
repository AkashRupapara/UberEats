/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const mongoose = require('mongoose');
const { make_request } = require('../kafka/client');

const {
  restaurants,
  restaurant_dishtypes,
  dish_imgs,
  dishes,
  sequelize,
  restaurant_imgs,
} = require('../models/data.model');
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
  make_request('restaurant.login', req.body, (err, response)=>{
    if (err || !response) {
      return res.status(500).send({ err });
    }
    return res.status(201).send({ token: response.token });
  });
};

const updateRestaurant = async (req, res) => {
  try {
    const restId = req.params.restId;
    const imgLink = req.body.link;

    const rest = await Restaurant.findOne({
      _id: mongoose.Types.ObjectId(String(restId)),
    });

    if (!rest) return res.status(404).send({ error: 'Restaurant Not Found' });

    if (req.body.email && req.body.email !== rest.email) {
      const checkRest = await Restaurant.findOne({
        email: req.body.email,
      });

      if (checkRest) {
        return res.status(403).send('Restaurant already exist with given email');
      }
    }

    try {
      await Restaurant.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(String(restId)),
        },
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );

      if (req.body.dish_type && req.body.dish_type.length > 0) {
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

      return res.status(200).send({ message: 'Restaurant Updated' });
    } catch (err) {
      console.log(err);
      return res.status(404).send(err);
    }
  } catch (err) {
    console.log(err);

    return res.status(404).send(err);
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const findEntry = await restaurants.findOne({
      where: {
        r_id: req.params.rid,
      },
    });
    if (!findEntry) {
      res.status(404).send('Restaurant Does not Exist to delete');
    } else {
      await restaurants.destroy({
        where: {
          r_id: req.params.rid,
        },
      });
      res.status(201).send({});
    }
  } catch (err) {
    res.status(404).send(err);
  }
};

const addRestaurantImage = async (req, res) => {
  const restId = req.headers.id;
  const imgLink = req.body.link;
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
    return res.status(200).send({ message: 'Image Added' });
  }

  return res.status(500).send({ error: 'Could not add Image' });
};

const deleteRestaurantImage = async (req, res) => {
  const restId = req.headers.id;
  const id = req.params.imgId;

  const img = await restaurant_imgs.findOne({
    where: {
      ri_id: id,
      r_id: restId,
    },
  });

  if (!img) {
    return res.status(404).send({ error: 'Image not found' });
  }

  try {
    await img.destroy();
    return res.status(200).send({ message: 'Restaurant Image deleted' });
  } catch (err) {
    return res.status(500).send(err);
  }
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
      // limit,
      // offset,
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
  deleteRestaurantImage,
  addRestaurantImage,
  getAllRestaurants,
  getRestaurantBySearch,
};
