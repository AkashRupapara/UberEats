/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable object-curly-newline */
const express = require('express');
const jwtDecode = require('jwt-decode');

const { dishes, dish_imgs, sequelize } = require('../models/data.model');

const router = express.Router();

router.post('/newdish', async (req, res) => {
  try {
    const { name, ingredients, price, desc, category, type, imgs } = req.body;
    const headerToken = req.headers.authorization;
    const restID = jwtDecode(headerToken).r_id;

    if (!(name && price && category && type)) {
      return res.status(403).send('Provide all Details');
    }

    const existingDish = await dishes.findOne({
      where: {
        r_id: restID,
        d_name: name,
      },
    });

    const t = await sequelize.transaction();
    try {
      if (!existingDish) {
        const dish = await dishes.create(
          {
            d_name: name,
            d_ingredients: ingredients,
            d_price: price,
            d_desc: desc,
            d_category: category,
            d_type: type,
            r_id: restID,
          },
          { transaction: t },
        );

        const dishImages = imgs.map((ele) => ({
          d_id: dish.d_id,
          di_img: ele,
          di_alt_text: 'Dish Image',
        }));
        await dish_imgs.bulkCreate(dishImages, {
          transaction: t,
        });
        t.commit();
        res.status(201).send({});
      } else {
        res.status(403).send('Dish Already Exist');
      }
    } catch (err) {
      t.rollback();
      res.status(404).send(err);
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

router.put('/:did', async (req, res) => {
  const { name, ingredients, price, desc, category, type, imgs } = req.body;
  const dishId = req.params.did;
  const headerToken = req.headers.authorization;
  const restID = jwtDecode(headerToken).r_id;

  if (!dishId) return res.status(403).send('Provide all Details');
  const existDish = await dishes.findOne({
    where: {
      d_id: dishId,
    },
  });

  if (!existDish) return res.status(404).send('Dish Does not exist!!');

  if (name !== existDish.d_name) {
    const findDishName = await dishes.findOne({
      where: {
        d_name: name,
        r_id: restID,
      },
    });

    if (findDishName) return res.status(403).send('Dish with same name Exist');
  }

  try {
    existDish.update(
      {
        d_name: name,
        d_ingredients: ingredients,
        d_price: price,
        d_desc: desc,
        d_category: category,
        d_type: type,
      },
      {
        returning: true,
      },
    );
    res.status(201).send('Dish Updated!!');
  } catch (err) {
    return res.status(404).send(err);
  }

  if (imgs) {
    try {
      await dish_imgs.destroy({
        where: {
          d_id: dishId,
        },
      });
      const dishImages = imgs.map((ele) => ({
        d_id: dishId,
        di_img: ele,
        di_alt_text: 'Dish Image',
      }));
      await dish_imgs.bulkCreate(dishImages);
    } catch (err) {
      res.status(404).send('Unable to update Dish Images');
    }
  }
});

router.delete('/:did', async (req, res) => {
  const dishId = req.params.did;
  if (!dishId) return res.status(404).send('Dish Does not Exist');

  try {
    await dishes.destroy({
      where: {
        d_id: dishId,
      },
    });
    res.status(201).send('Dish Deleted');
  } catch (err) {
    return res.status(404).send(err);
  }
});

router.get('/:did', async (req, res) => {
  const dishId = req.params.did;
  const dish = await dishes.findOne(
    { include: dish_imgs, where: { d_id: dishId } },
  );

  if (!dish) return res.status(404).send('Dish not found');
  return res.status(201).send(dish);
});
module.exports = router;
