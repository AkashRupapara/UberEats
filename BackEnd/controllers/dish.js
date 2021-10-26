/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const {
  dishes,
  dish_imgs,
  sequelize,
  restaurants,
} = require("../models/data.model");
const Restaurant = require("../models/Restaurant");
const mongoose = require("mongoose");

const createDish = async (req, res) => {
  try {
    const { name, ingredients, price, desc, category, dishType } = req.body;
    const restId = req.headers.id;

    if (!(name && price && category && dishType)) {
      return res.status(400).send({ error: "Provide all Details" });
    }

    const rest = await Restaurant.findOne({
      _id: mongoose.Types.ObjectId(String(restId)),
    });

    if (!rest) return res.status(404).send({ error: "Restaurant Not Found" });

    const existingDish = await Restaurant.findOne({
      "dishes.name": name,
      _id: mongoose.Types.ObjectId(String(restId)),
    });

    if (existingDish) {
      return res
        .status(409)
        .send({ error: "Dish with given name already exist!" });
    }

    const dishObj = {
      name,
      price,
      ingredients,
      desc,
      dishType,
      category,
    };

    const dishId = new mongoose.Types.ObjectId();
    const createdRest = await Restaurant.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(String(restId)),
      },
      {
        $push: { dishes: { _id: dishId, ...dishObj } },
      },
      {
        new: true,
      }
    );

    return res.status(201).json({ dishId });
  } catch (err) {
    res.status(500).send({ error: "Error Adding Dish" });
  }
};

const updateDish = async (req, res) => {
  const dishId = req.params.did;
  const restId = req.headers.id;

  if (!dishId) return res.status(403).send("Provide all Details");

  try {
    const updateDishObj = {};
    Object.keys(req.body).forEach((item) => {
      updateDishObj[`dishes.$.${item}`] = req.body[item];
    });

    const updatedDish = await Restaurant.updateOne(
      {
        _id: mongoose.Types.ObjectId(String(restId)),
        "dishes._id": mongoose.Types.ObjectId(String(dishId)),
      },
      {
        $set: updateDishObj,
      }
    );

    if (updatedDish) return res.status(201).send({ message: "Dish Updated!!" });

    return res.status(404).send({ error: "Dish Not Found" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error Updating Dish" });
  }
};

const deleteDish = async (req, res) => {
  try {
    const dishId = req.params.did;
    const restId = req.headers.id;
    const existingDish = await Restaurant.find(
      {
        'dishes._id': mongoose.Types.ObjectId(String(dishId)),
      },
      {
        dishes: {
          $elemMatch: { _id: mongoose.Types.ObjectId(String(dishId)) },
        },
      },
    );

    if (existingDish.length === 0) {
      return res.status(404).json({ error: 'Dish not found!' });
    }

    await Restaurant.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(String(restId)) },
      { $pull: { dishes: { _id: mongoose.Types.ObjectId(String(dishId)) } } },
      { new: true },
    );
    return res.status(200).json({ message: 'Dish deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getDishById = async (req, res) => {
  const dishId = req.params.did;
  const restId = req.headers.id;

  const dish = await dishes.findOne({
    include: dish_imgs,
    where: { d_id: dishId, r_id: restId },
  });

  if (!dish) return res.status(404).send("Dish not found");
  return res.status(201).send(dish);
};

const getAllDishes = async (req, res) => {
  const rid = req.headers.id;
  const dishDetails = await dishes.findAll({
    include: dish_imgs,
    where: {
      r_id: rid,
    },
  });
  if (dishDetails.lenght === 0) {
    return res.status(404).send({ error: "No Dishes Found" });
  }
  return res.status(201).send(dishDetails);
};

const insertDishImage = async (req, res) => {
  const restId = req.headers.id;
  const dishId = req.params.did;
  const imageLink = req.body.imageLink;

  if (!dishId) return res.status(403).send({ error: "Provide all Details" });

  try {
    const existingDish = await Restaurant.findOne(
      {
        _id: mongoose.Types.ObjectId(String(restId)),
      },
      {
        dishes: {
          _id: mongoose.Types.ObjectId(String(dishId)),
        },
      }
    );

    if (!existingDish)
      return res.status(404).send({ error: "Dish Does not exist!!" });

    const updatedRest = await Restaurant.find(
      {
        "dishes._id": mongoose.Types.ObjectId(String(dishId)),
      },
      {
        dishes: {
          $elemMatch: { _id: mongoose.Types.ObjectId(String(dishId)) },
        },
      }
    );
    return res.status(201).send({ message: "Dish image Added" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Error Adding Dish Image" });
  }
};

const deleteDishImage = async (req, res) => {
  const restId = req.headers.id;
  const dishImageId = req.params.imgId;

  const existDishImage = await dish_imgs.findOne({
    where: {
      di_id: dishImageId,
    },
  });

  if (!existDishImage) return res.status(404).send("Dish Does not exist!!");

  await dish_imgs.destroy({
    where: {
      di_id: dishImageId,
    },
  });
  return res.status(201).send({ message: "Dish image Deleted" });
};

module.exports = {
  createDish,
  updateDish,
  deleteDish,
  getDishById,
  getAllDishes,
  insertDishImage,
  deleteDishImage,
};
