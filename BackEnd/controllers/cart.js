// const { body, validationResult } = require('express-validator');

const { carts, dishes, sequelize, restaurants, dish_imgs } = require('../models/data.model');

const getCartDetails = async (req, res) => {
  const custID = req.headers.id;

  const existCart = await carts.findAll({
    where: {
      c_id: custID,
    },
  });

  if (existCart.length === 0) {
    return res.status(404).send('No Items in Cart');
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

  const {r_id} = cartItems[0].dish;

  const restDetails = await restaurants.findOne({
    where:{
      r_id,
    },
    attributes: { exclude: ["r_password", "createdAt", "updatedAt"] }
  },
  );
  return res.status(201).json({cartItems, restDetails});
};

const addItemToCart = async (req, res) => {
  const { dishId, restId } = req.body;
  const custId = req.headers.id;
  if ((restId && !dishId) || (!restId && dishId)) {
    return res.status(400).send('Provide all details');
  }
  const checkDish = await dishes.findOne({
    where: {
      d_id: dishId,
      r_id: restId,
    },
  });

  if (!checkDish) {
    return res.status(404).send('Dish does not exist for given restaurant');
  }

  const checkCart = await carts.findOne(
    {
      attributes: ['r_id'],
    },
    {
      where: {
        c_id: custId,
      },
    },
  );

  if (!checkCart) {
    await carts.create({
      c_id: custId,
      d_id: dishId,
      r_id: restId,
    });
    return res.status(201).send('Dish Added to Cart');
  }

  if (checkCart.r_id !== restId) {
    return res.status(403).send('Cannot added dishes for multiple restaurants');
  }

  await carts.create({
    c_id: custId,
    d_id: dishId,
    r_id: restId,
  });
  return res.status(201).send('Dish Added to Cart');
};

const resetCart = async (req, res) => {
  const custId = req.headers.id;

  const { dishId, restId } = req.body;

  if ((restId && !dishId) || (!restId && dishId)) {
    return res.status(400).send('Provide all details');
  }
  const t = await sequelize.transaction();
  try {
    await carts.destroy(
      {
        where: {
          c_id: custId,
        },
      },
      { transaction: t },
    );

    await carts.create({
      c_id: custId,
      d_id: dishId,
      r_id: restId,
    });
    t.commit();
    return res.status(201).send('Dish Added to Cart');
  } catch (err) {
    t.rollback();
    return res.status(500).send(err);
  }
};

const deleteCart = async (req, res) => {
  const custId = req.headers.id;

  await carts.destroy({
    where: {
      c_id: custId,
    },
  });
  res.status(201).send('Cart deleted for Customer');
};
module.exports = {
  getCartDetails,
  addItemToCart,
  resetCart,
  deleteCart,
};
