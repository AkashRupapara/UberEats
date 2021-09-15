const express = require('express');
const jwtDecode = require('jwt-decode');

const { carts, dishes, sequelize } = require('../models/data.model');

const router = express.Router();

router.post('/add', async (req, res) => {
  const { dishId, restId } = req.body;
  const headerToken = req.headers.authorization;
  const custId = jwtDecode(headerToken).c_id;
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
});

router.post('/reset', async (req, res) => {
  const headerToken = req.headers.authorization;
  const custId = jwtDecode(headerToken).c_id;

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
});

router.delete('/', async (req, res) => {
  const headerToken = req.headers.authorization;
  const custId = jwtDecode(headerToken).c_id;

  await carts.destroy({
    where: {
      c_id: custId,
    },
  });
  res.status(201).send('Cart deleted for Customer');
});

module.exports = router;
