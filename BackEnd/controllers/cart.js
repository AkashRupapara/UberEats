const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");
const Customer = require("../models/Customer");
const Cart = require("../models/Cart");

const getCartDetails = async (req, res) => {
  const custId = req.headers.id;
  const cartItems = await Cart.aggregate([
    {
      $match: {
        custId: mongoose.Types.ObjectId(String(custId)),
      },
    },
  ]);

  if (cartItems.length === 0) {
    return res.status(404).send({ error: "No Items in Cart" });
  }
  
  const restId = cartItems[0].restId;
  const dish = await Restaurant.findOne({
    _id: mongoose.Types.ObjectId(String(restId)),
  })
    .select("dishes")
    .select("name");

  let dishMap = new Map();
  const temp = dish.dishes.map((item) => {
    dishMap.set(item._id.toString(), item);
  });

  cartItems.forEach((item) => {
    item["name"] = dishMap.get(item.dishId.toString()).name;
    item["restName"] = dish.name;
    if (dishMap.get(item.dishId.toString()).dishImages.length > 0) {
      item["image"] = dishMap.get(item.dishId.toString()).dishImages[0].image;
    }
  });

  
  return res.status(201).json({ cartItems });
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
  req.body["totalPrice"] = (Math.round(req.body.qty * pricePerQty * 100) / 100).toFixed(2);;

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
  const { dishId, restId, qty } = req.body;

  if ((restId && !dishId) || (!restId && dishId)) {
    return res.status(400).send({ error: "Provide all details" });
  }
  try {
    await Cart.find({
      custId: mongoose.Types.ObjectId(String(custId)), 
    }).remove();

    const newCartItem = new Cart(req.body);
    const createdCartItem = await newCartItem.save();
    return res.status(201).send({ message: "Dish Added to Cart" });
  } catch (err) {
    return res.status(500).send(err);
  }
};

const deleteCart = async (req, res) => {
  const custId = req.headers.id;

  try {
    await Cart.find({
      custId: mongoose.Types.ObjectId(String(custId)),
    }).remove();

  } catch (err) {
    res.status(500).send({ error: "Error Deleting Cart" });
  }

  res.status(201).send({ message: "Cart deleted for Customer" });
};

const deleteCartItem = async (req, res) => {
  const custId = req.headers.id;
  const cartItemId = req.params.cartId;

  try {
    const item = await Cart.find({
      _id: mongoose.Types.ObjectId(String(cartItemId)),
    }).remove();
    return res.status(201).send({ message: "Cart Item Deleted" });
  } catch (err) {
    return res.status(400).send({ error: "Error Deleting Cart Item" });
  }
};

const updateCart = async (req, res) => {
  const custId = req.headers.id;
  if (custId === null || custId === undefined) {
    return res.status(403).send({ error: "Session Expired!" });
  }
  const cartId = req.params.cartId;
  const qty = req.body.qty;

  const cartItem = await Cart.findOne({
    _id: mongoose.Types.ObjectId(String(cartId)),
  });

  if (!cartItem || cartItem === undefined) {
    return res.status(404).send({ error: "Cart Item not found" });
  }
  const pricePerItem = cartItem.totalPrice / cartItem.qty;
  const updateCartItem = await Cart.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(String(cartId)),
    },
    {
      $set: { qty, totalPrice: (Math.round(qty * pricePerItem * 100) / 100).toFixed(2) },
    },
    {
      new: true,
    }
  );
  const cartItems = await Cart.aggregate([
    {
      $match: {
        custId: mongoose.Types.ObjectId(String(custId)),
      },
    },
  ]);

  if (cartItems.length === 0) {
    return res.status(404).send({ error: "No Items in Cart" });
  }
  
  const restId = cartItems[0].restId;
  const dish = await Restaurant.findOne({
    _id: mongoose.Types.ObjectId(String(restId)),
  })
    .select("dishes")
    .select("name");

  let dishMap = new Map();
  const temp = dish.dishes.map((item) => {
    dishMap.set(item._id.toString(), item);
  });

  cartItems.forEach((item) => {
    item["name"] = dishMap.get(item.dishId.toString()).name;
    item["restName"] = dish.name;
    if (dishMap.get(item.dishId.toString()).dishImages.length > 0) {
      item["image"] = dishMap.get(item.dishId.toString()).dishImages[0].image;
    }
  });

  return res.status(201).json({ cartItems });
};

module.exports = {
  getCartDetails,
  addItemToCart,
  resetCart,
  deleteCart,
  deleteCartItem,
  updateCart,
};
