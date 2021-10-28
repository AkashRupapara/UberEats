// const { body, validationResult } = require('express-validator');

const {
  carts,
  dishes,
  sequelize,
  restaurants,
  dish_imgs,
} = require("../models/data.model");

const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");
const Customer = require("../models/Customer");
const Cart = require("../models/Cart");

const getCartDetails = async (req, res) => {
  const custID = req.headers.id;

  const existCart = await carts.findAll({
    where: {
      c_id: custID,
    },
  });

  if (existCart.length === 0) {
    // return res.status(404).send({error: "No Items in Cart"});
  }

  const cartItems = await carts.findAll({
    include: [
      {
        model: dishes,
        include: dish_imgs,
      },
    ],
    where: {
      c_id: custID,
    },
  });

  const r_id = cartItems.length > 0 ? cartItems[0].dish.r_id : null;

  if (r_id === null) {
    return res.status(201).send({ message: "No Items in cart" });
  }

  const restDetails = await restaurants.findOne({
    where: {
      r_id,
    },
    attributes: { exclude: ["r_password", "createdAt", "updatedAt"] },
  });
  return res.status(201).json({ cartItems, restDetails });
};

const addItemToCart = async (req, res) => {
  const { dishId, restId } = req.body;
  const custId = req.headers.id;
  if ((restId && !dishId) || (!restId && dishId)) {
    return res.status(400).send({ error: "Provide all details" });
  }

  const checkDish = await Restaurant.findOne(
    {
      _id: mongoose.Types.ObjectId(String(restId)),
    },
    {
      dishes: {
        $elemMatch: { _id: mongoose.Types.ObjectId(String(dishId)) },
      },
    }
  );

  if (!checkDish || checkDish.dishes.length === 0) {
    return res.status(404).send({ error: "Dish does not exist!" });
  }

  //Price of Selected dish to add to cart
  const pricePerQty = checkDish.dishes[0].price;

  // const checkCart = await Cart.findOne({
  //   custId: mongoose.Types.ObjectId(String(custId)),
  // });

  const checkCart = await Cart.aggregate([
    {
      $lookup: {
        from: "restaurants",
        localField: "restId",
        foreignField: "_id",
        as: "restaurants",
      },
    },
    {
      $match: { custId: mongoose.Types.ObjectId(String(custId)) },
    },
  ]);

  req.body["custId"] = custId;
  req.body["totalPrice"] = req.body.qty * pricePerQty;

  if (!checkCart || checkCart.length === 0) {
    const newCartItem = new Cart(req.body);
    const createdCartItem = await newCartItem.save();
    return res
      .status(201)
      .send({ createdCartItem, message: "Dish added to Cart" });
  }

  
  if (
    checkCart &&
    checkCart.length > 0 &&
    checkCart[0].restaurants.length > 0 && 
    checkCart[0].restaurants[0]._id.toString() !== restId
  ) {
    return res.status(409).send({
      restId: checkCart[0].restId,
      restName: checkCart[0].restaurants[0].name,
      error: "Cannot added dishes for multiple restaurants",
    });
  }
  const newCartItem = new Cart(req.body);
  const createdCartItem = await newCartItem.save();
  return res.status(201).send({ message: "Dish Added to Cart" });
};

const resetCart = async (req, res) => {
  const custId = req.headers.id;
  const { dishId, restId } = req.body;

  if ((restId && !dishId) || (!restId && dishId)) {
    return res.status(400).send({ error: "Provide all details" });
  }
  const t = await sequelize.transaction();
  try {
    await carts.destroy(
      {
        where: {
          c_id: custId,
        },
      },
      { transaction: t }
    );

    await carts.create({
      c_id: custId,
      d_id: dishId,
      r_id: restId,
    });
    t.commit();
    return res.status(201).send({ message: "Dish Added to Cart" });
  } catch (err) {
    t.rollback();
    return res.status(500).send(err);
  }
};

const deleteCart = async (req, res) => {
  const custId = req.headers.id;

  try {
    await carts.destroy({
      where: {
        c_id: custId,
      },
    });
  } catch (err) {
    res.status(500).send({ error: "Error Deleting Cart" });
  }

  res.status(201).send({ message: "Cart deleted for Customer" });
};

const deleteCartItem = async (req, res) => {
  const custId = req.headers.id;
  const cartItemId = req.params.cartId;

  try {
    const item = await carts.findOne({
      where: {
        cart_id: cartItemId,
        c_id: custId,
      },
    });

    if (!item) {
      return res.status(404).send({ error: "Cannot find Item in cart" });
    }
    await item.destroy();

    return res.status(201).send({ message: "Cart Item Deleted" });
  } catch (err) {
    return res.status(400).send({ error: "Error Deleting Cart Item" });
  }
};

module.exports = {
  getCartDetails,
  addItemToCart,
  resetCart,
  deleteCart,
  deleteCartItem,
};
